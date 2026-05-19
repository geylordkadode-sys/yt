import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLocation } from "wouter";

export default function VerifyOtp() {
  const [_, setLocation] = useLocation();

  return (
    <AppLayout showNav={false}>
      <div className="min-h-[100dvh] flex flex-col px-6 pt-12 pb-6 bg-gradient-to-b from-rose-50 to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl -ml-20"></div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><polyline points="15,9 18,9 18,11"/><path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0"/></svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Verify Email</h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              We've sent a 6-digit code to your email. Enter it below to verify your account.
            </p>
          </div>
          
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col items-center">
            <form className="w-full flex flex-col items-center space-y-6" onSubmit={(e) => { e.preventDefault(); setLocation('/auth/profile-setup'); }}>
              <InputOTP maxLength={6} containerClassName="gap-2">
                <InputOTPGroup className="gap-2">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl rounded-xl border-border bg-muted/50" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              
              <Button type="submit" className="w-full h-12 rounded-full font-bold shadow-md shadow-primary/20 text-base">
                Verify Code
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <button className="font-bold text-primary hover:underline">
                Resend
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}