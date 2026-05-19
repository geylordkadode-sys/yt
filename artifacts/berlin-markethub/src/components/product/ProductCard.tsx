import { Link } from "wouter";
import { Heart, BadgeCheck } from "lucide-react";
import { Listing } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  listing: Listing;
  className?: string;
  compact?: boolean;
}

export function ProductCard({ listing, className, compact }: ProductCardProps) {
  const [liked, setLiked] = useState(listing.isLiked ?? false);

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${(price).toLocaleString()}`;
    return `$${price.toFixed(0)}`;
  };

  return (
    <Link href={`/product/${listing.id}`}>
      <div className={cn("bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer flex flex-col", className)}>
        <div className="relative">
          <div className={cn("relative overflow-hidden bg-rose-50", compact ? "aspect-square" : "aspect-[4/4.5]")}>
            <img
              src={listing.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <button
            className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
          >
            <Heart className={cn("w-3.5 h-3.5", liked ? "fill-primary text-primary" : "text-gray-400")} />
          </button>
        </div>

        <div className="p-2.5 flex flex-col flex-1">
          <h3 className="font-semibold text-xs text-gray-900 line-clamp-1 leading-tight mb-1">{listing.title}</h3>
          <span className="font-bold text-primary text-sm mb-2">{formatPrice(listing.price)}</span>

          <div className="flex items-center gap-1.5 mt-auto">
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-rose-100">
              {listing.sellerAvatar ? (
                <img src={listing.sellerAvatar} alt={listing.sellerName || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[7px] font-bold text-primary">
                  {(listing.sellerName || "S").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-500 truncate flex-1">{listing.sellerName || "Seller"}</span>
            {listing.sellerVerified && (
              <BadgeCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 fill-blue-100" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
