import { Link } from "wouter";
import { Heart, Star, BadgeCheck } from "lucide-react";
import { Listing } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  listing: Listing;
  className?: string;
}

export function ProductCard({ listing, className }: ProductCardProps) {
  return (
    <Link href={`/product/${listing.id}`}>
      <div className={cn("bg-card rounded-2xl overflow-hidden shadow-sm border border-border group cursor-pointer flex flex-col h-full relative", className)}>
        <button 
          className="absolute top-2 right-2 z-10 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 hover:text-primary transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // toggle wishlist logic
          }}
        >
          <Heart className={cn("w-4 h-4", listing.isLiked && "fill-primary text-primary")} />
        </button>
        
        <div className="aspect-[4/5] relative overflow-hidden bg-muted">
          <img 
            src={listing.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'} 
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">{listing.title}</h3>
          
          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="font-bold text-primary text-base">${listing.price.toFixed(2)}</span>
            {listing.rating && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                <span>{listing.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-muted overflow-hidden">
              {listing.sellerAvatar ? (
                <img src={listing.sellerAvatar} alt={listing.sellerName || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                  {(listing.sellerName || 'S').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate">{listing.sellerName || 'Seller'}</span>
            {listing.sellerVerified && (
              <BadgeCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}