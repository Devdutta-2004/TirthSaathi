import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import {
  Users, Bell, Shield, MapPin, Radio, Battery, Wifi, ArrowRight,
  Sparkles, CheckCircle2, Crosshair, Target, Zap, Activity
} from 'lucide-react';

export const FindMyPeopleSection = () => {
  const { familyGroup, familyMembers, triggerFamilyRing, setActiveModal, addToast } = useYatra();
  const members = familyGroup?.members || familyMembers || [];
  const [selectedMember, setSelectedMember] = useState(members[1] || members[0]);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    addToast(
      `Focused on ${member.name}`,
      `Distance: ${member.distanceMeters || 120}m. Battery: ${member.battery}%. Signal: ${member.signal || '5G UWB'}.`,
      'info'
    );
  };

  return (
    <section id="find-people" className="py-20 bg-[#040A17] border-t border-cyan-500/20 relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-black/60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>QUANTUM UWB PILGRIM RADAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Never Lose Sight of the People Who Matter.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            High-density pilgrimage environments require sub-meter precision. TirthSaathi uses Ultra-Wideband & WebRTC mesh to keep family circles synchronized.
          </p>
        </div>

        {/* Interactive Map & Member Control Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* STYLIZED ABSTRACT PILGRIMAGE MAP UI (Left 7 cols) */}
          <div className="lg:col-span-7 glass-cyber-panel rounded-4xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-cyan-500/30">
            {/* Top map toolbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20 text-white">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold tracking-wide uppercase font-mono text-cyan-300">
                  Live Radar: Kashi Corridor SafeZone
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40 backdrop-blur-sm font-mono">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Encrypted 5.8GHz Mesh Active</span>
              </div>
            </div>

            {/* Stylized Temple Map Canvas */}
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#030914] border border-cyan-500/30 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Rotating Radar Sweep Beam */}
              <div className="absolute inset-0 rounded-full pointer-events-none animate-radar-sweep opacity-75">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(0,240,255,0.3) 0deg, rgba(0,240,255,0.05) 45deg, transparent 90deg)'
                  }}
                />
              </div>

              {/* Abstract Map Grid Lines */}
              <div className="absolute inset-0 opacity-25 pointer-events-none">
                <div className="w-full h-full border border-cyan-400/40 rounded-full scale-50" />
                <div className="w-full h-full border border-cyan-400/30 rounded-full scale-75" />
                <div className="w-full h-full border border-cyan-400/20 rounded-full scale-100" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/30" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/30" />
              </div>

              {/* Temple Sanctum Icon in Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-glow">
                  <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold font-mono text-amber-300 uppercase tracking-widest mt-1 block">
                  Kashi Sanctum
                </span>
              </div>

              {/* SafeZone Circle Boundary */}
              <div className="absolute w-72 h-72 rounded-full border-2 border-dashed border-emerald-400/40 bg-emerald-500/5 animate-pulse-subtle pointer-events-none flex items-start justify-center pt-2">
                <span className="text-[9px] font-bold font-mono text-emerald-300 uppercase tracking-widest bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Safe Perimeter (150m)
                </span>
              </div>

              {/* Family Member Markers */}
              {members.map((member, idx) => {
                const isSelected = selectedMember?.id === member.id;
                // Pre-calculated relative canvas positions for mock layout
                const positions = [
                  { top: '35%', left: '50%' },
                  { top: '28%', left: '72%' },
                  { top: '70%', left: '68%' },
                  { top: '65%', left: '30%' }
                ];
                const pos = positions[idx % positions.length];

                return (
                  <div
                    key={member.id}
                    onClick={() => handleMemberClick(member)}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group"
                  >
                    {/* Animated Ripple for Selected */}
                    {isSelected && (
                      <div className="absolute -inset-3 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                    )}

                    {/* Member Marker Pin */}
                    <div
                      className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        member.name?.includes('You') || idx === 0
                          ? 'bg-cyan-500/90 border-white text-navy-950 scale-105 shadow-glow'
                          : isSelected
                          ? 'bg-amber-400 border-white text-navy-950 scale-110 shadow-glow ring-2 ring-cyan-400'
                          : 'bg-black/80 border-cyan-500/40 text-white hover:scale-105 backdrop-blur-md'
                      }`}
                    >
                      {/* Image Avatar */}
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-white/60 flex-shrink-0">
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] whitespace-nowrap font-mono">{member.name?.split(' ')[0]}</span>
                      {(!member.name?.includes('You') && idx !== 0) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Quick Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Host Node
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Selected Target
                </span>
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> In SafeZone
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Tap avatar to lock telemetry</span>
            </div>
          </div>

          {/* RIGHT SIDE: SELECTED MEMBER DETAIL CARD & ACTIONS (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Selected Card */}
            {selectedMember && (
              <div className="glass-cyber-panel rounded-3xl p-6 shadow-2xl border border-cyan-500/30">
                <div className="flex items-start justify-between pb-4 border-b border-cyan-500/20">
                  <div className="flex items-center gap-3.5">
                    {/* Target Photo Frame */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-glow p-0.5 bg-black/60 relative">
                      <img
                        src={selectedMember.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">{selectedMember.name}</h3>
                      <p className="text-xs text-cyan-400 font-mono">{selectedMember.role || 'Family Devotee'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[11px] font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> In SafeZone
                  </span>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2.5 my-4">
                  <div className="bg-black/50 p-2.5 rounded-xl text-center border border-cyan-500/20">
                    <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase block">Distance</span>
                    <span className="text-xs font-bold text-white mt-0.5 block font-mono">
                      {selectedMember.distanceMeters ? `${selectedMember.distanceMeters}m` : '120m'}
                    </span>
                  </div>
                  <div className="bg-black/50 p-2.5 rounded-xl text-center border border-cyan-500/20">
                    <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase block">Battery</span>
                    <span className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-0.5 font-mono">
                      <Battery className="w-3.5 h-3.5" /> {selectedMember.battery || 86}%
                    </span>
                  </div>
                  <div className="bg-black/50 p-2.5 rounded-xl text-center border border-cyan-500/20">
                    <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase block">Channel</span>
                    <span className="text-xs font-bold text-cyan-300 mt-0.5 flex items-center justify-center gap-0.5 font-mono">
                      <Wifi className="w-3.5 h-3.5 text-cyan-400" /> CH-9
                    </span>
                  </div>
                </div>

                {/* Action Buttons for Selected Member */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => triggerFamilyRing(selectedMember.name)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-navy-950 text-xs font-mono font-bold shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Bell className="w-4 h-4" /> Send High-Frequency Sacred Audio Beacon
                  </button>
                </div>
              </div>
            )}

            {/* Create Family Group Box */}
            <div className="glass-cyber-panel rounded-3xl p-6 text-white border border-cyan-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <h4 className="text-base font-bold font-display mb-1 text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Travelling in a Yatra Jatha or Family?</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Connect up to 20 pilgrims in an encrypted peer circle. Instant alerts if anyone wanders outside the designated safe boundary.
              </p>

              <button
                onClick={() => setActiveModal('family-group')}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-mono font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>CREATE QUANTUM CIRCLE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

