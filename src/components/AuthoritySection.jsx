import React from 'react';
import { useYatra } from '../context/YatraContext';
import { ShieldCheck, Activity, Users, Radio, AlertTriangle, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthoritySection = () => {
  const { addToast } = useYatra();

  const handleAuthorityInquiry = () => {
    addToast(
      'Authority Portal Demo Request',
      'Thank you. Our Government & Temple Trust Integration team will reach out within 24 hours.',
      'success'
    );
  };

  return (
    <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yatra-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yatra-sky/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-yatra-sky text-xs font-bold uppercase tracking-wider border border-white/20">
              <Building2 className="w-3.5 h-3.5" /> For Temple Trusts & Law Enforcement
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
              Better Pilgrimages Through Better Information
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              TirthSaathi equips district administrations, police departments, and temple trusts with unified real-time crowd telemetry, instant lost-person facial coordination, and incident command tools.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                { title: 'Real-Time Crowd Density Heatmaps', desc: 'Predict bottlenecks before surges occur and dynamically route yatris through secondary corridors.' },
                { title: 'Automated Lost-Person Coordination', desc: 'Single-click sync across 100+ volunteer handhelds, PA speaker towers, and mobile checkposts.' },
                { title: 'Emergency Rapid Response Dispatch', desc: 'Direct GPS pinpointing for medical trauma squads and Disaster Management (NDRF/SDRF) teams.' },
                { title: 'Official Broadcast & Public Safety Alerts', desc: 'Send geo-fenced safety notifications in regional languages directly to pilgrim smartphones.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-yatra-blue text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleAuthorityInquiry}
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-yatra-blue to-yatra-bright hover:from-yatra-bright hover:to-yatra-blue text-white font-bold text-sm shadow-glow transition-all flex items-center gap-2 group"
              >
                <span>Request Authority Portal Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Institutional Command Center Mockup (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 rounded-4xl p-6 sm:p-7 border border-slate-700 shadow-float backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-yatra-blue text-white flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">TirthSaathi Command Grid</h4>
                  <p className="text-[10px] text-emerald-400 font-mono">● LIVE TELEMETRY STREAM (NODE VAR-01)</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2.5 py-1 rounded-full border border-emerald-500/30">
                14/14 SECTORS OPTIMAL
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-mono block">Pilgrims Tracked</span>
                <span className="text-base font-mono font-bold text-white">1,48,290</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-mono block">Avg Wait Time</span>
                <span className="text-base font-mono font-bold text-amber-400">32 min</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-mono block">Lost Reunited</span>
                <span className="text-base font-mono font-bold text-emerald-400">99.4%</span>
              </div>
            </div>

            {/* Stylized Sector Matrix */}
            <div className="space-y-2 mb-4">
              {[
                { sector: 'Sector A (Ganga Ghats & Corridor Gate 1)', load: 84, status: 'Surge Control Active', color: 'bg-amber-500' },
                { sector: 'Sector B (Annakshetra & Water Point 3)', load: 45, status: 'Smooth Flow', color: 'bg-emerald-500' },
                { sector: 'Sector C (South Plaza & Locker Hub)', load: 62, status: 'Normal Flow', color: 'bg-yatra-sky' },
                { sector: 'Sector D (Senior Buggy Transit Route)', load: 30, status: 'Clear Route', color: 'bg-emerald-500' },
              ].map((sec, idx) => (
                <div key={idx} className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-xs">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-200 font-medium">{sec.sector}</span>
                    <span className="font-mono text-slate-400">{sec.status}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div style={{ width: `${sec.load}%` }} className={`h-full ${sec.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Broadcast Trigger Demo */}
            <button
              onClick={() => addToast('Test Alert Broadcasted', 'Simulated PA notification transmitted to all Sector A monitors.', 'info')}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5 border border-white/15"
            >
              <Radio className="w-3.5 h-3.5 text-yatra-sky" />
              <span>Simulate PA Broadcast to 25 Tower Speakers</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
