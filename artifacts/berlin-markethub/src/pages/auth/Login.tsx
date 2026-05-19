import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) { setError("Enter your email first"); return; }
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout showNav={false}>
      <div className="min-h-[100dvh] bg-white flex flex-col relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-100 rounded-full -mr-16 -mt-16 z-0" />
        <div className="absolute top-20 left-0 w-32 h-32 bg-pink-100 rounded-full -ml-10 z-0" />
        <div className="absolute bottom-32 right-0 w-40 h-40 bg-rose-50 rounded-full -mr-10 z-0" />

        <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 mb-4">
              <ShoppingBag className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to continue to Marketplace</p>
          </div>

          {magicLinkSent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
              <p className="text-gray-500 text-sm mb-6">We sent a magic link to <span className="font-semibold text-gray-700">{email}</span></p>
              <button className="text-primary font-semibold text-sm" onClick={() => setMagicLinkSent(false)}>
                Back to login
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleLogin}>
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
                      placeholder="Enter your password"
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
                </div>

                <div className="flex justify-end">
                  <Link href="/auth/reset-password" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-13 rounded-full font-bold shadow-lg shadow-primary/20 text-base bg-primary hover:bg-primary/90 mt-2">
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>

              <button
                className="mt-4 w-full py-3.5 rounded-full border-2 border-primary/20 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors"
                onClick={handleMagicLink}
                disabled={loading}
              >
                <Mail className="w-4 h-4" />
                Send Magic Link
              </button>

              <Link href="/auth/verify-otp">
                <button className="mt-3 w-full py-3.5 rounded-full border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">
                  Sign in with OTP
                </button>
              </Link>
            </>
          )}

          <p className="mt-auto pt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-bold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
