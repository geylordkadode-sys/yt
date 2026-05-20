import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      setLocation(`/auth/verify-otp?email=${encodeURIComponent(email)}&type=signup`);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/3" };
    if (password.length < 10) return { label: "Fair", color: "bg-amber-400", width: "w-2/3" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };
  const strength = passwordStrength();

  return (
    <AppLayout showNav={false}>
      <div className="min-h-[100dvh] bg-white flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-52 h-52 bg-rose-100 rounded-full -ml-20 -mt-20 z-0" />
        <div className="absolute top-32 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-10 z-0" />
        <div className="absolute bottom-20 left-0 w-40 h-40 bg-rose-50 rounded-full -ml-16 z-0" />

        <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 mb-4">
              <ShoppingBag className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join Marketplace today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {strength && (
                <div className="mt-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400">Password strength</span>
                    <span className={`text-[10px] font-semibold ${strength.label === "Strong" ? "text-green-500" : strength.label === "Fair" ? "text-amber-500" : "text-red-400"}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-rose-50 rounded-2xl p-4 space-y-2">
              {["Buy & sell with thousands of users", "Secure payments & buyer protection", "Real-time chat with sellers"].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-bold shadow-lg shadow-primary/20 text-base bg-primary hover:bg-primary/90 mt-2">
              {loading ? "Creating account..." : "Create Account & Send OTP"}
            </Button>
          </form>

          <p className="mt-3 text-center text-xs text-gray-400">
            By signing up, you agree to our{" "}
            <span className="text-primary font-medium">Terms of Service</span> and{" "}
            <span className="text-primary font-medium">Privacy Policy</span>
          </p>

          <p className="mt-auto pt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
