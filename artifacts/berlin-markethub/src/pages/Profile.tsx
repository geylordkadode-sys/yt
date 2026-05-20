import { AppLayout } from "@/components/layout/AppLayout";
import {
  MapPin, Calendar, Star, Edit2, Share2, MoreVertical, ChevronRight,
  User, ShoppingBag, Tag, CheckSquare, Award, Package, Heart,
  Percent, MessageSquare, Wallet, Settings, HelpCircle, Gift,
  Moon, Trash2, BadgeCheck, LogOut, Plus, Camera, Loader2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/ProductCard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

function ProfileContent() {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [soldListings, setSoldListings] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    const [profileRes, listingsRes, savedRes, walletRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("listings").select("*, profiles!seller_id(username,full_name,avatar_url,is_verified)")
        .eq("seller_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("listing_likes").select("listing_id, listings(*, profiles!seller_id(username,full_name,avatar_url,is_verified))")
        .eq("user_id", user!.id),
      supabase.from("wallets").select("*").eq("user_id", user!.id).single(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (listingsRes.data) {
      const all = listingsRes.data.map(mapListing);
      setListings(all.filter((l: any) => l.status !== "sold"));
      setSoldListings(all.filter((l: any) => l.status === "sold"));
    }
    if (savedRes.data) {
      setSavedListings(
        savedRes.data
          .filter((r: any) => r.listings)
          .map((r: any) => mapListing(r.listings))
      );
    }
    if (walletRes.data) setWallet(walletRes.data);
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
    sellerName: l.profiles?.full_name || l.profiles?.username || "You",
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `avatars/${user!.id}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("listings").upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from("listings").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", user!.id);
      setProfile((p: any) => ({ ...p, avatar_url: urlData.publicUrl }));
    } catch {
      // silently fail avatar upload
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleMarkAsSold = async (listingId: string) => {
    await supabase.from("listings").update({ status: "sold" }).eq("id", listingId);
    await loadAll();
  };

  const handleSignOut = async () => {
    setIsDrawerOpen(false);
    await signOut();
    setLocation("/auth/login");
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    await supabase.auth.admin?.deleteUser?.(user!.id).catch(() => {});
    await signOut();
    setLocation("/auth/signup");
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

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const username = profile?.username || user?.email?.split("@")[0] || "user";
  const avatarUrl = profile?.avatar_url;
  const joinedDate = new Date(user?.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  const menuItems = [
    { icon: User, label: "View Full Profile", href: `/seller/${user?.id}` },
    { icon: ShoppingBag, label: "My Shop", href: `/seller/${user?.id}` },
    { icon: Tag, label: "My Listings", action: () => { setActiveTab("listings"); setIsDrawerOpen(false); } },
    { icon: CheckSquare, label: "Mark as Sold", action: () => { setActiveTab("listings"); setIsDrawerOpen(false); } },
    { icon: Award, label: "Achievements", href: "#" },
    { icon: Package, label: "Orders & Purchases", href: "/orders" },
    { icon: Heart, label: "Saved Items", action: () => { setActiveTab("saved"); setIsDrawerOpen(false); } },
    { icon: Percent, label: "Offers & Coupons", href: "#" },
    { icon: Star, label: "My Reviews", action: () => { setActiveTab("reviews"); setIsDrawerOpen(false); } },
    { icon: Wallet, label: "Wallet", href: "/wallet" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "#" },
    { icon: Gift, label: "Invite & Earn", href: "#" },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="font-semibold text-base text-gray-900">My Profile</h1>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" onClick={() => setIsDrawerOpen(true)}>
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white px-4 pt-5 pb-4">
        <div className="flex flex-col items-center text-center">
          {/* Avatar with upload */}
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-rose-100 shadow-md bg-rose-50">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-3xl font-bold text-primary">{displayName.charAt(0).toUpperCase()}</span>
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <button
              className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm border-2 border-white"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          <div className="flex items-center gap-1.5 mb-0.5">
            <h1 className="text-lg font-bold text-gray-900">{displayName}</h1>
            {profile?.is_verified && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-100" />}
          </div>
          <p className="text-sm text-gray-500 mb-1">@{username}</p>

          {(profile?.rating || profile?.review_count > 0) && (
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-700">{(profile?.rating || 0).toFixed(1)}</span>
              <span className="text-sm text-gray-400">({profile?.review_count || 0} Reviews)</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 w-full mb-4 py-3 border-y border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{listings.length}</div>
              <div className="text-xs text-gray-500">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatCount(profile?.followers_count || 0)}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{profile?.following_count || 0}</div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
          </div>

          {/* Edit Profile */}
          <Link href="/profile/edit" className="w-full mb-4">
            <button className="w-full py-2.5 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </Link>

          {profile?.bio && (
            <p className="text-sm text-gray-600 text-center leading-relaxed mb-3 whitespace-pre-line">{profile.bio}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            {profile?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      {wallet && (
        <Link href="/wallet">
          <div className="mx-4 mt-2 bg-gradient-to-r from-primary to-rose-400 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80 mb-0.5">Wallet Balance</p>
                <p className="text-2xl font-bold">${(wallet.balance || 0).toFixed(2)}</p>
                {wallet.pending_payout > 0 && (
                  <p className="text-xs text-white/70 mt-0.5">${wallet.pending_payout.toFixed(2)} pending</p>
                )}
              </div>
              <div className="text-right">
                <Wallet className="w-8 h-8 text-white/60 mb-1 ml-auto" />
                <p className="text-xs text-white/70">Total Earned</p>
                <p className="text-sm font-bold">${(wallet.total_earned || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Stats Cards */}
      {(profile?.sold_count > 0 || listings.length > 0) && (
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="font-bold text-sm text-gray-900 mb-3">My Stats</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Items Sold</div>
              <div className="font-bold text-primary text-sm">{profile?.sold_count || 0}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Listings</div>
              <div className="font-bold text-primary text-sm">{listings.length}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Total Sales</div>
              <div className="font-bold text-primary text-sm">${(profile?.total_sales || 0).toFixed(0)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Listings Tabs */}
      <div className="bg-white mt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-white rounded-none h-11 p-0 border-b border-gray-100 justify-start overflow-x-auto hide-scrollbar">
            {["listings", "sold", "saved", "reviews"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-shrink-0 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-gray-500 text-sm font-medium h-full capitalize"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="listings" className="p-4 m-0">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Tag className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-medium">No active listings</p>
                <Link href="/post" className="mt-3 flex items-center gap-1.5 bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold">
                  <Plus className="w-4 h-4" /> Post a Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {listings.map(l => (
                  <div key={l.id} className="relative">
                    <ProductCard listing={l as any} />
                    <button
                      className="mt-1 w-full text-[10px] font-semibold text-primary border border-primary/20 rounded-lg py-1 hover:bg-rose-50 transition-colors"
                      onClick={() => handleMarkAsSold(l.id)}
                    >
                      Mark as Sold
                    </button>
                  </div>
                ))}
                <Link href="/post">
                  <div className="bg-rose-50 rounded-2xl border-2 border-dashed border-rose-200 flex flex-col items-center justify-center aspect-[3/4] text-primary hover:bg-rose-100 transition-colors">
                    <Plus className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold">Add Listing</span>
                  </div>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold" className="p-4 m-0">
            {soldListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Package className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No sold items yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {soldListings.map(l => <ProductCard key={l.id} listing={l as any} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="p-4 m-0">
            {savedListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Heart className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No saved items yet</p>
                <p className="text-xs mt-1">Tap the heart icon on any product</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {savedListings.map(l => <ProductCard key={l.id} listing={l as any} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="p-4 m-0">
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
              <Star className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">No reviews yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0 border-l border-gray-100 bg-white overflow-y-auto">
          <SheetTitle className="sr-only">Profile Menu</SheetTitle>

          {/* Drawer Header */}
          <div className="px-5 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-rose-100 bg-rose-50 flex items-center justify-center flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-primary">{displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">{displayName}</span>
                  {profile?.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-100" />}
                </div>
                <p className="text-sm text-gray-500">@{username}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, i) => (
              item.href ? (
                <Link key={i} href={item.href} onClick={() => setIsDrawerOpen(false)}>
                  <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3.5">
                      <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      <span className="text-sm text-gray-800 font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ) : (
                <button key={i} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors" onClick={item.action}>
                  <div className="flex items-center gap-3.5">
                    <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    <span className="text-sm text-gray-800 font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              )
            ))}

            <div className="h-px bg-gray-100 my-2 mx-5" />

            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <Moon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <span className="text-sm text-gray-800 font-medium">Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="h-px bg-gray-100 my-2 mx-5" />

            <button className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50 transition-colors" onClick={handleSignOut}>
              <LogOut className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 font-medium">Log Out</span>
            </button>

            <button
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 transition-colors ${confirmDelete ? "bg-red-50" : "hover:bg-red-50"}`}
              onClick={handleDeleteAccount}
            >
              <Trash2 className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              <span className="text-sm text-red-500 font-medium">
                {confirmDelete ? "Tap again to confirm deletion" : "Delete Account"}
              </span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}

export default function Profile() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
