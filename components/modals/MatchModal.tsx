'use client';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function MatchModal({ myProfile, matchedProfile, onClose, onMessage }: any) {
  const myPhoto = myProfile?.photos?.[0];
  const theirPhoto = matchedProfile?.photos?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 backdrop-blur-sm" />

      {/* Floating emojis */}
      {['❤️', '💕', '✨', '💫', '🔥'].map((e, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl pointer-events-none"
          style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 12}%`, opacity: 0.4 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
        >
          {e}
        </motion.span>
      ))}

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative text-center px-8 z-10"
      >
        <button onClick={onClose} className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <X size={16} className="text-white" />
        </button>

        <h2 className="font-heading font-extrabold text-4xl text-white mb-2 tracking-tight">
          It's a Match! 🎉
        </h2>
        <p className="text-white/75 mb-8 text-base">
          You and {matchedProfile?.full_name} liked each other
        </p>

        {/* Photos */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl rotate-[-6deg]">
            {myPhoto ? (
              <img src={myPhoto} className="w-full h-full object-cover" alt="You" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl">
                {myProfile?.gender === 'female' ? '👩' : '👨'}
              </div>
            )}
          </div>
          <span className="text-4xl z-10 -mx-2">💘</span>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl rotate-[6deg]">
            {theirPhoto ? (
              <img src={theirPhoto} className="w-full h-full object-cover" alt={matchedProfile?.full_name} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-4xl">
                {matchedProfile?.gender === 'female' ? '👩' : '👨'}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onMessage}
          className="w-full py-4 rounded-2xl bg-white text-primary font-heading font-bold text-lg flex items-center justify-center gap-2 shadow-2xl btn-press mb-3"
        >
          <MessageCircle size={22} /> Send a Message
        </button>
        <button onClick={onClose} className="text-white/60 text-sm py-2 hover:text-white transition-colors">
          Keep Swiping
        </button>
      </motion.div>
    </motion.div>
  );
}
