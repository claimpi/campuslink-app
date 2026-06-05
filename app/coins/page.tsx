'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const PACKAGES = [
  { id: 'starter', name: 'Starter', coins: 100, bonus: 0, price: 150, per: '1.5/coin' },
  { id: 'popular', name: 'Popular', coins: 500, bonus: 50, price: 599, per: '1.1/coin', popular: true },
  { id: 'premium', name: 'Premium', coins: 1000, bonus: 150, price: 999, per: '0.87/coin' },
  { id: 'vip', name: 'VIP', coins: 5000, bonus: 1000, price: 4499, per: '0.75/coin' },
];

const COIN_USES = [
  { icon: '⭐', label: 'Super Like', cost: 5 },
  { icon: '🚀', label: 'Profile Boost', cost: 10 },
  { icon: '👁', label: 'See Likes', cost: 20 },
  { icon: '↩️', label: 'Rewind', cost: 1 },
  { icon: '🎁', label: 'Send Gift', cost: '5–100' },
];

export default function BuyCoinsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [selected, setSelected] = useState('popular');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('coin_balance').eq('id', user.id).single();
      setBalance(data?.coin_balance || 0);
    };
    load();
  }, []);

  const pkg = PACKAGES.find(p => p.id === selected)!;

  const handleBuy = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }

    // Create pending transaction
    const { data: tx } = await supabase.from('transactions').insert({
      user_id: user.id,
      transaction_type: 'coin_purchase',
      amount_kes: pkg.price,
      coins_amount: pkg.coins + pkg.bonus,
      status: 'pending',
      description: `${pkg.coins + pkg.bonus} Campus Coins`,
    }).select().single();

    // In production: redirect to PesaPal
    // For now show success simulation
    if (tx) {
      alert(`Payment flow:\n\nIn production this redirects to PesaPal (M-Pesa / Card)\n\nTransaction ID: ${tx.id}\nAmount: KES ${pkg.price}\nCoins: ${pkg.coins + pkg.bonus}`);
    }
    setLoading(false);
  };

  return (
    <div className="screen bg-[#0A0A0F]">
      <div className="flex items-center gap-4 px-5 pt-safe pb-4">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center btn-press">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="font-heading font-bold text-xl text-white">Buy Coins</h1>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-yellow-400/10 border border-yellow-400/15">
          <span>🪙</span>
          <span className="text-yellow-400 font-bold text-sm">{balance}</span>
        </div>
      </div>

      {/* What coins do */}
      <div className="px-5 mb-5">
        <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3">Use coins for</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {COIN_USES.map(c => (
            <div key={c.label} className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-[#1C1C27] min-w-[72px]">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-white text-xs font-medium text-center leading-tight">{c.label}</span>
              <span className="text-primary text-xs font-bold">{c.cost} 🪙</span>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="px-4 space-y-3 pb-36">
        <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold px-1">Choose a package</p>
        {PACKAGES.map((pkg, i) => (
          <motion.button
            key={pkg.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setSelected(pkg.id)}
            className={`w-full rounded-3xl overflow-hidden border-2 text-left transition-all ${selected === pkg.id ? 'border-primary' : 'border-white/10'}`}
          >
            {pkg.popular && (
              <div className="gradient-primary py-1 text-center">
                <span className="text-white text-xs font-bold">🔥 BEST VALUE</span>
              </div>
            )}
            <div className="bg-[#1C1C27] p-4 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${selected === pkg.id ? 'gradient-gold' : 'bg-white/5'}`}>
                <span className="text-xl">🪙</span>
                <span className={`text-[10px] font-bold ${selected === pkg.id ? 'text-white' : 'text-gray-400'}`}>{pkg.coins >= 1000 ? `${pkg.coins/1000}K` : pkg.coins}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-white">{pkg.name}</span>
                  {pkg.bonus > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">+{pkg.bonus} bonus</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{pkg.coins + pkg.bonus} coins total</p>
                <p className="text-gray-600 text-xs">~KES {pkg.per}</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-bold text-white text-lg">KES {pkg.price.toLocaleString()}</p>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-auto mt-1 transition-all ${selected === pkg.id ? 'bg-primary border-primary' : 'border-gray-600'}`}>
                  {selected === pkg.id && <Check size={13} className="text-white" strokeWidth={3} />}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-safe pt-4 bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/5">
        <button onClick={handleBuy} disabled={loading}
          className="btn-press w-full h-14 rounded-2xl gradient-gold text-white font-heading font-bold text-lg shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2">
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <>Buy {PACKAGES.find(p => p.id === selected)!.coins + PACKAGES.find(p => p.id === selected)!.bonus} 🪙 for KES {PACKAGES.find(p => p.id === selected)!.price}</>
          }
        </button>
        <p className="text-center text-gray-600 text-xs mt-2">Pay via M-Pesa, Card or Airtel Money</p>
      </div>
    </div>
  );
}
