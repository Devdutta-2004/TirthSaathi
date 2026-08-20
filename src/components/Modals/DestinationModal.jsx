import React from 'react';
import { useYatra } from '../../context/YatraContext';
import { MapPin, Users, Clock, ShieldCheck, HeartHandshake, Utensils, X, Sparkles, Navigation } from 'lucide-react';

export const DestinationModal = () => {
  const { activeModal, setActiveModal, selectedDestination, addToast } = useYatra();

  if (activeModal !== 'destination-guide' || !selectedDestination) return null;

  const handleStartNavigation = () => {
    addToast('Yatra Guide Activated', `Turn-by-turn safe pilgrim corridor routes loaded for ${selectedDestination.name}.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/75 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Destination Image Banner */}
        <div className="relative h-64 w-full flex-shrink-0">
          <img
            src={selectedDestination.image}
            alt={selectedDestination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
          
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yatra-blue/80 backdrop-blur-md text-xs font-semibold mb-1.5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yatra-gold" /> {selectedDestination.badge}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display">{selectedDestination.name}</h3>
            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-yatra-sky" /> {selectedDestination.subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Yatra Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Crowd Density</span>
              <span className="text-sm font-bold text-navy-900 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-yatra-blue" /> {selectedDestination.crowdLevel} ({selectedDestination.crowdPercentage}%)
              </span>
            </div>
            <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Darshan Wait</span>
              <span className="text-sm font-bold text-amber-800 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> {selectedDestination.darshanWait}
              </span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Free Bhandaras</span>
              <span className="text-sm font-bold text-emerald-800 flex items-center justify-center gap-1 mt-0.5">
                <Utensils className="w-3.5 h-3.5 text-emerald-600" /> {selectedDestination.activeBhandaras} Active
              </span>
            </div>
            <div className="bg-rose-50/60 border border-rose-100 p-3 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Emergency Posts</span>
              <span className="text-sm font-bold text-rose-800 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> {selectedDestination.emergencyPoints} Booths
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              About This Sacred Destination
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedDestination.description}
            </p>
          </div>

          {/* Verified Safe Facilities */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5">
              Verified TirthSaathi Assistance Available Here
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedDestination.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-yatra-blue flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => setActiveModal(null)}
              className="py-3 px-5 rounded-2xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartNavigation}
              className="flex-1 py-3 px-5 rounded-2xl bg-yatra-blue hover:bg-yatra-bright text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> Start Safe Pilgrim Navigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
