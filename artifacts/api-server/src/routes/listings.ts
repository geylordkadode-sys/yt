import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

function getSupabase(authHeader?: string) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
  const client = createClient(supabaseUrl, supabaseKey);
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    return createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
  }
  return client;
}

router.get("/listings", async (req, res) => {
  try {
    const { category, search, sellerId, minPrice, maxPrice, condition, sort, limit = 20, offset = 0 } = req.query;
    const supabase = getSupabase(req.headers.authorization);
    let query = supabase.from("listings").select(`
      *,
      profiles:seller_id (username, full_name, avatar_url, is_verified)
    `).eq("status", "active");

    if (category) query = query.eq("category", category as string);
    if (sellerId) query = query.eq("seller_id", sellerId as string);
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));
    if (condition) query = query.eq("condition", condition as string);
    if (search) query = query.ilike("title", `%${search}%`);

    if (sort === "price_asc") query = query.order("price", { ascending: true });
    else if (sort === "price_desc") query = query.order("price", { ascending: false });
    else if (sort === "popular") query = query.order("views_count", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data, error } = await query;
    if (error) throw error;

    const listings = (data || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price,
      originalPrice: l.original_price,
      images: l.images || [],
      category: l.category,
      condition: l.condition,
      status: l.status,
      tags: l.tags || [],
      shippingFee: l.shipping_fee,
      quantity: l.quantity,
      sellerId: l.seller_id,
      sellerName: l.profiles?.full_name || l.profiles?.username,
      sellerAvatar: l.profiles?.avatar_url,
      sellerVerified: l.profiles?.is_verified || false,
      likesCount: l.likes_count || 0,
      viewsCount: l.views_count || 0,
      soldCount: l.sold_count || 0,
      rating: l.rating,
      isLiked: false,
      createdAt: l.created_at,
      updatedAt: l.updated_at,
    }));

    res.json(listings);
  } catch (err: any) {
    req.log.error(err, "Error listing listings");
    res.status(500).json({ error: err.message });
  }
});

router.post("/listings", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { title, description, price, originalPrice, images, category, condition, tags, shippingFee, quantity, status } = req.body;
    const { data, error } = await supabase.from("listings").insert({
      title, description, price, original_price: originalPrice, images: images || [],
      category, condition: condition || "new", tags: tags || [],
      shipping_fee: shippingFee, quantity: quantity || 1,
      status: status || "active", seller_id: user.id,
    }).select().single();

    if (error) throw error;
    res.status(201).json({ ...data, sellerId: data.seller_id, isLiked: false, likesCount: 0, viewsCount: 0, soldCount: 0 });
  } catch (err: any) {
    req.log.error(err, "Error creating listing");
    res.status(500).json({ error: err.message });
  }
});

router.get("/listings/featured", async (req, res) => {
  try {
    const { category, limit = 12 } = req.query;
    const supabase = getSupabase();
    let query = supabase.from("listings").select(`
      *,
      profiles:seller_id (username, full_name, avatar_url, is_verified)
    `).eq("status", "active").eq("is_featured", true).order("created_at", { ascending: false }).limit(Number(limit));

    if (category) query = query.eq("category", category as string);
    const { data, error } = await query;
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
    req.log.error(err, "Error listing featured");
    res.status(500).json({ error: err.message });
  }
});

router.get("/listings/trending", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("listings").select(`
      *,
      profiles:seller_id (username, full_name, avatar_url, is_verified)
    `).eq("status", "active").order("views_count", { ascending: false }).limit(12);

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

router.get("/listings/:id", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data, error } = await supabase.from("listings").select(`
      *,
      profiles:seller_id (username, full_name, avatar_url, is_verified)
    `).eq("id", req.params.id).single();

    if (error || !data) return res.status(404).json({ error: "Not found" });

    await supabase.from("listings").update({ views_count: (data.views_count || 0) + 1 }).eq("id", req.params.id);

    res.json({
      id: data.id, title: data.title, description: data.description, price: data.price,
      originalPrice: data.original_price, images: data.images || [], category: data.category,
      condition: data.condition, status: data.status, tags: data.tags || [],
      shippingFee: data.shipping_fee, quantity: data.quantity, sellerId: data.seller_id,
      sellerName: data.profiles?.full_name || data.profiles?.username,
      sellerAvatar: data.profiles?.avatar_url, sellerVerified: data.profiles?.is_verified || false,
      likesCount: data.likes_count || 0, viewsCount: (data.views_count || 0) + 1, soldCount: data.sold_count || 0,
      rating: data.rating, isLiked: false, createdAt: data.created_at, updatedAt: data.updated_at,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/listings/:id", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const updates: any = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.price !== undefined) updates.price = req.body.price;
    if (req.body.originalPrice !== undefined) updates.original_price = req.body.originalPrice;
    if (req.body.images !== undefined) updates.images = req.body.images;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.condition !== undefined) updates.condition = req.body.condition;
    if (req.body.tags !== undefined) updates.tags = req.body.tags;
    if (req.body.shippingFee !== undefined) updates.shipping_fee = req.body.shippingFee;
    if (req.body.quantity !== undefined) updates.quantity = req.body.quantity;
    if (req.body.status !== undefined) updates.status = req.body.status;

    const { data, error } = await supabase.from("listings").update(updates).eq("id", req.params.id).eq("seller_id", user.id).select().single();
    if (error || !data) return res.status(404).json({ error: "Not found or unauthorized" });

    res.json({ ...data, sellerId: data.seller_id, isLiked: false, likesCount: data.likes_count || 0, viewsCount: data.views_count || 0, soldCount: data.sold_count || 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/listings/:id", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    await supabase.from("listings").delete().eq("id", req.params.id).eq("seller_id", user.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/listings/:id/like", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data: existing } = await supabase.from("listing_likes").select().eq("listing_id", req.params.id).eq("user_id", user.id).single();

    if (existing) {
      await supabase.from("listing_likes").delete().eq("listing_id", req.params.id).eq("user_id", user.id);
      await supabase.rpc("decrement_likes", { listing_id: req.params.id });
      const { data: listing } = await supabase.from("listings").select("likes_count").eq("id", req.params.id).single();
      res.json({ liked: false, likesCount: listing?.likes_count || 0 });
    } else {
      await supabase.from("listing_likes").insert({ listing_id: req.params.id, user_id: user.id });
      await supabase.rpc("increment_likes", { listing_id: req.params.id });
      const { data: listing } = await supabase.from("listings").select("likes_count").eq("id", req.params.id).single();
      res.json({ liked: true, likesCount: listing?.likes_count || 0 });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/listings/:id/sold", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase.from("listings").update({ status: "sold" }).eq("id", req.params.id).eq("seller_id", user.id).select().single();
    if (error || !data) return res.status(404).json({ error: "Not found" });

    res.json({ ...data, sellerId: data.seller_id, isLiked: false, likesCount: data.likes_count || 0, viewsCount: data.views_count || 0, soldCount: data.sold_count || 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
