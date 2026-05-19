import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();
function getSupabase(authHeader?: string) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
  if (authHeader) {
    return createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${authHeader.replace("Bearer ", "")}` } },
    });
  }
  return createClient(supabaseUrl, supabaseKey);
}

router.get("/notifications", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.json([]);

    const { limit = 30, unreadOnly } = req.query;
    let query = supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(Number(limit));
    if (unreadOnly === "true") query = query.eq("is_read", false);

    const { data, error } = await query;
    if (error) throw error;

    res.json((data || []).map((n: any) => ({
      id: n.id, type: n.type, title: n.title, body: n.body, isRead: n.is_read,
      data: n.data || {}, createdAt: n.created_at,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/notifications/read", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { ids, all } = req.body;
    if (all) {
      await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
    } else if (ids && ids.length > 0) {
      await supabase.from("notifications").update({ is_read: true }).in("id", ids).eq("user_id", user.id);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
