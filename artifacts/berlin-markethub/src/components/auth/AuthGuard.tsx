import { ReactNode } from "react";
import { Link, useLocation } from "wouter";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  // In a real app, this would use the useAuth hook to check authentication status.
  // For this design task, we'll mock an unauthenticated state to show the fallback or redirect.
  // We'll assume the user is not authenticated for protected routes to demonstrate the prompt.
  const isAuthenticated = false; // Mock state

  const [_, setLocation] = useLocation();

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Sign in Required</h2>
        <p className="text-muted-foreground mb-6">
          You need to sign in to access this feature.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/auth/login"
            className="bg-primary text-primary-foreground py-3 rounded-full font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-secondary text-secondary-foreground py-3 rounded-full font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}