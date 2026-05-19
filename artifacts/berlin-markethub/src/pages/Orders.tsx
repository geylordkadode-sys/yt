import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_ORDERS = [
  {
    id: "ORD-1092",
    listingTitle: "Vintage Denim Jacket",
    listingImage: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    price: 45.00,
    sellerName: "Vintage Store Berlin",
    status: "shipped",
    createdAt: "2024-05-15T10:30:00Z"
  },
  {
    id: "ORD-0842",
    listingTitle: "Sony Wireless Headphones",
    listingImage: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
    price: 120.00,
    sellerName: "Tech Hub",
    status: "delivered",
    createdAt: "2024-05-02T14:20:00Z"
  }
];

export default function Orders() {
  return (
    <AuthGuard>
      <AppLayout>
        <Header title="My Orders" showBack />
        
        <Tabs defaultValue="purchases" className="w-full mt-2">
          <TabsList className="w-full bg-card rounded-none h-12 p-0 border-b border-border">
            <TabsTrigger value="purchases" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Purchases
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Sales
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchases" className="p-4 m-0 space-y-4">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">{order.id}</span>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status === 'delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span className="uppercase">{order.status}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img src={order.listingImage} alt={order.listingTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{order.listingTitle}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Sold by: {order.sellerName}</p>
                    <div className="font-bold text-primary mt-1">${order.price.toFixed(2)}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                
                {order.status === 'delivered' && (
                  <div className="mt-4 pt-3 border-t border-border flex justify-end">
                    <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold">
                      Leave Review
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="sales" className="p-4 m-0">
             <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold mb-2">No sales yet</h2>
              <p className="text-muted-foreground text-sm max-w-[250px] mb-6">When someone buys your items, they'll appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </AppLayout>
    </AuthGuard>
  );
}