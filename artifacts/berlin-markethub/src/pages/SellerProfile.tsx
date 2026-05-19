import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { MapPin, ShieldCheck, Star, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/ProductCard";
import { useRoute } from "wouter";

const MOCK_SELLER = {
  id: "s1",
  username: "vintagestore_berlin",
  fullName: "Vintage Store Berlin",
  bio: "Curated vintage clothing and accessories. Based in Berlin. Shipping worldwide. 🌍👗✨",
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
    category: "women", status: "active", quantity: 1, sellerId: "s1", sellerName: "Vintage Store Berlin", sellerVerified: true, likesCount: 24, viewsCount: 150, soldCount: 0, rating: 4.8, isLiked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: "2", title: "Silk Scarf 70s", price: 25.00, images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d"],
    category: "women", status: "active", quantity: 1, sellerId: "s1", sellerName: "Vintage Store Berlin", sellerVerified: true, likesCount: 45, viewsCount: 210, soldCount: 0, rating: 4.8, isLiked: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }
];

export default function SellerProfile() {
  const [match, params] = useRoute("/seller/:userId");

  return (
    <AppLayout>
      <Header title="Shop Profile" showBack showSearch={false} />
      
      <div className="bg-card pb-6 rounded-b-3xl shadow-sm relative">
        <div className="h-32 bg-gradient-to-r from-rose-200 via-primary/20 to-rose-100 absolute top-0 left-0 w-full z-0"></div>
        
        <div className="relative z-10 px-4 pt-16 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-muted shadow-md mb-3">
            <img src={MOCK_SELLER.avatarUrl} alt={MOCK_SELLER.fullName} className="w-full h-full object-cover" />
          </div>
          
          <h1 className="text-xl font-bold flex items-center gap-1.5">
            {MOCK_SELLER.fullName}
            {MOCK_SELLER.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
          </h1>
          <p className="text-sm text-muted-foreground">@{MOCK_SELLER.username}</p>
          
          <div className="flex items-center gap-4 mt-4 bg-muted/50 px-6 py-2 rounded-full border border-border">
            <div className="text-center">
              <div className="font-bold">{MOCK_SELLER.followersCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</div>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="text-center">
              <div className="font-bold">{MOCK_SELLER.followingCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Following</div>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="text-center flex flex-col items-center">
              <div className="font-bold flex items-center"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1"/> {MOCK_SELLER.rating}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{MOCK_SELLER.reviewCount} Reviews</div>
            </div>
          </div>
          
          <p className="text-sm text-center mt-4 max-w-[280px]">
            {MOCK_SELLER.bio}
          </p>
          
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{MOCK_SELLER.location}, {MOCK_SELLER.country}</span>
            </div>
          </div>
          
          <div className="flex gap-2 w-full mt-6">
            <Button className="flex-1 rounded-full font-semibold shadow-sm text-primary bg-primary/10 hover:bg-primary/20">
              <UserPlus className="w-4 h-4 mr-2" /> Follow
            </Button>
            <Button className="flex-1 rounded-full font-semibold shadow-sm bg-primary text-white hover:bg-primary/90">
              Message
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="w-full bg-card rounded-none h-12 p-0 border-b border-border justify-start overflow-x-auto hide-scrollbar">
            <TabsTrigger value="listings" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Listings ({MOCK_SELLER.listingsCount})
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Sold (45)
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
            </div>
          </TabsContent>
          
          <TabsContent value="sold" className="p-4 m-0">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground text-sm">Sold items will appear here.</p>
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
  );
}