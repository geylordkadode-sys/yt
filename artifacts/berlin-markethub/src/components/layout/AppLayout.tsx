import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col items-center justify-start overflow-x-hidden">
      <div className="w-full max-w-[430px] min-h-[100dvh] bg-background relative flex flex-col shadow-xl sm:border-x sm:border-border">
        <main className="flex-1 w-full pb-24 overflow-x-hidden">
          {children}
        </main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}