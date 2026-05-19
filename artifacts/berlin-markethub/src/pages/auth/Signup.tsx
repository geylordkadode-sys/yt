import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Signup() {
  const [_, setLocation] = useLocation();

  return (
    <AppLayout showNav={false}>
      <div className="min-h-[100dvh] flex flex-col px-6 pt-12 pb-6 bg-gradient-to-b from-rose-50 to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl -ml-20"></div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground text-sm">Join MarketHUB today</p>
          </div>
          
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setLocation('/auth/verify-otp'); }}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="hello@example.com" 
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full h-12 rounded-full font-bold shadow-md shadow-primary/20 text-base mt-2">
                Sign Up
              </Button>
            </form>
            
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-xs text-muted-foreground uppercase">Or continue with</span>
              <div className="h-px bg-border flex-1"></div>
            </div>
            
            <Button variant="outline" className="w-full h-12 rounded-full font-semibold border-border mt-6 bg-transparent hover:bg-muted">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="mr-2"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Google
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}