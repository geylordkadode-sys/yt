import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!);
}

router.get("/discovery/home", async (req, res) => {
  try {
    const supabase = getSupabase();

    const [featuredRes, trendingRes, categoriesRes] = await Promise.all([
      supabase.from("listings").select("*, profiles:seller_id (username, full_name, avatar_url, is_verified)")
        .eq("status", "active").eq("is_featured", true).order("created_at", { ascending: false }).limit(8),
      supabase.from("listings").select("*, profiles:seller_id (username, full_name, avatar_url, is_verified)")
        .eq("status", "active").order("views_count", { ascending: false }).limit(8),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    ]);

    const mapListing = (l: any) => ({
      id: l.id, title: l.title, description: l.description, price: l.price,
      originalPrice: l.original_price, images: l.images || [], category: l.category,
      condition: l.condition, status: l.status, tags: l.tags || [],
      shippingFee: l.shipping_fee, quantity: l.quantity, sellerId: l.seller_id,
      sellerName: l.profiles?.full_name || l.profiles?.username,
      sellerAvatar: l.profiles?.avatar_url, sellerVerified: l.profiles?.is_verified || false,
      likesCount: l.likes_count || 0, viewsCount: l.views_count || 0, soldCount: l.sold_count || 0,
      rating: l.rating, isLiked: false, createdAt: l.created_at, updatedAt: l.updated_at,
    });

    const categories = (categoriesRes.data || []).map((c: any) => ({
      id: c.id, name: c.name, icon: c.icon, count: c.listing_count || 0,
    }));

    res.json({
      featured: (featuredRes.data || []).map(mapListing),
      trending: (trendingRes.data || []).map(mapListing),
      categories,
      recentlyViewed: [],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/discovery/search", async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;
    const supabase = getSupabase();

    let query = supabase.from("listings").select("*, profiles:seller_id (username, full_name, avatar_url, is_verified)").eq("status", "active");
    if (q) query = query.ilike("title", `%${q}%`);
    if (category) query = query.eq("category", category as string);
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));
    if (sort === "price_asc") query = query.order("price", { ascending: true });
    else if (sort === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });
    query = query.limit(50);

    const { data, error } = await query;
    if (error) throw error;

    const mapListing = (l: any) => ({
      id: l.id, title: l.title, description: l.description, price: l.price,
      originalPrice: l.original_price, images: l.images || [], category: l.category,
      condition: l.condition, status: l.status, tags: l.tags || [],
      shippingFee: l.shipping_fee, quantity: l.quantity, sellerId: l.seller_id,
      sellerName: l.profiles?.full_name || l.profiles?.username,
      sellerAvatar: l.profiles?.avatar_url, sellerVerified: l.profiles?.is_verified || false,
      likesCount: l.likes_count || 0, viewsCount: l.views_count || 0, soldCount: l.sold_count || 0,
      rating: l.rating, isLiked: false, createdAt: l.created_at, updatedAt: l.updated_at,
    });

    res.json({
      listings: (data || []).map(mapListing),
      total: (data || []).length,
      suggestions: [],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
    if (error) throw error;
    res.json((data || []).map((c: any) => ({ id: c.id, name: c.name, icon: c.icon, count: c.listing_count || 0 })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
