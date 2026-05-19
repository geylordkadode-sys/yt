import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Heart, MessageSquare, Star, Package, Tag } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "like",
    title: "New Like",
    body: "Sarah liked your Vintage Denim Jacket.",
    isRead: false,
    time: "2m ago",
    icon: Heart,
    color: "bg-rose-100 text-primary",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d"
  },
  {
    id: "2",
    type: "order",
    title: "Order Shipped",
    body: "Your order for Sony Wireless Headphones has been shipped.",
    isRead: false,
    time: "1h ago",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    body: "Mike sent you a message about the Leather Boots.",
    isRead: true,
    time: "Yesterday",
    icon: MessageSquare,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "4",
    type: "promo",
    title: "Weekend Sale",
    body: "Use code WEEKEND20 for 20% off all vintage items.",
    isRead: true,
    time: "2 days ago",
    icon: Tag,
    color: "bg-amber-100 text-amber-600"
  }
];

export default function Notifications() {
  return (
    <AuthGuard>
      <AppLayout>
        <Header title="Notifications" showBack showBell={false} />
        
        <div className="p-2 space-y-1">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-3 rounded-2xl flex gap-3 cursor-pointer transition-colors ${notif.isRead ? 'bg-transparent hover:bg-muted/50' : 'bg-primary/5 hover:bg-primary/10'}`}
            >
              <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${notif.color}`}>
                <notif.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={`text-sm ${notif.isRead ? 'font-medium' : 'font-bold'}`}>{notif.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                </div>
                <p className={`text-xs ${notif.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                  {notif.body}
                </p>
              </div>
              
              {notif.image && (
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                  <img src={notif.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}