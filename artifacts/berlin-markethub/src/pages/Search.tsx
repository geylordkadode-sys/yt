import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Search as SearchIcon, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";

const CATEGORIES = ["All", "Women", "Men", "Home", "Beauty", "Electronics", "Vintage", "Art"];

const MOCK_RESULTS = [
  {
    id: "1", title: "Vintage Denim Jacket", price: 45.00, images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"],
    category: "women", status: "active", quantity: 1, sellerId: "s1", sellerName: "Vintage Store", sellerVerified: true, likesCount: 24, viewsCount: 150, soldCount: 0, rating: 4.8, isLiked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: "2", title: "Minimalist Ceramic Vase", price: 28.50, images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c"],
    category: "home", status: "active", quantity: 5, sellerId: "s2", sellerName: "Artisan Crafts", sellerVerified: true, likesCount: 12, viewsCount: 89, soldCount: 3, rating: 5.0, isLiked: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: "3", title: "Sony Wireless Headphones", price: 120.00, originalPrice: 150.00, images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"],
    category: "electronics", status: "active", quantity: 2, sellerId: "s3", sellerName: "Tech Hub", sellerVerified: false, likesCount: 56, viewsCount: 340, soldCount: 12, rating: 4.5, isLiked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: "4", title: "Organic Skincare Set", price: 65.00, images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571"],
    category: "beauty", status: "active", quantity: 10, sellerId: "s4", sellerName: "Pure Beauty", sellerVerified: true, likesCount: 89, viewsCount: 420, soldCount: 45, rating: 4.9, isLiked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }
];

export default function Search() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <AppLayout>
      <Header title="Discover" showBack />
      
      <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-md pb-3 pt-3 border-b border-border shadow-sm">
        <div className="px-4 flex gap-2">
          <div className="flex-1 bg-card rounded-full flex items-center px-4 py-2.5 shadow-sm border border-border">
            <SearchIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-transparent border-none outline-none w-full text-sm text-foreground"
              autoFocus
            />
          </div>
          <button className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 mt-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-4 mt-3 flex justify-between items-center text-xs font-medium text-muted-foreground">
          <span>{MOCK_RESULTS.length} results found</span>
          <button className="flex items-center gap-1 hover:text-foreground">
            Sort by: Popular <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {MOCK_RESULTS.map(listing => (
          <ProductCard key={listing.id} listing={listing as any} />
        ))}
      </div>
    </AppLayout>
  );
}