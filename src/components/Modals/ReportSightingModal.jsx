import React, { useState, useRef } from 'react';
import { useYatra } from '../../context/YatraContext';
import { analyzeAndMatchFace } from '../../services/aiFaceEngine';
import { uploadImageToCloudflare } from '../../services/cloudflareStorage';
import { saveCitizenSighting } from '../../services/missingPersonStore';
import {
  Eye,
  Camera,
  Upload,
  MapPin,
  Locate,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Sparkles,
  RefreshCw,
  UserCheck
} from 'lucide-react';

export const ReportSightingModal = () => {
  const { activeModal, setActiveModal, myCoords, addToast } = useYatra();
  const fileInputRef = useRef(null);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [coords, setCoords] = useState(myCoords || { lat: 25.3109, lng: 83.0107 });

  const [isProcessing, setIsProcessing] = useState(false);
  const [sightingResult, setSightingResult] = useState(null);

  if (activeModal !== 'report-sighting') return null;

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
      setSightingResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUseLiveGPS = () => {
    if (myCoords) {
      setCoords(myCoords);
      addToast('GPS Attached', `Lat: ${myCoords.lat.toFixed(4)}, Lng: ${myCoords.lng.toFixed(4)}`, 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoPreview) {
      addToast('Photo Required', 'Please upload or capture a photo of the spotted pilgrim.', 'warning');
      return;
    }
    if (!locationName) {
      addToast('Location Required', 'Please provide the landmark or booth where you found them.', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Run Decoupled AI Facial Vector Match
      const matchResult = await analyzeAndMatchFace(photoPreview, null, 'citizen_sighting');

      // 2. Upload Photo to Cloudflare R2 Permanent Storage
      const uploadRes = await uploadImageToCloudflare(photoPreview, 'sighting');
      const cloudPhotoUrl = uploadRes.url;

      // 3. Save Sighting in Store
      const savedSighting = saveCitizenSighting({
        photoUrl: cloudPhotoUrl,
        locationName,
        coords,
        reportedBy: reporterName || 'Compassionate Devotee',
        reporterPhone: reporterPhone || '+91 Mobile Sync',
        conditionNotes: conditionNotes || 'Spotted safe on temple grounds',
        matchedCaseId: matchResult.isMatchFound ? matchResult.topMatch.id : null,
        personName: matchResult.isMatchFound ? matchResult.topMatch.name : 'Unidentified Devotee',
        similarityScore: matchResult.isMatchFound ? matchResult.topMatch.similarityScore : null,
        euclideanDistance: matchResult.isMatchFound ? matchResult.topMatch.euclideanDistance : null
      });

      setIsProcessing(false);
      setSightingResult({
        sighting: savedSighting,
        matchResult
      });

      if (matchResult.isMatchFound) {
        addToast(
          '🎯 MATCH FOUND & REUNION ALERT SENT!',
          `${matchResult.topMatch.similarityScore}% match with ${matchResult.topMatch.name}. Alert sent to family & police!`,
          'success'
        );
      } else {
        addToast(
          'Sighting Registered Permanently',
          'Photo & GPS saved in Unclaimed Sightings archive for automated retroactive matching.',
          'info'
        );
      }
    } catch (err) {
      setIsProcessing(false);
      addToast('Error Registering Sighting', err.message, 'error');
    }
  };

  const handleClose = () => {
    setActiveModal(null);
    setPhotoPreview(null);
    setSightingResult(null);
    setLocationName('');
    setConditionNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 p-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display">I Found / Spotted Someone</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Citizen Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload a photo to instantly scan against 14,000+ registered missing cases.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {sightingResult ? (
            /* Result Screen */
            <div className="space-y-4 text-center py-2 animate-fadeIn">
              {sightingResult.matchResult.isMatchFound ? (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-5 text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                      ✓
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Confirmed Match ({sightingResult.matchResult.topMatch.similarityScore}%)
                      </span>
                      <h4 className="text-lg font-bold text-navy-900 mt-0.5">
                        {sightingResult.matchResult.topMatch.name}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Case #{sightingResult.matchResult.topMatch.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-2xl border border-emerald-200">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Guardian Contact:</span>
                      <strong className="text-navy-900">{sightingResult.matchResult.topMatch.contactPerson}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Phone:</span>
                      <strong className="text-emerald-700">{sightingResult.matchResult.topMatch.contactPhone}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-100/60 rounded-2xl text-xs text-emerald-900 leading-relaxed">
                    🎉 <strong>Reunion Notification Dispatched!</strong> An automated alert with your location ({locationName}) and photo has been transmitted to the family and nearest pilgrim assistance desk.
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs transition-colors"
                  >
                    Done & Return to Radar
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-200">
                      ℹ
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-navy-900">
                        Sighting Logged in Permanent Archive
                      </h4>
                      <p className="text-xs text-slate-500">
                        No active missing case matched this face right now.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    The photo and GPS coordinate have been permanently indexed in Cloudflare R2 and the Unclaimed Sighting Archive. If a family reports this person missing later today, the AI will automatically connect this sighting!
                  </p>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Photo of Spotted Pilgrim *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer border-2 border-dashed rounded-3xl p-4 text-center transition-all ${
                    photoPreview
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-yatra-blue bg-slate-50'
                  }`}
                >
                  {photoPreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-2xl object-cover border border-emerald-300"
                      />
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Photo Attached & Face Ready</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Click to change or take another photo</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 py-3">
                      <Camera className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-xs font-bold text-navy-900">Take Photo or Upload from Gallery</p>
                      <p className="text-[10px] text-slate-500">Extracts 128D facial biometrics instantly</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location & Landmark */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Location Where You Found Them *
                  </label>
                  <button
                    type="button"
                    onClick={handleUseLiveGPS}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Locate className="w-3 h-3" /> Use My Live GPS
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Dashashwamedh Ghat Tea Stall #3 / Gate 2"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 focus:border-yatra-blue bg-white"
                  />
                </div>
              </div>

              {/* Physical Condition & Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Condition & Clothes Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Safe, resting with Seva Dal booth, wearing yellow shawl"
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 focus:border-yatra-blue bg-white"
                />
              </div>

              {/* Reporter Info */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kailash Pandey"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Mobile (For Police)</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 XXXXX"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                    isProcessing
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-sm active:scale-[0.98]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning 128D Face Vector & Storing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Scan & Submit Citizen Sighting</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
