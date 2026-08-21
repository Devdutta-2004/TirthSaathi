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
  X
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
    { id: 'home', label: 'Home (Dham)', icon: Home, symbol: '🛕', badge: null },
    { id: 'punarmilan', label: 'PunarMilan AI', icon: Scan, symbol: '✨', badge: 'Face AI', badgeColor: 'bg-gold-500 text-navy-950' },
    { id: 'finder', label: 'Family Live Radar', icon: Users, symbol: '👨‍👩‍👧', badge: 'Radar', badgeColor: 'bg-blue-600 text-white' },
    { id: 'crowd', label: 'TirthSaathi Flow', icon: Compass, symbol: '🧭', badge: 'Smart Gate', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'nearby', label: 'Annakshetra & Bhandaras', icon: MapPin, symbol: '🍛', badge: null },
    { id: 'explore', label: 'Sacred Temples', icon: Sparkles, symbol: '🕉️', badge: null },
    { id: 'events', label: 'Aarti & Utsav', icon: Calendar, symbol: '🪔', badge: 'Live' },
    { id: 'ai', label: 'AI Margdarshak', icon: Bot, symbol: '🤖', badge: '24x7' },
    { id: 'emergency', label: 'Emergency SOS', icon: ShieldAlert, symbol: '🛡️', badge: null, isDanger: true },
    { id: 'authority', label: 'Command Center', icon: Building2, symbol: '🏛️', badge: 'Trust', badgeColor: 'bg-gold-400 text-navy-950' },
    { id: 'profile', label: 'Yatra Pass & Profile', icon: User, symbol: '📜', badge: null },
  ];

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Home, symbol: '🛕' },
    { id: 'punarmilan', label: 'PunarMilan', icon: Scan, symbol: '✨' },
    { id: 'finder', label: 'Radar', icon: Users, symbol: '👨‍👩‍👧' },
    { id: 'crowd', label: 'Flow', icon: Compass, symbol: '🧭' },
    { id: 'profile', label: 'Pass', icon: User, symbol: '📜' },
  ];

  const currentThemeObj = festivalThemes[festivalTheme] || festivalThemes.default;

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col md:flex-row text-navy-900 antialiased font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP / TABLET ROYAL NAVY & GOLD SIDEBAR
      ───────────────────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col justify-between glass-gold-sidebar transition-all duration-300 z-30 sticky top-0 h-screen text-white ${
          sidebarCollapsed ? 'w-20' : 'w-68'
        }`}
      >
        {/* Top: Brand Logo & Active Yatra */}
        <div className="p-4 border-b border-gold-500/20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-500 to-amber-600 flex items-center justify-center p-2 shadow-gold-sm text-navy-950 flex-shrink-0 font-bold text-xl">
                <span>🛕</span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-royal font-black text-lg text-gold-shine leading-none">
                    TirthSaathi
                  </span>
                  <span className="text-[10px] text-gold-300 font-devanagari tracking-wider mt-0.5">
                    तीर्थसाथी • Yatra PWA
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-xl text-gold-300/70 hover:text-gold-200 hover:bg-white/10 transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Yatra Badge */}
          {!sidebarCollapsed && (
            <div className="mt-3 p-2.5 rounded-2xl bg-gold-500/15 border border-gold-400/30 flex items-center justify-between text-xs backdrop-blur-sm">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="font-bold text-white truncate font-heritage">{activeTemple.city} Yatra</span>
              </div>
              <span className="text-[10px] text-gold-300 font-mono font-bold uppercase">Live</span>
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
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-navy-950 font-bold shadow-gold-sm'
                    : item.isDanger
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="text-base flex-shrink-0">{item.symbol}</span>
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
        <div className="p-3 border-t border-gold-500/20 space-y-2 bg-navy-950/60">
          {/* Senior Mode Toggle */}
          <button
            onClick={() => setSeniorMode(!seniorMode)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              seniorMode
                ? 'bg-gold-400 text-navy-950 border border-gold-300 shadow-gold-sm'
                : 'text-gold-200/80 hover:bg-white/10'
            }`}
            title="Senior Devotee Mode"
          >
            <Eye className="w-4 h-4 text-gold-400 flex-shrink-0" />
            {!sidebarCollapsed && <span>{seniorMode ? 'Senior Mode: ON' : 'Senior Mode'}</span>}
          </button>

          {/* Festival Theme Picker */}
          {!sidebarCollapsed && (
            <div className="relative">
              <button
                onClick={() => setThemePickerOpen(!themePickerOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors border border-gold-500/30"
              >
                <span className="flex items-center gap-1.5 truncate text-[11px]">
                  <Palette className="w-3.5 h-3.5 text-gold-400" />
                  <span className="truncate">{currentThemeObj.badge}</span>
                </span>
                <span className="text-[10px] text-gold-400">▼</span>
              </button>

              {themePickerOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-navy-900 rounded-2xl shadow-card border border-gold-500/40 p-1.5 z-50 space-y-1">
                  {Object.values(festivalThemes).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setFestivalTheme(t.id);
                        setThemePickerOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        festivalTheme === t.id
                          ? 'bg-gold-500 text-navy-950 font-bold'
                          : 'text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span>{t.badge}</span>
                      <span className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: t.primary }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Network Status Indicator */}
          <div className={`p-2 rounded-xl flex items-center justify-between text-[11px] font-bold ${
            networkStatus === 'online'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
              : networkStatus === 'offline'
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
              : 'bg-blue-950/60 text-sky-300 border border-sky-500/40'
          }`}>
            <div className="flex items-center gap-1.5">
              {networkStatus === 'online' ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              )}
              {!sidebarCollapsed && (
                <span>
                  {networkStatus === 'online' ? 'Online Mesh' : networkStatus === 'offline' ? 'Offline Cached' : 'Syncing...'}
                </span>
              )}
            </div>

            <button
              onClick={() => setNetworkStatus(networkStatus === 'online' ? 'offline' : 'online')}
              className="text-[9px] underline text-gold-300 hover:text-white cursor-pointer"
              title="Simulate network state change"
            >
              {!sidebarCollapsed ? (networkStatus === 'online' ? 'Sim Offline' : 'Go Online') : '⇄'}
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE APP TOP HEADER (Royal Gold & Navy)
      ───────────────────────────────────────────────────────────── */}
      <header className="md:hidden glass-gold-header sticky top-0 z-40 px-4 py-3 border-b border-gold-500/30 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-600 flex items-center justify-center text-navy-950 font-bold shadow-gold-sm">
              <span>🛕</span>
            </div>
            <div>
              <span className="font-royal font-black text-base text-gold-shine leading-none block">
                TirthSaathi
              </span>
              <span className="text-[10px] text-gold-300 font-devanagari font-semibold">
                {activeTemple.city} Yatra
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Offline Pill */}
          {networkStatus === 'offline' && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/40">
              🟠 Offline
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
      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto bg-heritage-jali">
        {children}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE APP BOTTOM NAVIGATION BAR (Royal Navy & Gold)
      ───────────────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-gold-nav z-40 px-2 py-2 shadow-float text-white">
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
                    ? 'text-gold-300 font-bold scale-105'
                    : 'text-slate-400 hover:text-white font-medium'
                }`}
              >
                <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner' : ''}`}>
                  <span className="text-base leading-none block">{item.symbol}</span>
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
