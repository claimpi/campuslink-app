'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import BottomNav from '@/components/layout/BottomNav';

export default function MatchesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [myId, setMyId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setMyId(user.id);
      const { data } = await supabase
        .from('matches')
        .select(`*, user1:profiles!matches_user1_id_fkey(id,full_name,photos,is_online,last_seen_at), user2:profiles!matches_user2_id_fkey(id,full_name,photos,is_online,last_seen_at)`)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      const enriched = (data || []).map(m => ({ ...m, other_user: m.user1_id === user.id ? m.user2 : m.user1 }));
      setMatches(enriched);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = matches.filter(m => m.other_user?.full_name?.toLowerCase().includes(search.toLowerCase()));
  const newMatches = filtered.filter(m => !m.last_message);
  const convos = filtered.filter(m => !!m.last_message);

  return (
    <div className="screen bg-[#0A0A0F] pb-nav">
      <div className="px-5 pt-safe pb-2">
        <h1 className="font-heading font-bold text-2xl text-white mb-4">Messages</h1>
        <div className="flex items-center gap-3 bg-[#1C1C27] rounded-2xl px-4 py-3">
          <Search size={16} className="text-gray-500 flex-shrink-0" />
          <input className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
            placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20">
          <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 px-8">
          <div className="text-6xl mb-4">💌</div>
          <h3 className="font-heading font-bold text-xl text-white mb-2">No matches yet</h3>
          <p className="text-gray-500 text-sm text-center">Start swiping to find your match!</p>
          <button onClick={() => router.push('/home')} className="mt-6 px-6 py-3 rounded-2xl gradient-primary text-white font-semibold btn-press">
            Start Swiping
          </button>
        </div>
      ) : (
        <>
          {newMatches.length > 0 && (
            <div className="mt-4">
              <p className="px-5 text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
                New Matches · {newMatches.length}
              </p>
              <div className="flex gap-4 px-5 overflow-x-auto no-scrollbar pb-2">
                {newMatches.map((m, i) => (
                  <motion.button key={m.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => router.push(`/chat/${m.id}`)} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="relative w-16 h-16 rounded-full border-2 border-primary overflow-hidden">
                      {m.other_user?.photos?.[0]
                        ? <img src={m.other_user.photos[0]} className="w-full h-full object-cover" alt="" />
                        : <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-2xl">👤</div>
                      }
                      {m.other_user?.is_online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0A0A0F]" />}
                    </div>
                    <span className="text-xs text-gray-400 font-medium w-16 truncate text-center">
                      {m.other_user?.full_name?.split(' ')[0]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {convos.length > 0 && (
            <div className="mt-4">
              <p className="px-5 text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Conversations</p>
              {convos.map((m, i) => (
                <motion.button key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => router.push(`/chat/${m.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-4 border-b border-white/5 active:bg-white/5 transition-colors">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[#1C1C27]">
                    {m.other_user?.photos?.[0]
                      ? <img src={m.other_user.photos[0]} className="w-full h-full object-cover" alt="" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    }
                    {m.other_user?.is_online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0A0A0F]" />}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between mb-0.5">
                      <span className="font-semibold text-white text-sm">{m.other_user?.full_name}</span>
                      {m.last_message && <span className="text-xs text-gray-600">{formatDistanceToNow(new Date(m.last_message.created_at), { addSuffix: false })}</span>}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{m.last_message?.content || 'Say hello! 👋'}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}
      <BottomNav />
    </div>
  );
}
