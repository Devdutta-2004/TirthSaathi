import React, { useState, useEffect } from 'react';
import { useYatra } from '../context/YatraContext';
import {
  ShieldAlert,
  Users,
  Menu,
  X,
  HeartHandshake,
  QrCode,
  Eye,
  Globe,
  ChevronDown,
  PhoneCall
} from 'lucide-react';

export const Navbar = () => {
  const { elderlyMode, setElderlyMode, setActiveModal, language, setLanguage } = useYatra();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'destinations', label: 'Explore Yatras', href: '#destinations' },
    { id: 'safety', label: 'Safety First', href: '#safety' },
    { id: 'find-people', label: 'Find My People', href: '#find-people' },
    { id: 'lost-found', label: 'Lost & Found', href: '#lost-found' },
    { id: 'bhandaras', label: 'Bhandaras & Food', href: '#bhandaras' },
    { id: 'events', label: 'Events & Aarti', href: '#events' },
    { id: 'elderly', label: 'Elderly Care', href: '#elderly' },
  ];

  const handleNavClick = (id, href) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-header py-3 shadow-soft border-b border-slate-100/80'
          : 'bg-white/95 py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* BRAND LOGO */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home', '#home');
          }}
          className="flex items-center gap-2.5 group"
        >
          {/* Custom SVG Temple & Pin Brand Mark */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-navy-800 to-yatra-blue flex items-center justify-center p-2 shadow-card group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
              <path d="M24 6C16 6 10 12 10 20c0 9 13 20 14 21 .5.4 1.5.4 2 0 1-1 14-12 14-21 0-8-6-14-14-14z" fill="#EAF5FF" opacity="0.25"/>
              <path d="M24 7C17 7 12 12.5 12 19.5c0 7.5 10.5 16 12 17.5 1.5-1.5 12-10 12-17.5C36 12.5 31 7 24 7z" fill="url(#navGrad)"/>
              <path d="M24 11L21 16H27L24 11Z" fill="#F6C453"/>
              <circle cx="24" cy="9.5" r="1.5" fill="#F59E0B"/>
              <path d="M20 17H28V24H20V17Z" fill="#FFFFFF"/>
              <path d="M22 24V20C22 19 23 18.5 24 18.5C25 18.5 26 19 26 20V24" fill="#1261C9"/>
              <defs>
                <linearGradient id="navGrad" x1="12" y1="7" x2="36" y2="37" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1683E8"/>
                  <stop offset="1" stopColor="#0B2545"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-display font-black text-xl tracking-tight text-navy-900 leading-none">
                Tirth<span className="text-yatra-blue">Saathi</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-yatra-saffron animate-pulse" />
            </div>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase leading-tight mt-0.5">
              Saath Aapke Safar Mein
            </span>
          </div>
        </a>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id, link.href);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-yatra-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-200/50'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Elderly Mode Quick Toggle */}
          <button
            onClick={() => setElderlyMode(!elderlyMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              elderlyMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Toggle Large Easy Fonts for Senior Pilgrims"
          >
            <Eye className="w-3.5 h-3.5 text-yatra-saffron" />
            <span>{elderlyMode ? 'Elderly Mode: ON' : 'Elderly Mode'}</span>
          </button>

          {/* Digital ID QR Pass button */}
          <button
            onClick={() => setActiveModal('digital-id')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 hover:bg-yatra-light text-navy-800 border border-slate-200 hover:border-yatra-blue/40 transition-colors"
            title="View Your Digital Pilgrim ID Pass"
          >
            <QrCode className="w-3.5 h-3.5 text-yatra-blue" />
            <span>Pilgrim Pass</span>
          </button>

          {/* Language Picker */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-100 border border-transparent transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-card border border-slate-100 py-1.5 z-50">
                {['English', 'हिन्दी (Hindi)', 'தமிழ் (Tamil)', 'తెలుగు (Telugu)'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang.split(' ')[0]);
                      setLangDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-yatra-light hover:text-yatra-blue font-medium"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Help & Emergency SOS Button */}
          <button
            onClick={() => setActiveModal('sos')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 animate-pulse-subtle"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Help & SOS</span>
          </button>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setActiveModal('sos')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-6 py-5 shadow-2xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.id, link.href);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-yatra-light text-yatra-blue font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-yatra-blue" />}
                </a>
              );
            })}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setElderlyMode(!elderlyMode);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold"
              >
                <Eye className="w-4 h-4 text-yatra-saffron" />
                <span>{elderlyMode ? 'Elderly Mode: Enabled' : 'Enable Elderly Easy Mode'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('digital-id');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-yatra-light text-yatra-blue text-xs font-bold border border-yatra-blue/20"
              >
                <QrCode className="w-4 h-4" />
                <span>View Digital Pilgrim Pass</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('sos');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 text-white text-sm font-bold shadow-md"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Trigger Emergency SOS (112 / 108)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
