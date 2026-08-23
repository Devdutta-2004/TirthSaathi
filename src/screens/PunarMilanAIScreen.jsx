import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useYatra } from '../context/YatraContext';
import {
  analyzeAndMatchFace,
  loadFaceModels
} from '../services/aiFaceEngine';
import {
  getMissingPersons,
  getCitizenSightings,
  getAIAuditLogs,
  calculateAIAccuracyMetrics,
  updateAuditGroundTruth,
  getBenchmarkDevotees,
  addBenchmarkDevotee,
  clearAllLocalMissingData,
  exportGovernmentDocketCSV,
  exportGovernmentDocketJSON
} from '../services/missingPersonStore';
import {
  Sparkles,
  Upload,
  Camera,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
  Eye,
  UserPlus,
  Radio,
  Share2,
  Scan,
  XCircle,
  Binary,
  Cpu,
  BarChart3,
  Download,
  Users,
  Locate,
  Check,
  Flame,
  FileSpreadsheet,
  FileJson,
  ExternalLink,
  ChevronRight,
  Trash2,
  PlusCircle,
  Award,
  RotateCcw
} from 'lucide-react';

export const PunarMilanAIScreen = () => {
  const { addToast, setActiveModal } = useYatra();

  // Navigation Tabs: 'scan' | 'database' | 'sightings' | 'accuracy'
  const [activeTab, setActiveTab] = useState('scan');

  // Scanner State - Defaults to Plain / No Image
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activePreset, setActivePreset] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [modelsReady, setModelsReady] = useState(false);
  const fileInputRef = useRef(null);

  // Live Data Lists (Synced across app)
  const [missingPersonsList, setMissingPersonsList] = useState(getMissingPersons());
  const [citizenSightingsList, setCitizenSightingsList] = useState(getCitizenSightings());
  const [benchmarkDevotees, setBenchmarkDevotees] = useState(getBenchmarkDevotees());
  const [auditLogs, setAuditLogs] = useState(getAIAuditLogs());

  // Database search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const accuracyMetrics = useMemo(() => calculateAIAccuracyMetrics(), [auditLogs]);

  // Pre-load ML neural network models and listen for DB updates
  useEffect(() => {
    loadFaceModels()
      .then(() => setModelsReady(true))
      .catch((e) => console.warn('Model pre-load notice:', e.message));

    const handleDbChange = () => {
      setMissingPersonsList(getMissingPersons());
      setCitizenSightingsList(getCitizenSightings());
      setBenchmarkDevotees(getBenchmarkDevotees());
      setAuditLogs(getAIAuditLogs());
    };

    window.addEventListener('tirthsaathi_db_updated', handleDbChange);
    return () => window.removeEventListener('tirthsaathi_db_updated', handleDbChange);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedPhoto(event.target.result);
      setActivePreset(null);
      setScanResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setSelectedPhoto(null);
    setActivePreset(null);
    setScanResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectPreset = (preset) => {
    setSelectedPhoto(preset.previewUrl);
    setActivePreset(preset.id);
    setScanResult(null);
  };

  const handleStartScan = async () => {
    if (!selectedPhoto) {
      addToast('Select a Photo', 'Please upload a portrait photo or select a benchmark devotee.', 'warning');
      return;
    }
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await analyzeAndMatchFace(selectedPhoto, (stepInfo) => {
        setScanStep(stepInfo);
      }, 'manual_search');

      setIsScanning(false);
      setScanResult(result);
      setAuditLogs(getAIAuditLogs());

      if (!result.hasFace) {
        addToast('No Face Detected', result.message, 'warning');
      } else if (result.isMatchFound) {
        addToast(
          '🎯 Confirmed Biometric Match!',
          `${result.topMatch.similarityScore}% similarity with ${result.topMatch.name} (${result.inferenceTimeMs}ms)`,
          'success'
        );
      } else {
        addToast(
          'No Match in Registered Database',
          `Face detected (Age ~${result.detectedBiometrics.estimatedAge}), but Euclidean distance d=${result.topMatch ? result.topMatch.euclideanDistance : '0.8+'} was above threshold.`,
          'info'
        );
      }
    } catch (err) {
      setIsScanning(false);
      addToast('Scan Error', err.message, 'error');
    }
  };

  const handleGroundTruthFeedback = (queryId, status) => {
    const { updatedLogs, updatedLog } = updateAuditGroundTruth(queryId, status);
    setAuditLogs(updatedLogs);

    if (status === 'true_positive' && scanResult?.topMatch) {
      const updatedBenchmarks = addBenchmarkDevotee({
        label: `${scanResult.topMatch.name} (${scanResult.topMatch.age})`,
        name: scanResult.topMatch.name,
        previewUrl: selectedPhoto || scanResult.topMatch.image,
        targetMatchId: scanResult.topMatch.id,
        tag: `Verified Case #${scanResult.topMatch.id.slice(-4)}`,
        description: `${scanResult.topMatch.similarityScore}% similarity • Confirmed Ground Truth (Euclidean d=${scanResult.topMatch.euclideanDistance})`,
        verifiedAccuracy: '100% True Positive (Verified)'
      });
      setBenchmarkDevotees(updatedBenchmarks);
      addToast(
        '🌟 Benchmark Devotees Updated!',
        `${scanResult.topMatch.name}'s verified photo was added to Benchmark Devotees as ground truth!`,
        'success'
      );
    } else if (status === 'true_negative' && selectedPhoto) {
      const updatedBenchmarks = addBenchmarkDevotee({
        label: `Verified Non-Match (${scanResult?.detectedBiometrics?.estimatedAge || 30}y)`,
        name: `Verified Non-Match Pilgrim`,
        previewUrl: selectedPhoto,
        targetMatchId: null,
        tag: 'Verified Unknown Devotee',
        description: `Euclidean d=${scanResult?.topMatch?.euclideanDistance || '0.85'} • Confirmed True Negative Rejection`,
        verifiedAccuracy: '100% True Negative (Verified)'
      });
      setBenchmarkDevotees(updatedBenchmarks);
      addToast(
        '🌟 Benchmark Devotees Updated!',
        'Verified non-match face was added to Benchmark Devotees as a negative control!',
        'success'
      );
    } else {
      addToast('Accuracy Audit Updated', `Query marked as ${status.replace('_', ' ').toUpperCase()}`, 'info');
    }
  };

  const handleResetAllData = async () => {
    if (window.confirm('Are you sure you want to clear all data and start completely fresh?')) {
      await clearAllLocalMissingData();
      handleClearPhoto();
      addToast('Database Reset', 'All database tables and local cache cleared.', 'info');
    }
  };

  // Filtered Missing Profiles
  const missingProfiles = useMemo(() => {
    return missingPersonsList.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.lastSeen && p.lastSeen.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [missingPersonsList, searchQuery, statusFilter]);

  const citizenSightings = citizenSightingsList;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>PunarMilan AI 2.0 (पुनर्मिलन)</span>
              <span className="text-white/30">•</span>
              <span className="font-mono text-[10px] text-emerald-400">Cloudflare R2 + Supabase PostgreSQL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Biometric Facial Recognition & Sighting Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Sub-millisecond mathematical vector search across registered pilgrims with permanent Cloudflare photo hosting, dynamic benchmark accuracy learning, and Supabase PostgreSQL cloud sync.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setActiveModal('report-sighting')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              <Eye className="w-4 h-4" />
              <span>I Found Someone</span>
            </button>
            <button
              onClick={() => setActiveModal('report-missing')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 text-xs font-bold shadow-md hover:shadow-gold-500/20 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Missing Case</span>
            </button>
            <button
              onClick={handleResetAllData}
              title="Reset all data to empty"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── CLEAN MODERN TAB SWITCHER ── */}
        <div className="flex items-center gap-1.5 pt-6 mt-4 border-t border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'scan', label: 'AI Facial Search', icon: Scan },
            { id: 'database', label: `Missing Database (${missingProfiles.length})`, icon: Users },
            { id: 'sightings', label: `Citizen Sightings (${citizenSightings.length})`, icon: Eye },
            { id: 'accuracy', label: `AI Accuracy & Govt Audit (${accuracyMetrics.accuracyRate}%)`, icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-navy-950 shadow-md scale-100'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TAB 1: AI FACIAL SEARCH (CLEAN & MINIMAL SCANNER)
          ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'scan' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Minimal Photo Dropzone Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Portrait Photo
                </span>
                <div className="flex items-center gap-2">
                  {selectedPhoto && (
                    <button
                      onClick={handleClearPhoto}
                      className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>

              {/* Photo Viewport / Plain Minimal Upload State */}
              <div
                onClick={() => !selectedPhoto && fileInputRef.current?.click()}
                className={`relative aspect-[4/3] rounded-3xl overflow-hidden transition-all flex items-center justify-center group ${
                  selectedPhoto
                    ? 'bg-navy-950 border border-slate-800 shadow-inner'
                    : 'cursor-pointer border-2 border-dashed border-slate-300 hover:border-yatra-blue bg-slate-50/70 hover:bg-blue-50/30'
                }`}
              >
                {selectedPhoto ? (
                  <>
                    <img
                      src={selectedPhoto}
                      alt="Scan Target"
                      className={`w-full h-full object-cover transition-opacity duration-300 ${isScanning ? 'opacity-70' : 'opacity-100'}`}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearPhoto();
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md z-10"
                      title="Clear photo"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900">Upload Portrait or Choose Registered Profile</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Drag & drop a pilgrim photo here or click upload to test facial vector matching.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                      <Upload className="w-3 h-3" /> Select File from Device
                    </span>
                  </div>
                )}

                {/* Laser Scanning Animation */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-navy-950/60 backdrop-blur-[2px]">
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-scan" />
                    <div className="w-48 h-56 border-2 border-dashed border-cyan-400/90 rounded-3xl relative animate-pulse flex items-center justify-center">
                      <div className="grid grid-cols-4 gap-4 opacity-70">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" style={{ animationDelay: `${i * 100}ms` }} />
                        ))}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-navy-900/95 border border-cyan-500/30 rounded-2xl p-2.5 text-center text-xs text-cyan-200 shadow-xl">
                      <span className="font-mono">{scanStep?.text || 'Extracting 128D mathematical vector...'}</span>
                    </div>
                  </div>
                )}

                {/* Bounding Box on Completed Scan */}
                {scanResult && !isScanning && scanResult.hasFace && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className={`w-48 h-56 border-2 rounded-3xl relative ${scanResult.isMatchFound ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.35)]' : 'border-amber-400'}`}>
                      <span className={`absolute -top-3 left-3 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm ${scanResult.isMatchFound ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                        {scanResult.isMatchFound ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {scanResult.isMatchFound ? `${scanResult.topMatch.similarityScore}% Match Found` : 'Face Detected (No DB Match)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Execute Search Action */}
              <button
                onClick={handleStartScan}
                disabled={isScanning || !selectedPhoto}
                className={`w-full py-4 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                  isScanning
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : !selectedPhoto
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 shadow-gold-sm active:scale-[0.98]'
                }`}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting 128D Vector & Scanning DB...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Execute Sub-Millisecond Vector Match</span>
                  </>
                )}
              </button>
            </div>

            {/* Benchmark Samples & Dynamic Learning Card */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {/* Benchmark Devotees */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Benchmark Devotees ({benchmarkDevotees.length})
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">● Updates on Accuracy Verification</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    Live Ground Truth
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {benchmarkDevotees.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-1.5">
                      <Camera className="w-7 h-7 mx-auto text-slate-300" />
                      <p className="text-xs font-bold text-slate-600">No benchmark photos yet</p>
                      <p className="text-[11px] text-slate-400">
                        When you register a missing person or verify a scan, their photos will appear here for 1-click testing.
                      </p>
                    </div>
                  ) : (
                    benchmarkDevotees.map((preset) => {
                      const isActive = activePreset === preset.id || selectedPhoto === preset.previewUrl;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`w-full p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                            isActive
                              ? 'border-gold-500 bg-gold-50/50 shadow-xs ring-1 ring-gold-400/40'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <img
                            src={preset.previewUrl}
                            alt={preset.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-navy-900 truncate">
                                {preset.name}
                              </span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                                preset.targetMatchId ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {preset.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {preset.description}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Decoupled Vector Storage Architecture Card */}
              <div className="bg-navy-950 text-white rounded-3xl p-5 border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    Decoupled Vector Architecture
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {modelsReady ? '● Neural Weights Ready' : '○ Initializing...'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-slate-400">Image Storage:</span>
                    <span className="font-mono text-emerald-400">Cloudflare R2 Bucket</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-slate-400">Cloud DBMS:</span>
                    <span className="font-mono text-white">Supabase PostgreSQL</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Vector Math:</span>
                    <span className="font-mono text-gold-300">128D Float32 (d &lt; 0.60)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biometrics Breakdown & Match Results */}
          {scanResult && scanResult.hasFace && (
            <div className="space-y-4 animate-fadeIn">
              {/* Telemetry Bar */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Binary className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-navy-900">Extracted Biometrics:</span>
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700">
                    Age: ~{scanResult.detectedBiometrics.estimatedAge} yrs
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700 capitalize">
                    Gender: {scanResult.detectedBiometrics.gender} ({scanResult.detectedBiometrics.genderConfidence}%)
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700">
                    {scanResult.detectedBiometrics.landmarkPointsCount} Landmark Points
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 font-mono px-2 py-0.5 rounded-lg border border-emerald-200 font-bold">
                    ⚡ {scanResult.inferenceTimeMs}ms Latency
                  </span>
                </div>

                <div className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                  Query Vector: [{scanResult.detectedBiometrics.descriptorSample.join(', ')}...]
                </div>
              </div>

              {/* Case A: Confirmed Match Found */}
              {scanResult.isMatchFound ? (
                <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-500 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shadow-sm">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-navy-900">
                          Confirmed Match: {scanResult.topMatch.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Case #{scanResult.topMatch.id} • Registered {scanResult.topMatch.timeReported}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                        {scanResult.topMatch.similarityScore}% Similarity
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px]">
                        Euclidean d={scanResult.topMatch.euclideanDistance}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    <div className="md:col-span-5 grid grid-cols-2 gap-3">
                      <div className="space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploaded Query</span>
                        <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                          <img src={selectedPhoto} alt="Uploaded" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="space-y-1 text-center">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Cloudflare Case Photo</span>
                        <div className="aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-sm">
                          <img src={scanResult.topMatch.image} alt="Case Match" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 block">Last Seen / Shelter:</span>
                            <strong className="text-navy-900 text-sm">{scanResult.topMatch.lastSeen}</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div>
                            <span className="text-slate-400 block">Guardian:</span>
                            <span className="font-bold text-slate-800">{scanResult.topMatch.contactPerson}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Phone:</span>
                            <span className="font-bold text-emerald-700">{scanResult.topMatch.contactPhone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => addToast('Dispatching Call', `Calling ${scanResult.topMatch.contactPhone}...`, 'info')}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Guardian ({scanResult.topMatch.contactPhone})</span>
                        </button>
                        <button
                          onClick={() => handleGroundTruthFeedback(scanResult.auditQueryId, 'true_positive')}
                          className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                          title="Verify Accuracy & Add to Benchmark Devotees"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Verify Accuracy (Save Benchmark) ✓</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Case B: Face detected, but NO match */
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                      ℹ
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-navy-900">
                        No Matching Missing Record in Database
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Face was detected (Age ~{scanResult.detectedBiometrics.estimatedAge}), but the Euclidean distance against all registered vectors was above the 0.60 threshold.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-amber-950">
                      <strong>Want to take action or verify this accuracy result?</strong>
                      <p className="text-[11px] text-amber-800 mt-0.5">Confirm as verified non-match to update the Benchmark negative controls.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleGroundTruthFeedback(scanResult.auditQueryId, 'true_negative')}
                        className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Verify True Negative (Save Benchmark)</span>
                      </button>
                      <button
                        onClick={() => setActiveModal('report-sighting')}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                      >
                        Log Sighting
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 2: MISSING PERSON DATABASE
          ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'database' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, case ID, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['all', 'searching', 'located', 'reunited'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Missing Profiles Grid */}
          {missingProfiles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-sm">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-navy-900">No Missing Cases Registered Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your database is clean and ready. Click "Register Missing Case" to upload a pilgrim's photo and record details.
              </p>
              <button
                onClick={() => setActiveModal('report-missing')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 text-xs font-bold shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register First Missing Case</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {missingProfiles.map((person) => (
                <div
                  key={person.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0 shadow-xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-slate-400">{person.id}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            person.status === 'located' || person.status === 'reunited'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {person.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-navy-900 truncate mt-0.5">{person.name}</h4>
                        <p className="text-[11px] text-slate-500">{person.age} yrs • {person.gender}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{person.lastSeen}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>Reported: {person.timeReported}</span>
                        <span>Sightings: <strong>{person.sightingsCount || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedPhoto(person.image);
                        setActiveTab('scan');
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Run AI Match</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 3: CITIZEN SIGHTINGS FEED
          ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'sightings' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-navy-900">Live Citizen Sighting Feed</h3>
              <p className="text-xs text-slate-500">Real-time reports submitted by pilgrims on temple grounds with GPS coordinates.</p>
            </div>
            <button
              onClick={() => setActiveModal('report-sighting')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Report New Sighting</span>
            </button>
          </div>

          {citizenSightings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                <Eye className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-navy-900">No Sightings Reported Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Devotees and temple volunteers can upload photos and attach live GPS to report anyone they spot.
              </p>
              <button
                onClick={() => setActiveModal('report-sighting')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                <Eye className="w-4 h-4" />
                <span>Log First Sighting</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {citizenSightings.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={s.photoUrl}
                      alt="Sighting"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0 shadow-xs"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{s.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.status === 'verified' ? 'Biometric Match' : 'Unclaimed'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-navy-900">{s.personName}</h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{s.locationName}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Reported by: <strong>{s.reportedBy}</strong> • {new Date(s.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    {s.similarityScore && (
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        {s.similarityScore}% Match (d={s.euclideanDistance})
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">
                      GPS: {s.coords?.lat?.toFixed(4)}, {s.coords?.lng?.toFixed(4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 4: AI ACCURACY & GOVERNMENT AUDIT LOGS
          ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'accuracy' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Accuracy Metrics KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Match Accuracy</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display mt-0.5 block">
                {accuracyMetrics.accuracyRate}%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">True Pos + True Neg</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Precision Rate</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-display mt-0.5 block">
                {accuracyMetrics.precision}%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">TP / (TP + FP)</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Scans Audited</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display mt-0.5 block">
                {accuracyMetrics.totalScans}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Immutable Logs</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Vector Latency</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display mt-0.5 block">
                {accuracyMetrics.avgInferenceMs}ms
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Sub-Millisecond Math</span>
            </div>
          </div>

          {/* Government Export Station */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-950 rounded-3xl p-5 text-white border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-gold-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Government & Police Export Station
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate official encrypted dockets for District Administration, NDRF, and Police Control Rooms.
              </p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={exportGovernmentDocketCSV}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export CSV Docket</span>
              </button>
              <button
                onClick={exportGovernmentDocketJSON}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-sm"
              >
                <FileJson className="w-4 h-4 text-gold-400" />
                <span>Export JSON Audit</span>
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-navy-900">AI Biometric Telemetry & Ground Truth Audit Trail</h4>

            {auditLogs.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-1">
                <BarChart3 className="w-7 h-7 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No facial scans audited yet</p>
                <p className="text-[11px] text-slate-400">
                  Every scan you perform in the AI Facial Search tab will automatically log its Euclidean distance and biometrics here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Query ID</th>
                      <th className="py-2.5 px-3">Age / Gender</th>
                      <th className="py-2.5 px-3">Matched Case</th>
                      <th className="py-2.5 px-3">Euclidean (d)</th>
                      <th className="py-2.5 px-3">Similarity</th>
                      <th className="py-2.5 px-3">Ground Truth</th>
                      <th className="py-2.5 px-3 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.queryId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono text-[11px] font-bold text-navy-900">{log.queryId}</td>
                        <td className="py-3 px-3 text-slate-700">~{log.detectedAge}y • {log.detectedGender}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{log.matchedName || 'None'}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">d={log.euclideanDistance}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-700">{log.similarityPercent}%</td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            log.groundTruthStatus === 'true_positive' ? 'bg-emerald-100 text-emerald-800' :
                            log.groundTruthStatus === 'true_negative' ? 'bg-blue-100 text-blue-800' :
                            log.groundTruthStatus === 'false_positive' ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {log.groundTruthStatus?.replace('_', ' ') || 'unconfirmed'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleGroundTruthFeedback(log.queryId, 'true_positive')}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold"
                              title="Mark as True Positive (Adds to Benchmarks)"
                            >
                              TP ✓
                            </button>
                            <button
                              onClick={() => handleGroundTruthFeedback(log.queryId, 'false_positive')}
                              className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 text-[10px] font-bold"
                              title="Mark as False Positive"
                            >
                              FP ✗
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
