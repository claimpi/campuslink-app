'use client';
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, Zap, RotateCcw, MapPin, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import BottomNav from '@/components/layout/BottomNav';
import MatchModal from '@/components/modals/MatchModal';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionAnim, setActionAnim] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUser(profile);
      const { data } = await supabase.rpc('get_discovery_profiles', { p_user_id: user.id, p_limit: 20 });
      setProfiles(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSwipe = async (action: 'like' | 'pass' | 'super_like') => {
    if (!user || !profiles.length) return;
    const top = profiles[0];
    setActionAnim(action);

    setTimeout(async () => {
      setProfiles(prev => prev.slice(1));
      setActionAnim(null);
      if (profiles.length <= 3) {
        const { data } = await supabase.rpc('get_discovery_profiles', { p_user_id: user.id, p_limit: 20 });
        if (data?.length) setProfiles(prev => [...prev.slice(1), ...data]);
      }
    }, 320);

    try {
      await supabase.from('swipes').insert({ swiper_id: user.id, swiped_id: top.id, action });
      if (action !== 'pass') {
        const { data: matchId } = await supabase.rpc('check_and_create_match', { p_swiper_id: user.id, p_swiped_id: top.id });
        if (matchId) {
          setMatch(top);
          setUser((u: any) => u ? { ...u, coin_balance: (u.coin_balance || 0) + 5 } : u);
        }
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-[#0A0A0F] flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe pb-3 flex-shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-yellow-400/10 border border-yellow-400/15 btn-press">
          <span className="text-base">🪙</span>
          <span className="text-yellow-400 font-heading font-bold text-sm">{user?.coin_balance ?? 0}</span>
        </button>
        <div className="flex items-center gap-1">
          <span className="font-heading font-extrabold text-xl text-white">Campus</span>
          <span className="font-heading font-extrabold text-xl px-1.5 py-0.5 rounded-lg gradient-primary text-white">Link</span>
        </div>
        <button className="w-9 h-9 rounded-2xl bg-[#1C1C27] flex items-center justify-center btn-press">
          <SlidersHorizontal size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative flex items-center justify-center px-4 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center">
            <span className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-8">
            <div className="text-6xl mb-4">💫</div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">You've seen everyone!</h3>
            <p className="text-gray-500 text-sm mb-6">Check back later for new people</p>
            <button onClick={() => { setLoading(true); supabase.rpc('get_discovery_profiles', { p_user_id: user?.id, p_limit: 20 }).then(({ data }) => { setProfiles(data || []); setLoading(false); }); }}
              className="px-6 py-3 rounded-2xl gradient-primary text-white font-semibold btn-press">Refresh</button>
          </motion.div>
        ) : (
          <>
            {/* Back cards */}
            {profiles.slice(1, 3).reverse().map((p, i) => (
              <div key={p.id} className="absolute w-full max-w-[340px] rounded-3xl bg-[#1C1C27] overflow-hidden"
                style={{ height: 'min(480px, calc(100dvh - 220px))', transform: `scale(${0.92 + i * 0.04}) translateY(${(1 - i) * 14}px)`, zIndex: i }}>
                {p.photos?.[0] && <img src={p.photos[0]} className="w-full h-full object-cover opacity-60" alt="" />}
              </div>
            ))}

            {/* Top swipe card */}
            {profiles[0] && (
              <SwipeCard
                key={profiles[0].id}
                profile={profiles[0]}
                action={actionAnim}
                onSwipe={handleSwipe}
              />
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 px-6 py-4 flex-shrink-0">
        <ActionBtn icon={<RotateCcw size={20} className="text-orange-400" />} size="sm" onClick={() => {}} />
        <ActionBtn icon={<X size={28} className="text-primary" />} size="lg" variant="outline" onClick={() => handleSwipe('pass')} />
        <ActionBtn icon={<Star size={20} className="text-white" />} size="sm" gradient="from-cyan-400 to-blue-600" onClick={() => handleSwipe('super_like')} />
        <ActionBtn icon={<Heart size={28} fill="white" className="text-white" />} size="lg" gradient="from-primary to-[#FF6B35]" onClick={() => handleSwipe('like')} />
        <ActionBtn icon={<Zap size={20} className="text-yellow-400" />} size="sm" onClick={() => {}} />
      </div>

      <BottomNav />

      <AnimatePresence>
        {match && (
          <MatchModal myProfile={user} matchedProfile={match}
            onClose={() => setMatch(null)}
            onMessage={() => { setMatch(null); /* navigate to chat */ }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({ profile, action, onSwipe }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [30, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -30], [1, 0]);
  const superOpacity = useTransform(y, [-100, -30], [1, 0]);
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = profile.photos?.length ? profile.photos : [];

  return (
    <motion.div
      className="absolute w-full max-w-[340px] swipe-card"
      style={{ x, y, rotate, height: 'min(480px, calc(100dvh - 220px))', zIndex: 20 }}
      drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.7}
      onDragEnd={(_, info) => {
        const { offset, velocity } = info;
        if (offset.y < -80 && Math.abs(offset.x) < 60) { onSwipe('super_like'); return; }
        if (offset.x > 80 || velocity.x > 400) { onSwipe('like'); return; }
        if (offset.x < -80 || velocity.x < -400) { onSwipe('pass'); return; }
      }}
      animate={action === 'like' ? { x: 500, rotate: 18, opacity: 0 } : action === 'pass' ? { x: -500, rotate: -18, opacity: 0 } : action === 'super_like' ? { y: -600, opacity: 0 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-full rounded-3xl overflow-hidden bg-[#1C1C27] relative shadow-2xl">
        {photos[photoIdx]
          ? <img src={photos[photoIdx]} className="w-full h-full object-cover" alt="" />
          : <div className="w-full h-full bg-gradient-to-br from-[#2a1020] to-[#1a1030] flex items-center justify-center text-8xl opacity-40">
              {profile.gender === 'female' ? '👩' : '👨'}
            </div>
        }

        {/* Photo dots */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1.5">
            {photos.map((_: any, i: number) => (
              <div key={i} className="flex-1 h-[3px] rounded-full" style={{ background: i === photoIdx ? '#fff' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        )}

        {/* Tap zones */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={() => setPhotoIdx(Math.max(0, photoIdx - 1))} />
          <div className="flex-1" onClick={() => setPhotoIdx(Math.min(photos.length - 1, photoIdx + 1))} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />

        {/* Stamps */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 left-4 border-[3px] border-green-400 rounded-xl px-3 py-1 rotate-[-15deg] pointer-events-none">
          <span className="font-heading font-extrabold text-green-400 text-2xl tracking-widest">LIKE</span>
        </motion.div>
        <motion.div style={{ opacity: passOpacity }} className="absolute top-12 right-4 border-[3px] border-primary rounded-xl px-3 py-1 rotate-[15deg] pointer-events-none">
          <span className="font-heading font-extrabold text-primary text-2xl tracking-widest">NOPE</span>
        </motion.div>
        <motion.div style={{ opacity: superOpacity }} className="absolute top-16 left-0 right-0 flex justify-center pointer-events-none">
          <div className="border-[3px] border-cyan-400 rounded-xl px-4 py-1">
            <span className="font-heading font-extrabold text-cyan-400 text-xl tracking-widest">SUPER LIKE ⭐</span>
          </div>
        </motion.div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {profile.is_online && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Online
              </span>
            )}
            {profile.is_verified && <span className="flex items-center gap-1 text-cyan-400 text-xs"><CheckCircle size={11} />Verified</span>}
            {profile.distance_km != null && (
              <span className="text-white/50 text-xs flex items-center gap-0.5"><MapPin size={10} />{Math.round(profile.distance_km)} km</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-2xl text-white">{profile.full_name}</span>
            {profile.age && <span className="font-heading text-xl text-white/75">{profile.age}</span>}
          </div>
          {profile.bio && <p className="text-white/70 text-sm mt-1 line-clamp-2 leading-relaxed">{profile.bio}</p>}
          {profile.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profile.interests.slice(0, 3).map((int: string) => (
                <span key={int} className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/80">{int}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ActionBtn({ icon, size, gradient, variant, onClick }: any) {
  return (
    <motion.button whileTap={{ scale: 0.88 }} onClick={onClick}
      className={`flex items-center justify-center rounded-full shadow-lg btn-press ${size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'} ${gradient ? `bg-gradient-to-br ${gradient}` : variant === 'outline' ? 'bg-white border-2 border-gray-200' : 'bg-[#1C1C27]'}`}>
      {icon}
    </motion.button>
  );
}
