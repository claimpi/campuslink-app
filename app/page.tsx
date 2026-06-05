'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Star, Shield, Zap, Download, ArrowRight, MapPin, Users, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-dark">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💘</span>
          <span className="font-heading font-bold text-xl">Campus<span className="text-primary">Link</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn-press px-5 py-2 rounded-full text-sm font-semibold gradient-primary text-white">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-secondary/20 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-sm text-gray-300 mb-8 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              🇰🇪 Made for Kenya
            </div>

            <h1 className="font-heading font-extrabold text-5xl md:text-7xl leading-tight mb-6 tracking-tight">
              Find Your
              <span className="block bg-gradient-to-r from-primary via-[#FF6B35] to-[#FFD700] bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The premium dating platform built for Kenyan young adults. Real connections, real people, near you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/auth/register" className="btn-press w-full sm:w-auto px-8 py-4 rounded-2xl gradient-primary text-white font-heading font-bold text-lg flex items-center justify-center gap-2 shadow-2xl shadow-primary/30">
                Start for Free <ArrowRight size={20} />
              </Link>
              <a
                href="#download"
                className="btn-press w-full sm:w-auto px-8 py-4 rounded-2xl glass-dark text-white font-semibold text-lg flex items-center justify-center gap-2 border border-white/10"
              >
                <Download size={20} /> Get the App
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-16 text-center">
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '12K+', label: 'Matches Made' },
                { value: '47', label: 'Counties' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading font-bold text-2xl md:text-3xl text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating cards preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative mt-20 h-80 flex items-center justify-center"
          >
            {/* Back card */}
            <div className="absolute w-56 h-72 rounded-3xl bg-gradient-to-b from-[#2a1a2e] to-[#1a1020] border border-white/10 rotate-[-8deg] translate-x-8 translate-y-2 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-6xl opacity-40">👩</div>
            </div>
            {/* Front card */}
            <div className="relative w-56 h-72 rounded-3xl bg-gradient-to-b from-[#2a1a2e] to-[#1a1020] border border-white/10 overflow-hidden shadow-2xl rotate-[3deg]">
              <div className="absolute inset-0 flex items-center justify-center text-7xl">👩</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-heading font-bold text-lg">Amara, 22</div>
                <div className="text-xs text-white/60 flex items-center gap-1 mt-1">
                  <MapPin size={10} /> Nairobi · 2 km
                </div>
                <div className="flex gap-2 mt-2">
                  {['🎵 Music', '✈️ Travel'].map(t => (
                    <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/15">{t}</span>
                  ))}
                </div>
              </div>
              {/* Like stamp */}
              <div className="absolute top-6 left-4 border-2 border-green-400 rounded px-2 py-0.5 rotate-[-15deg]">
                <span className="text-green-400 font-heading font-bold text-xs tracking-widest">LIKE</span>
              </div>
            </div>
            {/* Action buttons */}
            <div className="absolute -bottom-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1C1C27] border border-white/10 flex items-center justify-center text-primary shadow-lg">✕</div>
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-xl shadow-primary/40">
                <Heart size={24} fill="white" className="text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C9FF] to-[#0066FF] flex items-center justify-center shadow-lg">
                <Star size={18} fill="white" className="text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4 tracking-tight">
              Why CampusLink?
            </h2>
            <p className="text-gray-400 text-lg">Built different. Built for you.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <MapPin size={28} />, color: 'text-primary', bg: 'bg-primary/10', title: 'Find Nearby', desc: 'GPS-based matching shows you people within your distance preference across all 47 Kenyan counties.' },
              { icon: <Shield size={28} />, color: 'text-green-400', bg: 'bg-green-400/10', title: 'Verified Profiles', desc: 'AI-powered photo verification and manual review to ensure every profile is real and authentic.' },
              { icon: <Zap size={28} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'Campus Coins', desc: 'Virtual currency for Super Likes, Profile Boosts, and exclusive gifts. Buy via M-Pesa.' },
              { icon: <Heart size={28} />, color: 'text-pink-400', bg: 'bg-pink-400/10', title: 'Smart Matching', desc: 'Algorithm scores compatibility by interests, location, activity, and relationship goals.' },
              { icon: <Users size={28} />, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Real Connections', desc: 'Matched users unlock real-time chat with images, voice notes, and virtual gifts.' },
              { icon: <Sparkles size={28} />, color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'Premium Plans', desc: 'Silver, Gold, and Platinum tiers unlock unlimited likes, see who liked you, and more.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[#13131A] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download section */}
      <section id="download" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10"
          >
            <div className="text-5xl mb-4">📱</div>
            <h2 className="font-heading font-bold text-4xl mb-4 tracking-tight">
              Add to Your Phone
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Install CampusLink directly from your browser — no app store needed.
              Works like a native app on Android and iPhone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="px-6 py-4 rounded-2xl bg-[#1C1C27] border border-white/10 text-left">
                <div className="font-semibold mb-1">📱 Android</div>
                <div className="text-sm text-gray-400">Tap <strong>⋮ Menu</strong> → "Add to Home Screen"</div>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-[#1C1C27] border border-white/10 text-left">
                <div className="font-semibold mb-1">🍎 iPhone</div>
                <div className="text-sm text-gray-400">Tap <strong>Share</strong> → "Add to Home Screen"</div>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-white font-heading font-bold text-lg btn-press shadow-xl shadow-primary/30">
                Start Matching Now <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl">💘</span>
          <span className="font-heading font-bold text-white">CampusLink</span>
        </div>
        <div className="flex items-center justify-center gap-6 mb-4">
          {['Privacy Policy', 'Terms of Service', 'Safety', 'Contact'].map(l => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <p>© 2024 CampusLink Kenya. Made with ❤️ in Nairobi 🇰🇪</p>
      </footer>
    </div>
  );
}
