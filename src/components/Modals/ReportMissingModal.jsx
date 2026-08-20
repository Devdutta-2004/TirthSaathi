import React, { useState } from 'react';
import { useYatra } from '../../context/YatraContext';
import { UserX, Upload, MapPin, Camera, AlertCircle, CheckCircle2, X } from 'lucide-react';

export const ReportMissingModal = () => {
  const { activeModal, setActiveModal, addLostReport } = useYatra();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    lastSeen: '',
    wearing: '',
    languages: 'Hindi',
    contactPerson: '',
    medicalNotes: ''
  });
  const [hasPhoto, setHasPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (activeModal !== 'report-missing') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lastSeen) return;

    addLostReport({
      name: formData.name,
      age: formData.age ? `${formData.age} Years` : 'Age Unspecified',
      gender: formData.gender,
      lastSeen: formData.lastSeen,
      wearing: formData.wearing || 'Traditional attire',
      languages: formData.languages,
      contactPerson: formData.contactPerson || 'Family Member',
      matchedBooth: 'Broadcast sent to Temple Police & Volunteers'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveModal(null);
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        lastSeen: '',
        wearing: '',
        languages: 'Hindi',
        contactPerson: '',
        medicalNotes: ''
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/75 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-navy-800 p-6 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yatra-blue/30 border border-yatra-sky/40 flex items-center justify-center text-yatra-sky">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">Report a Missing Pilgrim</h3>
              <p className="text-xs text-slate-300">
                Instant broadcast to 50+ temple volunteer checkpoints and PA speaker systems.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-navy-800">Alert Dispatched Successfully!</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Our temple ground coordination team and automated camera matching system have been activated. Stay near your current reporting station.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-navy-800">
              <AlertCircle className="w-4 h-4 text-yatra-blue flex-shrink-0 mt-0.5" />
              <span>
                <strong>Demo Mode:</strong> Please enter sample information only. Information is broadcasted safely to simulated security nodes.
              </span>
            </div>

            {/* Photo Upload Simulator */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Recent Photo of Pilgrim (Optional for AI Match)
              </label>
              <div
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                  hasPhoto
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                    : 'border-slate-300 hover:border-yatra-blue bg-slate-50 text-slate-600'
                }`}
              >
                {hasPhoto ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Photo Attached: pilgrim_recent_portrait.jpg (Click to remove)</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Camera className="w-6 h-6 mx-auto text-slate-400" />
                    <p className="text-xs font-medium">Click to attach photo from camera or gallery</p>
                    <p className="text-[10px] text-slate-400">Helps automated CCTV and volunteer facial match</p>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name of Missing Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 focus:border-yatra-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age / Gender
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-16 px-2 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30"
                  />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="flex-1 px-2 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Child">Child</option>
                    <option value="Elderly">Senior</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Last Seen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Seen Location & Landmark *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Gate 3 Prasad Counter / Har Ki Pauri Ghat"
                  value={formData.lastSeen}
                  onChange={(e) => setFormData({ ...formData, lastSeen: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 focus:border-yatra-blue"
                />
              </div>
            </div>

            {/* Clothing & Appearance */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clothes & Distinct Features (Color, Glasses, Walking stick)
              </label>
              <input
                type="text"
                placeholder="e.g. Wearing saffron kurta, brown spectacles, holds wooden walking stick"
                value={formData.wearing}
                onChange={(e) => setFormData({ ...formData, wearing: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 focus:border-yatra-blue"
              />
            </div>

            {/* Contact Person */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reporting Contact Name & Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. Son: +91 98765 43210"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 focus:border-yatra-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Languages Spoken
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hindi, Bengali, Gujarati"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 focus:border-yatra-blue"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-yatra-blue hover:bg-yatra-bright text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserX className="w-4 h-4" /> Broadcast Missing Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
