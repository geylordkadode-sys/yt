import { Home, MessageSquare, Plus, User, Search, Bell, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  showSearch?: boolean;
  showBell?: boolean;
}

export function Header({ title, showBack, showCart = true, showSearch = false, showBell = true }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-rose-400 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {showBack ? (
          <button onClick={() => window.history.back()} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        ) : (
          <Link href="/" className="font-bold text-xl tracking-tight">MarketHUB</Link>
        )}
        
        {title && <h1 className="font-semibold text-lg absolute left-1/2 -translate-x-1/2">{title}</h1>}
        
        <div className="flex items-center gap-1">
          {showSearch && (
            <Link href="/search" className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <Search className="w-5 h-5" />
            </Link>
          )}
          {showBell && (
            <Link href="/notifications" className="p-2 rounded-full hover:bg-white/20 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full border border-primary"></span>
            </Link>
          )}
          {showCart && (
            <Link href="/cart" className="p-2 rounded-full hover:bg-white/20 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-white text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}