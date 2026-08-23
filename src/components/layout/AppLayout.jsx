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
    { id: 'finder', label: 'Radar', icon: Users },
    { id: 'crowd', label: 'Crowd Flow', icon: Compass },
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
        {/* Top: Brand Logo & Active Yatra */}
        <div className="p-4 border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center p-2 shadow-sm text-navy-950 flex-shrink-0 font-bold">
                <Compass className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-royal font-black text-lg text-gold-shine leading-none">
                    TirthSaathi
                  </span>
                  <span className="text-[10px] text-amber-300 font-devanagari tracking-wider mt-0.5">
                    तीर्थसाथी • Yatra PWA
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

          {/* Active Yatra Badge */}
          {!sidebarCollapsed && (
            <div className="mt-3 p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-between text-xs backdrop-blur-sm">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="font-bold text-white truncate font-heritage">{activeTemple.city} Yatra</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono font-bold uppercase">Live</span>
            </div>
          )}
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
          2. MOBILE APP TOP HEADER (Royal Saffron & Navy)
      ───────────────────────────────────────────────────────────── */}
      <header className="md:hidden glass-gold-header sticky top-0 z-40 px-4 py-3 border-b border-amber-500/30 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-royal font-black text-base text-gold-shine leading-none block">
                TirthSaathi
              </span>
              <span className="text-[10px] text-amber-300 font-devanagari font-semibold">
                {activeTemple.city} Yatra
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Offline Pill */}
          {networkStatus === 'offline' && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/40">
              Offline
            </span>
          )}

          {/* Quick SOS Trigger */}
          <button
            onClick={() => setActiveModal('sos')}
            className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN ACTIVE SCREEN CONTENT
          ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
        {children}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE APP BOTTOM NAVIGATION BAR (Single-Color Vector Icons)
      ───────────────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-gold-nav z-40 px-2 py-2 shadow-float text-white border-t border-amber-500/20">
        <div className="grid grid-cols-5 gap-1 items-center">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                  isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-white font-medium'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner' : 'text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5 leading-none font-devanagari">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
