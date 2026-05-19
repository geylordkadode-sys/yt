import { AppLayout } from "@/components/layout/AppLayout";
import { MapPin, Calendar, ShieldCheck, Star, Edit2, Share2, MoreVertical, ChevronRight, User, ShoppingBag, Tag, CheckSquare, Award, Package, Heart, Percent, MessageSquare, Wallet, Settings, HelpCircle, Gift, Moon, Trash2, BarChart2, TrendingUp, Users, LogOut, BadgeCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/ProductCard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";

const MOCK_PROFILE = {
  id: "u1",
  username: "ananya_sharma",
  fullName: "Ananya Sharma",
  bio: "Fashion lover | Seller | Believer in good vibes\nSelling trendy, quality & affordable products",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  location: "Delhi, India",
  joinedDate: "Jan 2023",
  isVerified: true,
  rating: 4.8,
  reviewCount: 128,
  followersCount: 2500,
  followingCount: 180,
  listingsCount: 128,
  totalSales: 125430,
  itemsSold: 320,
  successRate: 98,
  responseTime: "2h",
  repeatBuyers: 85,
  positiveReviews: 128,
};

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Elegant Handbag",
    price: 1299,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"],
    category: "women",
    status: "active",
    quantity: 1,
    sellerId: "u1",
    sellerName: "Ananya Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60",
    sellerVerified: true,
    likesCount: 32,
    viewsCount: 245,
    soldCount: 0,
    rating: 4.8,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Smart Watch",
    price: 2499,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
    category: "electronics",
    status: "active",
    quantity: 3,
    sellerId: "u1",
    sellerName: "Ananya Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60",
    sellerVerified: true,
    likesCount: 21,
    viewsCount: 189,
    soldCount: 5,
    rating: 4.7,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Floral Dress",
    price: 799,
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400"],
    category: "women",
    status: "active",
    quantity: 4,
    sellerId: "u1",
    sellerName: "Ananya Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60",
    sellerVerified: true,
    likesCount: 45,
    viewsCount: 310,
    soldCount: 8,
    rating: 4.9,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ACHIEVEMENTS = [
  { icon: "🏆", label: "Top Seller", date: "May 2024" },
  { icon: "⚡", label: "Fast Responder", date: "Apr 2024" },
  { icon: "💯", label: "100+ Sales", date: "Mar 2024" },
  { icon: "⭐", label: "5 Star Seller", date: "Feb 2024" },
];

const SHOP_IMAGES = [
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=120",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=120",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120",
  "https://images.unsplash.com/photo-1541643600914-78b084683702?w=120",
];

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

export default function Profile() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [, setLocation] = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: User, label: "View Full Profile", href: `/seller/${MOCK_PROFILE.id}` },
    { icon: ShoppingBag, label: "My Shop", href: `/seller/${MOCK_PROFILE.id}` },
    { icon: Tag, label: "My Listings", href: "#" },
    { icon: CheckSquare, label: "Mark as Sold", href: "#" },
    { icon: Award, label: "Achievements", href: "#" },
    { icon: Package, label: "Orders & Purchases", href: "/orders" },
    { icon: Heart, label: "Saved Items", href: "#" },
    { icon: Percent, label: "Offers & Coupons", href: "#" },
    { icon: Star, label: "My Reviews", href: "#" },
    { icon: Wallet, label: "Wallet", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
    { icon: HelpCircle, label: "Help & Support", href: "#" },
    { icon: Gift, label: "Invite & Earn", href: "#" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setLocation("/auth/login");
  };

  return (
    <AuthGuard>
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
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-rose-100 shadow-md mb-3">
              <img src={MOCK_PROFILE.avatarUrl} alt={MOCK_PROFILE.fullName} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-1.5 mb-0.5">
              <h1 className="text-lg font-bold text-gray-900">{MOCK_PROFILE.fullName}</h1>
              <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-100" />
            </div>
            <p className="text-sm text-gray-500 mb-1">@{MOCK_PROFILE.username}</p>
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-700">{MOCK_PROFILE.rating}</span>
              <span className="text-sm text-gray-400">({MOCK_PROFILE.reviewCount} Reviews)</span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-center gap-8 w-full mb-4 py-3 border-y border-gray-100">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{MOCK_PROFILE.listingsCount}</div>
                <div className="text-xs text-gray-500">Listings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{formatCount(MOCK_PROFILE.followersCount)}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{MOCK_PROFILE.followingCount}</div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link href="/profile/edit" className="w-full mb-4">
              <button className="w-full py-2.5 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </Link>

            {/* Bio */}
            <p className="text-sm text-gray-600 text-center leading-relaxed mb-3 whitespace-pre-line">
              {MOCK_PROFILE.bio}
            </p>

            {/* Location & Joined */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{MOCK_PROFILE.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {MOCK_PROFILE.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Shop */}
        <div className="bg-white mt-2 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-gray-900">My Shop</h2>
            <button className="text-sm font-medium text-primary">See Shop</button>
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {SHOP_IMAGES.map((img, i) => (
              <div key={i} className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-rose-50">
                <img src={img} alt="shop item" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* My Stats */}
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="font-bold text-sm text-gray-900 mb-3">My Stats</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Total Sales</div>
              <div className="font-bold text-primary text-sm">${MOCK_PROFILE.totalSales.toLocaleString()}</div>
              <div className="text-[9px] text-green-500 font-medium mt-0.5">+18% this month</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Items Sold</div>
              <div className="font-bold text-primary text-sm">{MOCK_PROFILE.itemsSold}</div>
              <div className="text-[9px] text-green-500 font-medium mt-0.5">+24% this month</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Success Rate</div>
              <div className="font-bold text-primary text-sm">{MOCK_PROFILE.successRate}%</div>
              <div className="text-[9px] text-green-500 font-medium mt-0.5">Excellent</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Response Time</div>
              <div className="font-bold text-primary text-sm">{MOCK_PROFILE.responseTime}</div>
              <div className="text-[9px] text-green-500 font-medium mt-0.5">Very Fast</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Repeat Buyers</div>
              <div className="font-bold text-primary text-sm">{MOCK_PROFILE.repeatBuyers}%</div>
              <div className="text-[9px] text-green-500 font-medium mt-0.5">Great</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-1">Positive Reviews</div>
              <div className="font-bold text-primary text-sm">{MOCK_PROFILE.positiveReviews}</div>
              <div className="text-[9px] text-amber-500 font-medium mt-0.5">4.8 Rating</div>
            </div>
          </div>
        </div>

        {/* Listings Tabs */}
        <div className="bg-white mt-2">
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="w-full bg-white rounded-none h-11 p-0 border-b border-gray-100 justify-start overflow-x-auto hide-scrollbar">
              {["Listings", "Sold", "Saved", "Reviews", "Likes"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="flex-shrink-0 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-gray-500 text-sm font-medium h-full"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="listings" className="p-4 m-0">
              <div className="grid grid-cols-3 gap-2">
                {MOCK_LISTINGS.map(listing => (
                  <div key={listing.id} className="relative">
                    <ProductCard listing={listing as any} compact />
                    <button className="absolute top-1 right-1 z-20 w-5 h-5 flex items-center justify-center">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="mt-1">
                      <span className="text-[9px] bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sold" className="p-4 m-0">
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Package className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No sold items yet</p>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="p-4 m-0">
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Heart className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No saved items yet</p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-4 m-0">
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Star className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No reviews yet</p>
              </div>
            </TabsContent>

            <TabsContent value="likes" className="p-4 m-0">
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Heart className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">No liked items yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Achievements */}
        <div className="bg-white mt-2 px-4 py-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-gray-900">Achievements</h2>
            <button className="text-sm font-medium text-primary">See All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar">
            {ACHIEVEMENTS.map((ach, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center text-2xl">
                  {ach.icon}
                </div>
                <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight w-16">{ach.label}</span>
                <span className="text-[9px] text-gray-400">{ach.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0 border-l border-gray-100 bg-white">
            <SheetTitle className="sr-only">Profile Menu</SheetTitle>
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Drawer Header */}
              <div className="px-5 py-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-rose-100">
                    <img src={MOCK_PROFILE.avatarUrl} alt={MOCK_PROFILE.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900">{MOCK_PROFILE.fullName}</span>
                      <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-100" />
                    </div>
                    <p className="text-sm text-gray-500">@{MOCK_PROFILE.username}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 py-2">
                {menuItems.map((item, i) => (
                  <Link key={i} href={item.href} onClick={() => setIsDrawerOpen(false)}>
                    <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3.5">
                        <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                        <span className="text-sm text-gray-800 font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                ))}

                <div className="h-px bg-gray-100 my-2 mx-5" />

                <div className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3.5">
                    <Moon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    <span className="text-sm text-gray-800 font-medium">Dark Mode</span>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="h-px bg-gray-100 my-2 mx-5" />

                <button
                  className="flex items-center gap-3.5 px-5 py-3 w-full hover:bg-gray-50 transition-colors"
                  onClick={() => { setIsDrawerOpen(false); handleSignOut(); }}
                >
                  <LogOut className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                  <span className="text-sm text-gray-600 font-medium">Log Out</span>
                </button>

                <button className="flex items-center gap-3.5 px-5 py-3 w-full hover:bg-red-50 transition-colors">
                  <Trash2 className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                  <span className="text-sm text-red-500 font-medium">Delete Account</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </AppLayout>
    </AuthGuard>
  );
}
