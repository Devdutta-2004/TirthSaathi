import React from 'react';
import { useYatra } from '../context/YatraContext';
import { PhoneCall, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const { setActiveModal } = useYatra();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-yatra-blue flex items-center justify-center p-1.5 shadow-md">
                <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                  <path d="M24 7C17 7 12 12.5 12 19.5c0 7.5 10.5 16 12 17.5 1.5-1.5 12-10 12-17.5C36 12.5 31 7 24 7z" fill="white"/>
                  <path d="M24 11L21 16H27L24 11Z" fill="#F6C453"/>
                  <circle cx="24" cy="9.5" r="1.5" fill="#F59E0B"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Tirth<span className="text-yatra-sky">Saathi</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Technology that keeps pilgrims connected, informed, and safe across India's most sacred pilgrimage corridors and temple towns.
            </p>

            {/* Helpline Badges */}
            <div className="pt-2 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                <PhoneCall className="w-3.5 h-3.5 text-yatra-sky" />
                <span>National Helpline: <strong>1363</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>Emergency: <strong>112 / 108</strong></span>
              </div>
            </div>
          </div>

          {/* Col 1: Explore */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4 font-display">
              Explore Yatras
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#destinations" className="hover:text-yatra-sky transition-colors">Varanasi Kashi Vishwanath</a></li>
              <li><a href="#destinations" className="hover:text-yatra-sky transition-colors">Ayodhya Ram Janmabhoomi</a></li>
              <li><a href="#destinations" className="hover:text-yatra-sky transition-colors">Tirupati Sri Venkateswara</a></li>
              <li><a href="#destinations" className="hover:text-yatra-sky transition-colors">Haridwar Har Ki Pauri</a></li>
              <li><a href="#destinations" className="hover:text-yatra-sky transition-colors">Kedarnath & Char Dham</a></li>
            </ul>
          </div>

          {/* Col 2: Safety & Tools */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4 font-display">
              Safety & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#find-people" className="hover:text-yatra-sky transition-colors">Find My People Radar</a></li>
              <li><a href="#lost-found" className="hover:text-yatra-sky transition-colors">Lost & Found Network</a></li>
              <li><a href="#bhandaras" className="hover:text-yatra-sky transition-colors">Free Bhandara & Water Finder</a></li>
              <li><a href="#events" className="hover:text-yatra-sky transition-colors">Daily Aarti Timings</a></li>
              <li><button onClick={() => setActiveModal('digital-id')} className="hover:text-yatra-sky transition-colors text-left">Digital Pilgrim QR Pass</button></li>
            </ul>
          </div>

          {/* Col 3: Institutional & Connect */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4 font-display">
              Organization
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#safety" className="hover:text-yatra-sky transition-colors">For Temple Trusts</a></li>
              <li><a href="#safety" className="hover:text-yatra-sky transition-colors">Police & Disaster Management</a></li>
              <li><a href="#elderly" className="hover:text-yatra-sky transition-colors">Elderly Pilgrim Initiative</a></li>
              <li><a href="#home" className="hover:text-yatra-sky transition-colors">Privacy & Data Security</a></li>
              <li><a href="#home" className="hover:text-yatra-sky transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© 2026 TirthSaathi. All rights reserved.</span>
            <span>• Made for safer, smarter & more connected pilgrimages.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
