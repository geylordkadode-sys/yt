import { Link, useLocation } from "wouter";
import { Home, MessageCircle, Plus, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Chats", href: "/chat", icon: MessageCircle },
    { name: "Post", href: "/post", icon: Plus, isFab: true },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Search", href: "/search", icon: Search },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-white border-t border-gray-100 px-2 py-2 pb-safe z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-end">
        {tabs.map((tab) => {
          const isActive = location === tab.href || (tab.href !== "/" && location.startsWith(tab.href));

          if (tab.isFab) {
            return (
              <Link key={tab.name} href={tab.href} className="flex flex-col items-center -mt-4 group">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-200">
                  <tab.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium mt-1 text-gray-500 group-hover:text-primary transition-colors">{tab.name}</span>
              </Link>
            );
          }

          return (
            <Link key={tab.name} href={tab.href} className="flex flex-col items-center py-1 min-w-12 group">
              <tab.icon
                className={cn("w-6 h-6 transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-primary")}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={cn("text-[10px] font-medium mt-0.5 transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-primary")}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
