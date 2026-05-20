import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLocation, useSearch } from "wouter";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";

export default function VerifyOtp() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const email = params.get("email") || "";
  const type = (params.get("type") || "signup") as "signup" | "email";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { setError("Please enter the full 6-digit code"); return; }
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type,
      });
      if (error) throw error;
      setVerified(true);
      setTimeout(() => setLocation("/"), 1500);
    } catch (err: any) {
      setError(err.message || "Invalid or expired code. Try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({ email, type: "signup" });
      if (error) throw error;
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verified!</h2>
          <p className="text-gray-500 text-sm">Taking you to the app...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="min-h-[100dvh] bg-white flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-100 rounded-full -mr-16 -mt-16 z-0" />
        <div className="absolute bottom-20 left-0 w-40 h-40 bg-pink-50 rounded-full -ml-12 z-0" />

        <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-8">
          {/* Back */}
          <button
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 w-fit"
            onClick={() => setLocation("/auth/signup")}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Icon + heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              We sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-gray-800 text-sm mt-0.5 break-all">{email}</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="flex flex-col items-center gap-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              containerClassName="gap-2"
            >
              <InputOTPGroup className="gap-2">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-14 text-xl font-bold rounded-xl border-2 border-gray-200 bg-gray-50 data-[active=true]:border-primary data-[active=true]:bg-white focus:border-primary transition-colors"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full h-12 rounded-full font-bold shadow-lg shadow-primary/20 text-base bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
            <button
              className="flex items-center gap-2 mx-auto text-primary font-semibold text-sm disabled:opacity-50 hover:underline"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resending}
            >
              <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          <p className="mt-auto pt-6 text-center text-xs text-gray-400">
            Make sure to check your spam folder if you don't see it.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
