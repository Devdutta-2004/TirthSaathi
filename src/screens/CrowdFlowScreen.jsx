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
  Navigation,
  Check,
  ChevronRight,
  Eye,
  CircleDot,
  Ticket
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

  // Workflow State (Clean & On-Demand)
  const [groupSize, setGroupSize] = useState(4);
  const [timeHorizonMinutes, setTimeHorizonMinutes] = useState(0); // 0 (Live), 15, 30, 60 mins
  const [surgeSimulated, setSurgeSimulated] = useState(false);
  const [selectedGateDetail, setSelectedGateDetail] = useState(null); // Gate opened on-demand
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

  // Handle Dynamic Surge Simulation
  const handleSimulateSurge = () => {
    if (!surgeSimulated) {
      setSurgeSimulated(true);
      setTimeHorizonMinutes(30);
      addToast(
        'Surge Alert Simulated',
        `ML Predictor detected sudden surge at ${activeTemple.gates[0].code}. Recommending ${recommendedGate?.code || 'Gate 2'}.`,
        'warning'
      );
    } else {
      setSurgeSimulated(false);
      setTimeHorizonMinutes(0);
      addToast('Crowd Restored', 'Corridors normalized to standard flow.', 'info');
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
    setSelectedGateDetail(null);

    addToast(
      'Darshan Pass Issued',
      `Pass #${pass.passCode} generated for ${selectedGateForPass.code}.`,
      'success'
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn pb-24 min-h-screen">
      {/* ── 1. CLEAN SHRINE SELECTOR TABS ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {temples.map((temple) => {
          const isSelected = activeTemple.id === temple.id;
          return (
            <button
              key={temple.id}
              onClick={() => {
                setActiveTemple(temple);
                setSurgeSimulated(false);
                setSelectedGateDetail(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all backdrop-blur-md ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md border border-amber-500'
                  : 'bg-white/70 text-amber-900 hover:bg-white/90 border border-amber-200/70 shadow-xs'
              }`}
            >
              <Compass className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
              <span>{temple.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── 2. CLEAN HIGH-LEVEL SHRINE STATUS HERO (MINIMAL, ZERO CLUTTER) ── */}
      <div className="bg-gradient-to-r from-amber-600/95 via-amber-700/95 to-orange-800/95 backdrop-blur-lg rounded-3xl p-6 text-white shadow-xl border border-amber-400/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-100 text-[10px] font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>TirthSaathi Flow • Live Crowd Router</span>
            </div>
            <h1 className="text-2xl font-black font-display tracking-tight text-white">
              {activeTemple.name}
            </h1>
            <p className="text-xs text-amber-100/90 max-w-xl">
              Tap any gate below to view live queues, 15/30/60-min forward predictions, and slotted entry passes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowHistoricalModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all shadow-xs"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
              <span>40-Yr Analytics</span>
            </button>

            <button
              onClick={handleSimulateSurge}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                surgeSimulated
                  ? 'bg-amber-400 text-navy-950 font-extrabold'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{surgeSimulated ? 'Reset Surge' : 'Test Surge'}</span>
            </button>
          </div>
        </div>

        {/* AI Quick Recommendation Pill */}
        {recommendedGate && (
          <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <span className="text-[10px] text-amber-200 uppercase font-bold block">Best Current Entry Corridor</span>
                <strong className="text-white text-sm">{recommendedGate.code} — {recommendedGate.name}</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedGateDetail(recommendedGate)}
              className="px-4 py-2 rounded-xl bg-white text-amber-950 hover:bg-amber-50 font-extrabold text-xs shadow-sm transition-all self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Inspect Gate Telemetry</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
            </button>
          </div>
        )}
      </div>

      {/* ── 3. CORRIDOR GATES GRID (CLEAN, SPACIOUS, VISUAL) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-amber-950 font-display tracking-tight">
            Temple Entry Gates ({allGates.length} Corridors)
          </h3>
          <span className="text-[11px] font-bold text-amber-700">Tap a gate to inspect details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allGates.map((gate) => {
            const isTop = recommendedGate?.id === gate.id;
            return (
              <div
                key={gate.id}
                onClick={() => setSelectedGateDetail(gate)}
                className={`bg-white/75 backdrop-blur-md rounded-3xl p-5 border transition-all cursor-pointer hover:shadow-md hover:bg-white/90 group flex flex-col justify-between space-y-3 ${
                  isTop
                    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-sm'
                    : 'border-amber-200/70 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-amber-950">{gate.code}</span>
                      {isTop && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Recommended
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-amber-950 group-hover:text-amber-700 transition-colors">
                      {gate.name}
                    </h4>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${gate.riskBadgeColor}`}>
                    {gate.riskLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs text-amber-900">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Est. Wait: <strong>{gate.dynamicWaitMinutes}m</strong></span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-amber-700 text-[11px] group-hover:translate-x-1 transition-transform">
                    <span>View Data & Pass</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ON-DEMAND GATE DETAIL MODAL (SHOWN ONLY WHEN USER CLICKS)
          ═══════════════════════════════════════════════════════════ */}
      {selectedGateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200 space-y-4">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 p-5 text-white relative">
              <button
                onClick={() => setSelectedGateDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-200 font-bold">{selectedGateDetail.code}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border bg-white/20 text-white border-white/30`}>
                  {selectedGateDetail.riskLabel}
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-white mt-0.5">{selectedGateDetail.name}</h3>
              <p className="text-xs text-amber-100/90">{activeTemple.name}</p>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              {/* Description */}
              <p className="text-slate-600 leading-relaxed text-xs">
                {selectedGateDetail.description}
              </p>

              {/* Prediction Horizon Selector */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <span className="font-extrabold text-amber-950 text-[11px] block">
                  ML Queue Prediction Horizon:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { mins: 0, label: 'Now' },
                    { mins: 15, label: '+15m' },
                    { mins: 30, label: '+30m (AI)' },
                    { mins: 60, label: '+60m' }
                  ].map((h) => (
                    <button
                      key={h.mins}
                      onClick={() => setTimeHorizonMinutes(h.mins)}
                      className={`py-1.5 px-1 rounded-xl text-center font-bold text-xs transition-all ${
                        timeHorizonMinutes === h.mins
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-bold">Est. Queue Wait</span>
                  <strong className="text-base font-black text-navy-950 font-display">
                    {selectedGateDetail.dynamicWaitMinutes} <span className="text-xs font-normal text-slate-500">mins</span>
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-bold">Walk Distance</span>
                  <strong className="text-base font-black text-navy-950 font-display">
                    {selectedGateDetail.distanceMeters} <span className="text-xs font-normal text-slate-500">m</span>
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-bold">Live Density</span>
                  <strong className="text-base font-black text-amber-800 font-display">
                    {selectedGateDetail.occupancyPercentage}%
                  </strong>
                </div>
              </div>

              {/* Capacity Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Occupancy Capacity</span>
                  <span className="font-mono font-bold">{selectedGateDetail.projectedOccupancy} / {selectedGateDetail.capacity}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedGateDetail.occupancyPercentage >= 80 ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedGateDetail.occupancyPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenPreBook(selectedGateDetail)}
                  className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Pre-Book Slotted Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedGateDetail(null);
                    addToast('Navigation Started', `Guiding route to ${selectedGateDetail.code}...`, 'success');
                  }}
                  className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          PRE-BOOK SLOTTED PASS MODAL
          ═══════════════════════════════════════════════════════════ */}
      {showPreBookModal && selectedGateForPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-200 space-y-4">
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 p-5 text-white relative">
              <button
                onClick={() => setShowPreBookModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-extrabold text-base text-white">Pre-Book Slotted Gate Pass</h3>
              <p className="text-xs text-amber-100">{selectedGateForPass.code} — {activeTemple.name}</p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-amber-950 block mb-1">Select Darshan Time Slot:</label>
                <select
                  value={selectedSlotTime}
                  onChange={(e) => setSelectedSlotTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-200 font-bold text-xs text-navy-900 bg-amber-50/40 focus:outline-none"
                >
                  <option value="05:30 AM - 06:30 AM">05:30 AM - 06:30 AM (Dawn Mangala Aarti)</option>
                  <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM (Morning Darshan)</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Peak Mid-Day Flow)</option>
                  <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM (Evening Sandhya Aarti)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-amber-950 block mb-1">Group Members:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGroupSize(n)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        groupSize === n
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {n} {n === 1 ? 'Person' : 'People'}
                    </button>
                  ))}
                </div>
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
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold shadow-md"
                >
                  Confirm & Issue Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          40-YEAR HISTORICAL DATASET MODAL
          ═══════════════════════════════════════════════════════════ */}
      {showHistoricalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-amber-200 flex flex-col">
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 p-5 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base">40-Year Longitudinal Yatra Matrix</h3>
                  <p className="text-xs text-amber-100">Shri Mata Vaishno Devi Shrine Board (1986–2025)</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoricalModal(false)}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-2">May</th>
                    <th className="py-2 px-2">Jun (Peak)</th>
                    <th className="py-2 px-2">Oct (Navratri)</th>
                    <th className="py-2 px-3 text-right">Annual Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {vaishnoDeviHistoricalMonthly.slice(-8).reverse().map((row) => (
                    <tr key={row.year} className="hover:bg-amber-50/50">
                      <td className="py-2 px-3 font-bold font-mono text-navy-950">{row.year}</td>
                      <td className="py-2 px-2 text-slate-600">{row.months[4].toLocaleString()}</td>
                      <td className="py-2 px-2 font-bold text-amber-800">{row.months[5].toLocaleString()}</td>
                      <td className="py-2 px-2 text-slate-600">{row.months[9].toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                        {row.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
