import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { MapPin, ShieldCheck, Star, Link as LinkIcon, Edit, LogOut, Settings, Image as ImageIcon, Menu, X, ChevronRight, ShoppingBag, Heart, MessageSquare, Award, PieChart, CreditCard, HelpCircle, UserPlus, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/ProductCard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

const MOCK_PROFILE = {
  id: "u1",
  username: "vintagestore_berlin",
  fullName: "Vintage Store Berlin",
  bio: "Curated vintage clothing and accessories. Based in Berlin. Shipping worldwide.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  country: "Germany",
  location: "Berlin",
  isVerified: true,
  rating: 4.8,
  reviewCount: 156,
  followersCount: 1240,
  followingCount: 45,
  listingsCount: 89,
};

const MOCK_LISTINGS = [
  {
    id: "1", title: "Vintage Denim Jacket", price: 45.00, images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"],
    category: "women", status: "active", quantity: 1, sellerId: "u1", sellerName: "Vintage Store Berlin", sellerVerified: true, likesCount: 24, viewsCount: 150, soldCount: 0, rating: 4.8, isLiked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: "2", title: "Silk Scarf 70s", price: 25.00, images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d"],
    category: "women", status: "active", quantity: 1, sellerId: "u1", sellerName: "Vintage Store Berlin", sellerVerified: true, likesCount: 45, viewsCount: 210, soldCount: 0, rating: 4.8, isLiked: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }
];

export default function Profile() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems = [
    { icon: Star, label: "My Shop", href: `/seller/${MOCK_PROFILE.id}` },
    { icon: ImageIcon, label: "My Listings", href: "#" },
    { icon: PieChart, label: "Analytics", href: "/profile/analytics" },
    { icon: ShoppingBag, label: "Orders & Purchases", href: "/orders" },
    { icon: Heart, label: "Saved Items", href: "#" },
    { icon: MessageSquare, label: "My Reviews", href: "#" },
    { icon: CreditCard, label: "Wallet", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
    { icon: HelpCircle, label: "Help & Support", href: "#" },
  ];

  return (
    <AuthGuard>
      <AppLayout>
        <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-rose-400 text-white px-4 py-3 shadow-md flex justify-between items-center">
           <h1 className="font-semibold text-lg absolute left-1/2 -translate-x-1/2">Profile</h1>
           <div className="w-10"></div> {/* Spacer for centering */}
           
           <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <button className="p-2 -mr-2 rounded-full hover:bg-white/20 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l border-border bg-background">
              <SheetTitle className="sr-only">Profile Menu</SheetTitle>
              <div className="h-full flex flex-col">
                <div className="p-6 bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-sm">
                      <img src={MOCK_PROFILE.avatarUrl} alt={MOCK_PROFILE.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{MOCK_PROFILE.fullName}</h3>
                      <p className="text-sm text-muted-foreground">@{MOCK_PROFILE.username}</p>
                    </div>
                  </div>
                  <Link href={`/seller/${MOCK_PROFILE.id}`}>
                    <Button variant="outline" className="w-full rounded-full text-xs font-semibold" onClick={() => setIsDrawerOpen(false)}>
                      View Public Profile
                    </Button>
                  </Link>
                </div>
                
                <div className="flex-1 overflow-y-auto py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</div>
                  {menuItems.map((item, i) => (
                    <Link key={i} href={item.href} onClick={() => setIsDrawerOpen(false)}>
                      <div className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-4">
                          <item.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                  
                  <div className="w-full h-px bg-border my-2"></div>
                  
                  <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                      <Moon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-sm">Dark Mode</span>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between px-6 py-3 hover:bg-rose-50 cursor-pointer transition-colors text-destructive mt-auto" onClick={() => setIsDrawerOpen(false)}>
                    <div className="flex items-center gap-4">
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium text-sm">Log Out</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="bg-card pb-6 rounded-b-3xl shadow-sm relative">
          <div className="h-32 bg-gradient-to-r from-rose-200 via-primary/20 to-rose-100 absolute top-0 left-0 w-full z-0"></div>
          
          <div className="relative z-10 px-4 pt-16 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-muted shadow-md mb-3">
              <img src={MOCK_PROFILE.avatarUrl} alt={MOCK_PROFILE.fullName} className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-xl font-bold flex items-center gap-1.5">
              {MOCK_PROFILE.fullName}
              {MOCK_PROFILE.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
            </h1>
            <p className="text-sm text-muted-foreground">@{MOCK_PROFILE.username}</p>
            
            <div className="flex items-center gap-4 mt-4 bg-muted/50 px-6 py-2 rounded-full border border-border">
              <div className="text-center">
                <div className="font-bold">{MOCK_PROFILE.followersCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</div>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="text-center">
                <div className="font-bold">{MOCK_PROFILE.followingCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Following</div>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="text-center flex flex-col items-center">
                <div className="font-bold flex items-center"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1"/> {MOCK_PROFILE.rating}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{MOCK_PROFILE.reviewCount} Reviews</div>
              </div>
            </div>
            
            <p className="text-sm text-center mt-4 max-w-[280px]">
              {MOCK_PROFILE.bio}
            </p>
            
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{MOCK_PROFILE.location}, {MOCK_PROFILE.country}</span>
              </div>
            </div>
            
            <div className="flex gap-2 w-full mt-6">
              <Link href="/profile/edit" className="flex-1">
                <Button className="w-full rounded-full font-semibold shadow-sm">
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </Link>
              <Button variant="outline" className="w-12 h-12 rounded-full p-0 flex-shrink-0 border-border" onClick={() => setIsDrawerOpen(true)}>
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="w-full bg-card rounded-none h-12 p-0 border-b border-border justify-start overflow-x-auto hide-scrollbar">
              <TabsTrigger value="listings" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Listings ({MOCK_PROFILE.listingsCount})
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Saved (12)
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings" className="p-4 m-0">
              <div className="grid grid-cols-2 gap-3">
                {MOCK_LISTINGS.map(listing => (
                  <ProductCard key={listing.id} listing={listing as any} />
                ))}
                
                <Link href="/post">
                  <div className="bg-primary/5 rounded-2xl overflow-hidden shadow-sm border border-primary/20 border-dashed cursor-pointer flex flex-col items-center justify-center h-full min-h-[220px] text-primary hover:bg-primary/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">Add New Listing</span>
                  </div>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="p-4 m-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg">No saved items</h3>
                <p className="text-muted-foreground text-sm max-w-[250px] mt-2">Tap the heart icon on products you like to save them here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-4 m-0">
               <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-sm">Reviews will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}