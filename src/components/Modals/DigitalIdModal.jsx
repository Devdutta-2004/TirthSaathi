import React from 'react';
import { useYatra } from '../../context/YatraContext';
import { QrCode, ShieldCheck, Heart, Phone, Download, Share2, X, CheckCircle } from 'lucide-react';

export const DigitalIdModal = () => {
  const { activeModal, setActiveModal, addToast } = useYatra();

  if (activeModal !== 'digital-id') return null;

  const handleDownload = () => {
    addToast('Digital Yatra Pass Downloaded', 'Pass saved to your device as offline wallet image.', 'success');
  };

  const handleShare = () => {
    addToast('Yatra Pass Shared', 'Encrypted emergency link copied to clipboard.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-800 via-yatra-blue to-navy-900 p-6 text-white text-center relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-yatra-sky" /> Government & Temple Trust Verified
          </div>
          <h3 className="text-xl font-bold font-display">Digital Pilgrim ID Pass</h3>
          <p className="text-xs text-sky-100 mt-0.5">National Pilgrim Safety & Darshan ID (TS-2026-KASHI)</p>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          {/* Pilgrim Card Badge */}
          <div className="border border-yatra-blue/20 bg-gradient-to-b from-blue-50/50 to-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yatra-sky/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yatra-blue to-yatra-bright text-white flex items-center justify-center font-bold text-xl shadow-md">
                DD
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-navy-900 text-base">Devdutta Dasgupta</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">Yatra ID: TS-88410-VAR</p>
                <p className="text-xs text-yatra-blue font-semibold mt-0.5">Family Group Leader (4 Members)</p>
              </div>
            </div>

            {/* QR Code Demo */}
            <div className="py-4 text-center">
              <div className="inline-block p-3 bg-white rounded-2xl border-2 border-dashed border-yatra-blue/30 shadow-inner">
                {/* Stylized QR representation */}
                <div className="w-36 h-36 bg-navy-900 rounded-xl p-2 flex flex-col justify-between text-white font-mono text-[9px] relative overflow-hidden">
                  <div className="flex justify-between">
                    <div className="w-9 h-9 border-2 border-white rounded-md p-1 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <div className="w-9 h-9 border-2 border-white rounded-md p-1 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  
                  <div className="text-center text-[8px] text-yatra-sky font-semibold tracking-wider">
                    SCAN FOR EMERGENCY & DARSHAN
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="w-9 h-9 border-2 border-white rounded-md p-1 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <div className="w-12 h-6 border border-white/60 flex items-center justify-center text-[7px] bg-yatra-blue/40">
                      TS-SECURE
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Scan at any temple checkpoint, medical tent, or lost-person booth
              </p>
            </div>

            {/* Medical and Emergency info */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Blood Group</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" /> B Positive (B+)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Emergency SOS Contact</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" /> +91 98300 XXXXX
                </span>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-yatra-blue hover:bg-yatra-bright text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Save Pass Offline
            </button>
            <button
              onClick={handleShare}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
