'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import BottomNav from '@/components/layout/BottomNav';

export default function LikesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [likes, setLikes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
      setUser(profile);

      // Get people who liked me but I haven't swiped on yet
      const { data } = await supabase
        .from('swipes')
        .select('swiper_id, action, created_at, profiles!swipes_swiper_id_fkey(id, full_name, photos, age, city, county, is_verified)')
        .eq('swiped_id', authUser.id)
        .in('action', ['like', 'super_like'])
        .order('created_at', { ascending: false });

      setLikes(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const isPremium = user?.subscription_tier !== 'free';

  const handleLikeBack = async (likerId: string) => {
    if (!user) return;
    await supabase.from('swipes').insert({ swiper_id: user.id, swiped_id: likerId, action: 'like' });
    const { data: matchId } = await supabase.rpc('check_and_create_match', { p_swiper_id: user.id, p_swiped_id: likerId });
    if (matchId) router.push('/matches');
    else setLikes(prev => prev.filter(l => l.swiper_id !== likerId));
  };

  return (
    <div className="screen bg-[#0A0A0F] pb-nav">
      <div className="px-5 pt-safe pb-4">
        <h1 className="font-heading font-bold text-2xl text-white">Liked You</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isPremium ? `${likes.length} people liked your profile` : 'Upgrade to see who likes you'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20">
          <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : likes.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 px-8">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="font-heading font-bold text-xl text-white mb-2">No likes yet</h3>
          <p className="text-gray-500 text-sm text-center">Keep swiping to get more likes!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {likes.map((like, i) => {
            const profile = like.profiles;
            const photo = profile?.photos?.[0];
            const isBlurred = !isPremium;

            return (
              <motion.div
                key={like.swiper_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-3xl overflow-hidden bg-[#1C1C27]"
                style={{ aspectRatio: '3/4' }}
              >
                {photo ? (
                  <img
                    src={photo}
                    className={`w-full h-full object-cover transition-all ${isBlurred ? 'blur-xl scale-110' : ''}`}
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl">
                    👤
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Super like badge */}
                {like.action === 'super_like' && (
                  <div className="absolute top-3 right-3 bg-cyan-500 rounded-xl px-2 py-1">
                    <span className="text-white text-xs font-bold">⭐ Super</span>
                  </div>
                )}

                {isBlurred ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Lock size={28} className="text-white mb-2" />
                    <p className="text-white text-xs font-semibold text-center px-4">Upgrade to see</p>
                  </div>
                ) : (
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-heading font-bold text-white text-base">
                      {profile?.full_name?.split(' ')[0]}{profile?.age ? `, ${profile.age}` : ''}
                    </p>
                    {(profile?.city || profile?.county) && (
                      <p className="text-white/60 text-xs">📍 {profile.city || profile.county}</p>
                    )}
                    <button
                      onClick={() => handleLikeBack(like.swiper_id)}
                      className="mt-2 w-full py-2 rounded-2xl gradient-primary text-white text-sm font-semibold btn-press flex items-center justify-center gap-1"
                    >
                      <Heart size={14} fill="white" /> Like Back
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Upgrade banner for free users */}
      {!isPremium && likes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-6 p-5 rounded-3xl gradient-secondary"
        >
          <h3 className="font-heading font-bold text-white text-lg mb-1">See who likes you 💘</h3>
          <p className="text-white/70 text-sm mb-4">Upgrade to Gold to see all {likes.length} people who liked your profile</p>
          <button
            onClick={() => router.push('/premium')}
            className="w-full py-3 rounded-2xl bg-white text-secondary font-heading font-bold btn-press"
          >
            Upgrade to Gold →
          </button>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
