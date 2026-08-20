import React from 'react';
import { useYatra } from '../context/YatraContext';
import { ArrowRight, QrCode, ShieldAlert, PhoneCall, Sparkles, Smartphone } from 'lucide-react';

export const FinalCTASection = () => {
  const { setActiveModal, addToast } = useYatra();

  const handleStartJourney = () => {
    setActiveModal('digital-id');
  };

  const handleExploreFeatures = () => {
    const el = document.getElementById('safety');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadApp = () => {
    addToast('TirthSaathi PWA Installed', 'TirthSaathi Web App is ready for offline yatra use on your home screen!', 'success');
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-navy-900">
      {/* Cinematic Mountain Yatra Lanterns Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/final_cta_yatra.jpg"
          alt="Pilgrims walking along majestic Himalayan yatra path with lanterns at dusk"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Deep blue brand gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/85 to-yatra-blue/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* Small top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yatra-gold text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-4 h-4" />
          <span>EMPOWERING SACRED JOURNEYS ACROSS INDIA</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight mb-6">
          Your Sacred Journey Deserves a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yatra-sky via-white to-yatra-gold">
            Trusted Saathi.
          </span>
        </h2>

        {/* Description */}
        <p className="text-slate-200 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-10">
          From finding your loved ones to discovering the right help at the right time, TirthSaathi is designed to make every pilgrimage safer, simpler, and spiritually fulfilling.
        </p>

        {/* Primary Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={handleStartJourney}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-yatra-blue to-yatra-bright hover:from-yatra-bright hover:to-yatra-blue text-white font-bold text-base shadow-glow hover:shadow-float transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>Start Your Journey Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleExploreFeatures}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/30 backdrop-blur-md transition-all hover:border-white/50"
          >
            Explore Safety Features
          </button>
        </div>

        {/* 24x7 Helpline Trust Card */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-red-600/90 text-white flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">National 24/7 Pilgrim Emergency Network</h4>
              <p className="text-slate-300">Dial toll-free 1363 (Tourist Helpline) or 112 (Police QRF)</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('sos')}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold whitespace-nowrap transition-colors"
          >
            Test Emergency SOS
          </button>
        </div>
      </div>
    </section>
  );
};
