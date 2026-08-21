import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { EventsCarousel } from '../components/home/EventsCarousel';
import {
  Search,
  Users,
  Compass,
  MapPin,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Clock,
  QrCode,
  Scan,
  Radio,
  Eye,
  Utensils
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
      addToast(`Selected ${match.name}`, `Live flow loaded for ${match.city}.`, 'info');
      setCurrentScreen('crowd');
    } else {
      setCurrentScreen('explore');
    }
  };

  const coreFeatures = [
    {
      id: 'punarmilan',
      title: 'PunarMilan AI',
      subtitle: 'Lost Member Face Search',
      badge: 'AI Vision',
      badgeColor: 'bg-gold-500/15 text-gold-700 border-gold-500/30',
      icon: Scan,
      iconBg: 'bg-gold-500/10 text-gold-600',
      symbol: '✨',
      onClick: () => setCurrentScreen('punarmilan'),
      highlight: true
    },
    {
      id: 'finder',
      title: 'Family Live Radar',
      subtitle: `${familyGroup.members.length} Devices Online`,
      badge: 'Live GPS',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
      symbol: '👨‍👩‍👧',
      onClick: () => setCurrentScreen('finder')
    },
    {
      id: 'crowd',
      title: 'Darshan Flow',
      subtitle: 'Smart Gate & Crowd Router',
      badge: '25m Wait',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Compass,
      iconBg: 'bg-emerald-50 text-emerald-600',
      symbol: '🧭',
      onClick: () => setCurrentScreen('crowd')
    },
    {
      id: 'emergency',
      title: 'Emergency SOS',
      subtitle: 'Instant Police & Medical (112)',
      badge: '24/7',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      icon: ShieldAlert,
      iconBg: 'bg-red-50 text-red-600',
      symbol: '🛡️',
      onClick: () => setActiveModal('sos'),
      isDanger: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* ── 1. MINIMAL HERO HEADER ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-6 sm:p-8 border border-slate-800 shadow-sm">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <span>🕉️</span>
              <span className="text-gold-300 font-devanagari">तीर्थसाथी</span>
              <span className="text-white/40">•</span>
              <span className="text-slate-300 text-[11px]">Sacred Companion</span>
            </div>

            <button
              onClick={() => setActiveModal('digital-id')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-gold-300" />
              <span>Pilgrim Pass</span>
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Peace of Mind Across Every Sacred Yatra.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              Find lost loved ones with AI face search, keep family connected on live radar, and navigate temple gates smoothly.
            </p>
          </div>

          {/* Minimal Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative pt-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            <input
              type="text"
              placeholder="Search temple, dham, or ghat (e.g. Kashi, Ayodhya, Tirupati)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 backdrop-blur-md transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-2.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── 2. CORE 4 PILLAR ACTIONS (Minimal Grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {coreFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <button
              key={feat.id}
              onClick={feat.onClick}
              className={`p-4 rounded-2xl bg-white border text-left flex flex-col justify-between transition-all duration-200 hover:shadow-md group relative overflow-hidden ${
                feat.highlight
                  ? 'border-gold-400/80 shadow-xs ring-1 ring-gold-400/30'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${feat.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                </div>

                <h3 className="font-bold text-navy-900 text-sm group-hover:text-gold-700 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {feat.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-navy-900">
                <span className="text-[11px]">Open Feature</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 3. ACTIVE DHAM STATUS (Clean & Compact) ── */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={activeTemple.image}
            alt={activeTemple.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {activeTemple.city}, {activeTemple.state}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-600 font-semibold">Live Telemetry</span>
            </div>
            <h3 className="text-base font-bold text-navy-900 mt-0.5">{activeTemple.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>Darshan Queue: <strong>~25 min</strong></span>
              <span>•</span>
              <span>Best Gate: <strong>Gate B</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setCurrentScreen('crowd')}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-colors"
          >
            Gate Analysis
          </button>
          <button
            onClick={() => setCurrentScreen('nearby')}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-semibold transition-colors"
          >
            Bhandaras
          </button>
        </div>
      </div>

      {/* ── 4. LIVE EVENTS & AARTIS (Clean Spotlight) ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Live Utsav & Aarti Schedule
          </span>
          <button
            onClick={() => setCurrentScreen('events')}
            className="text-xs font-semibold text-gold-800 hover:text-gold-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <EventsCarousel />
      </div>
    </div>
  );
};
