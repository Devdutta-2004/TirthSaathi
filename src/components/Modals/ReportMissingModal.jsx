import React, { useState, useRef } from 'react';
import { useYatra } from '../../context/YatraContext';
import { registerMissingPersonWithAI } from '../../services/aiFaceEngine';
import {
  UserPlus,
  Camera,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const ReportMissingModal = () => {
  const { activeModal, setActiveModal, addToast } = useYatra();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    lastSeen: '',
    wearing: '',
    languages: 'Hindi',
    contactPerson: '',
    contactPhone: '',
    medicalNotes: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [registeredCase, setRegisteredCase] = useState(null);

  if (activeModal !== 'report-missing') return null;

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lastSeen) {
      addToast('Required Fields', 'Please provide the missing person name and last seen location.', 'warning');
      return;
    }

    if (!photoPreview) {
      addToast('Photo Highly Recommended', 'Please upload a photo for AI facial recognition search.', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Extract 128D vector, upload to Cloudflare R2, save to profile & vector databases
      const result = await registerMissingPersonWithAI(
        {
          name: formData.name,
          age: formData.age ? Number(formData.age) : 40,
          gender: formData.gender,
          lastSeen: formData.lastSeen,
          attire: formData.wearing || 'Traditional attire',
          languages: formData.languages,
          contactPerson: formData.contactPerson || 'Family Guardian',
          contactPhone: formData.contactPhone || '+91 Mobile Sync',
          medicalNotes: formData.medicalNotes || 'None'
        },
        photoPreview
      );

      setIsProcessing(false);
      setRegisteredCase(result.person);

      addToast(
        '🎯 Case Registered & Cloud Indexed',
        `Case #${result.person.id} registered for ${result.person.name}. 128D vector indexed across all temple checkpoints!`,
        'success'
      );
    } catch (err) {
      setIsProcessing(false);
      addToast('Registration Error', err.message, 'error');
    }
  };

  const handleClose = () => {
    setActiveModal(null);
    setPhotoPreview(null);
    setRegisteredCase(null);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      lastSeen: '',
      wearing: '',
      languages: 'Hindi',
      contactPerson: '',
      contactPhone: '',
      medicalNotes: ''
    });
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
            <div className="w-11 h-11 rounded-2xl bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display">Register Missing Pilgrim</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-400/30">
                  Cloudflare + AI
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload portrait to index 128D biometric vector into permanent cloud storage.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {registeredCase ? (
            <div className="space-y-4 text-center py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-navy-900">Case Successfully Registered!</h4>
                <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
                  Official ID: {registeredCase.id}
                </p>
                <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  The portrait has been saved permanently to Cloudflare R2. Checkpoint cameras and citizen sighting searches are now actively monitoring for <strong>{registeredCase.name}</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Status: <strong>Broadcasted to 14,000+ CCTV Nodes</strong></span>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs transition-colors"
              >
                Close & View on Database
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recent Portrait Photo (Required for 128D AI Match) *
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
                          <span>Portrait Ready for 128D Vector Extraction</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Click to change photo</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 py-3">
                      <Camera className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-xs font-bold text-navy-900">Upload Front-Facing Photo</p>
                      <p className="text-[10px] text-slate-500">Extracts 68 landmarks & saves permanently to Cloudflare</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Age / Gender */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 68"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 bg-white"
                  />
                </div>
              </div>

              {/* Last Seen Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Seen Landmark / Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Godowlia Gate No. 2, Varanasi"
                    value={formData.lastSeen}
                    onChange={(e) => setFormData({ ...formData, lastSeen: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 bg-white"
                  />
                </div>
              </div>

              {/* Clothing Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clothing, Glasses & Distinguishing Marks
                </label>
                <input
                  type="text"
                  placeholder="e.g. White kurta, gold-rimmed spectacles, yellow shawl"
                  value={formData.wearing}
                  onChange={(e) => setFormData({ ...formData, wearing: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 bg-white"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Sharma (Son)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94544 00112"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
                      : 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 shadow-gold-sm active:scale-[0.98]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Extracting 128D Vector & Uploading to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Register & Index Biometric Vector</span>
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
