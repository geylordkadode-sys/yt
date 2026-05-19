import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ArrowLeft, Trash2, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const MOCK_CART = {
  items: [
    {
      id: "1",
      listingId: "1",
      title: "Vintage Denim Jacket",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
      quantity: 1,
      sellerId: "s1",
      sellerName: "Vintage Store Berlin"
    },
    {
      id: "2",
      listingId: "2",
      title: "Silk Scarf 70s",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d",
      quantity: 1,
      sellerId: "s1",
      sellerName: "Vintage Store Berlin"
    }
  ],
  subtotal: 70.00,
  shippingTotal: 5.00,
  total: 75.00
};

export default function Cart() {
  return (
    <AuthGuard>
      <AppLayout showNav={false}>
        <Header title="Shopping Cart" showBack />
        
        <div className="p-4 pb-32">
          {MOCK_CART.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
              <Link href="/">
                <Button className="rounded-full px-8">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <div className="w-6 h-6 bg-muted rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-primary">VS</span>
                  </div>
                  <span className="font-semibold text-sm">Vintage Store Berlin</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </div>
                
                <div className="space-y-4">
                  {MOCK_CART.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted border border-border">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-sm line-clamp-2 pr-2">{item.title}</h3>
                          <button className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                          <div className="flex items-center bg-muted rounded-full">
                            <button className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-black/5 rounded-full transition-colors">-</button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-black/5 rounded-full transition-colors">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card rounded-3xl p-5 shadow-sm border border-border space-y-3">
                <h3 className="font-bold mb-1">Order Summary</h3>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal ({MOCK_CART.items.length} items)</span>
                  <span>${MOCK_CART.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>${MOCK_CART.shippingTotal.toFixed(2)}</span>
                </div>
                <div className="w-full h-px bg-border my-1"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${MOCK_CART.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-900 rounded-2xl">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block mb-0.5 text-blue-950">Buyer Protection</span>
                  Get your item as described or your money back. Secure payments through MarketHUB.
                </div>
              </div>
            </div>
          )}
        </div>

        {MOCK_CART.items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-card border-t border-border p-4 z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-muted-foreground text-sm font-medium">Total Price</span>
              <span className="text-xl font-bold text-primary">${MOCK_CART.total.toFixed(2)}</span>
            </div>
            <Button className="w-full h-12 rounded-full font-bold shadow-md shadow-primary/20 text-lg">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </AppLayout>
    </AuthGuard>
  );
}