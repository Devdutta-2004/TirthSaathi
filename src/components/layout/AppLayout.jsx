import React, { useState } from 'react';
import { useYatra } from '../../context/YatraContext';
import { festivalThemes } from '../../services/themeManager';
import {
  Home,
  Users,
  Compass,
  MapPin,
  Sparkles,
  Calendar,
  Bot,
  ShieldAlert,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  Eye,
  Flame,
  Palette,
  QrCode,
  Radio,
  Scan,
  X,
  Navigation,
  Activity,
  Ticket
} from 'lucide-react';

export const AppLayout = ({ children }) => {
  const {
    currentScreen,
    setCurrentScreen,
    seniorMode,
    setSeniorMode,
    festivalTheme,
    setFestivalTheme,
    networkStatus,
    setNetworkStatus,
    activeTemple,
    setActiveModal
  } = useYatra();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home (Dham)', icon: Home, badge: null },
    { id: 'punarmilan', label: 'PunarMilan AI', icon: Scan, badge: 'Face AI', badgeColor: 'bg-amber-500 text-navy-950' },
    { id: 'finder', label: 'Family Live Radar', icon: Users, badge: 'Radar', badgeColor: 'bg-amber-600 text-white' },
    { id: 'crowd', label: 'TirthSaathi Flow', icon: Compass, badge: 'ML Router', badgeColor: 'bg-amber-700 text-white' },
    { id: 'nearby', label: 'Annakshetra & Bhandaras', icon: MapPin, badge: null },
    { id: 'explore', label: 'Sacred Temples', icon: Sparkles, badge: null },
    { id: 'events', label: 'Aarti & Utsav', icon: Calendar, badge: 'Live' },
    { id: 'ai', label: 'AI Margdarshak', icon: Bot, badge: '24x7' },
    { id: 'emergency', label: 'Emergency SOS', icon: ShieldAlert, badge: null, isDanger: true },
    { id: 'authority', label: 'Command Center', icon: Building2, badge: 'Trust', badgeColor: 'bg-amber-400 text-navy-950' },
    { id: 'profile', label: 'Yatra Pass & Profile', icon: User, badge: null },
  ];

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'punarmilan', label: 'PunarMilan', icon: Scan },
    { id: 'crowd', label: 'Crowd Flow', icon: Compass, isCenterHero: true },
    { id: 'finder', label: 'Family Radar', icon: Users },
    { id: 'profile', label: 'Yatra Pass', icon: User },
  ];

  const currentThemeObj = festivalThemes[festivalTheme] || festivalThemes.default;

  return (
    <div className="min-h-screen bg-amber-50/20 flex flex-col md:flex-row text-amber-950 antialiased font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP / TABLET ROYAL NAVY & SAFFRON SIDEBAR
      ───────────────────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col justify-between glass-gold-sidebar transition-all duration-300 z-30 sticky top-0 h-screen text-white ${
          sidebarCollapsed ? 'w-20' : 'w-68'
        }`}
      >
        {/* Top: Brand Logo & Active Yatra with Heritage Mandala Overlay */}
        <div className="p-4 border-b border-amber-500/25 relative overflow-hidden">
          {/* Sacred Mandala Line Art SVG Background */}
          <div className="absolute -right-10 -top-10 w-44 h-44 pointer-events-none opacity-20 text-amber-300">
            <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
              <circle cx="100" cy="100" r="20" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="40" />
              <circle cx="100" cy="100" r="60" strokeDasharray="4 2" />
              <circle cx="100" cy="100" r="85" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <path key={angle} d="M 100 100 Q 125 75 150 100 Q 125 125 100 100" transform={`rotate(${angle} 100 100)`} />
              ))}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <line key={angle} x1="100" y1="100" x2="100" y2="190" transform={`rotate(${angle} 100 100)`} strokeWidth="0.8" strokeOpacity="0.5" />
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <button
              onClick={() => setCurrentScreen('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <img
                src="/images/tirthsaathi_logo.png"
                alt="TirthSaathi Logo"
                className="w-10 h-10 rounded-2xl object-cover shadow-md flex-shrink-0 border border-amber-400/40"
              />
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-black text-lg text-white tracking-tight leading-none">
                    TirthSaathi
                  </span>
                  <span className="text-[10px] text-amber-300/80 font-medium tracking-wide mt-0.5">
                    Smart Pilgrimage Guide
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-xl text-amber-300/70 hover:text-amber-200 hover:bg-white/10 transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Shrine Badge */}
          {!sidebarCollapsed && (
            <div className="mt-3 p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-between text-xs backdrop-blur-sm relative z-10">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="font-bold text-white truncate text-xs">{activeTemple.name}</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono font-bold uppercase">Live</span>
            </div>
          )}
          {/* Bottom Gold Glow Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        </div>

        {/* Center: App Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 font-bold shadow-sm'
                    : item.isDanger
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-navy-950' : 'text-amber-400'}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate text-left">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono ${item.badgeColor || 'bg-white/20 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Controls: Senior Mode, Theme, Network Status */}
        <div className="p-3 border-t border-amber-500/20 space-y-2 bg-navy-950/60">
          {/* Senior Mode Toggle */}
          <button
            onClick={() => setSeniorMode(!seniorMode)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              seniorMode
                ? 'bg-amber-400 text-navy-950 border border-amber-300 shadow-sm'
                : 'text-amber-200/80 hover:bg-white/10'
            }`}
            title="Senior Devotee Mode"
          >
            <Eye className="w-4 h-4 text-amber-400 flex-shrink-0" />
            {!sidebarCollapsed && <span>{seniorMode ? 'Senior Mode: ON' : 'Senior Mode'}</span>}
          </button>

          {/* Festival Theme Picker */}
          {!sidebarCollapsed && (
            <div className="relative">
              <button
                onClick={() => setThemePickerOpen(!themePickerOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors border border-amber-500/30"
              >
                <span className="flex items-center gap-1.5 truncate text-[11px]">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">{currentThemeObj.name} Theme</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono">▼</span>
              </button>

              {themePickerOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 p-2 bg-navy-900 border border-amber-500/30 rounded-2xl shadow-xl space-y-1 z-50">
                  {Object.entries(festivalThemes).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setFestivalTheme(key);
                        setThemePickerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors ${
                        festivalTheme === key ? 'bg-amber-500 text-navy-950 font-bold' : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{t.name}</span>
                      <span className="text-[10px] opacity-75">{t.tagline}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE APP TOP HEADER (Deep Royal Navy & Sacred Mandala Art)
      ───────────────────────────────────────────────────────────── */}
      <header className="md:hidden bg-[#071426]/95 backdrop-blur-md text-white sticky top-0 z-40 px-4 py-3 border-b border-amber-500/25 flex items-center justify-between shadow-md relative overflow-hidden">
        {/* Sacred Indian Heritage Mandala Line Art SVG Background */}
        <div className="absolute -right-6 -top-10 w-44 h-44 pointer-events-none opacity-15 text-amber-400">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
            <circle cx="100" cy="100" r="18" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="36" />
            <circle cx="100" cy="100" r="54" strokeDasharray="4 2" />
            <circle cx="100" cy="100" r="76" />
            <circle cx="100" cy="100" r="98" strokeDasharray="2 3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <path key={angle} d="M 100 100 Q 125 75 150 100 Q 125 125 100 100" transform={`rotate(${angle} 100 100)`} />
            ))}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
              <line key={angle} x1="100" y1="100" x2="100" y2="185" transform={`rotate(${angle} 100 100)`} strokeWidth="0.8" strokeOpacity="0.6" />
            ))}
          </svg>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2.5 text-left"
          >
            <img
              src="/images/tirthsaathi_logo.png"
              alt="TirthSaathi Logo"
              className="w-8 h-8 rounded-xl object-cover shadow-sm flex-shrink-0 border border-amber-400/40"
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-base text-white tracking-tight leading-none">
                TirthSaathi
              </span>
              <span className="text-[10px] text-amber-300 font-medium tracking-wide mt-0.5">
                {activeTemple.name}
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {/* Offline Pill */}
          {networkStatus === 'offline' ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/40">
              Offline
            </span>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] text-amber-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeTemple.city || 'Live'}</span>
            </div>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN ACTIVE SCREEN CONTENT
          ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
        {children}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE APP BOTTOM NAVIGATION BAR (Elevated Center Hero)
      ───────────────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#071426]/98 backdrop-blur-xl z-40 px-2 py-1.5 shadow-2xl border-t border-amber-500/30 text-white">
        <div className="grid grid-cols-5 gap-1 items-end">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            // Elevated Hero Center Button (Crowd Flow - Core Feature)
            if (item.isCenterHero) {
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className="relative -mt-6 flex flex-col items-center justify-center group focus:outline-none z-10"
                >
                  {/* Glowing Ambient Halo */}
                  <div
                    className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                      isActive ? 'bg-amber-400/70 opacity-100 scale-125' : 'bg-amber-500/30 opacity-70'
                    }`}
                  />

                  {/* Elevated Round Golden Hero Icon */}
                  <div
                    className={`relative w-13 h-13 rounded-full flex items-center justify-center border-3 border-[#071426] transition-all duration-300 shadow-xl ${
                      isActive
                        ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-navy-950 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                        : 'bg-gradient-to-tr from-amber-600 to-amber-500 text-navy-950 hover:scale-105 shadow-md'
                    }`}
                  >
                    <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'rotate-12 scale-105' : 'group-hover:rotate-6'}`} />
                    {/* Live Pulse Dot */}
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#071426] animate-pulse" />
                  </div>

                  <span className={`text-[10px] mt-0.5 font-black tracking-tight whitespace-nowrap transition-colors ${isActive ? 'text-amber-300 drop-shadow-sm' : 'text-amber-200/90'}`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            // Standard Navigation Tabs
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                  isActive
                    ? 'text-amber-300 font-extrabold scale-105'
                    : 'text-slate-400 hover:text-white font-medium'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-inner' : 'text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5 leading-none font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
