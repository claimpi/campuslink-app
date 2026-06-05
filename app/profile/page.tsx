'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, Edit3, Plus, X, Crown, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import BottomNav from '@/components/layout/BottomNav';

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const photos = profile?.photos || [];
  const completion = calcCompletion(profile);

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <h1 className="font-heading font-bold text-2xl text-white">My Profile</h1>
        <button className="w-9 h-9 rounded-xl bg-[#1C1C27] flex items-center justify-center">
          <Settings size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-4 rounded-3xl overflow-hidden bg-[#1C1C27] mb-4">
        {/* Cover photo */}
        <div className="h-52 relative bg-gradient-to-br from-[#2a1020] to-[#1a1030]">
          {photos[0] ? (
            <img src={photos[0]} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl opacity-40">
              {profile?.gender === 'female' ? '👩' : '👨'}
            </div>
          )}
          {profile?.subscription_tier !== 'free' && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-400/90">
              <Crown size={12} className="text-yellow-900" />
              <span className="text-xs font-bold text-yellow-900 capitalize">{profile?.subscription_tier}</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h2 className="font-heading font-bold text-2xl text-white">
            {profile?.full_name}{profile?.age ? `, ${profile.age}` : ''}
          </h2>
          {(profile?.city || profile?.county) && (
            <p className="text-gray-400 text-sm mt-1">📍 {[profile.city, profile.county].filter(Boolean).join(', ')}</p>
          )}
          {profile?.bio && (
            <p className="text-gray-300 text-sm mt-2 leading-relaxed line-clamp-2">{profile.bio}</p>
          )}
        </div>

        <button
          onClick={() => router.push('/profile/edit')}
          className="mx-5 mb-5 w-[calc(100%-40px)] py-3 rounded-2xl gradient-primary text-white font-heading font-semibold flex items-center justify-center gap-2 btn-press"
        >
          <Edit3 size={18} /> Edit Profile
        </button>
      </motion.div>

      {/* Completion bar */}
      {completion < 100 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-4 mb-4 p-4 rounded-2xl bg-[#1C1C27]">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-white">Profile Completion</span>
            <span className="text-sm font-bold text-primary">{completion}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${completion}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Complete profiles get 3× more matches</p>
        </motion.div>
      )}

      {/* Photos grid */}
      <div className="mx-4 mb-4 p-5 rounded-2xl bg-[#1C1C27]">
        <div className="flex justify-between items-center mb-4">
          <span className="font-heading font-bold text-white">Photos</span>
          <span className="text-sm text-gray-500">{photos.length}/10</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
              {photos[i] ? (
                <>
                  <img src={photos[i]} className="w-full h-full object-cover" alt="" />
                  {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded-md bg-primary/90 text-white font-semibold">Main</span>}
                </>
              ) : (
                <Plus size={20} className="text-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Likes', value: '12', color: 'text-primary' },
          { label: 'Matches', value: '4', color: 'text-purple-400' },
          { label: 'Views', value: '87', color: 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-[#1C1C27] text-center">
            <div className={`font-heading font-bold text-xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Coins */}
      <div className="mx-4 mb-4 p-5 rounded-2xl bg-[#1C1C27] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🪙</span>
          <div>
            <div className="text-xs text-gray-500">Campus Coins</div>
            <div className="font-heading font-bold text-xl text-white">{profile?.coin_balance ?? 0}</div>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl gradient-gold text-white font-semibold text-sm btn-press">
          Buy Coins
        </button>
      </div>

      {/* Premium */}
      <button
        onClick={() => router.push('/premium')}
        className="mx-4 mb-4 w-[calc(100%-32px)] p-5 rounded-2xl gradient-secondary flex items-center justify-between btn-press"
      >
        <div>
          <div className="font-heading font-bold text-white text-base">
            {profile?.subscription_tier === 'free' ? 'Upgrade to Premium 💎' : '✨ Premium Active'}
          </div>
          <div className="text-white/70 text-xs mt-0.5">Unlimited likes · See who liked you</div>
        </div>
        <span className="text-white/60 text-xl">›</span>
      </button>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="mx-4 w-[calc(100%-32px)] py-3 rounded-2xl border border-red-500/30 text-red-400 font-semibold text-sm flex items-center justify-center gap-2 btn-press hover:bg-red-500/5 transition-colors"
      >
        Sign Out
      </button>

      <BottomNav />
    </div>
  );
}

function calcCompletion(p: any) {
  if (!p) return 0;
  const fields = [p.bio, p.age, p.gender, p.photos?.length > 0, p.interests?.length > 0, p.city, p.occupation, p.relationship_goal, p.height_cm];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
