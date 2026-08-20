import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { EventsCarousel } from '../components/home/EventsCarousel';
import {
  Search,
  Users,
  Compass,
  MapPin,
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Flame,
  QrCode,
  HeartPulse,
  Utensils,
  Bot,
  Sun,
  ShieldCheck
} from 'lucide-react';

export const HomeScreen = () => {
  const {
    setCurrentScreen,
    activeTemple,
    setActiveTemple,
    temples,
    familyGroup,
    setActiveModal,
    addToast
  } = useYatra();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const match = temples.find(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match) {
      setActiveTemple(match);
      addToast(`Selected ${match.name}`, `Loaded live telemetry for ${match.city}.`, 'info');
      setCurrentScreen('crowd');
    } else {
      setCurrentScreen('explore');
    }
  };

  // Cultural & Traditional Feature Actions with Gold Accents
  const primaryFeatures = [
    {
      id: 'finder',
      title: 'Family Raksha Finder',
      subtitle: `${familyGroup.members.length} Loved Ones Connected`,
      tag: 'Flagship #1',
      symbol: '👨‍👩‍👧',
      icon: Users,
      gradient: 'from-amber-600 to-gold-700',
      bgGlow: 'bg-gold-500/10 border-gold-500/30',
      onClick: () => setCurrentScreen('finder')
    },
    {
      id: 'crowd',
      title: 'TirthSaathi Flow',
      subtitle: 'Smart Gate & Crowd Router',
      tag: 'Flagship #2',
      symbol: '🧭',
      icon: Compass,
      gradient: 'from-emerald-700 to-teal-800',
      bgGlow: 'bg-emerald-500/10 border-emerald-500/30',
      onClick: () => setCurrentScreen('crowd')
    },
    {
      id: 'nearby',
      title: 'Annakshetra & Bhandara',
      subtitle: 'Free Satvik Prasad & Water',
      tag: 'Seva Finder',
      symbol: '🍛',
      icon: Utensils,
      gradient: 'from-amber-700 to-orange-800',
      bgGlow: 'bg-amber-500/10 border-amber-500/30',
      onClick: () => setCurrentScreen('nearby')
    },
    {
      id: 'emergency',
      title: 'Emergency Kavach',
      subtitle: '1-Touch Police & Medical SOS',
      tag: '24/7 Helpline',
      symbol: '🛡️',
      icon: ShieldAlert,
      gradient: 'from-red-700 to-rose-900',
      bgGlow: 'bg-red-500/10 border-red-500/30',
      onClick: () => setActiveModal('sos'),
      isDanger: true
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-7 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
          1. MAJESTIC TRADITIONAL CALLIGRAPHIC HEADER & DAWN GLOW
      ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl sm:rounded-mandap overflow-hidden shadow-temple border border-gold-500/30 royal-navy-gold-bg text-white p-6 sm:p-8">
        {/* Ambient Sunrise Ghats & Temple Watermark Fading Background */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-screen pointer-events-none">
          <img
            src="/images/hero_pilgrimage.jpg"
            alt="Sacred Varanasi Sunrise"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-gold-950/40 z-0 pointer-events-none" />

        {/* Traditional Mandala & Jali Lattice Overlays */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-mandala-ambient pointer-events-none opacity-40" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Sacred Sanskrit Eyebrow & Brand Crest */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 backdrop-blur-md">
              <span className="text-sm">🕉️</span>
              <span className="font-devanagari text-xs text-gold-300 tracking-wider">
                ॥ तीर्थे सर्वं प्रतिष्ठितम् ॥
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">
                Sacred Yatra Companion
              </span>
            </div>

            {/* Quick Digital Pilgrim Pass Badge */}
            <button
              onClick={() => setActiveModal('digital-id')}
              className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/50 text-gold-200 text-xs font-bold transition-colors shadow-gold-sm"
            >
              <QrCode className="w-4 h-4 text-gold-400" />
              <span>Digital Yatra Pass</span>
            </button>
          </div>

          {/* Majestic Calligraphic Title with Sanskrit Subtitle */}
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-royal font-black tracking-tight text-gold-shine">
                TirthSaathi
              </h1>
              <span className="font-devanagari text-lg sm:text-2xl text-gold-300 font-bold opacity-90 hidden sm:inline">
                (तीर्थसाथी)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-heritage tracking-wide mt-1 max-w-xl">
              "Your Trusted Spiritual Companion — Stay Connected, Safe & Guided Across India's Sacred Corridors."
            </p>
          </div>

          {/* Traditional Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl relative">
            <Search className="w-4 h-4 text-gold-400 absolute left-4 top-5" />
            <input
              type="text"
              placeholder="Search sacred dham, ghat, or mandir (e.g. Kashi, Ayodhya, Tirupati, Haridwar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-3.5 text-xs sm:text-sm rounded-2xl bg-navy-950/80 border border-gold-500/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 shadow-inner backdrop-blur-md"
            />
            <button
              type="submit"
              className="absolute right-2 top-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 font-bold text-xs shadow-gold-sm transition-all"
            >
              Explore
            </button>
          </form>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HORIZONTAL EVENTS & AARTI SPOTLIGHT CAROUSEL
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪔</span>
            <h2 className="text-sm sm:text-base font-bold font-heritage uppercase tracking-wider text-navy-900">
              Live Religious & Cultural Celebrations
            </h2>
          </div>
          <button
            onClick={() => setCurrentScreen('events')}
            className="text-xs font-bold text-gold-800 hover:text-gold-900 flex items-center gap-1 underline"
          >
            <span>View All Aartis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Unique Slideshow Carousel Component */}
        <EventsCarousel />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CULTURAL & TRADITIONAL ACTION CARDS (4 Main Pillars)
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔱</span>
            <h2 className="text-sm sm:text-base font-bold font-heritage uppercase tracking-wider text-navy-900">
              Yatra Raksha & Sacred Assistance
            </h2>
          </div>
          <span className="text-[11px] font-bold text-gold-700 font-devanagari">
            १-स्पर्श सेवा (1-Tap Direct Actions)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={feat.onClick}
                className={`p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-gold-500/60 shadow-sm hover:shadow-gold-md transition-all duration-300 text-left flex flex-col justify-between group transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden`}
              >
                {/* Subtle Traditional Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/5 rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-navy-900 to-navy-800 text-gold-400 border border-gold-500/30 flex items-center justify-center text-xl shadow-gold-sm group-hover:scale-110 transition-transform">
                      <span>{feat.symbol}</span>
                    </div>

                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-200 uppercase font-mono">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-900 text-base font-heritage group-hover:text-gold-700 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {feat.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gold-700 group-hover:text-gold-900">
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. ACTIVE SACRED YATRA SPOTLIGHT CARD
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl sm:rounded-arch border border-gold-500/30 shadow-card overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-12">
          {/* Temple Image */}
          <div className="sm:col-span-5 relative aspect-[16/10] sm:aspect-auto">
            <img
              src={activeTemple.image}
              alt={activeTemple.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-navy-950/80 via-transparent to-transparent" />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold-500 text-navy-950 text-[10px] font-bold uppercase shadow-sm">
              🛕 Active Yatra Dham
            </span>
          </div>

          {/* Temple Details & Gate Flow Trigger */}
          <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gold-700 uppercase tracking-wider font-heritage">
                  {activeTemple.city}, {activeTemple.state}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Crowd: Moderate (62%)
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-heritage text-navy-900 leading-tight">
                {activeTemple.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                {activeTemple.description}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-gold-50/70 p-2.5 rounded-2xl border border-gold-200/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span>Darshan Queue: <strong>~25 min</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Recommended: <strong>Gate B</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setCurrentScreen('crowd')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-yatra-blue hover:bg-navy-900 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-gold-300" />
                <span>Smart Gate Analysis</span>
              </button>

              <button
                onClick={() => setCurrentScreen('nearby')}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-colors"
              >
                Nearby Bhandaras
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TODAY'S VITAL STATUS PILLS (Compact & Meaningful)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Family Pill */}
        <div
          onClick={() => setCurrentScreen('finder')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-gold-400 shadow-sm cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-yatra-blue flex items-center justify-center text-lg shadow-2xs">
            👨‍👩‍👧
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-navy-900 truncate">Family SafeZone Radar</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              4 members in 150m perimeter
            </p>
          </div>
        </div>

        {/* AI Assistant Pill */}
        <div
          onClick={() => setCurrentScreen('ai')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-gold-400 shadow-sm cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center text-lg shadow-2xs">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-navy-900 truncate">AI Yatra Margdarshak</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              24x7 sacred assistant online
            </p>
          </div>
        </div>

        {/* Emergency SOS Pill */}
        <div
          onClick={() => setActiveModal('sos')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-red-400 shadow-sm cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shadow-2xs">
            🚨
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-navy-900 truncate">National Emergency 112</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              Direct police & medical dispatch
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
