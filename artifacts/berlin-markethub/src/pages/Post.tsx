import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import {
  Camera, X, Plus, Tag, Package, DollarSign, Truck,
  ChevronDown, CheckCircle2, Loader2, ArrowLeft, Info
} from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import compressImage from "browser-image-compression";

const CATEGORIES = [
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "home", label: "Home" },
  { id: "beauty", label: "Beauty" },
  { id: "electronics", label: "Electronics" },
  { id: "popular", label: "Popular / Other" },
];

const CONDITIONS = [
  { id: "new", label: "New", desc: "Never used, with tags" },
  { id: "like_new", label: "Like New", desc: "Barely used, no flaws" },
  { id: "good", label: "Good", desc: "Minor signs of use" },
  { id: "fair", label: "Fair", desc: "Visible wear but functional" },
];

interface ImagePreview {
  file: File;
  url: string;
}

function PostContent() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [images, setImages] = useState<ImagePreview[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [shippingFee, setShippingFee] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showConditionSheet, setShowConditionSheet] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      setError("Maximum 10 photos allowed");
      return;
    }
    const previews: ImagePreview[] = [];
    for (const file of files) {
      try {
        const compressed = await compressImage(file, {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });
        previews.push({ file: compressed as File, url: URL.createObjectURL(compressed) });
      } catch {
        previews.push({ file, url: URL.createObjectURL(file) });
      }
    }
    setImages(prev => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) { setError("Please add a title"); return; }
    if (!category) { setError("Please select a category"); return; }
    if (!condition) { setError("Please select a condition"); return; }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) { setError("Please enter a valid price"); return; }

    setUploading(true);
    try {
      const imageUrls: string[] = [];

      for (const img of images) {
        const ext = img.file.name.split(".").pop() || "jpg";
        const path = `${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("listings")
          .upload(path, img.file, { contentType: img.file.type, upsert: false });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("listings").getPublicUrl(path);
        imageUrls.push(urlData.publicUrl);
      }

      const { error: insertErr } = await supabase.from("listings").insert({
        title: title.trim(),
        description: description.trim() || null,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        images: imageUrls,
        category,
        condition,
        shipping_fee: shippingFee ? Number(shippingFee) : null,
        quantity: Number(quantity) || 1,
        seller_id: user!.id,
        status: "active",
      });
      if (insertErr) throw insertErr;

      setSuccess(true);
      setTimeout(() => setLocation("/"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to post listing");
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Listed!</h2>
          <p className="text-gray-500 text-sm">Your listing is now live on Marketplace</p>
        </div>
      </AppLayout>
    );
  }

  const selectedCategory = CATEGORIES.find(c => c.id === category);
  const selectedCondition = CONDITIONS.find(c => c.id === condition);

  return (
    <AppLayout showNav={false}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="font-bold text-base text-gray-900">Create Listing</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Photo Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            Photos
            <span className="text-xs text-gray-400 font-normal ml-1">({images.length}/10)</span>
          </h3>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((img, idx) => (
              <div key={idx} className="aspect-square relative rounded-xl overflow-hidden border border-gray-100">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold text-white bg-primary/80 py-0.5">
                    COVER
                  </span>
                )}
                <button
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                  onClick={() => removeImage(idx)}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}

            {images.length < 10 && (
              <button
                className="aspect-square rounded-xl border-2 border-dashed border-primary/30 bg-rose-50 flex flex-col items-center justify-center text-primary hover:bg-rose-100 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-semibold">Add Photo</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImagePick}
          />
          <p className="text-[10px] text-gray-400 mt-2.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            First photo is the cover. Up to 10 photos. Auto-compressed to save space.
          </p>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Details
          </h3>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Vintage Nike Sweatshirt"
              maxLength={100}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your item — condition, size, brand, any flaws..."
              rows={4}
              maxLength={1000}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
            <p className="text-[10px] text-gray-400 text-right">{description.length}/1000</p>
          </div>
        </div>

        {/* Category & Condition */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Category */}
          <button
            className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            onClick={() => setShowCategorySheet(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                <Tag className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-medium">Category *</p>
                <p className={`text-sm font-semibold ${selectedCategory ? "text-gray-900" : "text-gray-400"}`}>
                  {selectedCategory?.label || "Select category"}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Condition */}
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            onClick={() => setShowConditionSheet(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-medium">Condition *</p>
                <p className={`text-sm font-semibold ${selectedCondition ? "text-gray-900" : "text-gray-400"}`}>
                  {selectedCondition ? `${selectedCondition.label} — ${selectedCondition.desc}` : "Select condition"}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Pricing
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Original Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Truck className="w-3 h-3" /> Shipping Fee
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingFee}
                  onChange={e => setShippingFee(e.target.value)}
                  placeholder="0.00 = Free"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Bar */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-gray-100 px-4 py-3 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <Button
          className="w-full h-12 rounded-full font-bold text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading & Publishing...
            </span>
          ) : (
            "Post Listing"
          )}
        </Button>
      </div>

      {/* Category Bottom Sheet */}
      {showCategorySheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCategorySheet(false)} />
          <div className="relative w-full max-w-[430px] lg:max-w-[480px] mx-auto bg-white rounded-t-3xl p-6 shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="font-bold text-base text-gray-900 mb-4">Select Category</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    category === cat.id ? "bg-rose-50 text-primary" : "hover:bg-gray-50 text-gray-800"
                  }`}
                  onClick={() => { setCategory(cat.id); setShowCategorySheet(false); }}
                >
                  <span className="font-semibold text-sm">{cat.label}</span>
                  {category === cat.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Condition Bottom Sheet */}
      {showConditionSheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConditionSheet(false)} />
          <div className="relative w-full max-w-[430px] lg:max-w-[480px] mx-auto bg-white rounded-t-3xl p-6 shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="font-bold text-base text-gray-900 mb-4">Select Condition</h3>
            <div className="space-y-2">
              {CONDITIONS.map(cond => (
                <button
                  key={cond.id}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-colors ${
                    condition === cond.id
                      ? "border-primary bg-rose-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                  onClick={() => { setCondition(cond.id); setShowConditionSheet(false); }}
                >
                  <div className="text-left">
                    <p className={`font-bold text-sm ${condition === cond.id ? "text-primary" : "text-gray-900"}`}>
                      {cond.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{cond.desc}</p>
                  </div>
                  {condition === cond.id && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default function Post() {
  return (
    <AuthGuard>
      <PostContent />
    </AuthGuard>
  );
}
