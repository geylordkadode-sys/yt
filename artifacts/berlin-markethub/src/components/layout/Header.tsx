import { Bell, ShoppingCart, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  showBell?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showBack, showCart = true, showBell = true }: HeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-rose-100 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {showBack ? (
          <button onClick={() => setLocation("/")} className="p-2 -ml-2 rounded-full hover:bg-rose-50 transition-colors text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Marketplace</span>
          </Link>
        )}

        {title && <h1 className="font-semibold text-lg text-gray-900 absolute left-1/2 -translate-x-1/2">{title}</h1>}

        <div className="flex items-center gap-1">
          {showBell && (
            <Link href="/notifications" className="p-2 rounded-full hover:bg-rose-50 transition-colors relative text-gray-700">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>
            </Link>
          )}
          {showCart && (
            <Link href="/cart" className="p-2 rounded-full hover:bg-rose-50 transition-colors relative text-gray-700">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
