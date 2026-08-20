import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { destinations } from '../data/destinations';
import { MapPin, ArrowRight, Star, Clock, Users, Sparkles } from 'lucide-react';

export const DestinationsSection = () => {
  const { setSelectedDestination, setActiveModal } = useYatra();
  const [filter, setFilter] = useState('all');

  const handleOpenDestination = (dest) => {
    setSelectedDestination(dest);
    setActiveModal('destination-guide');
  };

  const filteredDestinations = destinations.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'north') return d.state === 'Uttar Pradesh' || d.state === 'Uttarakhand';
    if (filter === 'south') return d.state === 'Andhra Pradesh' || d.state === 'Tamil Nadu';
    return true;
  });

  return (
    <section id="destinations" className="py-20 bg-yatra-bg border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yatra-light text-yatra-blue text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yatra-gold" /> Sacred Yatra Destinations
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
              Explore Sacred Destinations
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              Discover India's most revered pilgrimage destinations and plan your journey with confidence, live crowd insights, and safety support.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
            {[
              { id: 'all', label: 'All Dhams' },
              { id: 'north', label: 'North India' },
              { id: 'south', label: 'South India' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.id
                    ? 'bg-yatra-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid (4:3 aspect ratio images) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleOpenDestination(dest)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-float transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col"
            >
              {/* Image Container with 4:3 ratio and zoom on hover */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-navy-900 shadow-sm">
                    {dest.badge}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-bold text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{dest.rating}</span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <span className="text-[10px] text-yatra-sky font-semibold uppercase tracking-wider block">
                    {dest.state}
                  </span>
                  <h3 className="text-xl font-bold font-display leading-tight">{dest.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-yatra-blue flex-shrink-0" />
                    <span className="truncate">{dest.subtitle}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {dest.description}
                  </p>
                </div>

                {/* Status Chips */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-yatra-blue" />
                      <strong>{dest.crowdLevel} Crowd</strong>
                    </span>
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {dest.darshanWait}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-yatra-light text-navy-800 group-hover:text-yatra-blue text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200 group-hover:border-yatra-blue/30"
                  >
                    <span>View Yatra Guide & Safety Hub</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
