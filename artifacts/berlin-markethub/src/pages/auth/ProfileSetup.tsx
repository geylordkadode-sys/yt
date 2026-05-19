import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useLocation } from "wouter";

export default function ProfileSetup() {
  const [_, setLocation] = useLocation();

  return (
    <AppLayout showNav={false}>
      <div className="min-h-[100dvh] flex flex-col px-6 pt-12 pb-6 bg-gradient-to-b from-rose-50 to-background relative overflow-hidden">
        <div className="relative z-10 flex-1 flex flex-col py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Profile</h1>
            <p className="text-muted-foreground text-sm">Tell us a bit about yourself</p>
          </div>
          
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setLocation('/'); }}>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-muted border-4 border-background flex items-center justify-center shadow-sm overflow-hidden">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-sm border-2 border-background">
                    <span className="text-lg font-bold pb-1">+</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Jane Doe" 
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-muted-foreground">@</span>
                  <input 
                    type="text" 
                    placeholder="janedoe" 
                    className="w-full bg-muted/50 border border-border rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Location</label>
                <input 
                  type="text" 
                  placeholder="Berlin, Germany" 
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              
              <Button type="submit" className="w-full h-12 rounded-full font-bold shadow-md shadow-primary/20 text-base mt-4">
                Complete Setup
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}