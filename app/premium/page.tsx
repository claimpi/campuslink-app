'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X } from 'lucide-react';

const TIERS = [
  {
    id: 'silver', name: 'Silver', emoji: '⚡', color: '#C0C0C0',
    gradient: 'from-gray-400 to-gray-300',
    monthly: 499, quarterly: 449, annual: 399,
    features: [
      { text: 'Ad-free experience', included: true },
      { text: '100 swipes/day', included: true },
      { text: 'Advanced filters', included: true },
      { text: 'See who liked you', included: false },
      { text: 'Unlimited likes', included: false },
      { text: 'Profile boosts', included: false },
    ],
  },
  {
    id: 'gold', name: 'Gold', emoji: '👑', color: '#FFD700',
    gradient: 'from-yellow-400 to-orange-400',
    monthly: 999, quarterly: 899, annual: 799,
    popular: true,
    features: [
      { text: 'Ad-free experience', included: true },
      { text: 'Unlimited swipes & likes', included: true },
      { text: 'See who liked you', included: true },
      { text: 'Advanced filters', included: true },
      { text: 'Unlimited rewinds', included: true },
      { text: '1 boost/day', included: true },
    ],
  },
  {
    id: 'platinum', name: 'Platinum', emoji: '💎', color: '#9B7DFF',
    gradient: 'from-purple-500 to-primary',
    monthly: 1999, quarterly: 1799, annual: 1599,
    features: [
      { text: 'Everything in Gold', included: true },
      { text: 'AI smart matching', included: true },
      { text: 'Priority placement', included: true },
      { text: 'Read receipts', included: true },
      { text: 'VIP badge', included: true },
      { text: '100 coins/month', included: true },
    ],
  },
];

type Billing = 'monthly' | 'quarterly' | 'annual';

export default function PremiumPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('gold');
  const [billing, setBilling] = useState<Billing>('monthly');

  const price = (tier: any) => {
    if (billing === 'annual') return tier.annual;
    if (billing === 'quarterly') return tier.quarterly;
    return tier.monthly;
  };

  const discount = (b: Billing) => b === 'annual' ? '20% off' : b === 'quarterly' ? '10% off' : null;

  return (
    <div className="screen bg-[#0A0A0F]">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-safe pb-4">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center btn-press">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="font-heading font-bold text-xl text-white">Go Premium</h1>
      </div>

      {/* Hero */}
      <div className="px-5 mb-5">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-secondary/30 to-primary/20 border border-white/10">
          <p className="text-4xl mb-3">✨</p>
          <h2 className="font-heading font-bold text-2xl text-white mb-1">Unlock everything</h2>
          <p className="text-gray-400 text-sm">More matches. More connections. More CampusLink.</p>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex gap-2 px-5 mb-5">
        {(['monthly', 'quarterly', 'annual'] as Billing[]).map(b => (
          <button key={b} onClick={() => setBilling(b)}
            className={`btn-press flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all relative ${billing === b ? 'gradient-primary text-white' : 'bg-white/5 text-gray-400'}`}>
            {b.charAt(0).toUpperCase() + b.slice(1)}
            {discount(b) && (
              <span className="absolute -top-2 -right-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {discount(b)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tier cards */}
      <div className="px-4 space-y-3 pb-32">
        {TIERS.map((tier, i) => (
          <motion.button
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSelected(tier.id)}
            className={`w-full rounded-3xl overflow-hidden border-2 transition-all text-left ${selected === tier.id ? 'border-primary' : 'border-white/10'}`}
          >
            {tier.popular && (
              <div className="gradient-primary py-1.5 text-center">
                <span className="text-white text-xs font-bold tracking-wider">⭐ MOST POPULAR</span>
              </div>
            )}
            <div className="bg-[#1C1C27] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-2xl`}>
                    {tier.emoji}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-lg">{tier.name}</p>
                    <p className="font-heading font-bold text-xl" style={{ color: tier.color }}>
                      KES {price(tier).toLocaleString()}
                      <span className="text-gray-500 text-sm font-normal">/mo</span>
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected === tier.id ? 'bg-primary border-primary' : 'border-gray-600'}`}>
                  {selected === tier.id && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
              </div>

              <div className="space-y-2">
                {tier.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-3">
                    {f.included
                      ? <Check size={16} className="text-green-400 flex-shrink-0" strokeWidth={2.5} />
                      : <X size={16} className="text-gray-600 flex-shrink-0" strokeWidth={2} />
                    }
                    <span className={`text-sm ${f.included ? 'text-white' : 'text-gray-600'}`}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-safe pt-4 bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/5">
        <button
          onClick={() => router.push(`/premium/checkout?tier=${selected}&billing=${billing}`)}
          className="btn-press w-full h-14 rounded-2xl gradient-primary text-white font-heading font-bold text-lg shadow-xl shadow-primary/30"
        >
          Subscribe to {TIERS.find(t => t.id === selected)?.name} ✨
        </button>
        <p className="text-center text-gray-600 text-xs mt-2">Cancel anytime · Billed via M-Pesa or card</p>
      </div>
    </div>
  );
}
