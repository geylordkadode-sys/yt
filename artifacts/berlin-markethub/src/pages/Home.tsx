import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/product/ProductCard";
import { SlidersHorizontal, Search, Star, Shirt, Home as HomeIcon, Heart, Smartphone, LayoutGrid } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const CATEGORIES = [
  { id: "popular", name: "Popular", icon: Star },
  { id: "women", name: "Women", icon: Shirt },
  { id: "men", name: "Men", icon: Shirt },
  { id: "home", name: "Home", icon: HomeIcon },
  { id: "beauty", name: "Beauty", icon: Heart },
  { id: "electronics", name: "Electronics", icon: Smartphone },
  { id: "all", name: "All", icon: LayoutGrid },
];

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Elegant Handbag",
    price: 1299,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"],
    category: "women",
    status: "active",
    quantity: 1,
    sellerId: "s1",
    sellerName: "Ananya Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60",
    sellerVerified: true,
    likesCount: 24,
    viewsCount: 150,
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
    sellerId: "s2",
    sellerName: "Rohan Verma",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60",
    sellerVerified: true,
    likesCount: 56,
    viewsCount: 340,
    soldCount: 12,
    rating: 4.7,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Modern Sofa",
    price: 8999,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"],
    category: "home",
    status: "active",
    quantity: 1,
    sellerId: "s3",
    sellerName: "Mehak Kapoor",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60",
    sellerVerified: true,
    likesCount: 33,
    viewsCount: 220,
    soldCount: 5,
    rating: 4.9,
    isLiked: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Wireless Headphones",
    price: 1899,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
    category: "electronics",
    status: "active",
    quantity: 8,
    sellerId: "s4",
    sellerName: "Arjun Malhotra",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60",
    sellerVerified: true,
    likesCount: 89,
    viewsCount: 520,
    soldCount: 45,
    rating: 4.6,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Floral Dress",
    price: 799,
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400"],
    category: "women",
    status: "active",
    quantity: 4,
    sellerId: "s5",
    sellerName: "Priya Singh",
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60",
    sellerVerified: true,
    likesCount: 41,
    viewsCount: 180,
    soldCount: 8,
    rating: 4.8,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Casual Sneakers",
    price: 1499,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
    category: "men",
    status: "active",
    quantity: 6,
    sellerId: "s6",
    sellerName: "Karan Mehta",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60",
    sellerVerified: true,
    likesCount: 67,
    viewsCount: 390,
    soldCount: 23,
    rating: 4.5,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Table Lamp",
    price: 599,
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"],
    category: "home",
    status: "active",
    quantity: 10,
    sellerId: "s7",
    sellerName: "Neha Iyer",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60",
    sellerVerified: true,
    likesCount: 28,
    viewsCount: 145,
    soldCount: 15,
    rating: 4.7,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Perfume",
    price: 1099,
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683702?w=400"],
    category: "beauty",
    status: "active",
    quantity: 5,
    sellerId: "s8",
    sellerName: "Simran Kaur",
    sellerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60",
    sellerVerified: true,
    likesCount: 53,
    viewsCount: 310,
    soldCount: 31,
    rating: 4.9,
    isLiked: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("popular");

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
          <button className="text-sm font-medium text-primary">See all</button>
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
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-rose-50 border-rose-100"
                }`}>
                  <Icon
                    className={`w-6 h-6 ${isActive ? "text-white" : "text-primary"}`}
                    strokeWidth={1.5}
                  />
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
      <div className="bg-white mt-2 px-4 pb-4 pt-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Featured Products</h2>
          <Link href="/search" className="text-sm font-medium text-primary">See all</Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOCK_LISTINGS.map(listing => (
            <ProductCard key={listing.id} listing={listing as any} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
