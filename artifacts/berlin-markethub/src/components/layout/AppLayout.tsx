import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-rose-50/60 flex flex-col items-center justify-start overflow-x-hidden">
      <div className="w-full max-w-[430px] lg:max-w-[480px] min-h-[100dvh] bg-white relative flex flex-col shadow-xl sm:shadow-2xl lg:my-0 border-x border-gray-100">
        <main className="flex-1 w-full pb-24 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
