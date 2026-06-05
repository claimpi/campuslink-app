'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Plus, X, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const INTERESTS = [
  '🎵 Music', '🎬 Movies', '📚 Books', '🎮 Gaming', '✈️ Travel',
  '🍕 Food', '💪 Fitness', '🎨 Art', '📸 Photography', '🌿 Nature',
  '🏄 Sports', '💃 Dancing', '🧘 Yoga', '🍳 Cooking', '🌍 Culture',
  '🎸 Guitar', '🏋️ Gym', '🎤 Singing', '🏕️ Camping', '☕ Coffee',
];

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    };
    load();
  }, []);

  const update = (k: string, v: any) => setProfile((p: any) => ({ ...p, [k]: v }));

  const toggleInterest = (i: string) => {
    const cur = profile?.interests || [];
    update('interests', cur.includes(i) ? cur.filter((x: string) => x !== i) : cur.length < 8 ? [...cur, i] : cur);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({
      full_name: profile.full_name,
      bio: profile.bio,
      age: profile.age,
      occupation: profile.occupation,
      university: profile.university,
      city: profile.city,
      county: profile.county,
      height_cm: profile.height_cm,
      interests: profile.interests,
      relationship_goal: profile.relationship_goal,
    }).eq('id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.back(); }, 800);
  };

  if (!profile) return (
    <div className="screen bg-[#0A0A0F] flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const Field = ({ label, value, onChange, placeholder, type = 'text', multiline = false }: any) => (
    <div className="mb-4">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
      {multiline ? (
        <textarea
          className="app-input resize-none h-24"
          placeholder={placeholder}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          maxLength={300}
        />
      ) : (
        <input
          className="app-input"
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="screen bg-[#0A0A0F] pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-safe pb-4 sticky top-0 bg-[#0A0A0F]/95 backdrop-blur-xl z-10 border-b border-white/5">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center btn-press">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="font-heading font-bold text-xl text-white flex-1">Edit Profile</h1>
        <button onClick={handleSave} disabled={saving}
          className={`px-4 py-2 rounded-2xl font-semibold text-sm btn-press transition-all ${saved ? 'bg-green-500 text-white' : 'gradient-primary text-white'}`}>
          {saving ? '...' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      <div className="px-5 pt-4">
        {/* Photos */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Photos ({(profile.photos || []).length}/10)</p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => {
              const photo = profile.photos?.[i];
              return (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                  {photo ? (
                    <>
                      <img src={photo} className="w-full h-full object-cover" alt="" />
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded-md bg-primary/90 text-white font-semibold">Main</span>}
                      <button
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
                        onClick={() => {
                          const photos = [...(profile.photos || [])];
                          photos.splice(i, 1);
                          update('photos', photos);
                        }}
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <Plus size={22} className="text-gray-600" />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-gray-600 text-xs mt-2">Tap + to add photos (feature requires native app)</p>
        </div>

        {/* Basic info */}
        <Field label="Full Name" value={profile.full_name} onChange={(v: string) => update('full_name', v)} placeholder="Your full name" />
        <Field label="Bio" value={profile.bio} onChange={(v: string) => update('bio', v)} placeholder="Tell others about yourself..." multiline />
        <Field label="Age" value={profile.age} onChange={(v: string) => update('age', v)} placeholder="Your age" type="number" />
        <Field label="Occupation" value={profile.occupation} onChange={(v: string) => update('occupation', v)} placeholder="What do you do?" />
        <Field label="University / School" value={profile.university} onChange={(v: string) => update('university', v)} placeholder="Where do you study?" />
        <Field label="City" value={profile.city} onChange={(v: string) => update('city', v)} placeholder="Your city" />
        <Field label="Height (cm)" value={profile.height_cm} onChange={(v: string) => update('height_cm', v)} placeholder="e.g. 170" type="number" />

        {/* Interests */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Interests ({(profile.interests || []).length}/8)
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => (
              <button key={i} onClick={() => toggleInterest(i)}
                className={`btn-press px-3 py-2 rounded-full text-sm border transition-all ${(profile.interests || []).includes(i) ? 'border-primary bg-primary/15 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Relationship goal */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Looking for</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'serious', label: '💍 Serious relationship' },
              { id: 'casual', label: '😊 Something casual' },
              { id: 'friendship', label: '🤝 Friendship' },
              { id: 'not_sure', label: '🤔 Not sure yet' },
            ].map(g => (
              <button key={g.id} onClick={() => update('relationship_goal', g.id)}
                className={`btn-press py-3 px-4 rounded-2xl text-sm border text-left transition-all ${profile.relationship_goal === g.id ? 'border-primary bg-primary/10 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
