'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Image as ImageIcon, MoreVertical, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { format, isToday, isYesterday } from 'date-fns';

export default function ChatPage() {
  const { matchId } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [match, setMatch] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [myId, setMyId] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setMyId(user.id);

      // Get match + other user
      const { data: matchData } = await supabase
        .from('matches')
        .select(`*, user1:profiles!matches_user1_id_fkey(id,full_name,photos,avatar_url,is_online,last_seen_at), user2:profiles!matches_user2_id_fkey(id,full_name,photos,avatar_url,is_online,last_seen_at)`)
        .eq('id', matchId)
        .single();

      if (matchData) {
        setMatch(matchData);
        setOtherUser(matchData.user1_id === user.id ? matchData.user2 : matchData.user1);
      }

      // Get messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      setMessages(msgs || []);
      setLoading(false);

      // Mark as read
      await supabase.from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
    };

    load();

    // Realtime
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `match_id=eq.${matchId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [matchId]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'auto' }), 100);
    }
  }, [loading]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const content = text.trim();
    setText('');
    setSending(true);

    // Optimistic
    const temp = { id: `temp_${Date.now()}`, match_id: matchId, sender_id: myId, content, message_type: 'text', is_read: false, created_at: new Date().toISOString(), temp: true };
    setMessages(prev => [...prev, temp]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    const { data, error } = await supabase.from('messages')
      .insert({ match_id: matchId, sender_id: myId, content, message_type: 'text' })
      .select().single();

    if (!error && data) {
      setMessages(prev => prev.map(m => m.id === temp.id ? data : m));
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const photo = otherUser?.photos?.[0] || otherUser?.avatar_url;

  // Group messages by date
  const grouped = messages.reduce((acc: any[], msg) => {
    const date = format(new Date(msg.created_at), 'yyyy-MM-dd');
    if (!acc.length || acc[acc.length - 1].date !== date) {
      acc.push({ date, messages: [msg] });
    } else {
      acc[acc.length - 1].messages.push(msg);
    }
    return acc;
  }, []);

  const dateLabel = (d: string) => {
    const date = new Date(d);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <div className="bg-[#0A0A0F] flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pb-3 bg-[#0A0A0F] border-b border-white/5 flex-shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center btn-press">
          <ArrowLeft size={20} className="text-white" />
        </button>

        <div className="flex items-center gap-3 flex-1" onClick={() => {}}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1C1C27]">
              {photo
                ? <img src={photo} className="w-full h-full object-cover" alt="" />
                : <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
              }
            </div>
            {otherUser?.is_online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0A0A0F]" />
            )}
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">{otherUser?.full_name}</p>
            <p className={`text-xs ${otherUser?.is_online ? 'text-green-400' : 'text-gray-500'}`}>
              {otherUser?.is_online ? 'Online' : 'Recently active'}
            </p>
          </div>
        </div>

        <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center btn-press">
          <MoreVertical size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-1">
        {loading ? (
          <div className="flex justify-center pt-10">
            <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          grouped.map((group, gi) => (
            <div key={gi}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-gray-600 text-xs px-2">{dateLabel(group.date)}</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {group.messages.map((msg: any, i: number) => {
                const isMe = msg.sender_id === myId;
                const isLast = i === group.messages.length - 1 || group.messages[i + 1]?.sender_id !== msg.sender_id;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: msg.temp ? 0.6 : 1, y: 0 }}
                    className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''} mb-1`}
                  >
                    {/* Avatar */}
                    {!isMe && (
                      <div className={`w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ${isLast ? '' : 'invisible'}`}>
                        {photo
                          ? <img src={photo} className="w-full h-full object-cover" alt="" />
                          : <div className="w-full h-full bg-[#1C1C27] flex items-center justify-center text-xs">👤</div>
                        }
                      </div>
                    )}

                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`px-4 py-2.5 rounded-3xl ${
                        isMe
                          ? 'bg-gradient-to-br from-primary to-[#FF6B35] text-white rounded-br-lg'
                          : 'bg-[#1C1C27] text-white rounded-bl-lg'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      {isLast && (
                        <p className="text-gray-600 text-[10px] px-1">
                          {format(new Date(msg.created_at), 'HH:mm')}
                          {isMe && msg.is_read && ' · Seen'}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-safe bg-[#0A0A0F] border-t border-white/5 flex-shrink-0">
        <button className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 btn-press">
          <ImageIcon size={18} className="text-gray-400" />
        </button>

        <div className="flex-1 flex items-center bg-[#1C1C27] rounded-3xl px-4 py-2.5 gap-2">
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
            placeholder="Message..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${text.trim() ? 'gradient-primary shadow-lg shadow-primary/30' : 'bg-white/5'}`}
        >
          <Send size={16} className={text.trim() ? 'text-white' : 'text-gray-600'} />
        </motion.button>
      </div>
    </div>
  );
}
