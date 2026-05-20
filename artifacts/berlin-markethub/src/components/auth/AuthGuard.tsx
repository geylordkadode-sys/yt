import { ReactNode } from "react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in Required</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-[240px]">
          You need to sign in to access this feature.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/auth/login" className="bg-primary text-white py-3 rounded-full font-semibold text-sm text-center block">
            Sign In
          </Link>
          <Link href="/auth/signup" className="border-2 border-primary text-primary py-3 rounded-full font-semibold text-sm text-center block">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
