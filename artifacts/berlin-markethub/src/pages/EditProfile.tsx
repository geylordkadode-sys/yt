import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useLocation } from "wouter";

export default function EditProfile() {
  const [_, setLocation] = useLocation();

  return (
    <AuthGuard>
      <AppLayout showNav={false}>
        <Header title="Edit Profile" showBack />
        
        <div className="p-4 bg-background pb-8">
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setLocation('/profile'); }}>
            
            <div className="flex justify-center mb-6 pt-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted border-4 border-background flex items-center justify-center shadow-sm overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-sm border-2 border-background">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-5 shadow-sm border border-border space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Vintage Store Berlin"
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
                    defaultValue="vintagestore_berlin"
                    className="w-full bg-muted/50 border border-border rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Bio</label>
                <textarea 
                  defaultValue="Curated vintage clothing and accessories. Based in Berlin. Shipping worldwide. 🌍👗✨"
                  rows={3}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Location</label>
                <input 
                  type="text" 
                  defaultValue="Berlin, Germany"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full h-12 rounded-full font-bold shadow-md shadow-primary/20 text-base mt-4">
              Save Changes
            </Button>
          </form>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}