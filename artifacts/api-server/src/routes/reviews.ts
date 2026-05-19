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

router.get("/reviews", async (req, res) => {
  try {
    const { listingId, sellerId, limit = 20 } = req.query;
    const supabase = getSupabase();

    let query = supabase.from("reviews").select("*, reviewer:reviewer_id (username, full_name, avatar_url)").order("created_at", { ascending: false }).limit(Number(limit));
    if (listingId) query = query.eq("listing_id", listingId as string);
    if (sellerId) query = query.eq("seller_id", sellerId as string);

    const { data, error } = await query;
    if (error) throw error;

    res.json((data || []).map((r: any) => ({
      id: r.id, listingId: r.listing_id, sellerId: r.seller_id,
      reviewerId: r.reviewer_id, reviewerName: r.reviewer?.full_name || r.reviewer?.username,
      reviewerAvatar: r.reviewer?.avatar_url, rating: r.rating, comment: r.comment,
      isVerifiedPurchase: r.is_verified_purchase || false, helpfulCount: r.helpful_count || 0,
      createdAt: r.created_at,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { listingId, sellerId, rating, comment } = req.body;
    const { data, error } = await supabase.from("reviews").insert({
      listing_id: listingId, seller_id: sellerId, reviewer_id: user.id, rating, comment,
    }).select("*, reviewer:reviewer_id (username, full_name, avatar_url)").single();

    if (error) throw error;
    res.status(201).json({
      id: data.id, listingId: data.listing_id, sellerId: data.seller_id,
      reviewerId: data.reviewer_id, reviewerName: data.reviewer?.full_name || data.reviewer?.username,
      reviewerAvatar: data.reviewer?.avatar_url, rating: data.rating, comment: data.comment,
      isVerifiedPurchase: false, helpfulCount: 0, createdAt: data.created_at,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
