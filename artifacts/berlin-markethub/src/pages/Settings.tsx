import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, Mail, Bell, Eye, EyeOff, CheckCircle2, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

function SettingsContent() {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { setPwError("Password must be at least 6 characters"); return; }
    setPwLoading(true);
    setPwError("");
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Account
        </h3>
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 mb-0.5">Email address</p>
          <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          Change Password
        </h3>

        {pwSuccess && (
          <div className="mb-3 flex items-center gap-2 p-3 bg-green-50 rounded-xl text-green-600 text-sm">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Password updated successfully!
          </div>
        )}
        {pwError && (
          <div className="mb-3 p-3 bg-red-50 rounded-xl text-red-600 text-sm">{pwError}</div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">New Password</label>
            <div className="relative mt-1">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={pwLoading || newPassword.length < 6} className="w-full rounded-full bg-primary hover:bg-primary/90 font-semibold">
            {pwLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Notifications
        </h3>
        <div className="space-y-0">
          {[
            { label: "Email notifications", desc: "Receive updates via email", value: emailNotifs, onChange: setEmailNotifs },
            { label: "Order updates", desc: "Get notified about your orders", value: orderNotifs, onChange: setOrderNotifs },
            { label: "Messages", desc: "New message notifications", value: messageNotifs, onChange: setMessageNotifs },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors relative ${item.value ? "bg-primary" : "bg-gray-200"}`}
                onClick={() => item.onChange(!item.value)}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${item.value ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <h3 className="font-bold text-sm text-gray-900 p-4 pb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Privacy & Security
        </h3>
        {[
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
          { label: "Data & Privacy", href: "#" },
        ].map((item, i) => (
          <a key={i} href={item.href} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-t border-gray-50">
            <span className="text-sm text-gray-700">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </a>
        ))}
      </div>

      <button
        className="w-full py-3 rounded-full border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
        onClick={async () => { await signOut(); setLocation("/auth/login"); }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default function Settings() {
  return (
    <AuthGuard>
      <AppLayout>
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="font-bold text-base text-gray-900">Settings</h1>
        </div>
        <SettingsContent />
      </AppLayout>
    </AuthGuard>
  );
}
