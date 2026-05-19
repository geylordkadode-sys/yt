import { Link, useLocation } from "wouter";
import { Home, MessageSquare, Plus, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Chats", href: "/chat", icon: MessageSquare },
    { name: "Post", href: "/post", icon: Plus, isFab: true },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Search", href: "/search", icon: Search },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-card border-t border-border px-6 py-2 pb-safe z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center relative">
        {tabs.map((tab) => {
          const isActive = location === tab.href || (tab.href !== "/" && location.startsWith(tab.href));

          if (tab.isFab) {
            return (
              <Link key={tab.name} href={tab.href} className="relative -top-6 flex flex-col items-center group">
                <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <tab.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-medium mt-1 text-muted-foreground group-hover:text-primary transition-colors">{tab.name}</span>
              </Link>
            );
          }

          return (
            <Link key={tab.name} href={tab.href} className="flex flex-col items-center group min-w-12 py-1">
              <div className={cn("p-1.5 rounded-full transition-colors", isActive ? "text-primary bg-primary/10" : "text-muted-foreground group-hover:text-primary")}>
                <tab.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn("text-[10px] font-medium mt-0.5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}