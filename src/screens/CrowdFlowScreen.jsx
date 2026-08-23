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
  MONTH_NAMES,
  SHRINE_REGISTRY
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
  ChevronLeft,
  Eye,
  CircleDot,
  Ticket,
  Search,
  Filter,
  SlidersHorizontal,
  Sun,
  Moon,
  Clock3
} from 'lucide-react';

export const CrowdFlowScreen = () => {
  const {
    activeTemple,
    setActiveTemple,
    temples,
    seniorMode,
    refreshPasses,
    addToast
  } = useYatra();

  // State Management
  const [selectedTemple, setSelectedTemple] = useState(null); // null = Gallery View, Temple object = Detail View
  const [stateFilter, setStateFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail View Interactive Time & Date State
  const [selectedDate, setSelectedDate] = useState('Today (24 Aug)');
  const [selectedTimeHour, setSelectedTimeHour] = useState(8); // 8 AM
  const [timeHorizonMinutes, setTimeHorizonMinutes] = useState(0);
  const [surgeSimulated, setSurgeSimulated] = useState(false);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingGate, setBookingGate] = useState(null);
  const [groupSize, setGroupSize] = useState(2);
  const [generatedPass, setGeneratedPass] = useState(null);
  const [livePasses, setLivePasses] = useState(getStoredPasses());

  // Refresh passes listener
  useEffect(() => {
    const handleUpdate = () => setLivePasses(getStoredPasses());
    window.addEventListener('tirthsaathi_passes_updated', handleUpdate);
    return () => window.removeEventListener('tirthsaathi_passes_updated', handleUpdate);
  }, []);

  // Filtered Temples for Gallery View
  const allShrines = useMemo(() => Object.values(SHRINE_REGISTRY), []);
  
  const filteredTemples = useMemo(() => {
    return allShrines.filter((t) => {
      const matchState = stateFilter === 'All' || t.state.toLowerCase() === stateFilter.toLowerCase();
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchState && matchSearch;
    });
  }, [allShrines, stateFilter, searchQuery]);

  // Current active shrine evaluation for detail view
  const currentShrine = selectedTemple || activeTemple || allShrines[0];

  const { recommendedGate, allGates } = useMemo(() => {
    return evaluateTempleGates(
      currentShrine,
      groupSize,
      seniorMode,
      timeHorizonMinutes,
      livePasses,
      surgeSimulated ? { gateId: currentShrine.gates[0].id, addedPilgrims: 480 } : null
    );
  }, [currentShrine, groupSize, seniorMode, timeHorizonMinutes, livePasses, surgeSimulated]);

  // Available Time Slots for Scrubber
  const timeSlots = [
    { hour: 5, label: '05:00 AM', period: 'Dawn Mangala Aarti', rush: 'Moderate', rushColor: 'text-amber-700 bg-amber-50', wait: '15m' },
    { hour: 8, label: '08:00 AM', period: 'Morning Darshan', rush: 'Low (Ideal)', rushColor: 'text-emerald-800 bg-emerald-50', wait: '8m', isIdeal: true },
    { hour: 11, label: '11:00 AM', period: 'Mid-Day Peak Flow', rush: 'High Rush', rushColor: 'text-red-700 bg-red-50', wait: '35m' },
    { hour: 14, label: '02:00 PM', period: 'Afternoon Slotted', rush: 'Low (Ideal)', rushColor: 'text-emerald-800 bg-emerald-50', wait: '10m', isIdeal: true },
    { hour: 18, label: '06:00 PM', period: 'Sandhya Evening Aarti', rush: 'High Rush', rushColor: 'text-red-700 bg-red-50', wait: '40m' },
    { hour: 21, label: '09:00 PM', period: 'Night Shayan Darshan', rush: 'Moderate', rushColor: 'text-amber-700 bg-amber-50', wait: '12m' }
  ];

  const currentSlotInfo = timeSlots.find((s) => s.hour === selectedTimeHour) || timeSlots[1];

  // Handle Temple Card Click
  const handleOpenTemple = (temple) => {
    setSelectedTemple(temple);
    setActiveTemple(temple);
    setBookingGate(temple.gates[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Slotted QR Booking Modal
  const handleOpenBooking = (gate) => {
    setBookingGate(gate || recommendedGate || currentShrine.gates[0]);
    setShowBookingModal(true);
  };

  // Confirm Slotted QR Booking
  const handleConfirmBooking = () => {
    if (!bookingGate) return;

    const pass = createEntryPass({
      templeId: currentShrine.id,
      templeName: currentShrine.name,
      gateId: bookingGate.id,
      gateCode: bookingGate.code,
      gateName: bookingGate.name,
      groupSize,
      slotTime: `${currentSlotInfo.label} - ${currentSlotInfo.period}`
    });

    refreshPasses();
    setLivePasses(getStoredPasses());
    setShowBookingModal(false);
    setGeneratedPass(pass);

    addToast(
      'Darshan Pass Issued',
      `Pass #${pass.passCode} confirmed for ${bookingGate.code}. Leading crowd signal indexed!`,
      'success'
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn pb-24 min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
          VIEW 1: ALL TEMPLES GALLERY (INITIAL WIREFRAME VIEW)
          ═══════════════════════════════════════════════════════════ */}
      {!selectedTemple && (
        <div className="space-y-5">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-600/95 via-amber-700/95 to-orange-800/95 backdrop-blur-lg rounded-3xl p-6 text-white shadow-xl border border-amber-400/40 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-100 text-[10px] font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Live Temple Crowd Radar & Slotted Pass</span>
            </div>
            <h1 className="text-2xl font-black font-display tracking-tight text-white">
              Pilgrimage Corridors & Live Crowd Flow
            </h1>
            <p className="text-xs text-amber-100/90 max-w-xl leading-relaxed">
              Select any sacred shrine to view live gate crowd density, inspect 3D perspective views, find ideal visit timings, and book instant QR passes.
            </p>
          </div>

          {/* Search & State Filter Pills */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-amber-600 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search Somnath, Dwarkadhish, Ram Mandir, Kedarnath, Ambaji..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/75 backdrop-blur-md border border-amber-200/80 text-xs text-amber-950 placeholder:text-amber-700/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {['All', 'Gujarat', 'Uttar Pradesh', 'Uttarakhand', 'Jammu & Kashmir', 'Andhra Pradesh', 'Madhya Pradesh'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStateFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all backdrop-blur-md ${
                    stateFilter === st
                      ? 'bg-amber-600 text-white shadow-sm border border-amber-500'
                      : 'bg-white/70 text-amber-900 hover:bg-white/90 border border-amber-200/70 shadow-xs'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Temples Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTemples.map((temple) => (
              <div
                key={temple.id}
                onClick={() => handleOpenTemple(temple)}
                className="bg-white/75 backdrop-blur-md rounded-3xl overflow-hidden border border-amber-200/70 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                {/* Temple Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-sm text-navy-950 shadow-sm border border-white/20 font-display">
                      {temple.tag || temple.state}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CircleDot className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                      <span>Live Monitored</span>
                    </span>
                  </div>

                  {/* Bottom Text Over Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                    <h3 className="font-extrabold text-base tracking-tight drop-shadow-sm font-display">
                      {temple.name}
                    </h3>
                    <p className="text-[11px] text-amber-200/90 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{temple.location}</span>
                    </p>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="p-4 space-y-3 bg-white/50 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>{temple.gates.length} Entry Gates</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>Avg Wait ~15m</span>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-200/80 transition-all flex items-center justify-center gap-1 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600">
                    <span>Inspect 3D View & Gate Rush</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          VIEW 2: DEDICATED TEMPLE 3D VIEW & GATE RUSH BREAKDOWN
          ═══════════════════════════════════════════════════════════ */}
      {selectedTemple && (
        <div className="space-y-6 animate-fadeIn">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedTemple(null)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/75 backdrop-blur-md border border-amber-200/80 text-amber-900 hover:bg-white text-xs font-bold shadow-xs transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All Temples</span>
            </button>

            <button
              onClick={() => handleOpenBooking(null)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold text-xs shadow-md"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Slotted QR Pass</span>
            </button>
          </div>

          {/* ── 1. 3D SIDE VIEW PERSPECTIVE HERO BANNER ── */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-200/80 group">
            <img
              src={currentShrine.threeDImage || currentShrine.image}
              alt={currentShrine.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/30 to-transparent" />

            {/* Top 3D Badge */}
            <div className="absolute top-4 left-4">
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-navy-950 shadow-md border border-white/20 font-display flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>3D Perspective View • {currentShrine.tag}</span>
              </span>
            </div>

            {/* Bottom Details Overlay */}
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white drop-shadow-md">
                {currentShrine.name}
              </h2>
              <p className="text-xs text-amber-200/90 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentShrine.location}</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-300 font-bold">🟢 Live Crowd Monitored</span>
              </p>
              <p className="text-[11px] text-slate-300/90 line-clamp-2 pt-1 max-w-2xl">
                {currentShrine.description}
              </p>
            </div>
          </div>

          {/* ── 2. VISUALLY SHOWS CROWD DENSITY AT EACH ENTRY GATE ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-amber-950 font-display tracking-tight">
                  Gate Entry Corridors & Real-Time Density
                </h3>
                <p className="text-[11px] text-amber-800/80">Live queue clearance rates and crowd occupancy</p>
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {allGates.length} Corridors Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allGates.map((gate) => {
                const isRecommended = recommendedGate?.id === gate.id;
                return (
                  <div
                    key={gate.id}
                    className={`bg-white/75 backdrop-blur-md rounded-3xl p-5 border transition-all space-y-3 hover:shadow-md hover:bg-white/90 ${
                      isRecommended
                        ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                        : 'border-amber-200/70 shadow-xs'
                    }`}
                  >
                    {/* Gate Title & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-amber-950">{gate.code}</span>
                          {isRecommended && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Recommended</span>
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-amber-950">{gate.name}</h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${gate.riskBadgeColor}`}>
                        {gate.riskLabel}
                      </span>
                    </div>

                    {/* Visual Density Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">Live Crowd Density:</span>
                        <strong className="text-amber-950 font-display">{gate.occupancyPercentage}% Occupancy</strong>
                      </div>

                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            gate.occupancyPercentage >= 80
                              ? 'bg-gradient-to-r from-red-500 to-rose-600'
                              : gate.occupancyPercentage >= 60
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          }`}
                          style={{ width: `${gate.occupancyPercentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{gate.projectedOccupancy} in queue</span>
                        <span>Max Cap: {gate.capacity}</span>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-100 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Wait: <strong>{gate.dynamicWaitMinutes}m</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                        <Footprints className="w-3.5 h-3.5 text-amber-600" />
                        <span>Distance: <strong>{gate.distanceMeters}m</strong></span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleOpenBooking(gate)}
                      className="w-full py-2 rounded-xl bg-amber-500/15 hover:bg-amber-600 hover:text-white text-amber-950 font-bold text-xs border border-amber-300/80 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Book Pass for {gate.code.split(' ')[0]}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 3. INTERACTIVE DATE & TIME SELECTOR / IDEAL VISIT FINDER ── */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-amber-950 font-display">
                    Interactive Ideal Visit Time & Prediction
                  </h3>
                  <p className="text-[11px] text-amber-800/80">Select date and hour to discover low-rush windows</p>
                </div>
              </div>
            </div>

            {/* Date Selection Pills */}
            <div>
              <span className="text-xs font-bold text-amber-950 block mb-1.5">Select Visit Date:</span>
              <div className="grid grid-cols-3 gap-2">
                {['Today (24 Aug)', 'Tomorrow (25 Aug)', 'Weekend (26 Aug)'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 px-1 rounded-xl text-center font-bold text-xs transition-all ${
                      selectedDate === d
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-amber-50/50 text-amber-900 border border-amber-200/70 hover:bg-amber-100/60'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Scrubber */}
            <div>
              <span className="text-xs font-bold text-amber-950 block mb-1.5">Select Time Window:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeHour === slot.hour;
                  return (
                    <button
                      key={slot.hour}
                      onClick={() => setSelectedTimeHour(slot.hour)}
                      className={`p-3 rounded-2xl text-left border transition-all space-y-1 ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/30'
                          : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-black text-navy-950">{slot.label}</strong>
                        {slot.isIdeal && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Ideal Time
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">{slot.period}</span>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className={`font-bold px-1.5 py-0.2 rounded ${slot.rushColor}`}>
                          {slot.rush}
                        </span>
                        <span className="text-slate-600 font-bold">~{slot.wait} wait</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Dynamic Evaluation Highlight Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-600/15 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>AI Visit Forecast for {selectedDate} at {currentSlotInfo.label}:</span>
                </div>
                <p className="text-xs text-amber-900 font-medium">
                  {currentSlotInfo.isIdeal
                    ? `✨ Highly Recommended Window! Minimal queue expected (~${currentSlotInfo.wait} wait).`
                    : `⚠️ Heavy Aarti Rush expected (~${currentSlotInfo.wait} wait). We recommend arriving 20 mins early.`}
                </p>
              </div>

              <button
                onClick={() => handleOpenBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>Book This Slot ({currentSlotInfo.label})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 1: SLOTTED DARSHAN PASS BOOKING
          ═══════════════════════════════════════════════════════════ */}
      {showBookingModal && bookingGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200 space-y-4">
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 p-5 text-white relative">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-extrabold text-base text-white">{currentShrine.name}</h3>
              <p className="text-xs text-amber-100">{bookingGate.code} • Official Slotted Darshan Pass</p>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              {/* Date */}
              <div>
                <label className="font-extrabold text-amber-950 block mb-1">Darshan Date:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today (24 Aug)', 'Tomorrow (25 Aug)', 'Weekend (26 Aug)'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`py-2 rounded-xl text-center font-bold border transition-all text-xs ${
                        selectedDate === d
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Window */}
              <div>
                <label className="font-extrabold text-amber-950 block mb-1">Time Slot:</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((s) => (
                    <button
                      key={s.hour}
                      type="button"
                      onClick={() => setSelectedTimeHour(s.hour)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        selectedTimeHour === s.hour
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/30'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="font-bold text-xs text-navy-950 block">{s.label}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{s.period}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Gate */}
              <div>
                <label className="font-extrabold text-amber-950 block mb-1">Selected Corridor Gate:</label>
                <div className="grid grid-cols-2 gap-2">
                  {currentShrine.gates.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setBookingGate(g)}
                      className={`p-2.5 rounded-xl text-left font-bold text-xs border transition-all ${
                        bookingGate.id === g.id
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-1 ring-emerald-400'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{g.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Size */}
              <div>
                <label className="font-extrabold text-amber-950 block mb-1">Group Size (Devotees):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGroupSize(n)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        groupSize === n
                          ? 'bg-navy-950 text-white border-navy-950'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {n} {n === 1 ? 'Person' : 'Devotees'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold shadow-md"
                >
                  Confirm & Issue QR Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 2: ISSUED QR DARSHAN PASS
          ═══════════════════════════════════════════════════════════ */}
      {generatedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-amber-200 text-center space-y-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
              <button
                onClick={() => setGeneratedPass(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-3xl bg-white/20 border border-white/30 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg mt-2">Verified Darshan Pass</h3>
              <p className="text-xs text-emerald-100 font-mono">Pass #{generatedPass.passCode}</p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shrine:</span>
                  <strong className="text-navy-900">{generatedPass.templeName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Entry Gate:</span>
                  <strong className="text-emerald-700">{generatedPass.gateCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slot:</span>
                  <span className="font-bold text-slate-800">{generatedPass.slotTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Devotees:</span>
                  <span className="font-bold text-navy-900">{generatedPass.groupSize} Pilgrims</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-2">
                <div className="w-32 h-32 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white shadow-sm">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Scan at RFID / Turnstile Scanner</span>
              </div>

              <button
                onClick={() => setGeneratedPass(null)}
                className="w-full py-3 rounded-2xl bg-navy-950 text-white font-bold text-xs shadow-md"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
