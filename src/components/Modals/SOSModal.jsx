import React, { useState, useEffect } from 'react';
import { useYatra } from '../../context/YatraContext';
import { ShieldAlert, PhoneCall, MapPin, Radio, HeartPulse, AlertCircle, X, Check, Volume2 } from 'lucide-react';

export const SOSModal = () => {
  const { activeModal, setActiveModal, addToast } = useYatra();
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const [sosType, setSosType] = useState('medical');

  useEffect(() => {
    let timer;
    if (activeModal === 'sos' && countdown > 0 && !isTriggered) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0 && !isTriggered) {
      setIsTriggered(true);
      addToast(
        '🚨 Emergency SOS Dispatched!',
        'Your live GPS coordinates (25.3176° N, 82.9739° E) and medical profile have been sent to Temple Police Command and nearby Medical Desk.',
        'emergency'
      );
    }
    return () => clearInterval(timer);
  }, [activeModal, countdown, isTriggered]);

  if (activeModal !== 'sos') return null;

  const handleCancelCountdown = () => {
    setCountdown(5);
    setIsTriggered(false);
    setActiveModal(null);
    addToast('SOS Standby', 'Emergency trigger safely cancelled.', 'info');
  };

  const handleImmediateDispatch = () => {
    setCountdown(0);
    setIsTriggered(true);
    addToast(
      '🚨 Emergency SOS Dispatched Immediately!',
      'Temple Quick Response Force (QRF) & Emergency Ambulance alerted.',
      'emergency'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-red-200">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white text-center relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center border border-white/40 animate-pulse-subtle">
            <ShieldAlert className="w-9 h-9 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold font-display tracking-tight">
            {isTriggered ? 'SOS Signal Broadcasted!' : 'Emergency Assistance (SOS)'}
          </h3>
          <p className="text-red-100 text-sm mt-1">
            {isTriggered
              ? 'Stay calm. Help is en route to your exact location.'
              : 'Direct hotline to Temple Quick Response & Medical Emergency'}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {!isTriggered ? (
            <>
              {/* Countdown warning */}
              <div className="text-center py-2 bg-red-50 rounded-2xl border border-red-100 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-1 flex items-center justify-center gap-1.5">
                  <Radio className="w-4 h-4 animate-ping" /> Auto-broadcasting in
                </div>
                <div className="text-4xl font-extrabold text-red-600 font-display">
                  0{countdown}s
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Automatic GPS location & family notification will be sent unless cancelled.
                </p>
              </div>

              {/* Emergency Types */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Select Nature of Emergency:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'medical', label: 'Medical / First Aid', icon: HeartPulse },
                    { id: 'lost', label: 'Elderly / Child Separated', icon: AlertCircle },
                    { id: 'security', label: 'Crowd Crush / Security', icon: ShieldAlert },
                    { id: 'police', label: 'Police Assistance', icon: PhoneCall },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = sosType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSosType(item.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                          isSelected
                            ? 'border-red-600 bg-red-50 text-red-700 font-semibold shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelCountdown}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel / False Alarm
                </button>
                <button
                  type="button"
                  onClick={handleImmediateDispatch}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" /> Send SOS Now
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Triggered confirmation view */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Active Response Team Assigned</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Unit: <strong>Kashi Corridor Rapid Care Unit #3</strong> (Estimated Arrival: 3-4 mins)
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-500" /> Current Geo-coordinates:
                  </span>
                  <span className="font-mono text-slate-900 font-semibold">25.3109° N, 83.0107° E</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="font-medium text-slate-700">Nearest Landmark:</span>
                  <span className="text-slate-900 font-semibold">Ganga Ghat Platform 2 (210m away)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-slate-700">Family Members Alerted:</span>
                  <span className="text-emerald-700 font-semibold">3 Family Contacts Notified</span>
                </div>
              </div>

              {/* Direct helpline buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-yatra-sky" /> Call Police (112)
                </a>
                <a
                  href="tel:108"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                >
                  <HeartPulse className="w-4 h-4 text-white" /> Ambulance (108)
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsTriggered(false);
                  setCountdown(5);
                  setActiveModal(null);
                }}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium text-center"
              >
                Close SOS Screen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
