import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function ResetPassword() {
  const [_, setLocation] = useLocation();

  return (
    <AppLayout showNav={false}>
      <div className="min-h-[100dvh] flex flex-col px-6 pt-12 pb-6 bg-gradient-to-b from-rose-50 to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl -ml-20"></div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <button onClick={() => window.history.back()} className="absolute top-0 left-0 p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="mb-10 text-center mt-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setLocation('/auth/login'); }}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="hello@example.com" 
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full h-12 rounded-full font-bold shadow-md shadow-primary/20 text-base mt-2">
                Send Reset Link
              </Button>
            </form>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}