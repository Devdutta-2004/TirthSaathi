import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { destinations } from '../data/destinations';
import { MapPin, Clock, Users, Star, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const ExploreScreen = () => {
  const { setSelectedDestination, setActiveModal, setCurrentScreen, setActiveTemple, temples } = useYatra();
  const [activeStateFilter, setActiveStateFilter] = useState('all');

  const handleSelectYatra = (dest) => {
    const matchedTemple = temples.find((t) => t.name.toLowerCase().includes(dest.name.toLowerCase()) || dest.name.toLowerCase().includes(t.city.toLowerCase()));
    if (matchedTemple) {
      setActiveTemple(matchedTemple);
    }
    setSelectedDestination(dest);
    setActiveModal('destination-guide');
  };

  const filtered = destinations.filter((d) => {
    if (activeStateFilter === 'all') return true;
    return d.state === activeStateFilter;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-yatra-blue text-[10px] font-bold uppercase tracking-wider">
            Comprehensive Pilgrimage Directory
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold font-display text-navy-900 mt-1">
            Explore Sacred Temples & Dhams
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Discover temple histories, gate regulations, live crowd status, and best visiting months.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Uttar Pradesh', 'Uttarakhand', 'Andhra Pradesh'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStateFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeStateFilter === st
                  ? 'bg-yatra-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Dhams' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Destination Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((dest) => (
          <div
            key={dest.id}
            onClick={() => handleSelectYatra(dest)}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-float transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-navy-900">
                  {dest.badge}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-yatra-sky font-semibold uppercase">{dest.state}</span>
                  <h3 className="text-xl font-bold font-display">{dest.name}</h3>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-yatra-blue flex-shrink-0" />
                  <span className="truncate">{dest.subtitle}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {dest.description}
                </p>

                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                  <span className="flex items-center gap-1 font-bold text-navy-900">
                    <Users className="w-3 h-3 text-yatra-blue" /> {dest.crowdLevel} ({dest.crowdPercentage}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" /> Darshan: {dest.darshanWait}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button className="w-full py-2.5 px-4 rounded-xl bg-yatra-light group-hover:bg-yatra-blue text-yatra-blue group-hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                <span>View Full Yatra Guide & Smart Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
