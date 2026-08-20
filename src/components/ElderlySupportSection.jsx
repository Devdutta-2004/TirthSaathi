import React from 'react';
import { useYatra } from '../context/YatraContext';
import { Heart, Eye, Mic, PhoneCall, QrCode, Accessibility, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const ElderlySupportSection = () => {
  const { elderlyMode, setElderlyMode, setActiveModal } = useYatra();

  const elderlyFeatures = [
    {
      title: 'High-Contrast Large Text Mode',
      desc: 'Enlarged crisp typography and oversized buttons designed specifically for senior devotees with reduced vision.',
      icon: Eye
    },
    {
      title: 'Voice-Activated Yatra Guide',
      desc: 'Speak naturally in Hindi, Tamil, Telugu, Bengali or English without typing complicated searches.',
      icon: Mic
    },
    {
      title: 'One-Touch Family Beacon & SOS',
      desc: 'Single prominent emergency button that rings sons/daughters and alerts temple wheelchair volunteers.',
      icon: PhoneCall
    },
    {
      title: 'Special Darshan & Wheelchair Pass',
      desc: 'Priority queue routing, battery buggy booking, and designated senior citizen entrance gate coordinates.',
      icon: Heart
    }
  ];

  return (
    <section id="elderly" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                <Heart className="w-3.5 h-3.5 text-yatra-saffron" /> Senior Devotee Care & Accessibility
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight leading-tight">
                Designed for Every Generation
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                For our parents and grandparents, a pilgrimage is a lifetime aspiration. TirthSaathi ensures their journey is dignified, safe, and stress-free with zero technological complexity.
              </p>
            </div>

            {/* Interactive Mode Toggle Box */}
            <div className="bg-gradient-to-r from-blue-50 to-amber-50/60 p-5 rounded-3xl border border-yatra-blue/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                  <span>👓 Try Elderly Easy Mode</span>
                  {elderlyMode && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Switches the entire website to large fonts, high-contrast buttons, and simplified 1-touch actions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setElderlyMode(!elderlyMode)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${
                  elderlyMode
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                    : 'bg-yatra-blue hover:bg-yatra-bright text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{elderlyMode ? 'Disable Easy Mode' : 'Enable Easy Mode'}</span>
              </button>
            </div>

            {/* 4 Feature Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {elderlyFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-yatra-blue flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 text-xs sm:text-sm font-display mb-1">{feat.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick pass action */}
            <div className="pt-2">
              <button
                onClick={() => setActiveModal('digital-id')}
                className="py-3 px-6 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-yatra-sky" />
                <span>Print or Save Senior Devotee QR Card</span>
              </button>
            </div>
          </div>

          {/* Right Image (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-float border border-slate-100 aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[540px]">
              <img
                src="/images/elderly_pilgrim.jpg"
                alt="Elderly grandfather assisted lovingly by family in temple"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-black/10" />

              {/* Floating Quote Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-card border border-white/40">
                <p className="text-xs italic text-slate-700 leading-relaxed font-serif">
                  "Knowing our parents can summon help with a single tap made our Char Dham yatra completely peaceful."
                </p>
                <span className="text-[11px] font-bold text-yatra-blue block mt-1.5 font-sans">
                  — The Sharma Family, Haridwar Yatri
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
