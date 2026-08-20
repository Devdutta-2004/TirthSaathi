import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { recordGateScan, getGateScans } from '../services/passService';
import { queueOfflineAction } from '../services/offlineSyncService';
import {
  Building2,
  QrCode,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserMinus,
  Radio,
  Camera,
  History,
  Lock,
  Unlock,
  Users,
  RotateCw,
  X
} from 'lucide-react';

export const AuthorityScreen = () => {
  const {
    activeTemple,
    updateGateCrowd,
    toggleGateStatus,
    networkStatus,
    addToast
  } = useYatra();

  const [selectedGateId, setSelectedGateId] = useState(activeTemple.gates[1]?.id || activeTemple.gates[0].id);
  const [passCodeInput, setPassCodeInput] = useState('');
  const [groupSizeInput, setGroupSizeInput] = useState(4);
  const [scannerActive, setScannerActive] = useState(false);
  const [scanHistory, setScanHistory] = useState(getGateScans());

  const currentGate = activeTemple.gates.find((g) => g.id === selectedGateId) || activeTemple.gates[0];

  const handleScanSubmit = (scanType = 'ENTRY') => {
    const code = passCodeInput.trim() || `TS-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    const groupCount = Number(groupSizeInput) || 2;

    const delta = scanType === 'ENTRY' ? groupCount : -groupCount;
    updateGateCrowd(activeTemple.id, selectedGateId, delta);

    if (networkStatus === 'offline') {
      queueOfflineAction({
        type: 'GATE_SCAN',
        passCode: code,
        gateId: selectedGateId,
        scanType,
        groupCount
      });
    }

    const recorded = recordGateScan({
      passCode: code,
      gateId: selectedGateId,
      scanType,
      customGroupSize: groupCount
    });

    setScanHistory([recorded, ...scanHistory]);
    setPassCodeInput('');
    setScannerActive(false);

    addToast(
      scanType === 'ENTRY' ? `✓ Entry Recorded (+${groupCount})` : `✓ Exit Recorded (-${groupCount})`,
      `${currentGate.code} occupancy updated to ${Math.max(0, currentGate.currentCount + delta)} / ${currentGate.capacity}.`,
      'success'
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* 1. CONTROL CENTER HEADER */}
      <div className="bg-navy-900 rounded-3xl p-6 text-white shadow-float border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-navy-950 text-[10px] font-bold uppercase">
                Temple Authority & Security Control Room
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">● NODE VAR-ADMIN</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
              {activeTemple.name} — Gate Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-slate-200">
            Total Gates: <strong>{activeTemple.gates.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {networkStatus === 'online' ? 'Online Mesh Active' : 'Offline Scanning Mode'}
          </span>
        </div>
      </div>

      {/* 2. LIVE GATES TELEMETRY MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTemple.gates.map((gate) => {
          const occupancy = Math.round((gate.currentCount / gate.capacity) * 100);
          const isSelected = selectedGateId === gate.id;
          const isOpen = gate.status === 'OPEN';

          let pillColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          if (occupancy > 75) pillColor = 'bg-red-100 text-red-800 border-red-200';
          else if (occupancy > 50) pillColor = 'bg-amber-100 text-amber-800 border-amber-200';

          return (
            <div
              key={gate.id}
              onClick={() => setSelectedGateId(gate.id)}
              className={`p-5 rounded-3xl bg-white border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-yatra-blue ring-2 ring-yatra-blue/30 shadow-card'
                  : 'border-slate-200/80 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-navy-900 text-base">{gate.code}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillColor}`}>
                    {occupancy}% Full
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-3 truncate">{gate.name}</p>

                {/* Occupancy Counter */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center mb-3">
                  <span className="text-2xl font-extrabold text-navy-900 font-display">
                    {gate.currentCount}
                  </span>
                  <span className="text-xs text-slate-400 font-normal"> / {gate.capacity} Capacity</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div
                    style={{ width: `${occupancy}%` }}
                    className={`h-full rounded-full ${
                      occupancy > 75 ? 'bg-red-500' : occupancy > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Toggle Open/Close Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${isOpen ? 'text-emerald-700' : 'text-red-600'}`}>
                  ● {gate.status}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGateStatus(activeTemple.id, gate.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors"
                >
                  {isOpen ? 'Close Gate' : 'Re-open'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. INTERACTIVE QR SCANNER & ENTRY/EXIT RECORDER (Selected Gate) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <span className="text-[10px] font-bold text-yatra-blue uppercase tracking-wider">
              Live Gate Operator Console
            </span>
            <h3 className="text-lg font-bold text-navy-900 font-display">
              Scanning & Count Management: {currentGate.code} ({currentGate.name})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScannerActive(!scannerActive)}
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-yatra-sky" />
              <span>{scannerActive ? 'Hide Camera' : 'Open QR Scanner Viewfinder'}</span>
            </button>
          </div>
        </div>

        {/* Camera Viewfinder Simulator */}
        {scannerActive && (
          <div className="relative aspect-[16/9] max-w-md mx-auto rounded-3xl bg-navy-950 border-2 border-dashed border-yatra-sky/50 p-6 flex flex-col items-center justify-center text-white text-center shadow-inner overflow-hidden animate-fadeIn">
            {/* Animated Laser Scanning Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-yatra-sky shadow-glow animate-bounce" />
            <QrCode className="w-16 h-16 text-yatra-sky/60 animate-pulse mb-2" />
            <p className="text-xs font-bold">Simulated Optical QR Scanner Active</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Point camera at pilgrim entry pass or click below to simulate instant scan
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleScanSubmit('ENTRY')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                Simulate QR Pass Scan (+4 Devotees)
              </button>
            </div>
          </div>
        )}

        {/* Manual Pass Code Entry Form */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Pass Code / Token Number
            </label>
            <input
              type="text"
              placeholder="e.g. TS-PASS-8B71XA"
              value={passCodeInput}
              onChange={(e) => setPassCodeInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-yatra-blue/30"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Group Size (Headcount)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={groupSizeInput}
              onChange={(e) => setGroupSizeInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-yatra-blue/30"
            />
          </div>

          {/* Quick Entry / Exit Buttons */}
          <div className="sm:col-span-4 flex gap-2 pt-4 sm:pt-0">
            <button
              onClick={() => handleScanSubmit('ENTRY')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1"
            >
              <UserCheck className="w-4 h-4" />
              <span>Record Entry (+{groupSizeInput})</span>
            </button>

            <button
              onClick={() => handleScanSubmit('EXIT')}
              className="py-2.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <UserMinus className="w-4 h-4" />
              <span>Exit (-{groupSizeInput})</span>
            </button>
          </div>
        </div>

        {/* Audit Trail of Recent Scans */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Recent Gate Scan Audit Trail
          </h4>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {scanHistory.map((scan) => (
              <div
                key={scan.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    scan.scanType === 'ENTRY' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {scan.scanType} (+{scan.groupCount})
                  </span>
                  <span className="font-mono font-bold text-navy-900">{scan.passCode}</span>
                  <span className="text-slate-500 truncate hidden sm:inline">{scan.message}</span>
                </div>
                <span className="text-[11px] text-slate-400">{scan.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
