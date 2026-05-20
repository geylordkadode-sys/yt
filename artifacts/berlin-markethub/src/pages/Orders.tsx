import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Clock, CheckCircle2, ChevronRight, Loader2, Truck, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700",  icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700",    icon: CheckCircle2 },
  shipped:   { label: "Shipped",   color: "bg-purple-100 text-purple-700",icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500",    icon: XCircle },
  refunded:  { label: "Refunded",  color: "bg-rose-100 text-rose-600",    icon: XCircle },
};

function OrderCard({ order }: { order: any }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">
            {order.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
          <Icon className="w-3 h-3" />
          {cfg.label}
        </div>
      </div>
      <div className="flex gap-3 items-center p-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
          {order.listing?.images?.[0] ? (
            <img src={order.listing.images[0]} alt={order.listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">
            {order.listing?.title || "Item"}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <div className="font-bold text-primary text-base mt-1">${Number(order.price).toFixed(2)}</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
      </div>
    </div>
  );
}

function OrdersContent() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => { if (user) load(); }, [user]);

  const load = async () => {
    setLoading(true);
    const [purchasesRes, salesRes] = await Promise.all([
      supabase.from("orders")
        .select("*, listing:listings(id,title,images)")
        .eq("buyer_id", user!.id)
        .order("created_at", { ascending: false }),
      supabase.from("orders")
        .select("*, listing:listings(id,title,images), buyer:profiles!buyer_id(full_name,username,avatar_url)")
        .eq("seller_id", user!.id)
        .order("created_at", { ascending: false }),
    ]);
    if (purchasesRes.data) setPurchases(purchasesRes.data);
    if (salesRes.data) setSales(salesRes.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="purchases" className="w-full mt-0">
      <TabsList className="w-full bg-white rounded-none h-11 p-0 border-b border-gray-100">
        <TabsTrigger value="purchases" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-gray-500 text-sm font-medium h-full">
          Purchases ({purchases.length})
        </TabsTrigger>
        <TabsTrigger value="sales" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-gray-500 text-sm font-medium h-full">
          Sales ({sales.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="purchases" className="p-4 m-0 space-y-3">
        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-3">
              <Package className="w-8 h-8 text-primary opacity-40" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">No orders yet</h2>
            <p className="text-gray-400 text-sm mb-5">Browse the marketplace to find something you love</p>
            <button onClick={() => setLocation("/")} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold">
              Browse Listings
            </button>
          </div>
        ) : purchases.map(o => <OrderCard key={o.id} order={o} />)}
      </TabsContent>

      <TabsContent value="sales" className="p-4 m-0 space-y-3">
        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-3">
              <Package className="w-8 h-8 text-primary opacity-40" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">No sales yet</h2>
            <p className="text-gray-400 text-sm mb-5">Post a listing to start selling</p>
            <button onClick={() => setLocation("/post")} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold">
              Post a Listing
            </button>
          </div>
        ) : sales.map(o => <OrderCard key={o.id} order={o} />)}
      </TabsContent>
    </Tabs>
  );
}

export default function Orders() {
  return (
    <AuthGuard>
      <AppLayout>
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="font-bold text-base text-gray-900">Orders & Purchases</h1>
        </div>
        <OrdersContent />
      </AppLayout>
    </AuthGuard>
  );
}
