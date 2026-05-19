import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { MessageSquare, Search } from "lucide-react";
import { Link } from "wouter";
import { AuthGuard } from "@/components/auth/AuthGuard";

const MOCK_CHATS = [
  {
    id: "1",
    user: { name: "Sarah Connor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
    lastMessage: "Is the jacket still available?",
    time: "2m ago",
    unread: 2,
    item: { title: "Vintage Denim Jacket", image: "https://images.unsplash.com/photo-1542272604-787c3835535d" }
  },
  {
    id: "2",
    user: { name: "Mike Wheeler", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36" },
    lastMessage: "I can do $35 for it.",
    time: "1h ago",
    unread: 0,
    item: { title: "Leather Boots", image: "https://images.unsplash.com/photo-1608667508764-33cf0726b13a" }
  },
  {
    id: "3",
    user: { name: "Eleven", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
    lastMessage: "Thanks, received it today!",
    time: "Yesterday",
    unread: 0,
    item: { title: "Silk Scarf", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d" }
  }
];

export default function ChatList() {
  return (
    <AuthGuard>
      <AppLayout>
        <Header title="Messages" />
        
        <div className="p-4">
          <div className="bg-card rounded-full flex items-center px-4 py-2.5 shadow-sm border border-border mb-4">
            <Search className="w-5 h-5 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="bg-transparent border-none outline-none w-full text-sm text-foreground"
            />
          </div>

          <div className="space-y-3">
            {MOCK_CHATS.map((chat) => (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <div className="bg-card p-3 rounded-2xl border border-border shadow-sm flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img src={chat.user.avatar} alt={chat.user.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-sm truncate">{chat.user.name}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                    </div>
                    <p className={`text-sm truncate ${chat.unread > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  
                  {chat.item && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border relative">
                      <img src={chat.item.image} alt={chat.item.title} className="w-full h-full object-cover" />
                      {chat.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}