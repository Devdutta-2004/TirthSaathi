import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useYatra } from '../context/YatraContext';
import { calculateHaversineDistance, calculateCompassBearing } from '../services/geoService';
import { LiveGPSMap } from '../components/map/LiveGPSMap';
import {
  Users, QrCode, Share2, Copy, Check, MapPin, Bell, Phone, Navigation,
  RefreshCw, Battery, Wifi, Shield, Clock, UserPlus, Compass, AlertCircle,
  Sparkles, Radio, Eye, X, ChevronDown, Volume2, Locate, ArrowUp, Scan
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   APPLE AIRTAG–INSPIRED PRECISION FINDER SCREEN
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

  // Precision finder animation state
  const [pulsePhase, setPulsePhase] = useState(0);
  const animFrameRef = useRef(null);

  // Animate pulse phase for the precision radar
  useEffect(() => {
    let frame;
    const tick = () => {
      setPulsePhase(p => (p + 0.02) % (Math.PI * 2));
      frame = requestAnimationFrame(tick);
    };
    if (view === 'precision' && selectedMember) {
      frame = requestAnimationFrame(tick);
    }
    return () => frame && cancelAnimationFrame(frame);
  }, [view, selectedMember]);

  const handleCopyCode = () => {
    setCopied(true);
    addToast('Circle Code Copied', `Share code ${familyGroup.groupCode} with family.`, 'success');
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
    if (dist <= 3) return { text: 'Here', color: '#34D399', bg: 'rgba(52,211,153,0.15)' };
    if (dist <= 10) return { text: 'Very Close', color: '#34D399', bg: 'rgba(52,211,153,0.12)' };
    if (dist <= 30) return { text: 'Nearby', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' };
    if (dist <= 100) return { text: 'Within Range', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
    return { text: 'Far', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
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

  /* ─────────────────────────────────────────────
     PEOPLE LIST VIEW (AirTag Items List Style)
  ──────────────────────────────────────────── */
  const renderPeopleList = () => (
    <div className="space-y-4 animate-fadeIn">
      {/* PunarMilan AI Facial Finder Quick Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-amber-500/15 border border-gold-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center font-bold text-xs shadow-xs">
            <Scan className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-navy-900">PunarMilan AI (Lost Member Face Match)</h4>
            <p className="text-[11px] text-slate-600">Scan photo across 14,000+ temple CCTV checkpoints</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentScreen('punarmilan')}
          className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex-shrink-0 transition-colors"
        >
          Open AI Scanner
        </button>
      </div>

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">
            Family Live Radar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {familyGroup.members.length} device{familyGroup.members.length > 1 ? 's' : ''} connected
            <span className="text-slate-300">•</span>
            <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{familyGroup.groupCode}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopyCode}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            title="Share Circle Code">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
          </button>
          <button onClick={() => setShowJoinModal(true)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            title="Join Circle">
            <UserPlus className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <button onClick={() => setView('map')}
            className="w-8 h-8 rounded-full bg-navy-900 hover:bg-navy-800 flex items-center justify-center transition-colors shadow-xs"
            title="View Live GPS Map">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* People Cards */}
      <div className="space-y-2">
        {familyGroup.members.map((member) => {
          const distance = getLiveDistance(member);
          const bearing = getLiveBearing(member);
          const proximity = getProximityLabel(distance);
          const isThisDevice = distance === 0;

          return (
            <button
              key={member.deviceId || member.id}
              onClick={() => !isThisDevice && openPrecisionFinder(member)}
              className="w-full text-left bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3.5">
                {/* Avatar with status ring */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-2xl border-2 border-white shadow-sm">
                    {member.avatar || '👤'}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    member.isOnline || isThisDevice ? 'bg-emerald-400' : 'bg-slate-300'
                  }`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[15px] text-navy-900 truncate">
                      {member.name}{isThisDevice ? ' (You)' : ''}
                    </h3>
                    {isThisDevice && (
                      <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">This Device</span>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    {isThisDevice ? (
                      <span className="flex items-center gap-1">
                        <Locate className="w-3 h-3" /> GPS active · ±{myAccuracy}m
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span style={{ color: proximity.color }}>●</span>
                        {proximity.text}
                        <span className="text-slate-300">·</span>
                        <span className="font-mono text-xs">{distance >= 1000 ? `${(distance/1000).toFixed(1)}km` : `${distance}m`}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-mono text-xs">{bearing}°</span>
                      </span>
                    )}
                  </p>
                </div>

                {/* Right Side */}
                {!isThisDevice && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); triggerBeacon(member); }}
                      className="w-9 h-9 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors"
                      title="Play Sound"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                    <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90 group-hover:text-slate-600 transition-colors" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Person CTA */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-sm font-semibold text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Create New Family Circle
      </button>
    </div>
  );

  /* ─────────────────────────────────────────────
     PRECISION FINDER VIEW (AirTag Radar Style)
  ──────────────────────────────────────────── */
  const renderPrecisionFinder = () => {
    if (!selectedMember) return null;

    const distance = getLiveDistance(selectedMember);
    const bearing = getLiveBearing(selectedMember);
    const proximity = getProximityLabel(distance);

    // Dynamic ring sizes based on distance
    const maxRings = 4;
    const pulseScale = 0.97 + Math.sin(pulsePhase) * 0.03;

    // Arrow rotation: bearing relative to device heading
    const arrowDeg = bearing - myHeading;

    // Color gradient based on distance
    const getGradient = () => {
      if (distance <= 5) return 'from-emerald-400 via-emerald-300 to-teal-400';
      if (distance <= 20) return 'from-emerald-400 via-green-400 to-cyan-400';
      if (distance <= 50) return 'from-cyan-400 via-blue-400 to-blue-500';
      if (distance <= 150) return 'from-blue-400 via-indigo-400 to-purple-400';
      return 'from-orange-400 via-red-400 to-pink-400';
    };

    // Background hue shift
    const getBg = () => {
      if (distance <= 5) return 'bg-[#0B1A14]';
      if (distance <= 20) return 'bg-[#0B1818]';
      if (distance <= 50) return 'bg-[#0B1520]';
      if (distance <= 150) return 'bg-[#0F1328]';
      return 'bg-[#1A0F14]';
    };

    return (
      <div className={`fixed inset-0 z-50 ${getBg()} flex flex-col items-center justify-between overflow-hidden transition-colors duration-1000`}
        style={{ paddingTop: 'env(safe-area-inset-top, 20px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>

        {/* ── Top Bar ── */}
        <div className="w-full px-5 pt-3 pb-2 flex items-center justify-between z-20">
          <button onClick={() => { setView('people'); setSelectedMember(null); }}
            className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
            <ChevronDown className="w-5 h-5 rotate-90" /> Back
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-xs font-medium">Live</span>
          </div>
        </div>

        {/* ── Member Info ── */}
        <div className="text-center z-20 -mt-2">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
            {selectedMember.avatar || '👤'}
          </div>
          <h2 className="text-white text-xl font-bold tracking-tight">{selectedMember.name}</h2>
          <p className="text-white/50 text-xs font-medium mt-0.5">{selectedMember.role || 'Family Member'}</p>
        </div>

        {/* ── Giant Precision Radar ── */}
        <div className="flex-1 flex items-center justify-center w-full relative">
          {/* Concentric pulse rings */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center" style={{ transform: `scale(${pulseScale})` }}>
            {[...Array(maxRings)].map((_, i) => {
              const size = 100 + i * 55;
              const opacity = 0.08 + (maxRings - i) * 0.04;
              const delay = i * 0.3;
              return (
                <div
                  key={i}
                  className={`absolute rounded-full border bg-gradient-to-br ${getGradient()}`}
                  style={{
                    width: size, height: size,
                    borderColor: `rgba(255,255,255,${opacity})`,
                    opacity: opacity + Math.sin(pulsePhase + i * 0.8) * 0.03,
                    background: `radial-gradient(circle, rgba(255,255,255,${0.02 + (maxRings - i)*0.01}) 0%, transparent 70%)`,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              );
            })}

            {/* Center: Directional Arrow */}
            <div className="absolute z-10 flex flex-col items-center">
              {distance > 5 ? (
                <div
                  className="transition-transform duration-300 ease-out"
                  style={{ transform: `rotate(${arrowDeg}deg)` }}
                >
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-2xl`}
                    style={{ boxShadow: `0 0 60px 15px ${proximity.color}33` }}>
                    <ArrowUp className="w-10 h-10 text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                </div>
              ) : (
                // "Here" checkmark when very close
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-2xl animate-pulse"
                  style={{ boxShadow: '0 0 80px 20px rgba(52,211,153,0.3)' }}>
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
          </div>

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${proximity.color}15 0%, transparent 60%)`
            }} />
        </div>

        {/* ── Distance Display ── */}
        <div className="text-center z-20 mb-2">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-6xl font-black text-white tracking-tight tabular-nums" style={{ fontFamily: "'SF Pro Display', 'Plus Jakarta Sans', system-ui" }}>
              {distance >= 1000 ? (distance / 1000).toFixed(1) : distance}
            </span>
            <span className="text-2xl font-semibold text-white/60">
              {distance >= 1000 ? 'km' : 'm'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proximity.color }} />
            <span className="text-white/60 text-sm font-medium">{proximity.text}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/40 text-sm font-mono">{bearing}° bearing</span>
          </div>
        </div>

        {/* ── Bottom Action Bar ── */}
        <div className="w-full px-5 pb-4 space-y-2.5 z-20">
          {/* Play Sound */}
          <button
            onClick={() => triggerBeacon(selectedMember)}
            className="w-full py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2.5 active:scale-[0.97]"
          >
            <Volume2 className="w-5 h-5" />
            Play Sacred Chime on Their Phone
          </button>

          {/* Navigate on Map */}
          <button
            onClick={() => setView('map')}
            className="w-full py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2.5 active:scale-[0.97]"
          >
            <Navigation className="w-5 h-5" />
            View on Live Map
          </button>

          {/* GPS Coordinates */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-white/30 font-mono pt-1">
            <span>Their GPS: {selectedMember.coords?.lat?.toFixed(5)}, {selectedMember.coords?.lng?.toFixed(5)}</span>
            <span>·</span>
            <span>±{selectedMember.accuracy || myAccuracy}m</span>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     MAP VIEW (Full-Screen OpenStreetMap)
  ──────────────────────────────────────────── */
  const renderMapView = () => (
    <div className="space-y-4 animate-fadeIn">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button onClick={() => setView('people')}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
          <ChevronDown className="w-4 h-4 rotate-90" /> People
        </button>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-medium">Live GPS Stream</span>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-[480px] w-full">
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

      {/* Member Quick Pills Below Map */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {familyGroup.members.map((m) => {
          const dist = getLiveDistance(m);
          const prox = getProximityLabel(dist);
          const isThis = dist === 0;
          return (
            <button
              key={m.deviceId || m.id}
              onClick={() => !isThis && openPrecisionFinder(m)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                selectedMember?.id === m.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xl">{m.avatar || '👤'}</span>
              <div>
                <span className="text-xs font-semibold text-navy-900 block">{m.name}</span>
                <span className="text-[10px] font-mono" style={{ color: prox.color }}>
                  {isThis ? 'You' : `${dist}m · ${prox.text}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <div className={view === 'precision' ? '' : 'max-w-2xl mx-auto p-4 sm:p-6'}>
      {view === 'people' && renderPeopleList()}
      {view === 'precision' && renderPrecisionFinder()}
      {view === 'map' && renderMapView()}

      {/* ─── CREATE CIRCLE MODAL ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleCreateGroupSubmit}
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-lg font-bold text-navy-900">New Family Circle</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Circle Name</label>
              <input type="text" required placeholder="e.g. Sharma Family Yatra"
                value={groupNameInput} onChange={(e) => setGroupNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Name</label>
              <input type="text" placeholder="e.g. Devdutta"
                value={yourNameInput} onChange={(e) => setYourNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition" />
            </div>
            <button type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors">
              Create Circle
            </button>
          </form>
        </div>
      )}

      {/* ─── JOIN CIRCLE MODAL ─── */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleJoinGroupSubmit}
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-lg font-bold text-navy-900">Join Family Circle</h3>
              <button type="button" onClick={() => setShowJoinModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Circle Code</label>
              <input type="text" required placeholder="e.g. TS-FAM-7X29A"
                value={joinCodeInput} onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono uppercase tracking-wider focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Name</label>
              <input type="text" placeholder="e.g. Sunita"
                value={yourNameInput} onChange={(e) => setYourNameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition" />
            </div>
            <button type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors">
              Connect Devices
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
