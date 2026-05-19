import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Camera, ChevronRight, Tags, Info, Package, Truck, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function Post() {
  return (
    <AuthGuard>
      <AppLayout showNav={false}>
        <Header title="Create Listing" showBack />
        
        <div className="p-4 bg-background">
          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border mb-4">
            <h3 className="font-bold text-base mb-3 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" /> Photos
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-primary/5 rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">Add Photo</span>
              </div>
              <div className="aspect-square bg-muted rounded-xl border border-border flex items-center justify-center"></div>
              <div className="aspect-square bg-muted rounded-xl border border-border flex items-center justify-center"></div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Add up to 10 photos. First photo will be the cover. Supported formats: JPG, PNG.</p>
          </div>

          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border mb-4 flex flex-col gap-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> Details
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Title</label>
              <input 
                type="text" 
                placeholder="e.g. Vintage Nike Sweatshirt" 
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Description</label>
              <textarea 
                placeholder="Describe your item. Mention condition, size, any flaws..." 
                rows={4}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          <div className="bg-card rounded-3xl p-1 shadow-sm border border-border mb-4">
            <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Tags className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Category</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="text-sm mr-1">Select</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Condition</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="text-sm mr-1">Select</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer rounded-b-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Euro className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Price & Shipping</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="text-sm mr-1">Set Price</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-card border-t border-border p-4 z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <Button className="w-full h-12 rounded-full font-bold shadow-md shadow-primary/20 text-lg">
            Post Listing
          </Button>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}