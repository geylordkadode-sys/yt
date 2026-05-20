import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, TrendingUp, Clock, Loader2 } from "lucide-react";

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any; sign: string }> = {
  credit:     { label: "Payment received", color: "text-green-600", icon: ArrowDownLeft, sign: "+" },
  debit:      { label: "Purchase",         color: "text-red-500",   icon: ArrowUpRight,  sign: "-" },
  cashback:   { label: "Cashback",         color: "text-blue-500",  icon: TrendingUp,    sign: "+" },
  refund:     { label: "Refund",           color: "text-amber-500", icon: ArrowDownLeft, sign: "+" },
  withdrawal: { label: "Withdrawal",       color: "text-gray-500",  icon: ArrowUpRight,  sign: "-" },
};

function WalletContent() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) load(); }, [user]);

  const load = async () => {
    setLoading(true);
    const [walletRes, txRes] = await Promise.all([
      supabase.from("wallets").select("*").eq("user_id", user!.id).single(),
      supabase.from("wallet_transactions")
        .select("*, wallets!wallet_id(user_id)")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (walletRes.data) setWallet(walletRes.data);
    if (txRes.data) setTransactions(txRes.data.filter((t: any) => t.wallets?.user_id === user!.id));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary to-rose-400 rounded-3xl p-6 text-white shadow-lg shadow-primary/20">
        <div className="flex items-center gap-2 mb-1 opacity-80">
          <WalletIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Available Balance</span>
        </div>
        <div className="text-4xl font-bold mb-4">${(wallet?.balance || 0).toFixed(2)}</div>
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-white/70">Total Earned</p>
            <p className="font-bold">${(wallet?.total_earned || 0).toFixed(2)}</p>
          </div>
          {wallet?.pending_payout > 0 && (
            <div>
              <p className="text-xs text-white/70">Pending</p>
              <p className="font-bold text-amber-200">${wallet.pending_payout.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Button */}
      <button className="w-full py-3.5 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
        <ArrowUpRight className="w-4 h-4" />
        Request Withdrawal
      </button>

      {/* Transactions */}
      <div>
        <h2 className="font-bold text-sm text-gray-900 mb-3">Transaction History</h2>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Clock className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Transactions appear here when you buy or sell</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx: any) => {
              const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.credit;
              const Icon = cfg.icon;
              return (
                <div key={tx.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${cfg.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{tx.description || cfg.label}</p>
                    <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <span className={`font-bold text-sm ${tx.type === "credit" || tx.type === "cashback" || tx.type === "refund" ? "text-green-600" : "text-gray-700"}`}>
                    {cfg.sign}${Number(tx.amount).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="font-bold text-base text-gray-900">My Wallet</h1>
        </div>
        <WalletContent />
      </AppLayout>
    </AuthGuard>
  );
}
