import React, { useState, useMemo } from 'react';
import { useYatra } from '../context/YatraContext';
import { evaluateTempleGates } from '../services/crowdEngine';
import { createEntryPass } from '../services/passService';
import {
  Compass,
  Users,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  QrCode,
  Download,
  Share2,
  RotateCcw,
  Footprints,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';

export const CrowdFlowScreen = () => {
  const {
    activeTemple,
    setActiveTemple,
    temples,
    updateGateCrowd,
    seniorMode,
    refreshPasses,
    addToast
  } = useYatra();

  // Workflow state
  const [groupSize, setGroupSize] = useState(4);
  const [surgeSimulated, setSurgeSimulated] = useState(false);
  const [activePassModal, setActivePassModal] = useState(null);
  const [selectedGateDetails, setSelectedGateDetails] = useState(null);

  // Evaluate gates using the scoring algorithm
  const { recommendedGate, allGates } = useMemo(() => {
    return evaluateTempleGates(activeTemple, groupSize, seniorMode);
  }, [activeTemple, groupSize, seniorMode]);

  // Handle Dynamic Surge Simulation (demonstrates intelligent dynamic redirection!)
  const handleSimulateSurge = () => {
    if (!surgeSimulated) {
      // Simulate sudden surge at Gate B (e.g. +450 pilgrims arrive)
      updateGateCrowd(activeTemple.id, 'gate-b', 460);
      setSurgeSimulated(true);
      addToast(
        '⚠️ Dynamic Gate Redirection Alert!',
        'Gate B has experienced a sudden surge (78% capacity). TirthSaathi Flow has automatically redirected you to Gate D.',
        'warning'
      );
    } else {
      // Reset back
      updateGateCrowd(activeTemple.id, 'gate-b', -460);
      setSurgeSimulated(false);
      addToast('Crowd Telemetry Normalized', 'Gate B capacity restored to normal flow.', 'info');
    }
  };

  // Generate QR Entry Pass
  const handleGeneratePass = (gate) => {
    const targetGate = gate || recommendedGate;
    const pass = createEntryPass({
      templeId: activeTemple.id,
      templeName: activeTemple.name,
      gateId: targetGate.id,
      gateCode: targetGate.code,
      gateName: targetGate.name,
      groupSize,
      slotTime: '10:30 AM - 11:15 AM'
    });

    refreshPasses();
    setActivePassModal(pass);
    addToast(
      '🎟️ Entry Pass Generated!',
      `Pass #${pass.passCode} for group of ${groupSize} assigned to ${targetGate.code}.`,
      'success'
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* 1. TOP BANNER */}
      <div className="bg-gradient-to-r from-navy-900 via-yatra-blue to-navy-900 rounded-3xl p-6 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-yatra-gold text-xs font-bold uppercase tracking-wider mb-2 border border-white/20">
              <Compass className="w-3.5 h-3.5" /> Flagship Technology #2: TirthSaathi Flow
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
              Intelligent Temple Crowd Flow & Gate Router
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
              Algorithmic load balancing across temple gates to minimize queue times and prevent congestion bottlenecks.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-sky-200 block">Current Temple</span>
            <span className="text-sm font-bold text-white font-display">{activeTemple.name}</span>
          </div>
        </div>
      </div>

      {/* 2. STEP 1 & 2: TEMPLE & GROUP SIZE CONTROLS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Step 1: Select Temple */}
        <div className="md:col-span-7">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Step 1: Select Sacred Destination
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {temples.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTemple(t);
                  setSurgeSimulated(false);
                }}
                className={`p-2.5 rounded-2xl text-left border transition-all text-xs font-bold ${
                  activeTemple.id === t.id
                    ? 'bg-yatra-light border-yatra-blue text-yatra-blue shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <span className="block truncate">{t.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">{t.city}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Group Size Selector */}
        <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
            Step 2: How many pilgrims are visiting?
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setGroupSize((s) => Math.max(1, s - 1))}
              className="w-10 h-10 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-navy-900 font-extrabold text-lg flex items-center justify-center transition-colors shadow-sm"
            >
              −
            </button>
            <div className="text-center min-w-16">
              <span className="text-3xl font-extrabold font-display text-navy-900">{groupSize}</span>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Pilgrims</span>
            </div>
            <button
              onClick={() => setGroupSize((s) => Math.min(20, s + 1))}
              className="w-10 h-10 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-navy-900 font-extrabold text-lg flex items-center justify-center transition-colors shadow-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC REDIRECTION ALERT BANNER (If surge simulated) */}
      {surgeSimulated && (
        <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm flex items-start gap-3.5 animate-fadeIn">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 animate-bounce">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-950">
                ⚠️ Dynamic Gate Redirection Activated!
              </h4>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-mono font-bold px-2 py-0.5 rounded">
                LIVE RE-CALCULATION
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              Gate B is experiencing unexpected surge congestion (78% occupancy). The algorithm has automatically reassigned your group to <strong>Gate D (Estimated wait: 15 mins)</strong>.
            </p>
          </div>
        </div>
      )}

      {/* 4. PROMINENT RECOMMENDED GATE CARD */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50/50 rounded-4xl p-6 sm:p-7 border-2 border-emerald-300 shadow-float relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Best Recommended Gate for You
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-navy-900">
              🟢 {recommendedGate.code} ({recommendedGate.name})
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {recommendedGate.description}
            </p>
          </div>

          {/* Quick Get Pass CTA */}
          <button
            onClick={() => handleGeneratePass(recommendedGate)}
            className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
          >
            <QrCode className="w-4 h-4" />
            <span>Get QR Entry Pass</span>
          </button>
        </div>

        {/* 3 Vital Recommendation Metrics */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Wait</span>
            <span className="text-xl font-extrabold text-emerald-700 font-display mt-0.5 block">
              ~{recommendedGate.estimatedWaitMin} min
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Occupancy</span>
            <span className="text-xl font-extrabold text-navy-900 font-display mt-0.5 block">
              {recommendedGate.occupancyPercent}%
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Distance</span>
            <span className="text-xl font-extrabold text-yatra-blue font-display mt-0.5 block">
              {recommendedGate.distanceMeters}m
            </span>
          </div>
        </div>

        {/* Why this gate was picked */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-1">
          <span className="flex items-center gap-1.5 font-medium text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Algorithm Score: <strong>{recommendedGate.score} (Lowest Congestion)</strong>
          </span>

          {/* Simulate Surge Test Button */}
          <button
            onClick={handleSimulateSurge}
            className="text-[11px] font-bold text-slate-600 hover:text-navy-900 underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3 text-amber-600" />
            <span>{surgeSimulated ? 'Reset Surge Test' : 'Test Dynamic Surge Redirection'}</span>
          </button>
        </div>
      </div>

      {/* 5. ALL GATES COMPARISON GRID */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          All Temple Entry Gates Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allGates.map((gate) => {
            const isTop = gate.id === recommendedGate.id;
            let badgeColor = 'bg-emerald-100 text-emerald-800';
            let statusDot = 'bg-emerald-500';

            if (gate.occupancyPercent > 75) {
              badgeColor = 'bg-red-100 text-red-800';
              statusDot = 'bg-red-500';
            } else if (gate.occupancyPercent > 50) {
              badgeColor = 'bg-amber-100 text-amber-800';
              statusDot = 'bg-amber-500';
            }

            return (
              <div
                key={gate.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  isTop
                    ? 'border-emerald-300 ring-2 ring-emerald-200/60 shadow-sm'
                    : 'border-slate-200/80 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${statusDot}`} />
                      <h4 className="font-bold text-navy-900 text-base">{gate.code}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                      {gate.occupancyPercent}% Occupied
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-semibold mb-1">{gate.name}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {gate.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      style={{ width: `${gate.occupancyPercent}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        gate.occupancyPercent > 75
                          ? 'bg-red-500'
                          : gate.occupancyPercent > 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> ~{gate.estimatedWaitMin} min queue
                    </span>
                    <span>Distance: {gate.distanceMeters}m</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => handleGeneratePass(gate)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-yatra-light text-navy-900 hover:text-yatra-blue text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Select & Get Pass</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. SIMPLIFIED 2D TEMPLE CROWD MAP */}
      <div className="bg-navy-900 rounded-3xl p-6 text-white border border-slate-700/80 shadow-float space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Footprints className="w-4 h-4 text-yatra-sky" />
            <span className="font-bold uppercase font-mono">Temple Gate Floorplan & Walking Route</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">● LIVE GATE MESH ACTIVE</span>
        </div>

        {/* 2D Canvas */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl bg-gradient-to-b from-navy-950 to-[#0A2240] border border-slate-700 overflow-hidden flex items-center justify-center p-4">
          {/* Temple Sanctum in Center */}
          <div className="w-28 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex flex-col items-center justify-center text-center shadow-glow z-10">
            <span className="text-xl">🛕</span>
            <span className="text-[9px] font-bold text-amber-200 uppercase tracking-widest mt-0.5">
              Inner Sanctum
            </span>
          </div>

          {/* Gate Markers Positioned around Sanctum */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-md">
              Gate A (82% High)
            </span>
          </div>

          <div className="absolute bottom-4 left-1/4 -translate-x-1/2 flex flex-col items-center">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-glow ring-2 ring-white">
              Gate B (31% Recommended) ⭐
            </span>
          </div>

          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center">
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-md">
              Gate C (64% Med)
            </span>
          </div>

          <div className="absolute bottom-4 right-1/4 -translate-x-1/2 flex flex-col items-center">
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md">
              Gate D (Senior/Pass)
            </span>
          </div>

          {/* User Walking Path to Gate B */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-400">
            <line x1="10%" y1="90%" x2="25%" y2="78%" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
          </svg>
          <div className="absolute bottom-3 left-4 bg-white text-navy-900 px-2 py-0.5 rounded-full text-[9px] font-bold">
            🚶 You are here (650m to Gate B)
          </div>
        </div>
      </div>

      {/* 7. GENERATED ENTRY PASS MODAL */}
      {activePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-yatra-blue uppercase tracking-wider">
                Temple Entry Token Pass
              </span>
              <button
                onClick={() => setActivePassModal(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pass QR Box */}
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200">
              <div className="w-40 h-40 mx-auto bg-navy-900 rounded-2xl p-2.5 flex flex-col justify-between text-white font-mono text-[9px] shadow-inner">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-2 border-white rounded-md p-1 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-white rounded-xs" />
                  </div>
                  <div className="w-8 h-8 border-2 border-white rounded-md p-1 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-white rounded-xs" />
                  </div>
                </div>
                <div className="text-[8px] text-yatra-sky font-bold">
                  {activePassModal.passCode}
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 border-2 border-white rounded-md p-1 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-white rounded-xs" />
                  </div>
                  <span className="text-[7px] text-amber-300 font-bold">{activePassModal.gateCode}</span>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-navy-900 text-base">{activePassModal.templeName}</h3>
                <span className="font-bold text-emerald-700 text-sm block mt-0.5">
                  Assigned Gate: {activePassModal.gateCode}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Valid for: <strong>Group of {activePassModal.groupSize} Pilgrims</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Slot: {activePassModal.slotTime}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  addToast('Pass Saved to Wallet', 'Entry pass saved offline for gate scanning.', 'success');
                  setActivePassModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-yatra-blue hover:bg-yatra-bright text-white text-xs font-bold shadow-sm"
              >
                Save Pass Offline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
