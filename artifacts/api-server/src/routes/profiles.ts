import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

function getSupabase(authHeader?: string) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    return createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
  }
  return createClient(supabaseUrl, supabaseKey);
}

router.get("/profiles/:userId", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data, error } = await supabase.from("profiles").select("*").eq("id", req.params.userId).single();
    if (error || !data) return res.status(404).json({ error: "Not found" });

    const { data: { user } } = await supabase.auth.getUser();
    let isFollowing = false;
    if (user) {
      const { data: follow } = await supabase.from("follows").select().eq("follower_id", user.id).eq("following_id", req.params.userId).single();
      isFollowing = !!follow;
    }

    res.json({
      id: data.id, username: data.username, fullName: data.full_name, bio: data.bio,
      avatarUrl: data.avatar_url, country: data.country, location: data.location,
      websiteUrl: data.website_url, facebookUrl: data.facebook_url,
      instagramUrl: data.instagram_url, twitterUrl: data.twitter_url,
      isVerified: data.is_verified || false, rating: data.rating,
      reviewCount: data.review_count || 0, followersCount: data.followers_count || 0,
      followingCount: data.following_count || 0, listingsCount: data.listings_count || 0,
      totalSales: data.total_sales, responseTime: data.response_time,
      joinedAt: data.created_at, isFollowing, badges: data.badges || [],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/profiles/:userId", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== req.params.userId) return res.status(403).json({ error: "Forbidden" });

    const updates: any = {};
    const fields: Record<string, string> = {
      username: "username", fullName: "full_name", bio: "bio", avatarUrl: "avatar_url",
      country: "country", location: "location", websiteUrl: "website_url",
      facebookUrl: "facebook_url", instagramUrl: "instagram_url", twitterUrl: "twitter_url",
    };
    for (const [key, col] of Object.entries(fields)) {
      if (req.body[key] !== undefined) updates[col] = req.body[key];
    }

    const { data, error } = await supabase.from("profiles").update(updates).eq("id", req.params.userId).select().single();
    if (error || !data) return res.status(500).json({ error: error?.message || "Update failed" });

    res.json({
      id: data.id, username: data.username, fullName: data.full_name, bio: data.bio,
      avatarUrl: data.avatar_url, country: data.country, location: data.location,
      websiteUrl: data.website_url, facebookUrl: data.facebook_url,
      instagramUrl: data.instagram_url, twitterUrl: data.twitter_url,
      isVerified: data.is_verified || false, rating: data.rating,
      reviewCount: data.review_count || 0, followersCount: data.followers_count || 0,
      followingCount: data.following_count || 0, listingsCount: data.listings_count || 0,
      totalSales: data.total_sales, responseTime: data.response_time,
      joinedAt: data.created_at, isFollowing: false, badges: data.badges || [],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/profiles/:userId/follow", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data: existing } = await supabase.from("follows").select().eq("follower_id", user.id).eq("following_id", req.params.userId).single();

    if (existing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", req.params.userId);
      await supabase.rpc("decrement_followers", { user_id: req.params.userId });
      await supabase.rpc("decrement_following", { user_id: user.id });
      const { data: profile } = await supabase.from("profiles").select("followers_count").eq("id", req.params.userId).single();
      res.json({ following: false, followersCount: profile?.followers_count || 0 });
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: req.params.userId });
      await supabase.rpc("increment_followers", { user_id: req.params.userId });
      await supabase.rpc("increment_following", { user_id: user.id });
      const { data: profile } = await supabase.from("profiles").select("followers_count").eq("id", req.params.userId).single();
      res.json({ following: true, followersCount: profile?.followers_count || 0 });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/profiles/:userId/stats", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", req.params.userId).single();

    const { data: orders } = await supabase.from("orders").select("price, status").eq("seller_id", req.params.userId);
    const completedOrders = (orders || []).filter((o: any) => o.status === "delivered");
    const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.price || 0), 0);
    const successRate = orders && orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0;

    const { data: reviews } = await supabase.from("reviews").select("rating").eq("seller_id", req.params.userId);
    const positiveReviews = (reviews || []).filter((r: any) => r.rating >= 4).length;

    res.json({
      totalSales: totalRevenue, itemsSold: completedOrders.length,
      successRate: Math.round(successRate), responseTime: profile?.response_time || "2h",
      repeatBuyers: 0, positiveReviews,
      rating: profile?.rating || 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/profiles/:userId/listings", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data, error } = await supabase.from("listings").select("*, profiles:seller_id (username, full_name, avatar_url, is_verified)").eq("seller_id", req.params.userId).order("created_at", { ascending: false });

    if (error) throw error;
    const listings = (data || []).map((l: any) => ({
      id: l.id, title: l.title, description: l.description, price: l.price,
      originalPrice: l.original_price, images: l.images || [], category: l.category,
      condition: l.condition, status: l.status, tags: l.tags || [],
      shippingFee: l.shipping_fee, quantity: l.quantity, sellerId: l.seller_id,
      sellerName: l.profiles?.full_name || l.profiles?.username,
      sellerAvatar: l.profiles?.avatar_url, sellerVerified: l.profiles?.is_verified || false,
      likesCount: l.likes_count || 0, viewsCount: l.views_count || 0, soldCount: l.sold_count || 0,
      rating: l.rating, isLiked: false, createdAt: l.created_at, updatedAt: l.updated_at,
    }));
    res.json(listings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
