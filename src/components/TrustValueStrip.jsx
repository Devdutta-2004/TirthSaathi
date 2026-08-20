import React from 'react';
import { Users, ShieldAlert, Compass, Sparkles } from 'lucide-react';

export const TrustValueStrip = () => {
  const highlights = [
    {
      id: 1,
      icon: Users,
      title: 'Stay Connected',
      description: 'Keep your family connected during crowded yatras with live proximity alerts.',
      accent: 'group-hover:border-yatra-blue/40'
    },
    {
      id: 2,
      icon: ShieldAlert,
      title: 'Emergency Ready',
      description: 'Quick one-touch access to temple emergency teams and 24x7 verified helplines.',
      accent: 'group-hover:border-red-300'
    },
    {
      id: 3,
      icon: Compass,
      title: 'Discover Nearby',
      description: 'Find free bhandaras, drinking water, medical tents, rest shelters and help points.',
      accent: 'group-hover:border-emerald-300'
    },
    {
      id: 4,
      icon: Sparkles,
      title: 'Trusted Information',
      description: 'Get live darshan queue times, authentic aarti schedules and crowd advisories.',
      accent: 'group-hover:border-amber-300'
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`group p-5 rounded-3xl bg-slate-50/70 hover:bg-white border border-slate-200/70 hover:border-yatra-blue/30 transition-all duration-300 hover:shadow-card transform hover:-translate-y-1`}
              >
                <div className="w-12 h-12 rounded-2xl bg-yatra-light text-yatra-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-navy-900 text-base font-display mb-1.5 group-hover:text-yatra-blue transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
