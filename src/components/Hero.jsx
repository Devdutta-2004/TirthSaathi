import React from 'react';
import { useYatra } from '../context/YatraContext';
import { ArrowRight, ShieldCheck, Sparkles, Users, Navigation } from 'lucide-react';

export const Hero = () => {
  const { setActiveModal } = useYatra();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-24 pb-20 md:pt-28 md:pb-28 overflow-hidden bg-navy-900">
      {/* Background Image with Cinematic Pilgrimage Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_pilgrimage.jpg"
          alt="Sacred Indian Pilgrimage Gathering at Varanasi Sunrise"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
          fetchpriority="high"
        />
        {/* Multi-layered Vignette and Blue Brand Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/50" />
        <div className="absolute inset-0 bg-yatra-blue/15 mix-blend-color" />
      </div>

      {/* Decorative Subtle Constellation / Holy Route Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sacredGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="#5EB7F5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sacredGrid)" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yatra-sky text-xs font-bold uppercase tracking-widest mb-6 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-yatra-saffron animate-ping" />
            <span>YOUR JOURNEY. OUR RESPONSIBILITY.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-white tracking-tight leading-[1.1] mb-6">
            Travel with Faith.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yatra-sky via-sky-200 to-yatra-gold">
              Journey with Confidence.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed mb-8 max-w-2xl text-shadow-sm">
            TirthSaathi helps pilgrims stay connected, find loved ones, discover essential services, and travel safely through India's most sacred destinations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
            <button
              onClick={() => scrollToSection('destinations')}
              className="group flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-yatra-blue to-yatra-bright hover:from-yatra-bright hover:to-yatra-blue text-white font-bold text-base shadow-glow hover:shadow-float transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              <span>Explore TirthSaathi</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('safety')}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/30 backdrop-blur-md transition-all hover:border-white/50"
            >
              <ShieldCheck className="w-5 h-5 text-yatra-sky" />
              <span>Safety & Family Tracking</span>
            </button>
          </div>

          {/* Trust Indicator */}
          <div className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm font-medium pt-2 border-t border-white/15">
            <div className="flex -space-x-2">
              <span className="w-7 h-7 rounded-full bg-yatra-blue border-2 border-navy-900 flex items-center justify-center text-[10px] font-bold text-white">4.9★</span>
              <span className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-navy-900 flex items-center justify-center text-[10px] font-bold text-white">✓</span>
              <span className="w-7 h-7 rounded-full bg-amber-500 border-2 border-navy-900 flex items-center justify-center text-[10px] font-bold text-white">ॐ</span>
            </div>
            <span>Built for safer, smarter & more connected pilgrimages across 25+ sacred dhams</span>
          </div>
        </div>
      </div>
    </section>
  );
};
