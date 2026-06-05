'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, Zap, RotateCcw, MapPin, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import BottomNav from '@/components/layout/BottomNav';
import MatchModal from '@/components/modals/MatchModal';

export default function HomePage() {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [match, setMatch] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [action, setAction] = useState<'like' | 'pass' | 'super' | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUser(profile);
      const { data } = await supabase.rpc('get_discovery_profiles', { p_user_id: user.id, p_limit: 20 });
      setProfiles(data || []);
    };
    load();
  }, []);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = async (swipeAction: 'like' | 'pass' | 'super_like') => {
    if (!user || !currentProfile) return;
    setAction(swipeAction === 'like' ? 'like' : swipeAction === 'pass' ? 'pass' : 'super');

    try {
      const { data: swipe } = await supabase.from('swipes').insert({
        swiper_id: user.id, swiped_id: currentProfile.id, action: swipeAction
      }).select().single();

      if (swipeAction !== 'pass') {
        const { data: matchId } = await supabase.rpc('check_and_create_match', {
          p_swiper_id: user.id, p_swiped_id: currentProfile.id
        });
        if (matchId) setMatch(currentProfile);
      }
    } catch (err) { console.error(err); }

    setTimeout(() => {
      setAction(null);
      setCurrentIndex(i => i + 1);
    }, 350);
  };

  const remaining = profiles.length - currentIndex;

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <button className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-yellow-400/10 border border-yellow-400/20">
          <span>🪙</span>
          <span className="text-yellow-400 font-heading font-bold text-sm">{user?.coin_balance ?? 0}</span>
        </button>

        <div className="flex items-center gap-1">
          <span className="font-heading font-bold text-xl text-white">Campus</span>
          <span className="font-heading font-bold text-xl px-1.5 py-0.5 rounded-md bg-gradient-to-r from-primary to-[#FF6B35] text-white">Link</span>
        </div>

        <button className="w-9 h-9 rounded-xl bg-[#1C1C27] flex items-center justify-center">
          <span className="text-gray-400">⚡</span>
        </button>
      </div>

      {/* Card Stack */}
      <div className="flex-1 relative flex items-center justify-center px-4 pb-4" style={{ minHeight: 480 }}>
        <AnimatePresence>
          {remaining === 0 ? (
            <EmptyState onRefresh={() => setCurrentIndex(0)} />
          ) : (
            <>
              {/* Back cards */}
              {[2, 1].map(offset => {
                const idx = currentIndex + offset;
                if (idx >= profiles.length) return null;
                return (
                  <div
                    key={profiles[idx]?.id}
                    className="absolute w-full max-w-sm rounded-3xl overflow-hidden bg-[#1C1C27]"
                    style={{
                      height: 480,
                      transform: `scale(${1 - offset * 0.04}) translateY(${offset * 12}px)`,
                      zIndex: 10 - offset,
                    }}
                  />
                );
              })}

              {/* Top card */}
              {currentProfile && (
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  action={action}
                  onSwipe={handleSwipe}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4 px-6 pb-6">
        <ActionBtn onClick={() => {}} icon={<RotateCcw size={20} className="text-orange-400" />} size="sm" />
        <ActionBtn onClick={() => handleSwipe('pass')} icon={<X size={28} className="text-primary" />} size="lg" border />
        <ActionBtn
          onClick={() => handleSwipe('super_like')}
          icon={<Star size={20} className="text-white" />}
          size="sm"
          gradient="from-cyan-400 to-blue-500"
        />
        <ActionBtn
          onClick={() => handleSwipe('like')}
          icon={<Heart size={28} className="text-white" fill="white" />}
          size="lg"
          gradient="from-primary to-[#FF6B35]"
        />
        <ActionBtn onClick={() => {}} icon={<Zap size={20} className="text-yellow-400" />} size="sm" />
      </div>

      <BottomNav active="home" />

      <AnimatePresence>
        {match && (
          <MatchModal
            myProfile={user}
            matchedProfile={match}
            onClose={() => setMatch(null)}
            onMessage={() => setMatch(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({ profile, action, onSwipe }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -20], [1, 0]);
  const superOpacity = useTransform(y, [-120, -20], [1, 0]);

  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = profile.photos?.length > 0 ? profile.photos : [];
  const photo = photos[photoIdx] || null;

  const handleDragEnd = (_: any, info: any) => {
    const { offset, velocity } = info;
    if (offset.y < -100 && Math.abs(offset.x) < 80) { onSwipe('super_like'); return; }
    if (offset.x > 100 || velocity.x > 500) { onSwipe('like'); return; }
    if (offset.x < -100 || velocity.x < -500) { onSwipe('pass'); return; }
  };

  return (
    <motion.div
      className="absolute w-full max-w-sm swipe-card"
      style={{ x, y, rotate, height: 480, zIndex: 20 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={
        action === 'like' ? { x: 600, rotate: 20, opacity: 0 } :
        action === 'pass' ? { x: -600, rotate: -20, opacity: 0 } :
        action === 'super' ? { y: -600, opacity: 0 } :
        {}
      }
      transition={{ duration: 0.35 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full h-full rounded-3xl overflow-hidden bg-[#1C1C27] relative shadow-2xl">
        {/* Photo */}
        {photo ? (
          <img src={photo} alt={profile.full_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a1020] to-[#1a1030] flex items-center justify-center text-8xl">
            {profile.gender === 'female' ? '👩' : profile.gender === 'male' ? '👨' : '🧑'}
          </div>
        )}

        {/* Photo dots */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1.5">
            {photos.map((_: any, i: number) => (
              <button key={i} onClick={() => setPhotoIdx(i)}
                className="flex-1 h-[3px] rounded-full"
                style={{ background: i === photoIdx ? '#fff' : 'rgba(255,255,255,0.35)' }}
              />
            ))}
          </div>
        )}

        {/* Tap zones */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={() => setPhotoIdx(Math.max(0, photoIdx - 1))} />
          <div className="flex-1" onClick={() => setPhotoIdx(Math.min(photos.length - 1, photoIdx + 1))} />
        </div>

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

        {/* LIKE stamp */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-16 left-5 border-[3px] border-green-400 rounded-lg px-3 py-1 rotate-[-15deg] pointer-events-none">
          <span className="font-heading font-extrabold text-green-400 text-2xl tracking-widest">LIKE</span>
        </motion.div>

        {/* NOPE stamp */}
        <motion.div style={{ opacity: passOpacity }} className="absolute top-16 right-5 border-[3px] border-primary rounded-lg px-3 py-1 rotate-[15deg] pointer-events-none">
          <span className="font-heading font-extrabold text-primary text-2xl tracking-widest">NOPE</span>
        </motion.div>

        {/* SUPER LIKE stamp */}
        <motion.div style={{ opacity: superOpacity }} className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none">
          <div className="border-[3px] border-cyan-400 rounded-lg px-4 py-1">
            <span className="font-heading font-extrabold text-cyan-400 text-xl tracking-widest">SUPER LIKE</span>
          </div>
        </motion.div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-1">
            {profile.is_online && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online
              </span>
            )}
            {profile.is_verified && (
              <span className="flex items-center gap-1 text-cyan-400 text-xs">
                <CheckCircle size={12} /> Verified
              </span>
            )}
            {profile.distance_km != null && (
              <span className="flex items-center gap-1 text-white/50 text-xs">
                <MapPin size={10} /> {Math.round(profile.distance_km)} km
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading font-bold text-2xl text-white">{profile.full_name}</span>
            {profile.age && <span className="font-heading text-xl text-white/80">{profile.age}</span>}
          </div>
          {profile.bio && (
            <p className="text-white/70 text-sm line-clamp-2 mb-2 leading-relaxed">{profile.bio}</p>
          )}
          {profile.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
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

function ActionBtn({ onClick, icon, size, gradient, border }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex items-center justify-center rounded-full shadow-lg ${
        size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
      } ${
        gradient ? `bg-gradient-to-br ${gradient}` :
        border ? 'bg-white border-2 border-primary/20' :
        'bg-[#1C1C27]'
      }`}
    >
      {icon}
    </motion.button>
  );
}

function EmptyState({ onRefresh }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-8">
      <div className="text-6xl mb-4">💫</div>
      <h3 className="font-heading font-bold text-xl text-white mb-2">You've seen everyone!</h3>
      <p className="text-gray-400 text-sm mb-6">Adjust your filters or check back later</p>
      <button onClick={onRefresh} className="px-6 py-3 rounded-2xl gradient-primary text-white font-semibold btn-press">
        Refresh
      </button>
    </motion.div>
  );
}
