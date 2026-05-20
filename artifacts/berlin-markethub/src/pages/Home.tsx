import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/product/ProductCard";
import { SlidersHorizontal, Search, Star, Shirt, Home as HomeIcon, Heart, Smartphone, LayoutGrid } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "popular", name: "Popular", icon: Star },
  { id: "women", name: "Women", icon: Shirt },
  { id: "men", name: "Men", icon: Shirt },
  { id: "home", name: "Home", icon: HomeIcon },
  { id: "beauty", name: "Beauty", icon: Heart },
  { id: "electronics", name: "Electronics", icon: Smartphone },
  { id: "all", name: "All", icon: LayoutGrid },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("popular");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [activeCategory]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("listings")
        .select(`
          id, title, price, original_price, images, category, status,
          quantity, seller_id, likes_count, views_count, sold_count, rating,
          profiles!seller_id (
            id, username, full_name, avatar_url, is_verified
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(20);

      if (activeCategory !== "popular" && activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }
      if (activeCategory === "popular") {
        query = query.order("likes_count", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      const mapped = (data || []).map((l: any) => ({
        id: l.id,
        title: l.title,
        price: l.price,
        originalPrice: l.original_price,
        images: l.images || [],
        category: l.category,
        status: l.status,
        quantity: l.quantity,
        sellerId: l.seller_id,
        sellerName: l.profiles?.full_name || l.profiles?.username || "Seller",
        sellerAvatar: l.profiles?.avatar_url,
        sellerVerified: l.profiles?.is_verified || false,
        likesCount: l.likes_count || 0,
        viewsCount: l.views_count || 0,
        soldCount: l.sold_count || 0,
        rating: l.rating,
        isLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setListings(mapped);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Header />

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white">
        <Link href="/search">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-rose-50 border border-rose-100 rounded-full flex items-center px-4 py-2.5 gap-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-400 text-sm">Search for products, brands and more...</span>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </div>
          </div>
        </Link>
      </div>

      {/* Shortcuts */}
      <div className="bg-white px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Shortcuts</h2>
          <Link href="/search" className="text-sm font-medium text-primary">See all</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isActive ? "bg-primary border-primary" : "bg-rose-50 border-rose-100"
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-primary"}`} strokeWidth={1.5} />
                </div>
                <span className={`text-[11px] font-medium ${isActive ? "text-primary" : "text-gray-500"}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white mt-2 px-4 pb-6 pt-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Featured Products</h2>
          <Link href="/search" className="text-sm font-medium text-primary">See all</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl animate-pulse" style={{ aspectRatio: "3/4" }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-3">
              <Search className="w-7 h-7 text-primary opacity-50" />
            </div>
            <p className="text-gray-500 text-sm font-medium">No listings yet</p>
            <p className="text-gray-400 text-xs mt-1">Be the first to post something!</p>
            <Link href="/post" className="mt-4 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold">
              Post a Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {listings.map(listing => (
              <ProductCard key={listing.id} listing={listing as any} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
