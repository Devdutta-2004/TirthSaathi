import React, { useState, useEffect, useRef } from 'react';
import { useYatra } from '../context/YatraContext';
import { calculateHaversineDistance, calculateCompassBearing } from '../services/geoService';
import { LiveGPSMap } from '../components/map/LiveGPSMap';
import {
  Users, Share2, Copy, Check, MapPin, Bell, Navigation,
  Battery, Wifi, Shield, UserPlus, Compass, AlertCircle,
  Sparkles, Radio, X, ChevronDown, Volume2, Locate, ArrowUp, Scan,
  Activity, Cpu, Target, Layers, Zap, Crosshair, Signal, Eye
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   ULTRA-FUTURISTIC CYBERNETIC FAMILY FINDER HUD
   ═══════════════════════════════════════════════════════════ */

export const FinderScreen = () => {
  const {
    familyGroup, createFamily, joinFamily, triggerBeacon,
    networkStatus, isRealtimeConnected, myCoords, myAccuracy, myHeading, myBattery, addToast,
    setCurrentScreen
  } = useYatra();

  const [view, setView] = useState('people');       // 'people' | 'precision' | 'map'
  const [selectedMember, setSelectedMember] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState('');
  const [yourNameInput, setYourNameInput] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [beaconPinging, setBeaconPinging] = useState(false);

  // Precision finder animation state
  const [pulsePhase, setPulsePhase] = useState(0);

  // Animate pulse phase for the precision radar
  useEffect(() => {
    let frame;
    const tick = () => {
      setPulsePhase(p => (p + 0.025) % (Math.PI * 2));
      frame = requestAnimationFrame(tick);
    };
    if (view === 'precision' && selectedMember) {
      frame = requestAnimationFrame(tick);
    }
    return () => frame && cancelAnimationFrame(frame);
  }, [view, selectedMember]);

  const handleCopyCode = () => {
    setCopied(true);
    addToast('Quantum Circle Key Copied', `Secure access code ${familyGroup.groupCode} copied to clipboard.`, 'success');
    navigator.clipboard && navigator.clipboard.writeText(familyGroup.groupCode);
    setTimeout(() => setCopied(false), 2500);
  };

  const getLiveDistance = (member) => {
    if (!member?.coords || !myCoords) return member?.distanceMeters || 0;
    return calculateHaversineDistance(myCoords.lat, myCoords.lng, member.coords.lat, member.coords.lng);
  };

  const getLiveBearing = (member) => {
    if (!member?.coords || !myCoords) return 0;
    return calculateCompassBearing(myCoords.lat, myCoords.lng, member.coords.lat, member.coords.lng);
  };

  const getProximityLabel = (dist) => {
    if (dist <= 3) return { text: 'TARGET LOCKED (HERE)', color: '#10B981', border: 'rgba(16,185,129,0.4)', bg: 'rgba(16,185,129,0.12)' };
    if (dist <= 10) return { text: 'ULTRA-CLOSE PROXIMITY', color: '#00F0FF', border: 'rgba(0,240,255,0.4)', bg: 'rgba(0,240,255,0.12)' };
    if (dist <= 30) return { text: 'UWB NEARBY ZONE', color: '#3B82F6', border: 'rgba(59,130,246,0.4)', bg: 'rgba(59,130,246,0.12)' };
    if (dist <= 100) return { text: 'PERIMETER IN RANGE', color: '#F59E0B', border: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.12)' };
    return { text: 'LONG RANGE SEPARATION', color: '#EF4444', border: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.1)' };
  };

  const handleCreateGroupSubmit = (e) => {
    e.preventDefault();
    if (!groupNameInput) return;
    createFamily(groupNameInput, yourNameInput);
    setShowCreateModal(false);
    setGroupNameInput('');
  };

  const handleJoinGroupSubmit = (e) => {
    e.preventDefault();
    if (!joinCodeInput) return;
    joinFamily(joinCodeInput, yourNameInput);
    setShowJoinModal(false);
    setJoinCodeInput('');
  };

  const openPrecisionFinder = (member) => {
    setSelectedMember(member);
    setView('precision');
  };

  const handleTriggerBeaconAction = (member) => {
    setBeaconPinging(true);
    triggerBeacon(member);
    setTimeout(() => setBeaconPinging(false), 2000);
  };

  /* ─────────────────────────────────────────────
     1. TACTICAL HUD VIEW (Overview & Roster)
  ──────────────────────────────────────────── */
  const renderPeopleList = () => (
    <div className="space-y-4 animate-fadeIn">
      {/* ── TOP TELEMETRY STRIP ── */}
      <div className="p-3.5 rounded-2xl glass-cyber-panel border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 relative overflow-hidden">
        {/* Glowing background scanline */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-scanline" />
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm relative">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-0.5 -right-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                UWB MESH ONLINE
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                FREQ: 7.98 GHz (CH-9)
              </span>
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide mt-0.5">
              {familyGroup.name || 'Quantum Family Circle'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Key Code */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-2.5 py-1.5 rounded-xl text-xs font-mono text-cyan-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>{familyGroup.groupCode}</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Copy Encrypted Circle Key"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Join Circle Code"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── PUNARMILAN AI BIOMETRIC SCANNER BANNER ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-gold-500/10 to-cyan-500/10 border border-gold-500/40 relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-400 flex items-center justify-center font-bold text-xs shadow-glow">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  PunarMilan AI Neural Facial Link
                </h4>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Active scan across 14,000+ CCTV nodes & pilgrims for missing family
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('punarmilan')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-navy-950 font-bold text-xs flex-shrink-0 transition-all shadow-md active:scale-95 flex items-center gap-1.5 font-mono"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI SCAN</span>
          </button>
        </div>
      </div>

      {/* ── VIEW SWITCHER TABS ── */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setView('people')}
          className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            view === 'people'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>TACTICAL NODES ({familyGroup.members.length})</span>
        </button>
        <button
          onClick={() => setView('map')}
          className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            view === 'map'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>SATELLITE GPS GRID</span>
        </button>
      </div>

      {/* ── FAMILY TELEMETRY ROSTER CARDS ── */}
      <div className="space-y-3">
        {familyGroup.members.map((member) => {
          const distance = getLiveDistance(member);
          const bearing = getLiveBearing(member);
          const proximity = getProximityLabel(distance);
          const isThisDevice = distance === 0;

          return (
            <div
              key={member.deviceId || member.id}
              onClick={() => !isThisDevice && openPrecisionFinder(member)}
              className={`w-full text-left rounded-2xl p-4 transition-all glass-cyber-card border relative overflow-hidden group ${
                isThisDevice
                  ? 'border-cyan-500/30'
                  : 'cursor-pointer hover:border-cyan-400/60 active:scale-[0.99]'
              }`}
            >
              {/* Corner Sci-Fi Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400/60" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/60" />

              <div className="flex items-center gap-4">
                {/* Holographic Avatar Frame with Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-500/50 p-0.5 bg-black/60 shadow-lg group-hover:border-cyan-400 transition-colors">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-xl filter contrast-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </div>

                  {/* Status Indicator Pip */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-navy-950 flex items-center justify-center ${
                    member.isOnline || isThisDevice ? 'bg-emerald-400' : 'bg-slate-400'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </div>
                </div>

                {/* Member Telemetry & Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[15px] text-white truncate tracking-wide">
                        {member.name}
                      </h3>
                      {isThisDevice ? (
                        <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                          HOST NODE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          {member.role || 'Node'}
                        </span>
                      )}
                    </div>

                    {/* Proximity Status Pill */}
                    {!isThisDevice && (
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          color: proximity.color,
                          borderColor: proximity.border,
                          backgroundColor: proximity.bg
                        }}
                      >
                        {proximity.text}
                      </span>
                    )}
                  </div>

                  {/* Telemetry row */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-slate-400">
                    {isThisDevice ? (
                      <span className="flex items-center gap-1 text-cyan-300">
                        <Locate className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> GPS FIX: ±{myAccuracy}m
                      </span>
                    ) : (
                      <>
                        <span className="text-white font-bold text-sm">
                          {distance >= 1000 ? `${(distance/1000).toFixed(1)} km` : `${distance} m`}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Compass className="w-3.5 h-3.5 text-cyan-400" /> {bearing}°
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400">
                          {member.uwbChannel || 'UWB CH-9'}
                        </span>
                      </>
                    )}

                    {/* Battery indicator */}
                    <span className="flex items-center gap-1 ml-auto text-emerald-400">
                      <Battery className="w-3.5 h-3.5" />
                      <span>{isThisDevice ? myBattery : (member.battery || 88)}%</span>
                    </span>
                  </div>
                </div>

                {/* Right Action Icons */}
                {!isThisDevice && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerBeaconAction(member);
                      }}
                      className="w-9 h-9 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 flex items-center justify-center transition-colors"
                      title="Emit Sonic Audio Beacon"
                    >
                      <Volume2 className={`w-4 h-4 ${beaconPinging ? 'animate-bounce text-amber-200' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPrecisionFinder(member);
                      }}
                      className="w-9 h-9 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/40 text-cyan-300 flex items-center justify-center transition-colors shadow-glow"
                      title="Engage Precision Radar"
                    >
                      <Crosshair className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CREATE NEW CIRCLE CTA ── */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 text-xs font-mono font-bold text-cyan-300 transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
      >
        <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span>INITIALIZE NEW QUANTUM FAMILY CIRCLE</span>
      </button>
    </div>
  );

  /* ─────────────────────────────────────────────
     2. HOLOGRAPHIC PRECISION RADAR (LiDAR HUD)
  ──────────────────────────────────────────── */
  const renderPrecisionFinder = () => {
    if (!selectedMember) return null;

    const distance = getLiveDistance(selectedMember);
    const bearing = getLiveBearing(selectedMember);
    const proximity = getProximityLabel(distance);

    // Dynamic ring sizes and audio pulses
    const maxRings = 5;
    const pulseScale = 0.96 + Math.sin(pulsePhase) * 0.04;

    // Relative arrow rotation: target bearing minus device heading
    const arrowDeg = bearing - myHeading;

    return (
      <div
        className="fixed inset-0 z-50 bg-[#030814] flex flex-col items-center justify-between overflow-hidden select-none"
        style={{
          paddingTop: 'env(safe-area-inset-top, 24px)',
          paddingBottom: 'env(safe-area-inset-bottom, 24px)'
        }}
      >
        {/* Holographic Background Grid & Radial Scan */}
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/10 pointer-events-none" />

        {/* ── TOP HUD BAR ── */}
        <div className="w-full px-5 pt-3 pb-2 flex items-center justify-between z-20">
          <button
            onClick={() => { setView('people'); setSelectedMember(null); }}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/15 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all backdrop-blur-md"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
            <span>DISENGAGE</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-[11px] bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full text-cyan-300 shadow-glow">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>UWB TARGET LOCK: ACTIVE</span>
          </div>
        </div>

        {/* ── TARGET PROFILE CARD ── */}
        <div className="text-center z-20 flex flex-col items-center -mt-2">
          {/* Target Portrait with Holographic Hex Frame */}
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-glow p-1 bg-black/60 relative">
              <img
                src={selectedMember.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'}
                alt={selectedMember.name}
                className="w-full h-full object-cover rounded-xl"
              />
              {/* Scanline overlay across photo */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-cyan-400/20 pointer-events-none" />
            </div>

            {/* Target Reticle Accents */}
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
          </div>

          <h2 className="text-white text-lg font-extrabold tracking-wide font-display">
            {selectedMember.name}
          </h2>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-cyan-400">
            <span>{selectedMember.role || 'Family Member'}</span>
            <span>•</span>
            <span>{selectedMember.uwbChannel || 'UWB CH-9'}</span>
          </div>
        </div>

        {/* ── GIANT HOLOGRAPHIC RADAR SCANNER ── */}
        <div className="flex-1 flex items-center justify-center w-full relative">
          {/* Radar Container */}
          <div
            className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center"
            style={{ transform: `scale(${pulseScale})` }}
          >
            {/* Rotating Radar Sweep Beam */}
            <div className="absolute inset-0 rounded-full pointer-events-none animate-radar-sweep opacity-75">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(0,240,255,0.35) 0deg, rgba(0,240,255,0.05) 45deg, transparent 90deg)'
                }}
              />
            </div>

            {/* Concentric Distance Range Rings */}
            {[...Array(maxRings)].map((_, i) => {
              const size = 110 + i * 55;
              const ringOpacity = 0.15 + (maxRings - i) * 0.08;
              return (
                <div
                  key={i}
                  className="absolute rounded-full border border-cyan-500/40 pointer-events-none transition-all duration-300"
                  style={{
                    width: size,
                    height: size,
                    borderColor: i === 0 ? 'rgba(0,240,255,0.7)' : `rgba(0,240,255,${ringOpacity})`,
                    boxShadow: i === 0 ? '0 0 25px rgba(0,240,255,0.25)' : 'none'
                  }}
                />
              );
            })}

            {/* Crosshair Axes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-full h-px bg-cyan-400" />
              <div className="h-full w-px bg-cyan-400 absolute" />
            </div>

            {/* Directional Holographic Arrow Reticle */}
            <div className="absolute z-20 flex flex-col items-center">
              {distance > 3 ? (
                <div
                  className="transition-transform duration-300 ease-out"
                  style={{ transform: `rotate(${arrowDeg}deg)` }}
                >
                  <div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-glow-blue border border-cyan-300"
                    style={{
                      boxShadow: '0 0 50px rgba(0,240,255,0.6), inset 0 0 20px rgba(255,255,255,0.5)'
                    }}
                  >
                    <ArrowUp className="w-12 h-12 text-white drop-shadow-md" strokeWidth={3} />
                  </div>
                </div>
              ) : (
                /* "HERE" Target Lock state */
                <div
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow animate-neon-cyan border-2 border-emerald-200"
                  style={{
                    boxShadow: '0 0 60px rgba(16,185,129,0.8)'
                  }}
                >
                  <Check className="w-14 h-14 text-white" strokeWidth={3.5} />
                </div>
              )}
            </div>
          </div>

          {/* Ambient Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${proximity.color}20 0%, transparent 65%)`
            }}
          />
        </div>

        {/* ── DISTANCE TELEMETRY GAUGE ── */}
        <div className="text-center z-20 mb-2">
          <div className="inline-flex items-baseline gap-2 font-mono">
            <span className="text-6xl sm:text-7xl font-black text-neon-cyan tracking-tight tabular-nums">
              {distance >= 1000 ? (distance / 1000).toFixed(1) : distance}
            </span>
            <span className="text-2xl font-bold text-cyan-300">
              {distance >= 1000 ? 'km' : 'm'}
            </span>
          </div>

          {/* Precision Status Banner */}
          <div className="flex items-center justify-center gap-2 mt-1 font-mono text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: proximity.color }} />
            <span className="font-bold tracking-wider" style={{ color: proximity.color }}>
              {proximity.text}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{bearing}° AZIMUTH</span>
          </div>
        </div>

        {/* ── BOTTOM TACTICAL ACTION BAR ── */}
        <div className="w-full px-5 pb-4 space-y-2.5 z-20 max-w-md">
          {/* Sonic Beacon Button */}
          <button
            onClick={() => handleTriggerBeaconAction(selectedMember)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-gold-500/20 hover:from-amber-500/30 hover:to-gold-500/30 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-md"
          >
            <Volume2 className={`w-4 h-4 ${beaconPinging ? 'animate-bounce text-amber-200' : ''}`} />
            <span>DISPATCH HIGH-FREQUENCY SACRED CHIME BEACON</span>
          </button>

          {/* Switch to Satellite Map */}
          <button
            onClick={() => setView('map')}
            className="w-full py-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-glow"
          >
            <MapPin className="w-4 h-4" />
            <span>OVERLAY SATELLITE GPS MAP</span>
          </button>

          {/* Micro Telemetry Footer */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-2 pt-1">
            <span>COORDS: {selectedMember.coords?.lat?.toFixed(4)}, {selectedMember.coords?.lng?.toFixed(4)}</span>
            <span>UWB RES: ±0.3m</span>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     3. SATELLITE ORBITAL MAP VIEW
  ──────────────────────────────────────────── */
  const renderMapView = () => (
    <div className="space-y-4 animate-fadeIn">
      {/* Map Control Bar */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setView('people')}
          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          <span>ROSTER VIEW</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>GPS RADAR STREAM ACTIVE</span>
        </div>
      </div>

      {/* Map Canvas with Cyber Frame */}
      <div className="rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl relative">
        <div className="h-[460px] w-full">
          <LiveGPSMap
            myCoords={myCoords}
            myAccuracy={myAccuracy}
            myHeading={myHeading}
            members={familyGroup.members}
            selectedMember={selectedMember}
            onSelectMember={(m) => openPrecisionFinder(m)}
          />
        </div>
      </div>

      {/* Quick Member Carousel with Photos */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {familyGroup.members.map((m) => {
          const dist = getLiveDistance(m);
          const prox = getProximityLabel(dist);
          const isThis = dist === 0;
          return (
            <button
              key={m.deviceId || m.id}
              onClick={() => !isThis && openPrecisionFinder(m)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all text-left glass-cyber-card ${
                selectedMember?.id === m.id
                  ? 'border-cyan-400 bg-cyan-950/60 shadow-glow'
                  : 'border-white/10 hover:border-cyan-500/40'
              }`}
            >
              {/* Photo Avatar */}
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-cyan-400/50 flex-shrink-0">
                <img
                  src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-white block truncate max-w-[100px]">
                  {m.name}
                </span>
                <span className="text-[10px] font-mono block" style={{ color: prox.color }}>
                  {isThis ? 'Host Node' : `${dist}m • ${prox.text.split(' ')[0]}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER MAIN SCREEN
  ═══════════════════════════════════════════ */
  return (
    <div className={view === 'precision' ? '' : 'max-w-2xl mx-auto p-4 sm:p-6'}>
      {view === 'people' && renderPeopleList()}
      {view === 'precision' && renderPrecisionFinder()}
      {view === 'map' && renderMapView()}

      {/* ─── CREATE CIRCLE CYBER MODAL ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleCreateGroupSubmit}
            className="glass-cyber-panel rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-cyan-500/40 space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Create Quantum Circle
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-cyan-300 mb-1.5 uppercase">
                Circle Identifier Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sharma Family Yatra"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-cyan-300 mb-1.5 uppercase">
                Your Leader Call-sign
              </label>
              <input
                type="text"
                placeholder="e.g. Devdutta"
                value={yourNameInput}
                onChange={(e) => setYourNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 text-xs font-mono font-bold tracking-wider uppercase shadow-glow transition-all active:scale-95"
            >
              INITIALIZE & ENCRYPT CIRCLE
            </button>
          </form>
        </div>
      )}

      {/* ─── JOIN CIRCLE CYBER MODAL ─── */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleJoinGroupSubmit}
            className="glass-cyber-panel rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-cyan-500/40 space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Connect Node to Circle
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-cyan-300 mb-1.5 uppercase">
                Circle Cryptographic Code
              </label>
              <input
                type="text"
                required
                placeholder="TS-FAM-7X29A"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-cyan-500/30 text-cyan-300 font-mono text-sm uppercase tracking-wider focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-cyan-300 mb-1.5 uppercase">
                Your Member Call-sign
              </label>
              <input
                type="text"
                placeholder="e.g. Sunita"
                value={yourNameInput}
                onChange={(e) => setYourNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 text-xs font-mono font-bold tracking-wider uppercase shadow-glow transition-all active:scale-95"
            >
              SYNCHRONIZE QUANTUM MESH
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
