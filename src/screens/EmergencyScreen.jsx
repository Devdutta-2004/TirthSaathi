import React from 'react';
import { useYatra } from '../context/YatraContext';
import { ShieldAlert, PhoneCall, HeartPulse, UserX, MapPin, Radio, AlertCircle, Sparkles } from 'lucide-react';

export const EmergencyScreen = () => {
  const { setActiveModal, addToast } = useYatra();

  const emergencyHelplines = [
    { name: 'National Tourist & Pilgrim Helpline', number: '1363', desc: 'Toll-free 24x7 multilingual guidance & yatra assistance' },
    { name: 'Police Quick Response Force (QRF)', number: '112', desc: 'Direct dispatch to temple security commands & patrol booths' },
    { name: 'National Ambulance Emergency', number: '108', desc: 'Immediate medical ambulance & paramedical response' },
    { name: 'Women & Senior Safety Helpline', number: '1090', desc: 'Dedicated protection & special care assistance' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 text-white shadow-float relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse-subtle">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase">
              Emergency & SOS Command Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              Immediate Yatra Assistance
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-red-100 max-w-xl">
          One-touch direct link to Temple Quick Response Teams, local health trauma centers, and missing person broadcasts.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveModal('sos')}
            className="py-3 px-6 rounded-2xl bg-white text-red-700 font-extrabold text-sm shadow-md hover:bg-red-50 transition-all flex items-center gap-2"
          >
            <Radio className="w-4 h-4 animate-ping text-red-600" />
            <span>Trigger One-Touch SOS (5s Countdown)</span>
          </button>

          <button
            onClick={() => setActiveModal('report-missing')}
            className="py-3 px-5 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs border border-white/30 transition-colors flex items-center gap-1.5"
          >
            <UserX className="w-4 h-4" />
            <span>Report Missing Person</span>
          </button>
        </div>
      </div>

      {/* Emergency Phone Hotlines */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-navy-900 font-display flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-yatra-blue" />
          <span>Direct 24/7 Emergency Helplines</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyHelplines.map((line, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
            >
              <div>
                <h4 className="font-bold text-navy-900 text-xs sm:text-sm">{line.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{line.desc}</p>
              </div>

              <a
                href={`tel:${line.number}`}
                className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold font-mono transition-colors flex-shrink-0 flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-yatra-sky" />
                <span>{line.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Emergency Medical Posts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-navy-900 font-display flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-red-500" />
          <span>Active Medical Trauma Desks (Within 500m)</span>
        </h3>

        <div className="space-y-2">
          {[
            { name: 'Kashi Vishwanath Corridor Trauma Post #1', distance: '180m away', doctor: 'Dr. S. K. Pathak on duty', equip: 'Oxygen, Defibrillator, Wheelchairs' },
            { name: 'Godowlia Red Cross Emergency Post', distance: '320m away', doctor: 'Paramedic Squad Active', equip: 'First-Aid, Ambulances' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-navy-900">{item.name}</h4>
                <p className="text-[11px] text-slate-500">{item.distance} • {item.doctor} ({item.equip})</p>
              </div>
              <button
                onClick={() => addToast('Dispatching Medical Support', `Route mapped to ${item.name}.`, 'success')}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs"
              >
                Navigate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
