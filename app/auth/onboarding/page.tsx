'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, Plus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const INTERESTS = [
  '🎵 Music', '🎬 Movies', '📚 Books', '🎮 Gaming', '✈️ Travel',
  '🍕 Food', '💪 Fitness', '🎨 Art', '📸 Photography', '🌿 Nature',
  '🏄 Sports', '💃 Dancing', '🧘 Yoga', '🍳 Cooking', '🌍 Culture',
  '🎸 Guitar', '🏋️ Gym', '🎤 Singing', '🏕️ Camping', '☕ Coffee',
  '🎪 Events', '🏃 Running', '🌙 Nightlife', '🎭 Theatre', '🧩 Puzzles',
];

const GOALS = [
  { id: 'serious', emoji: '💍', label: 'Serious relationship' },
  { id: 'casual', emoji: '😊', label: 'Something casual' },
  { id: 'friendship', emoji: '🤝', label: 'Friendship' },
  { id: 'not_sure', emoji: '🤔', label: 'Not sure yet' },
];

const GENDERS = [
  { id: 'male', emoji: '👨', label: 'Man' },
  { id: 'female', emoji: '👩', label: 'Woman' },
  { id: 'non_binary', emoji: '🧑', label: 'Non-binary' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    gender: '',
    age: '',
    looking_for: '',
    relationship_goal: '',
    interests: [] as string[],
    city: '',
    county: '',
    bio: '',
  });

  const update = (k: string, v: any) => setProfile(p => ({ ...p, [k]: v }));
  const toggleInterest = (i: string) => {
    setProfile(p => ({
      ...p,
      interests: p.interests.includes(i)
        ? p.interests.filter(x => x !== i)
        : p.interests.length < 8 ? [...p.interests, i] : p.interests,
    }));
  };

  const COUNTIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Kiambu', 'Machakos', 'Nyeri', 'Meru', 'Embu', 'Garissa', 'Kilifi'];

  const handleFinish = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }
    await supabase.from('profiles').update({
      gender: profile.gender || null,
      age: profile.age ? parseInt(profile.age) : null,
      looking_for: profile.looking_for || null,
      relationship_goal: profile.relationship_goal || null,
      interests: profile.interests,
      city: profile.city || null,
      county: profile.county || null,
      bio: profile.bio || null,
    }).eq('id', user.id);
    router.push('/home');
  };

  const steps = [
    {
      title: 'I am a...',
      subtitle: 'Select your gender',
      canNext: !!profile.gender,
      content: (
        <div className="grid grid-cols-3 gap-3">
          {GENDERS.map(g => (
            <button key={g.id} onClick={() => update('gender', g.id)}
              className={`btn-press flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all ${profile.gender === g.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'}`}>
              <span className="text-4xl">{g.emoji}</span>
              <span className="text-white text-sm font-medium">{g.label}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'How old are you?',
      subtitle: 'You must be 18 or older',
      canNext: parseInt(profile.age) >= 18 && parseInt(profile.age) <= 80,
      content: (
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <input
              type="number"
              min="18" max="80"
              value={profile.age}
              onChange={e => update('age', e.target.value)}
              className="w-40 text-center text-6xl font-heading font-bold bg-transparent text-white border-b-2 border-primary outline-none pb-2"
              placeholder="--"
              autoFocus
            />
          </div>
          <p className="text-gray-500 text-sm">Years old</p>
        </div>
      ),
    },
    {
      title: "I'm interested in...",
      subtitle: 'Who are you looking to meet?',
      canNext: !!profile.looking_for,
      content: (
        <div className="grid grid-cols-3 gap-3">
          {GENDERS.map(g => (
            <button key={g.id} onClick={() => update('looking_for', g.id)}
              className={`btn-press flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all ${profile.looking_for === g.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'}`}>
              <span className="text-4xl">{g.emoji}</span>
              <span className="text-white text-sm font-medium">{g.label}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "I'm looking for...",
      subtitle: 'What kind of relationship?',
      canNext: !!profile.relationship_goal,
      content: (
        <div className="flex flex-col gap-3">
          {GOALS.map(g => (
            <button key={g.id} onClick={() => update('relationship_goal', g.id)}
              className={`btn-press flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${profile.relationship_goal === g.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'}`}>
              <span className="text-3xl">{g.emoji}</span>
              <span className="text-white font-medium text-base">{g.label}</span>
              {profile.relationship_goal === g.id && <span className="ml-auto text-primary">✓</span>}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Your interests',
      subtitle: 'Pick up to 8 things you love',
      canNext: profile.interests.length >= 3,
      content: (
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {INTERESTS.map(i => (
              <button key={i} onClick={() => toggleInterest(i)}
                className={`btn-press px-3 py-2 rounded-full text-sm border transition-all ${profile.interests.includes(i) ? 'border-primary bg-primary/15 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                {i}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center">{profile.interests.length}/8 selected · pick at least 3</p>
        </div>
      ),
    },
    {
      title: 'Where are you?',
      subtitle: 'Helps find people near you',
      canNext: !!profile.county,
      content: (
        <div className="space-y-4">
          <input
            className="app-input"
            placeholder="City (e.g. Westlands)"
            value={profile.city}
            onChange={e => update('city', e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {COUNTIES.map(c => (
              <button key={c} onClick={() => update('county', c)}
                className={`btn-press px-3 py-2.5 rounded-xl text-sm border transition-all ${profile.county === c ? 'border-primary bg-primary/15 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'About you',
      subtitle: 'Write a short bio (optional)',
      canNext: true,
      content: (
        <div>
          <textarea
            className="app-input resize-none h-32"
            placeholder="Tell others something interesting about yourself..."
            value={profile.bio}
            onChange={e => update('bio', e.target.value)}
            maxLength={300}
            autoFocus
          />
          <p className="text-right text-gray-600 text-xs mt-2">{profile.bio.length}/300</p>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="screen bg-[#0A0A0F]">
      {/* Header */}
      <div className="px-5 pt-safe pb-2">
        <div className="flex items-center gap-4 mb-4">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center btn-press">
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
          <div className="flex-1">
            {/* Progress bar */}
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <span className="text-gray-500 text-xs">{step + 1}/{steps.length}</span>
        </div>
      </div>

      <div className="px-6 pb-10 flex flex-col" style={{ minHeight: 'calc(100dvh - 90px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
            className="flex-1"
          >
            <h2 className="font-heading font-bold text-3xl text-white mb-1 tracking-tight">{current.title}</h2>
            <p className="text-gray-400 mb-7 text-base">{current.subtitle}</p>
            {current.content}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 space-y-3">
          <button
            disabled={!current.canNext || saving}
            onClick={() => isLast ? handleFinish() : setStep(s => s + 1)}
            className={`btn-press w-full h-14 rounded-2xl font-heading font-bold text-lg flex items-center justify-center gap-2 transition-opacity ${current.canNext ? 'gradient-primary text-white shadow-xl shadow-primary/30' : 'bg-white/10 text-white/30'}`}
          >
            {saving
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : isLast ? 'Start Matching 🔥' : <><span>Continue</span><ArrowRight size={20} /></>
            }
          </button>
          {!isLast && (
            <button onClick={() => isLast ? handleFinish() : setStep(s => s + 1)}
              className="w-full text-center text-gray-500 text-sm py-2">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
