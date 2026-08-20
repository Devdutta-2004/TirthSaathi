import React from 'react';
import { useYatra } from '../context/YatraContext';
import { Users, MapPin, UserX, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const SafetySection = () => {
  const { setActiveModal } = useYatra();

  const safetyFeatures = [
    {
      id: 'family',
      icon: Users,
      title: 'Family Connection',
      description: 'Create an encrypted private group and stay connected with your loved ones even in dense yatra crowds.',
      actionLabel: 'Create Group',
      onClick: () => setActiveModal('family-group')
    },
    {
      id: 'find',
      icon: MapPin,
      title: 'Find My People',
      description: 'View the real-time approximate zone of connected family members and trigger audio beacons for effortless reunions.',
      actionLabel: 'Open Radar',
      onClick: () => {
        const el = document.getElementById('find-people');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'lost',
      icon: UserX,
      title: 'Lost & Found Network',
      description: 'Report missing companions instantly to broadcast details to 50+ temple volunteer checkpoints and PA desks.',
      actionLabel: 'Report Missing',
      onClick: () => setActiveModal('report-missing')
    },
    {
      id: 'sos',
      icon: ShieldAlert,
      title: 'SOS Emergency Assistance',
      description: 'One-touch emergency beacon transmits your GPS coordinates to Temple QRF, medical posts, and family contacts.',
      actionLabel: 'Trigger SOS',
      onClick: () => setActiveModal('sos'),
      isDanger: true
    },
  ];

  return (
    <section id="safety" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: Large Premium Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-float border border-slate-100 aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[580px]">
              <img
                src="/images/family_pilgrimage.jpg"
                alt="Three generations Indian family traveling safely at pilgrimage temple"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-black/10" />

              {/* Floating Live Badge Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-card border border-white/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">Protected by TirthSaathi SafeZone</h4>
                    <p className="text-[11px] text-slate-500">
                      Family perimeter active • 4 Members within 120m radius
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background aura */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-yatra-sky/15 rounded-full blur-3xl -z-10" />
          </div>

          {/* RIGHT COLUMN: Feature Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-yatra-blue text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldAlert className="w-3.5 h-3.5" /> Pillar of Trust & Protection
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight leading-tight">
                A Safer Yatra Starts with TirthSaathi
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                Crowded festivals, massive river ghats, and expansive temple corridors should bring spiritual serenity, not anxiety. TirthSaathi builds a digital safety net around your family.
              </p>
            </div>

            {/* Grid of 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {safetyFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.id}
                    className="p-5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-yatra-blue/40 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 shadow-sm ${
                        feat.isDanger
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yatra-light text-yatra-blue'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="font-bold text-navy-900 text-base mb-1.5 font-display">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={feat.onClick}
                        className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                          feat.isDanger
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-yatra-blue hover:text-yatra-bright'
                        }`}
                      >
                        <span>{feat.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
