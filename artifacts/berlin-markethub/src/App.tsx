import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import Post from "@/pages/Post";
import SellerProfile from "@/pages/SellerProfile";
import Analytics from "@/pages/Analytics";
import ChatList from "@/pages/ChatList";
import ChatDetail from "@/pages/ChatDetail";
import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import Notifications from "@/pages/Notifications";
import Wallet from "@/pages/Wallet";
import Settings from "@/pages/Settings";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import ResetPassword from "@/pages/auth/ResetPassword";
import ProfileSetup from "@/pages/auth/ProfileSetup";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/seller/:id" component={SellerProfile} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/edit" component={EditProfile} />
      <Route path="/profile/analytics" component={Analytics} />
      <Route path="/post" component={Post} />
      <Route path="/chat" component={ChatList} />
      <Route path="/chat/:conversationId" component={ChatDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/settings" component={Settings} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={Signup} />
      <Route path="/auth/verify-otp" component={VerifyOtp} />
      <Route path="/auth/reset-password" component={ResetPassword} />
      <Route path="/auth/profile-setup" component={ProfileSetup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;