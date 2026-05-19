import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const router = Router();

router.post("/upload/image", async (req, res) => {
  try {
    const { dataUrl, bucket = "listings", filename } = req.body;
    if (!dataUrl) return res.status(400).json({ error: "dataUrl required" });

    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const compressed = await sharp(buffer)
      .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const sizeKB = Math.round(compressed.length / 1024);
    const fname = filename || `${Date.now()}.jpg`;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.storage.from(bucket).upload(fname, compressed, {
      contentType: "image/jpeg",
      upsert: true,
    });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    res.json({ url: urlData.publicUrl, path: data.path, size: sizeKB });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
