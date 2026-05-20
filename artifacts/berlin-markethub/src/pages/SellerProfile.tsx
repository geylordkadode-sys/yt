import { AppLayout } from "@/components/layout/AppLayout";
import { MapPin, Calendar, Star, UserPlus, UserCheck, MessageSquare, BadgeCheck, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/ProductCard";
import { useRoute, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

export default function SellerProfile() {
  const [, params] = useRoute("/seller/:userId");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const sellerId = params?.userId;

  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [soldListings, setSoldListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (sellerId) loadAll();
  }, [sellerId]);

  const loadAll = async () => {
    setLoading(true);
    const [sellerRes, listingsRes, reviewsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", sellerId).single(),
      supabase.from("listings").select("*, profiles!seller_id(username,full_name,avatar_url,is_verified)")
        .eq("seller_id", sellerId).order("created_at", { ascending: false }),
      supabase.from("reviews").select("*, profiles!reviewer_id(username,full_name,avatar_url)")
        .eq("seller_id", sellerId).order("created_at", { ascending: false }),
    ]);

    if (sellerRes.data) setSeller(sellerRes.data);
    if (listingsRes.data) {
      const all = listingsRes.data.map(mapListing);
      setListings(all.filter((l: any) => l.status === "active"));
      setSoldListings(all.filter((l: any) => l.status === "sold"));
    }
    if (reviewsRes.data) setReviews(reviewsRes.data);

    if (user && sellerId) {
      const { data } = await supabase.from("follows")
        .select("id").eq("follower_id", user.id).eq("following_id", sellerId).single();
      setIsFollowing(!!data);
    }
    setLoading(false);
  };

  const mapListing = (l: any) => ({
    id: l.id,
    title: l.title,
    price: l.price,
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
    createdAt: l.created_at,
    updatedAt: l.updated_at,
  });

  const handleFollow = async () => {
    if (!user) { setLocation("/auth/login"); return; }
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", sellerId);
        await supabase.rpc("decrement_followers", { user_id: sellerId });
        await supabase.rpc("decrement_following", { user_id: user.id });
        setIsFollowing(false);
        setSeller((s: any) => ({ ...s, followers_count: Math.max(0, (s?.followers_count || 0) - 1) }));
      } else {
        await supabase.from("follows").insert({ follower_id: user.id, following_id: sellerId });
        await supabase.rpc("increment_followers", { user_id: sellerId });
        await supabase.rpc("increment_following", { user_id: user.id });
        setIsFollowing(true);
        setSeller((s: any) => ({ ...s, followers_count: (s?.followers_count || 0) + 1 }));
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    if (!user) { setLocation("/auth/login"); return; }
    setLocation("/chat");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!seller) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-gray-400 flex-col gap-2">
          <Package className="w-10 h-10 opacity-40" />
          <p className="text-sm">Seller not found</p>
        </div>
      </AppLayout>
    );
  }

  const displayName = seller.full_name || seller.username || "Seller";
  const joinedDate = new Date(seller.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const isOwnProfile = user?.id === sellerId;

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="font-bold text-base text-gray-900">Shop Profile</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white px-4 pt-5 pb-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-rose-100 shadow-md bg-rose-50 flex items-center justify-center mb-3">
            {seller.avatar_url ? (
              <img src={seller.avatar_url} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary">{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mb-0.5">
            <h1 className="text-lg font-bold text-gray-900">{displayName}</h1>
            {seller.is_verified && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-100" />}
          </div>
          <p className="text-sm text-gray-500 mb-2">@{seller.username || "user"}</p>

          {seller.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-700">{seller.rating?.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({seller.review_count || 0} reviews)</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 w-full mb-4 py-3 border-y border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{listings.length}</div>
              <div className="text-xs text-gray-500">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatCount(seller.followers_count || 0)}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{seller.following_count || 0}</div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
          </div>

          {!isOwnProfile && (
            <div className="flex gap-2 w-full mb-4">
              <Button
                className={`flex-1 rounded-full font-semibold text-sm ${isFollowing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-rose-50 text-primary border-2 border-primary hover:bg-rose-100"}`}
                onClick={handleFollow}
                disabled={followLoading}
              >
                {isFollowing ? <><UserCheck className="w-4 h-4 mr-1.5" /> Following</> : <><UserPlus className="w-4 h-4 mr-1.5" /> Follow</>}
              </Button>
              <Button className="flex-1 rounded-full font-semibold text-sm bg-primary text-white hover:bg-primary/90" onClick={handleMessage}>
                <MessageSquare className="w-4 h-4 mr-1.5" /> Message
              </Button>
            </div>
          )}

          {seller.bio && (
            <p className="text-sm text-gray-600 text-center leading-relaxed mb-3">{seller.bio}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            {seller.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{seller.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mt-2">
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="w-full bg-white rounded-none h-11 p-0 border-b border-gray-100">
            <TabsTrigger value="listings" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-gray-500 text-sm font-medium h-full">
              Listings ({listings.length})
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-gray-500 text-sm font-medium h-full">
              Sold ({soldListings.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-gray-500 text-sm font-medium h-full">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="p-4 m-0">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Package className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No active listings</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {listings.map(l => <ProductCard key={l.id} listing={l as any} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold" className="p-4 m-0">
            {soldListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Package className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No sold items yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {soldListings.map(l => <ProductCard key={l.id} listing={l as any} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="p-4 m-0">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Star className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((r: any) => (
                  <div key={r.id} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 overflow-hidden flex items-center justify-center">
                        {r.profiles?.avatar_url ? (
                          <img src={r.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-primary">
                            {(r.profiles?.full_name || r.profiles?.username || "U").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {r.profiles?.full_name || r.profiles?.username || "User"}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
