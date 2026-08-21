import React, { useState, useRef, useEffect } from 'react';
import { useYatra } from '../context/YatraContext';
import {
  analyzeAndMatchFace,
  loadFaceModels,
  PRESET_TEST_PHOTOS
} from '../services/aiFaceEngine';
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
  Cpu
} from 'lucide-react';

export const PunarMilanAIScreen = () => {
  const { addToast, setActiveModal } = useYatra();
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_TEST_PHOTOS[0].previewUrl);
  const [activePreset, setActivePreset] = useState(PRESET_TEST_PHOTOS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [modelsReady, setModelsReady] = useState(false);
  const fileInputRef = useRef(null);

  // Pre-load ML models on screen mount
  useEffect(() => {
    loadFaceModels()
      .then(() => setModelsReady(true))
      .catch((e) => console.warn('Model pre-load notice:', e.message));
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

  const handleSelectPreset = (preset) => {
    setSelectedPhoto(preset.previewUrl);
    setActivePreset(preset.id);
    setScanResult(null);
  };

  const handleStartScan = async () => {
    if (!selectedPhoto) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await analyzeAndMatchFace(selectedPhoto, (stepInfo) => {
        setScanStep(stepInfo);
      });

      setIsScanning(false);
      setScanResult(result);

      if (!result.hasFace) {
        addToast('No Face Detected', result.message, 'warning');
      } else if (result.isMatchFound) {
        addToast(
          '🎯 Confirmed Biometric Match!',
          `${result.topMatch.similarityScore}% match with ${result.topMatch.name} at ${result.topMatch.location}`,
          'success'
        );
      } else {
        addToast(
          'No Match in Current Database',
          `Face detected (Age ~${result.detectedBiometrics.estimatedAge}), but no matching missing record was found.`,
          'info'
        );
      }
    } catch (err) {
      setIsScanning(false);
      addToast('Scan Error', err.message, 'error');
    }
  };

  const handleConnectOfficer = (officerPhone, location) => {
    addToast(
      'Connecting to Checkpoint Officer',
      `Dispatching call to ${officerPhone} at ${location}...`,
      'info'
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-700 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>PunarMilan AI (पुनर्मिलन)</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-mono text-[10px]">TensorFlow Face ML Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            Real-Time Face Recognition Search
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Extracts 128D neural biometric vectors from any photo and computes mathematical Euclidean distance against registered lost person records.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('report-missing')}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4 text-gold-400" />
          <span>Register Missing Case</span>
        </button>
      </div>

      {/* ── PHOTO UPLOAD & PRESET TESTERS ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Upload & Preview Card */}
        <div className="md:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              1. Choose or Upload Photo
            </span>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Any Image
            </button>
          </div>

          {/* Photo Frame with Face Mesh Overlay */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group">
            {selectedPhoto ? (
              <img
                src={selectedPhoto}
                alt="Target Face"
                className={`w-full h-full object-cover transition-opacity duration-300 ${isScanning ? 'opacity-75' : 'opacity-100'}`}
              />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Camera className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                <p className="text-xs font-medium">No photo selected</p>
                <p className="text-[10px] text-slate-500 mt-1">Upload a portrait or choose a sample below</p>
              </div>
            )}

            {/* AI Scanner Radar & Landmark Animation */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-navy-950/50 backdrop-blur-[2px]">
                {/* Scanning Laser Line */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan" />

                {/* Biometric Face Box */}
                <div className="w-48 h-56 border-2 border-dashed border-cyan-400/80 rounded-2xl relative animate-pulse flex items-center justify-center">
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

                  {/* 68 Landmark Points Simulator */}
                  <div className="grid grid-cols-4 gap-4 opacity-70">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-navy-900/90 border border-cyan-500/30 rounded-xl p-2.5 text-center text-xs text-cyan-200">
                  <span className="font-mono">{scanStep?.text || 'Analyzing biometric vectors...'}</span>
                </div>
              </div>
            )}

            {/* Bounding Box on Completed Scan */}
            {scanResult && !isScanning && scanResult.hasFace && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className={`w-48 h-56 border-2 rounded-2xl relative ${scanResult.isMatchFound ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'border-amber-400'}`}>
                  <span className={`absolute -top-3 left-3 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm ${scanResult.isMatchFound ? 'bg-emerald-500' : 'bg-amber-600'}`}>
                    {scanResult.isMatchFound ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {scanResult.isMatchFound ? `${scanResult.topMatch.similarityScore}% Match Found` : 'Face Detected (No DB Match)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Scan Action Button */}
          <button
            onClick={handleStartScan}
            disabled={isScanning || !selectedPhoto}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isScanning
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 shadow-gold-sm active:scale-[0.98]'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting Biometric Vector...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>Execute Real Neural Face Match</span>
              </>
            )}
          </button>
        </div>

        {/* Presets & Info Column */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          {/* Quick Presets for Real Testing */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Benchmark Sample Devotees
              </span>
              <span className="text-[10px] text-slate-400">Test True Match vs Mismatch</span>
            </div>

            <div className="space-y-2">
              {PRESET_TEST_PHOTOS.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isActive
                        ? 'border-gold-500 bg-gold-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={preset.previewUrl}
                      alt={preset.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-navy-900 truncate">
                          {preset.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${preset.targetMatchId ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Status Card */}
          <div className="bg-navy-950 text-white rounded-3xl p-5 border border-gold-500/20 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Local Neural Model
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {modelsReady ? '● Models Loaded (Offline Ready)' : '○ Loading Weights...'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Architecture:</span>
                <span className="font-mono text-white">SSD MobileNet + 68 Landmark Net</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Descriptor Embedding:</span>
                <span className="font-mono text-emerald-400">128-dimensional Float32</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Distance Metric:</span>
                <span className="font-mono text-gold-300">Euclidean Distance (Threshold &lt; 0.60)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RESULT: NO FACE DETECTED ── */}
      {scanResult && !scanResult.hasFace && (
        <div className="bg-amber-50 rounded-3xl p-5 border-2 border-amber-300 shadow-sm flex items-start gap-3.5 text-amber-900 animate-fadeIn">
          <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-amber-950">No Human Face Detected</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              The neural network could not find a clear human face in the uploaded image. Please ensure good lighting, avoid blurry photos, and upload a front-facing portrait of the pilgrim.
            </p>
          </div>
        </div>
      )}

      {/* ── RESULT: FACE DETECTED - BIOMETRICS BREAKDOWN & MATCH STATUS ── */}
      {scanResult && scanResult.hasFace && (
        <div className="space-y-4 animate-fadeIn">
          {/* Biometrics telemetry box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-yatra-blue" />
              <span className="font-semibold text-navy-900">Extracted Biometrics:</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                Age: ~{scanResult.detectedBiometrics.estimatedAge} yrs
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 capitalize">
                Gender: {scanResult.detectedBiometrics.gender} ({scanResult.detectedBiometrics.genderConfidence}%)
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                {scanResult.detectedBiometrics.landmarkPointsCount} Landmark Points
              </span>
            </div>

            <div className="font-mono text-[10px] text-slate-500 truncate max-w-xs">
              Vector: [{scanResult.detectedBiometrics.descriptorSample.join(', ')}...]
            </div>
          </div>

          {/* Case A: Confirmed Match Found */}
          {scanResult.isMatchFound ? (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-500 shadow-card space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-navy-900">
                      Confirmed Biometric Match: {scanResult.topMatch.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Case #{scanResult.topMatch.id} • Matched {scanResult.topMatch.detectedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                    {scanResult.topMatch.similarityScore}% Similarity
                  </span>
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px]">
                    d={scanResult.topMatch.euclideanDistance}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Side by side comparison */}
                <div className="md:col-span-5 grid grid-cols-2 gap-2.5">
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploaded Photo</span>
                    <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200">
                      <img src={selectedPhoto} alt="Uploaded" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Checkpoint Frame</span>
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-emerald-400">
                      <img src={scanResult.topMatch.image} alt="CCTV Match" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Details & Location */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-yatra-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-slate-400 block">Current Location / Camp:</span>
                        <strong className="text-navy-900 text-sm">{scanResult.topMatch.location}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block">Age & Gender:</span>
                        <span className="font-semibold text-slate-800">{scanResult.topMatch.age} • {scanResult.topMatch.gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Attire:</span>
                        <span className="font-semibold text-slate-800">{scanResult.topMatch.attire}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Duty Officer:</span>
                        <span className="font-semibold text-slate-800">{scanResult.topMatch.contactOfficer}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Status:</span>
                        <span className="font-semibold text-emerald-700">{scanResult.topMatch.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      onClick={() => handleConnectOfficer(scanResult.topMatch.officerPhone, scanResult.topMatch.location)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Officer ({scanResult.topMatch.officerPhone})</span>
                    </button>
                    <button
                      onClick={() => addToast('Volunteer Dispatched', `Reunion Volunteer assigned to escort family to ${scanResult.topMatch.location}.`, 'success')}
                      className="py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Request Volunteer Escort
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Case B: Face detected, but NO match in database */
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start gap-3 text-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                  ℹ
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy-900">
                    No Matching Record Found in Checkpoint Database
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    A face was successfully detected (estimated age: ~{scanResult.detectedBiometrics.estimatedAge}), but the Euclidean distance against all registered missing records was too high (best similarity was only {scanResult.topMatch ? scanResult.topMatch.similarityScore : 0}%, Euclidean distance d={scanResult.topMatch ? scanResult.topMatch.euclideanDistance : '0.8+'}, which is above the 0.60 match threshold).
                  </p>
                </div>
              </div>

              {/* Action to register */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-amber-900">
                  <strong>Want to register this person as missing?</strong>
                  <p className="text-[11px] text-amber-800 mt-0.5">This will index their 128D face vector across all temple CCTV streams and shelter nodes immediately.</p>
                </div>
                <button
                  onClick={() => setActiveModal('report-missing')}
                  className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex-shrink-0 transition-colors"
                >
                  Register Missing Case
                </button>
              </div>

              {/* Candidates list table showing genuine low similarity */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Database Comparison Log (Mathematical Euclidean Distances)
                </span>
                <div className="space-y-1.5">
                  {scanResult.allCandidates.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={c.image} alt={c.name} className="w-7 h-7 rounded-lg object-cover" />
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <span className="text-slate-400 font-mono text-[10px]">({c.id})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-500 text-[11px]">Euclidean d={c.euclideanDistance}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                          {c.similarityPercent}% (Non-Match)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
