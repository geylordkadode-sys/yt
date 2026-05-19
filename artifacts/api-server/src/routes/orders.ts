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

router.get("/cart", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.json({ items: [], subtotal: 0, shippingTotal: 0, total: 0 });

    const { data, error } = await supabase.from("cart_items").select(`
      *,
      listing:listing_id (id, title, price, images, shipping_fee, seller_id, profiles:seller_id (username, full_name))
    `).eq("user_id", user.id);

    if (error) throw error;
    const items = (data || []).map((c: any) => ({
      id: c.id, listingId: c.listing_id, title: c.listing?.title || "",
      price: c.listing?.price || 0, image: (c.listing?.images || [])[0] || "",
      quantity: c.quantity, sellerId: c.listing?.seller_id || "",
      sellerName: c.listing?.profiles?.full_name || c.listing?.profiles?.username || "",
    }));

    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const shippingTotal = 0;
    res.json({ items, subtotal, shippingTotal, total: subtotal + shippingTotal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { listingId, quantity } = req.body;
    const { data: existing } = await supabase.from("cart_items").select().eq("user_id", user.id).eq("listing_id", listingId).single();

    if (existing) {
      await supabase.from("cart_items").update({ quantity: existing.quantity + (quantity || 1) }).eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({ user_id: user.id, listing_id: listingId, quantity: quantity || 1 });
    }

    const { data, error } = await supabase.from("cart_items").select(`
      *,
      listing:listing_id (id, title, price, images, shipping_fee, seller_id, profiles:seller_id (username, full_name))
    `).eq("user_id", user.id);

    if (error) throw error;
    const items = (data || []).map((c: any) => ({
      id: c.id, listingId: c.listing_id, title: c.listing?.title || "",
      price: c.listing?.price || 0, image: (c.listing?.images || [])[0] || "",
      quantity: c.quantity, sellerId: c.listing?.seller_id || "",
      sellerName: c.listing?.profiles?.full_name || c.listing?.profiles?.username || "",
    }));
    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    res.json({ items, subtotal, shippingTotal: 0, total: subtotal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/cart/:itemId", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    await supabase.from("cart_items").delete().eq("id", req.params.itemId).eq("user_id", user.id);

    const { data } = await supabase.from("cart_items").select(`
      *,
      listing:listing_id (id, title, price, images, shipping_fee, seller_id, profiles:seller_id (username, full_name))
    `).eq("user_id", user.id);

    const items = (data || []).map((c: any) => ({
      id: c.id, listingId: c.listing_id, title: c.listing?.title || "",
      price: c.listing?.price || 0, image: (c.listing?.images || [])[0] || "",
      quantity: c.quantity, sellerId: c.listing?.seller_id || "",
      sellerName: c.listing?.profiles?.full_name || c.listing?.profiles?.username || "",
    }));
    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    res.json({ items, subtotal, shippingTotal: 0, total: subtotal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const supabase = getSupabase(req.headers.authorization);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { type } = req.query;
    let query = supabase.from("orders").select(`
      *,
      listing:listing_id (title, images),
      buyer:buyer_id (full_name, username),
      seller:seller_id (full_name, username)
    `).order("created_at", { ascending: false });

    if (type === "sales") query = query.eq("seller_id", user.id);
    else query = query.eq("buyer_id", user.id);

    const { data, error } = await query;
    if (error) throw error;

    res.json((data || []).map((o: any) => ({
      id: o.id, listingId: o.listing_id, listingTitle: o.listing?.title || "",
      listingImage: (o.listing?.images || [])[0] || "", price: o.price,
      buyerId: o.buyer_id, sellerId: o.seller_id,
      buyerName: o.buyer?.full_name || o.buyer?.username,
      sellerName: o.seller?.full_name || o.seller?.username,
      status: o.status, createdAt: o.created_at,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
