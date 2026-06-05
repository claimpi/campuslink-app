'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Heart, MapPin, Shield, Zap } from 'lucide-react';

export default function SplashPage() {
  return (
    <div className="screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Bg orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/25 blur-[80px]" />
        <div className="absolute bottom-40 left-0 w-56 h-56 rounded-full bg-secondary/20 blur-[70px]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-20 pb-10 relative">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-20 h-20 rounded-[28px] gradient-primary flex items-center justify-center mb-5 shadow-2xl shadow-primary/40">
            <span className="text-4xl">💘</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl tracking-tight text-center">
            Campus<span className="text-primary">Link</span>
          </h1>
          <p className="text-gray-400 mt-2 text-center text-base">Find your match in Kenya 🇰🇪</p>
        </motion.div>

        {/* Phone mockup cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-64 flex items-center justify-center mb-12"
        >
          {/* Back card */}
          <div className="absolute w-48 h-64 rounded-3xl bg-[#1C1C27] border border-white/10 rotate-[-8deg] translate-x-6 translate-y-2" />
          {/* Front card */}
          <div className="relative w-48 h-64 rounded-3xl bg-gradient-to-b from-[#2a1020] to-[#1a1030] border border-white/10 overflow-hidden rotate-[3deg] shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center text-7xl">👩</div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="font-heading font-bold text-white text-lg">Amara, 22</p>
              <p className="text-white/60 text-xs flex items-center gap-1">
                <MapPin size={10} /> Nairobi · 2km
              </p>
            </div>
            {/* Like stamp */}
            <div className="absolute top-6 left-3 border-2 border-green-400 rounded-lg px-2 py-0.5 rotate-[-15deg]">
              <span className="text-green-400 font-heading font-bold text-sm tracking-widest">LIKE</span>
            </div>
          </div>
          {/* Buttons */}
          <div className="absolute -bottom-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-red-400/30 flex items-center justify-center shadow-lg">
              <span className="text-primary font-bold text-xl">✕</span>
            </div>
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-xl shadow-primary/40">
              <Heart size={24} fill="white" className="text-white" />
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { icon: <MapPin size={18} />, label: 'Nearby matches', color: 'text-primary' },
            { icon: <Shield size={18} />, label: 'Verified profiles', color: 'text-green-400' },
            { icon: <Zap size={18} />, label: 'M-Pesa coins', color: 'text-yellow-400' },
          ].map((f) => (
            <div key={f.label} className="app-card p-3 flex flex-col items-center gap-2 text-center">
              <span className={f.color}>{f.icon}</span>
              <span className="text-[11px] text-gray-400 leading-tight">{f.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-3 mt-auto"
        >
          <Link href="/auth/register"
            className="btn-press w-full h-14 rounded-2xl gradient-primary text-white font-heading font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/30">
            Create Account <ArrowRight size={20} />
          </Link>
          <Link href="/auth/login"
            className="btn-press w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-base flex items-center justify-center">
            Sign In
          </Link>
        </motion.div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
