import React from 'react';
import { useYatra } from '../context/YatraContext';
import { syncOfflineQueue, getOfflineQueue } from '../services/offlineSyncService';
import {
  User,
  QrCode,
  ShieldCheck,
  Heart,
  Phone,
  Eye,
  Globe,
  Wifi,
  Database,
  Download,
  RotateCw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ProfileScreen = () => {
  const {
    passes,
    seniorMode,
    setSeniorMode,
    language,
    setLanguage,
    networkStatus,
    setNetworkStatus,
    offlineQueueCount,
    setActiveModal,
    addToast
  } = useYatra();

  const handleManualSync = () => {
    const count = syncOfflineQueue();
    if (count > 0) {
      addToast('✓ Cache Synchronized', `${count} offline queued records pushed to central server.`, 'success');
    } else {
      addToast('Cache Up to Date', 'All records are currently synchronized.', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* 1. USER PROFILE CARD */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-navy-900 to-yatra-blue text-white flex items-center justify-center font-bold text-2xl shadow-card flex-shrink-0">
          DD
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-navy-900">
              Devdutta Dasgupta
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-center sm:self-auto flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Pilgrim ID
            </span>
          </div>

          <p className="text-xs text-slate-500 font-mono">
            National Yatra Pass ID: TS-88410-VAR (Kashi Dham)
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-yatra-blue" /> +91 98300 12345
            </span>
            <span className="flex items-center gap-1 text-red-600 font-semibold">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> Blood Group: B+
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveModal('digital-id')}
          className="px-4 py-2.5 rounded-2xl bg-yatra-light hover:bg-yatra-blue text-yatra-blue hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-yatra-blue/30 self-stretch sm:self-auto justify-center"
        >
          <QrCode className="w-4 h-4" />
          <span>View QR Card</span>
        </button>
      </div>

      {/* 2. RECENT ENTRY PASSES WALLET */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-900 font-display flex items-center gap-2">
            <QrCode className="w-4 h-4 text-yatra-blue" />
            <span>My Active Temple Entry Passes</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {passes.length} Saved Passes
          </span>
        </div>

        {passes.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
            No entry passes generated yet. Visit <strong>Crowd Flow</strong> to get an instant gate pass.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {passes.map((pass) => (
              <div
                key={pass.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-navy-900">{pass.passCode}</span>
                    <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {pass.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mt-1">{pass.templeName}</h4>
                  <p className="text-[11px] text-slate-500">
                    Gate: <strong>{pass.gateCode}</strong> • Group of {pass.groupSize}
                  </p>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">{pass.createdAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. SETTINGS & PREFERENCES */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-navy-900 font-display">
          Accessibility & App Preferences
        </h3>

        <div className="space-y-3">
          {/* Senior Mode Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-navy-900 text-xs">Senior Devotee Mode</h4>
                <p className="text-[11px] text-slate-500">High-contrast, large text and simplified actions</p>
              </div>
            </div>

            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                seniorMode
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {seniorMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Language Selector */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-yatra-blue flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-navy-900 text-xs">Preferred Regional Language</h4>
                <p className="text-[11px] text-slate-500">Currently: {language}</p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-navy-900 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. OFFLINE DATA & CACHE INSPECTOR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-900 font-display flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Offline Sync & Storage Telemetry</span>
          </h3>

          <button
            onClick={handleManualSync}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Force Sync</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Network State</span>
            <strong className="text-emerald-700 text-xs uppercase">{networkStatus}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Offline Queue</span>
            <strong className="text-navy-900 text-xs">{offlineQueueCount} Pending</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">PWA Service Worker</span>
            <strong className="text-emerald-700 text-xs">Active (v2.0)</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Cached Dhams</span>
            <strong className="text-navy-900 text-xs">4 Temples</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
