'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill all fields'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          username: form.fullName.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).slice(2, 6),
        },
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/auth/onboarding');
  };

  const steps = [
    {
      title: "What's your name?",
      subtitle: 'This is how you\'ll appear to others',
      content: (
        <div className="relative">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="app-input pl-11"
            placeholder="Full name"
            value={form.fullName}
            onChange={e => update('fullName', e.target.value)}
            autoFocus
          />
        </div>
      ),
      canNext: form.fullName.trim().length >= 2,
    },
    {
      title: 'Your email',
      subtitle: "We'll use this to verify your account",
      content: (
        <div className="relative">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="app-input pl-11"
            placeholder="Email address"
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            autoFocus
          />
        </div>
      ),
      canNext: /\S+@\S+\.\S+/.test(form.email),
    },
    {
      title: 'Create a password',
      subtitle: 'At least 6 characters',
      content: (
        <div className="relative">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="app-input pl-11 pr-12"
            placeholder="Password"
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={e => update('password', e.target.value)}
            autoFocus
          />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      ),
      canNext: form.password.length >= 6,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="screen bg-[#0A0A0F]">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-safe pb-4">
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
          className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center btn-press"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        {/* Progress dots */}
        <div className="flex gap-2 flex-1 justify-center">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/50' : 'w-4 bg-white/15'}`} />
          ))}
        </div>
        <div className="w-10" />
      </div>

      <div className="px-6 pt-8 pb-10 flex flex-col min-h-[calc(100dvh-80px)]">
        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <h2 className="font-heading font-bold text-3xl text-white mb-2 tracking-tight">
              {current.title}
            </h2>
            <p className="text-gray-400 mb-8 text-base">{current.subtitle}</p>

            {current.content}

            {error && (
              <div className="mt-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next/Submit button */}
        <button
          disabled={!current.canNext || loading}
          onClick={() => isLast ? handleRegister() : setStep(s => s + 1)}
          className={`btn-press w-full h-14 rounded-2xl font-heading font-bold text-lg flex items-center justify-center gap-2 transition-opacity ${current.canNext ? 'gradient-primary text-white shadow-xl shadow-primary/30' : 'bg-white/10 text-white/30'}`}
        >
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : isLast ? 'Create Account 🎉' : <><span>Continue</span><ArrowRight size={20} /></>
          }
        </button>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{' '}
          <button onClick={() => router.push('/auth/login')} className="text-primary font-semibold">Sign In</button>
        </p>
      </div>
    </div>
  );
}
