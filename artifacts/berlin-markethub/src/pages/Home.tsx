import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/product/ProductCard";
import { Search } from "lucide-react";
import { Link } from "wouter";

const CATEGORIES = [
  { id: "all", name: "All", icon: "✨" },
  { id: "women", name: "Women", icon: "👗" },
  { id: "men", name: "Men", icon: "👕" },
  { id: "home", name: "Home", icon: "🏡" },
  { id: "beauty", name: "Beauty", icon: "💄" },
  { id: "electronics", name: "Tech", icon: "📱" },
];

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    price: 45.00,
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"],
    category: "women",
    status: "active",
    quantity: 1,
    sellerId: "s1",
    sellerName: "Vintage Store",
    sellerVerified: true,
    likesCount: 24,
    viewsCount: 150,
    soldCount: 0,
    rating: 4.8,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Minimalist Ceramic Vase",
    price: 28.50,
    images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c"],
    category: "home",
    status: "active",
    quantity: 5,
    sellerId: "s2",
    sellerName: "Artisan Crafts",
    sellerVerified: true,
    likesCount: 12,
    viewsCount: 89,
    soldCount: 3,
    rating: 5.0,
    isLiked: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Sony Wireless Headphones",
    price: 120.00,
    originalPrice: 150.00,
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"],
    category: "electronics",
    status: "active",
    quantity: 2,
    sellerId: "s3",
    sellerName: "Tech Hub",
    sellerVerified: false,
    likesCount: 56,
    viewsCount: 340,
    soldCount: 12,
    rating: 4.5,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Organic Skincare Set",
    price: 65.00,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571"],
    category: "beauty",
    status: "active",
    quantity: 10,
    sellerId: "s4",
    sellerName: "Pure Beauty",
    sellerVerified: true,
    likesCount: 89,
    viewsCount: 420,
    soldCount: 45,
    rating: 4.9,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function Home() {
  return (
    <AppLayout>
      <Header />
      
      {/* Search Bar */}
      <div className="px-4 py-3 bg-gradient-to-b from-primary/10 to-transparent">
        <Link href="/search">
          <div className="bg-card rounded-full flex items-center px-4 py-3 shadow-sm border border-border cursor-text">
            <Search className="w-5 h-5 text-muted-foreground mr-2" />
            <span className="text-muted-foreground text-sm">Search for products, brands...</span>
          </div>
        </Link>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 min-w-max pb-2">
          {CATEGORIES.map((cat, idx) => (
            <Link key={cat.id} href={`/search?category=${cat.id}`} className="flex flex-col items-center gap-1.5 group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-105 ${idx === 0 ? 'bg-primary text-white' : 'bg-card border border-border'}`}>
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Featured Finds</h2>
          <Link href="/search" className="text-primary text-sm font-medium">See all</Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {MOCK_LISTINGS.map(listing => (
            <ProductCard key={listing.id} listing={listing as any} />
          ))}
        </div>
      </div>
      
      {/* Trending Banner */}
      <div className="px-4 py-2 my-2">
        <div className="bg-gradient-to-r from-rose-400 to-primary rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block mb-2">Weekend Sale</span>
            <h2 className="text-2xl font-bold mb-1">Up to 50% Off</h2>
            <p className="text-white/90 text-sm mb-4">On selected summer styles</p>
            <Link href="/search?promo=summer" className="bg-white text-primary px-5 py-2 rounded-full text-sm font-bold inline-block shadow-sm">
              Shop Now
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-full bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b')] bg-cover opacity-50 mix-blend-overlay"></div>
        </div>
      </div>
      
    </AppLayout>
  );
}