import React from 'react';
import { UserCheck, Users, Compass, ShieldCheck, ArrowRight } from 'lucide-react';
import { useYatra } from '../context/YatraContext';

export const HowItWorksSection = () => {
  const { setActiveModal } = useYatra();

  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Generate your free Digital Pilgrim ID Pass with blood group and emergency contact in 30 seconds.',
      icon: UserCheck,
      action: () => setActiveModal('digital-id'),
      actionText: 'Get Digital Pass'
    },
    {
      step: '02',
      title: 'Add Your Family',
      description: 'Create an encrypted private circle and link elderly parents and children with one invite code.',
      icon: Users,
      action: () => setActiveModal('family-group'),
      actionText: 'Create Circle'
    },
    {
      step: '03',
      title: 'Explore Destination',
      description: 'Discover nearby free Annakshetras, water ATMs, medical booths, and crowd-free walking corridors.',
      icon: Compass,
      action: () => {
        const el = document.getElementById('destinations');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      actionText: 'Explore Yatras'
    },
    {
      step: '04',
      title: 'Travel Safely',
      description: 'Experience your sacred pilgrimage with complete peace of mind backed by automated SOS & lost beacons.',
      icon: ShieldCheck,
      action: () => setActiveModal('sos'),
      actionText: 'View SOS Center'
    },
  ];

  return (
    <section className="py-20 bg-yatra-bg border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yatra-light text-yatra-blue text-xs font-bold uppercase tracking-wider mb-3">
            <UserCheck className="w-3.5 h-3.5" /> Simple 4-Step Onboarding
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
            Your Yatra, Made Simpler
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
            Get started in less than two minutes before arriving at any major sacred pilgrimage destination in India.
          </p>
        </div>

        {/* Steps Grid with Connecting Progress Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-float transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative group"
              >
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-black text-3xl text-yatra-sky/60 group-hover:text-yatra-blue transition-colors">
                    {s.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-yatra-light text-yatra-blue flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-bold text-navy-900 font-display mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    {s.description}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={s.action}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 group-hover:bg-yatra-light text-navy-900 group-hover:text-yatra-blue text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200 group-hover:border-yatra-blue/30"
                  >
                    <span>{s.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
