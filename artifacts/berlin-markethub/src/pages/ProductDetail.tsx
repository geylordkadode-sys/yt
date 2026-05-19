import { useState } from "react";
import { useRoute } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Star, ChevronRight, Share2, Heart, ShieldCheck, MapPin, MessageSquare, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AuthGuard } from "@/components/auth/AuthGuard";

const MOCK_PRODUCT = {
  id: "1",
  title: "Vintage Denim Jacket",
  description: "Authentic 90s vintage Levi's denim jacket in excellent condition. Slight distressing on the cuffs which adds to the character. Perfect for layering in any season.",
  price: 45.00,
  originalPrice: 65.00,
  images: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0"
  ],
  category: "Women",
  condition: "Excellent - Used",
  status: "active",
  quantity: 1,
  sellerId: "s1",
  sellerName: "Vintage Store Berlin",
  sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  sellerVerified: true,
  likesCount: 24,
  viewsCount: 150,
  rating: 4.8,
  reviewsCount: 12,
  isLiked: false,
  shippingFee: 5.00,
  location: "Berlin, Germany",
};

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const [isLiked, setIsLiked] = useState(MOCK_PRODUCT.isLiked);

  return (
    <AppLayout showNav={false}>
      <Header showBack showCart showSearch />
      
      <div className="pb-24">
        {/* Images */}
        <div className="relative bg-muted">
          <Carousel className="w-full">
            <CarouselContent>
              {MOCK_PRODUCT.images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="aspect-square relative w-full overflow-hidden">
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {MOCK_PRODUCT.images.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-white/50'}`} />
              ))}
            </div>
          </Carousel>
          
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
            <button 
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-foreground hover:text-primary transition-colors"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-primary text-primary' : ''}`} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-foreground hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-card mb-2 shadow-sm rounded-b-3xl">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-xl font-bold leading-tight mb-1">{MOCK_PRODUCT.title}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-2xl text-primary">${MOCK_PRODUCT.price.toFixed(2)}</span>
                {MOCK_PRODUCT.originalPrice && (
                  <span className="text-muted-foreground line-through">${MOCK_PRODUCT.originalPrice.toFixed(2)}</span>
                )}
                {MOCK_PRODUCT.originalPrice && (
                  <span className="bg-rose-100 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
                    {Math.round((1 - MOCK_PRODUCT.price / MOCK_PRODUCT.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-medium text-foreground">{MOCK_PRODUCT.rating}</span>
              <span className="ml-1">({MOCK_PRODUCT.reviewsCount} reviews)</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span>{MOCK_PRODUCT.likesCount} Likes</span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span>{MOCK_PRODUCT.condition}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="p-4 bg-card mb-2 shadow-sm rounded-3xl cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                <img src={MOCK_PRODUCT.sellerAvatar} alt={MOCK_PRODUCT.sellerName} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold">{MOCK_PRODUCT.sellerName}</h3>
                  {MOCK_PRODUCT.sellerVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-0.5 gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{MOCK_PRODUCT.location}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Details */}
        <div className="p-4 bg-card shadow-sm rounded-3xl">
          <h3 className="font-bold text-lg mb-3">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {MOCK_PRODUCT.description}
          </p>
          
          <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Category</span>
              <span className="font-medium text-sm">{MOCK_PRODUCT.category}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Shipping</span>
              <span className="font-medium text-sm">{MOCK_PRODUCT.shippingFee > 0 ? `$${MOCK_PRODUCT.shippingFee.toFixed(2)}` : 'Free Shipping'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-card border-t border-border p-4 z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <Button variant="outline" className="w-12 h-12 p-0 flex-shrink-0 rounded-full border-primary/20 text-primary hover:bg-primary/10 hover:text-primary">
            <MessageSquare className="w-5 h-5" />
          </Button>
          <Button variant="outline" className="flex-1 h-12 rounded-full font-bold border-primary text-primary hover:bg-primary hover:text-white">
            Add to Cart
          </Button>
          <Button className="flex-1 h-12 rounded-full font-bold shadow-md shadow-primary/20">
            Buy Now
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}