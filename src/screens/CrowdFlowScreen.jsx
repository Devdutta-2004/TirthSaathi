import React, { useState, useMemo, useEffect } from 'react';
import { useYatra } from '../context/YatraContext';
import {
  evaluateTempleGates,
  predictMacroSeasonality,
  getContinuousLearningMetrics
} from '../services/crowdEngine';
import { createEntryPass, getStoredPasses } from '../services/passService';
import {
  vaishnoDeviHistoricalMonthly,
  MONTH_NAMES
} from '../data/historicalCrowdData';
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
  X,
  Calendar,
  Layers,
  BarChart3,
  Flame,
  Zap,
  Info,
  Navigation,
  Check,
  ChevronRight,
  Eye,
  AlertCircle
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

  // Workflow State
  const [groupSize, setGroupSize] = useState(4);
  const [timeHorizonMinutes, setTimeHorizonMinutes] = useState(0); // 0 (Live), 15, 30, 60 mins
  const [surgeSimulated, setSurgeSimulated] = useState(false);
  const [activePassModal, setActivePassModal] = useState(null);
  const [showPreBookModal, setShowPreBookModal] = useState(false);
  const [showHistoricalModal, setShowHistoricalModal] = useState(false);
  const [selectedGateForPass, setSelectedGateForPass] = useState(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState('10:00 AM - 11:00 AM');
  const [livePasses, setLivePasses] = useState(getStoredPasses());

  // Refresh passes when updated
  useEffect(() => {
    const handleUpdate = () => setLivePasses(getStoredPasses());
    window.addEventListener('tirthsaathi_passes_updated', handleUpdate);
    return () => window.removeEventListener('tirthsaathi_passes_updated', handleUpdate);
  }, []);

  // Multi-Scale ML Evaluation
  const { recommendedGate, allGates, systemAlert } = useMemo(() => {
    return evaluateTempleGates(
      activeTemple,
      groupSize,
      seniorMode,
      timeHorizonMinutes,
      livePasses,
      surgeSimulated ? { gateId: activeTemple.gates[0].id, addedPilgrims: 480 } : null
    );
  }, [activeTemple, groupSize, seniorMode, timeHorizonMinutes, livePasses, surgeSimulated]);

  // Macro Seasonal Forecast for Selected Shrine
  const macroForecast = useMemo(() => {
    const currentMonth = new Date().getMonth();
    return predictMacroSeasonality(activeTemple.id, currentMonth, 2026);
  }, [activeTemple]);

  // Handle Dynamic Surge Simulation (demonstrating proactive 25-min diversion)
  const handleSimulateSurge = () => {
    if (!surgeSimulated) {
      setSurgeSimulated(true);
      setTimeHorizonMinutes(30); // auto-forward to 30 mins to show prediction
      addToast(
        '⚠️ ML Proactive Redirection Alert!',
        `Sudden surge predicted at ${activeTemple.gates[0].code}. TirthSaathi Flow has proactively redirected pilgrims to ${recommendedGate?.code || 'Gate 2'}.`,
        'warning'
      );
    } else {
      setSurgeSimulated(false);
      setTimeHorizonMinutes(0);
      addToast('Crowd Telemetry Normalized', 'All corridors restored to normal steady flow.', 'info');
    }
  };

  // Open Pre-Booking Modal
  const handleOpenPreBook = (gate) => {
    setSelectedGateForPass(gate || recommendedGate || activeTemple.gates[0]);
    setShowPreBookModal(true);
  };

  // Generate QR Entry Pass
  const handleConfirmPreBook = () => {
    if (!selectedGateForPass) return;

    const pass = createEntryPass({
      templeId: activeTemple.id,
      templeName: activeTemple.name,
      gateId: selectedGateForPass.id,
      gateCode: selectedGateForPass.code,
      gateName: selectedGateForPass.name,
      groupSize,
      slotTime: selectedSlotTime
    });

    refreshPasses();
    setLivePasses(getStoredPasses());
    setShowPreBookModal(false);
    setActivePassModal(pass);

    addToast(
      '🎟️ QR Pass Pre-Booked & ML Indexed!',
      `Pass #${pass.passCode} generated for group of ${groupSize} at ${selectedGateForPass.code}. ML leading indicator updated!`,
      'success'
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* ── 1. SACRED MODERN HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-gold-400" />
              <span>TirthSaathi Flow 2.0</span>
              <span className="text-white/30">•</span>
              <span className="font-mono text-[10px] text-emerald-400">Continuous Learning ML Crowd Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
              Intelligent Multi-Scale Crowd & Gate Router
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Fuses 40 years of longitudinal historical data with real-time QR pre-booking leading indicators to predict and prevent bottlenecks 25–40 minutes before they form.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setShowHistoricalModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-gold-400" />
              <span>40-Yr Historical Data</span>
            </button>
            <button
              onClick={handleSimulateSurge}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-[0.98] ${
                surgeSimulated
                  ? 'bg-amber-500 hover:bg-amber-400 text-navy-950 font-extrabold animate-pulse'
                  : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{surgeSimulated ? 'Reset Surge Simulation' : 'Simulate Surge (+480 Pilgrims)'}</span>
            </button>
          </div>
        </div>

        {/* ── MULTI-SHRINE SELECTOR TABS ── */}
        <div className="flex items-center gap-2 pt-6 mt-4 border-t border-white/10 overflow-x-auto no-scrollbar">
          {temples.map((temple) => {
            const isSelected = activeTemple.id === temple.id;
            return (
              <button
                key={temple.id}
                onClick={() => {
                  setActiveTemple(temple);
                  setSurgeSimulated(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-navy-950 shadow-md font-extrabold scale-100'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{temple.name}</span>
                {temple.id === 'vaishno_devi' && (
                  <span className="text-[9px] bg-navy-950/60 text-gold-300 px-1.5 py-0.5 rounded-full font-mono">
                    1986-2025 Dataset
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. PREDICTIVE TIME HORIZON SCRUBBER & SEASONAL KPI BAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Interactive Horizon Switcher */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" />
              ML Prediction Horizon Scrubber
            </span>
            <p className="text-[11px] text-slate-500">
              Shift time horizon to inspect AI forward queue simulations.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {[
              { mins: 0, label: 'Live (Now)' },
              { mins: 15, label: '+15 Mins' },
              { mins: 30, label: '+30 Mins (AI)' },
              { mins: 60, label: '+60 Mins (Peak)' }
            ].map((hz) => (
              <button
                key={hz.mins}
                onClick={() => setTimeHorizonMinutes(hz.mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeHorizonMinutes === hz.mins
                    ? 'bg-navy-900 text-white shadow-sm scale-100'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-200'
                }`}
              >
                {hz.label}
              </button>
            ))}
          </div>
        </div>

        {/* Macro Seasonal Indicator Card */}
        <div className="lg:col-span-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-4 sm:p-5 border border-blue-800 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block">
              Tier-1 Macro Forecast ({macroForecast.month})
            </span>
            <div className="text-xl font-black font-display text-white">
              {(macroForecast.predictedMonthlyFootfall / 100000).toFixed(2)} Lakhs
            </div>
            <span className="text-[10px] text-cyan-200">
              {macroForecast.isPeakSeason ? '🔥 Peak Pilgrimage Season' : 'Steady Seasonal Flow'}
            </span>
          </div>

          <button
            onClick={() => setShowHistoricalModal(true)}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            title="View 40-Year Historical Data"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── 3. PROACTIVE SURGE WARNING BANNER (IF ACTIVE) ── */}
      {systemAlert && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 text-navy-950 shadow-lg border border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/25 border border-white/40 text-navy-950 flex items-center justify-center flex-shrink-0 font-black text-lg">
              ⚠️
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-navy-950">
                {systemAlert.title}
              </h3>
              <p className="text-xs text-navy-900/90 mt-0.5 max-w-2xl font-medium leading-relaxed">
                {systemAlert.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenPreBook(recommendedGate)}
            className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold whitespace-nowrap shadow-md self-start sm:self-auto"
          >
            Route via {recommendedGate?.code || 'Recommended Gate'} →
          </button>
        </div>
      )}

      {/* ── 4. PROACTIVE BEST GATE RECOMMENDATION HERO CARD ── */}
      {recommendedGate && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500 shadow-xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-xs">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    AI Recommended Optimal Entry
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="font-mono text-xs text-slate-500">
                    Forecast Horizon: +{timeHorizonMinutes} Mins
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-navy-950 mt-0.5">
                  {recommendedGate.code} — {recommendedGate.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${recommendedGate.riskBadgeColor}`}>
                {recommendedGate.riskLabel}
              </span>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Est. Queue Wait</span>
              </div>
              <div className="text-2xl font-black font-display text-navy-900 mt-1">
                {recommendedGate.dynamicWaitMinutes} <span className="text-xs font-semibold text-slate-500">mins</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">⚡ Lowest Waiting Time</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                <span>Walking Distance</span>
              </div>
              <div className="text-2xl font-black font-display text-navy-900 mt-1">
                {recommendedGate.distanceMeters} <span className="text-xs font-semibold text-slate-500">m</span>
              </div>
              <span className="text-[10px] text-slate-500">~{recommendedGate.walkingMinutes} min walk from hub</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                <Users className="w-3.5 h-3.5 text-gold-600" />
                <span>Projected Density</span>
              </div>
              <div className="text-2xl font-black font-display text-navy-900 mt-1">
                {recommendedGate.occupancyPercentage}%
              </div>
              <span className="text-[10px] text-slate-500">
                {recommendedGate.projectedOccupancy} / {recommendedGate.capacity} capacity
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pre-Booked Influx</span>
              </div>
              <div className="text-2xl font-black font-display text-indigo-900 mt-1">
                {recommendedGate.scheduledPreBookings} <span className="text-xs font-semibold text-slate-500">pilgrims</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-bold">● Leading Signal Factor</span>
            </div>
          </div>

          {/* Gate Description & Accessibility Perks */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 text-xs">
            <p className="text-slate-600 max-w-xl leading-relaxed">
              {recommendedGate.description}
            </p>

            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button
                onClick={() => handleOpenPreBook(recommendedGate)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 font-bold text-xs shadow-md active:scale-[0.98]"
              >
                <QrCode className="w-4 h-4" />
                <span>Pre-Book Entry Pass (Group of {groupSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. ALL CORRIDORS COMPARISON GRID (ALL 4 GATES) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-navy-900">
              All Entrance Corridors Comparison ({activeTemple.gates.length} Gates)
            </h3>
            <p className="text-xs text-slate-500">
              Real-time capacity analysis with forward 15/30/60-min queue predictions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="text-slate-500 font-bold">Group Size:</label>
            <select
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white font-bold text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {[1, 2, 4, 6, 8, 12].map((n) => (
                <option key={n} value={n}>{n} Pilgrims</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allGates.map((gate) => {
            const isTopRec = recommendedGate?.id === gate.id;
            return (
              <div
                key={gate.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isTopRec
                    ? 'border-emerald-500 shadow-md ring-1 ring-emerald-400/40'
                    : gate.riskLevel === 'CRITICAL'
                    ? 'border-red-300 bg-red-50/20 shadow-xs'
                    : 'border-slate-200/80 shadow-sm hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-navy-900">{gate.code}</span>
                        {isTopRec && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ★ Recommended
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-navy-900 mt-0.5">{gate.name}</h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${gate.riskBadgeColor}`}>
                      {gate.riskLabel}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Occupancy ({gate.occupancyPercentage}%)</span>
                      <span className="font-bold text-navy-900 font-mono">
                        {gate.projectedOccupancy} / {gate.capacity}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          gate.occupancyPercentage >= 85
                            ? 'bg-red-500'
                            : gate.occupancyPercentage >= 60
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${gate.occupancyPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-slate-600">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-slate-400 block text-[10px]">Queue Wait</span>
                      <strong className="text-navy-900 text-xs">{gate.dynamicWaitMinutes} mins</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-slate-400 block text-[10px]">Walk Dist</span>
                      <strong className="text-navy-900 text-xs">{gate.distanceMeters}m</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-slate-400 block text-[10px]">Pre-Bookings</span>
                      <strong className="text-indigo-900 text-xs">{gate.scheduledPreBookings} QR</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {gate.elderlyFriendly && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                        Elderly / Buggy
                      </span>
                    )}
                    {gate.wheelchairAccessible && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium">
                        Wheelchair
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenPreBook(gate)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Get QR Pass</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6. PRE-BOOK ENTRY PASS MODAL ── */}
      {showPreBookModal && selectedGateForPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 space-y-4">
            <div className="bg-gradient-to-r from-navy-950 to-navy-900 p-5 text-white relative">
              <button
                onClick={() => setShowPreBookModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Pre-Book Slotted Gate Pass</h3>
                  <p className="text-xs text-slate-300">{activeTemple.name}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Selected Corridor / Gate:</label>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-navy-900 flex justify-between items-center">
                  <span>{selectedGateForPass.code} — {selectedGateForPass.name}</span>
                  <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Est. {selectedGateForPass.dynamicWaitMinutes}m wait
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Entry Time Slot:</label>
                <select
                  value={selectedSlotTime}
                  onChange={(e) => setSelectedSlotTime(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-slate-200 font-bold text-navy-900 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="05:30 AM - 06:30 AM">05:30 AM - 06:30 AM (Dawn Mangala Aarti)</option>
                  <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM (Morning Darshan)</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Peak Mid-Day Flow)</option>
                  <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM (Afternoon Slotted)</option>
                  <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM (Evening Sandhya Aarti)</option>
                  <option value="08:30 PM - 09:30 PM">08:30 PM - 09:30 PM (Night Shayan Aarti)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Number of Pilgrims (Group Members):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGroupSize(num)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        groupSize === num
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num} {num === 1 ? 'Person' : 'People'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-blue-900 text-[11px] space-y-1">
                <strong>💡 ML Signal Leading Indicator Notice:</strong>
                <p className="text-blue-800/90 leading-relaxed">
                  Your pre-booking automatically coordinates gate clearance and alerts security to maintain smooth zero-bottleneck flow.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreBookModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPreBook}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 font-bold shadow-md"
                >
                  Confirm & Issue Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. GENERATED ENTRY PASS MODAL ── */}
      {activePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
              <button
                onClick={() => setActivePassModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-3xl bg-white/20 border border-white/30 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg mt-2">Verified Darshan Pass</h3>
              <p className="text-xs text-emerald-100 font-mono">Pass #{activePassModal.passCode}</p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shrine:</span>
                  <strong className="text-navy-900">{activePassModal.templeName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Designated Gate:</span>
                  <strong className="text-emerald-700">{activePassModal.gateCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Slot:</span>
                  <span className="font-bold text-slate-800">{activePassModal.slotTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Group Members:</span>
                  <span className="font-bold text-navy-900">{activePassModal.groupSize} Pilgrims</span>
                </div>
              </div>

              {/* QR Code Representation */}
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-2">
                <div className="w-32 h-32 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white font-mono text-[10px] shadow-sm">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Present at RFID / Turnstile Gate Scanner</span>
              </div>

              <button
                onClick={() => setActivePassModal(null)}
                className="w-full py-3 rounded-2xl bg-navy-950 text-white font-bold text-xs shadow-md"
              >
                Done / Save to Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. HISTORICAL 1986–2025 DATASET MODAL ── */}
      {showHistoricalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            <div className="bg-gradient-to-r from-navy-950 to-navy-900 p-5 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Historical 40-Year Longitudinal Yatra Matrix</h3>
                  <p className="text-xs text-slate-300">Shri Mata Vaishno Devi Shrine Board (1986–2025)</p>
                </div>
              </div>

              <button
                onClick={() => setShowHistoricalModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
                <strong>ML Training Baseline:</strong> Nearly 40 years of continuous ground truth records powering the Fourier seasonal multi-scale prediction curves.
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-2">Jan</th>
                      <th className="py-2.5 px-2">May</th>
                      <th className="py-2.5 px-2 bg-amber-50 text-amber-900">Jun (Peak)</th>
                      <th className="py-2.5 px-2">Oct (Navratri)</th>
                      <th className="py-2.5 px-2">Dec</th>
                      <th className="py-2.5 px-3 text-right font-black">Annual Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vaishnoDeviHistoricalMonthly.slice(-12).reverse().map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-bold font-mono text-navy-900">{row.year}</td>
                        <td className="py-2.5 px-2 text-slate-600">{row.months[0].toLocaleString()}</td>
                        <td className="py-2.5 px-2 text-slate-600">{row.months[4].toLocaleString()}</td>
                        <td className="py-2.5 px-2 font-bold text-amber-800 bg-amber-50/50">{row.months[5].toLocaleString()}</td>
                        <td className="py-2.5 px-2 text-slate-600">{row.months[9].toLocaleString()}</td>
                        <td className="py-2.5 px-2 text-slate-600">{row.months[11].toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                          {row.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
