import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { Users, Bell, Shield, MapPin, Radio, Battery, Wifi, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const FindMyPeopleSection = () => {
  const { familyMembers, triggerFamilyRing, setActiveModal, addToast } = useYatra();
  const [selectedMember, setSelectedMember] = useState(familyMembers[1]); // Default Mom

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    addToast(
      `Focused on ${member.name}`,
      `Distance: ${member.distance}. Battery: ${member.battery}%. Signal: ${member.signal}.`,
      'info'
    );
  };

  return (
    <section id="find-people" className="py-20 bg-yatra-bg border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yatra-light text-yatra-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" /> Real-Time Family Connectivity
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
            Never Lose Sight of the People Who Matter.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Crowded pilgrimage sites can be overwhelming. TirthSaathi helps families stay connected and find each other when crowds separate them.
          </p>
        </div>

        {/* Interactive Map & Member Control Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* STYLIZED ABSTRACT PILGRIMAGE MAP UI (Left 7 cols) */}
          <div className="lg:col-span-7 bg-navy-900 rounded-4xl p-6 sm:p-8 shadow-float relative overflow-hidden border border-slate-700/50">
            {/* Top map toolbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/70 text-white">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold tracking-wide uppercase font-mono">
                  Live Radar: Kashi Temple SafeZone
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Radio className="w-3.5 h-3.5 text-yatra-sky animate-spin" />
                <span>Encrypted Mesh Beacon Active</span>
              </div>
            </div>

            {/* Stylized Temple Map Canvas */}
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-navy-950 via-[#0A2240] to-navy-900 border border-slate-700/80 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Abstract Map Grid Lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full border border-yatra-sky/30 rounded-full scale-50" />
                <div className="w-full h-full border border-yatra-sky/20 rounded-full scale-75" />
                <div className="w-full h-full border border-yatra-sky/15 rounded-full scale-100" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-yatra-sky/20" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-yatra-sky/20" />
              </div>

              {/* Temple Sanctum Icon in Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-glow">
                  <span className="text-2xl">🛕</span>
                </div>
                <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest mt-1 block">
                  Kashi Vishwanath Sanctum
                </span>
              </div>

              {/* SafeZone Circle Boundary */}
              <div className="absolute w-72 h-72 rounded-full border-2 border-dashed border-emerald-400/40 bg-emerald-500/5 animate-pulse-subtle pointer-events-none flex items-start justify-center pt-2">
                <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Safe Perimeter Zone (150m)
                </span>
              </div>

              {/* Family Member Markers */}
              {familyMembers.map((member) => {
                const isSelected = selectedMember.id === member.id;
                return (
                  <div
                    key={member.id}
                    onClick={() => handleMemberClick(member)}
                    style={{ top: `${member.coords.y}%`, left: `${member.coords.x}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group`}
                  >
                    {/* Animated Ripple for Selected */}
                    {isSelected && (
                      <div className="absolute -inset-3 rounded-full bg-yatra-sky/30 animate-ping pointer-events-none" />
                    )}

                    {/* Member Marker Pin */}
                    <div
                      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border shadow-float transition-all ${
                        member.id === 'me'
                          ? 'bg-yatra-blue border-white text-white scale-105'
                          : isSelected
                          ? 'bg-amber-400 border-white text-navy-950 scale-110 shadow-glow ring-2 ring-white'
                          : 'bg-white/95 border-slate-200 text-navy-900 hover:scale-105'
                      }`}
                    >
                      <span className="text-sm">{member.avatar}</span>
                      <span className="text-[11px] whitespace-nowrap">{member.name.split(' ')[0]}</span>
                      {member.id !== 'me' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Quick Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-slate-300 text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yatra-blue" /> You
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Selected Family
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Safe In-Bounds
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Click any avatar to inspect</span>
            </div>
          </div>

          {/* RIGHT SIDE: SELECTED MEMBER DETAIL CARD & ACTIONS (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Selected Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="text-3xl w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-inner">
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">{selectedMember.name}</h3>
                    <p className="text-xs text-yatra-blue font-semibold">{selectedMember.role}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In SafeZone
                </span>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2.5 my-4">
                <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Distance</span>
                  <span className="text-xs font-bold text-navy-900 mt-0.5 block">{selectedMember.distance}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Battery</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center justify-center gap-0.5">
                    <Battery className="w-3.5 h-3.5" /> {selectedMember.battery}%
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Signal</span>
                  <span className="text-xs font-bold text-navy-900 mt-0.5 flex items-center justify-center gap-0.5">
                    <Wifi className="w-3.5 h-3.5 text-yatra-blue" /> High
                  </span>
                </div>
              </div>

              {/* Action Buttons for Selected Member */}
              <div className="space-y-2.5 pt-2">
                {selectedMember.id !== 'me' ? (
                  <button
                    onClick={() => triggerFamilyRing(selectedMember.name)}
                    className="w-full py-3 px-4 rounded-xl bg-yatra-blue hover:bg-yatra-bright text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" /> Send Loud Spiritual Chime Beacon
                  </button>
                ) : (
                  <div className="text-center py-2 text-xs text-slate-500 font-medium bg-slate-50 rounded-xl">
                    This is your active anchor beacon
                  </div>
                )}
              </div>
            </div>

            {/* Create Family Group Box */}
            <div className="bg-gradient-to-br from-navy-900 to-yatra-blue rounded-3xl p-6 text-white shadow-card">
              <h4 className="text-base font-bold font-display mb-1">Travelling in a Yatra Jatha or Family?</h4>
              <p className="text-xs text-sky-100 leading-relaxed mb-4">
                Connect up to 20 pilgrims in your group. Receive instant notifications if anyone wanders outside the designated safe boundary.
              </p>

              <button
                onClick={() => setActiveModal('family-group')}
                className="w-full py-3 px-4 rounded-2xl bg-white text-navy-900 hover:bg-yatra-light font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <span>Create a Family Group</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
