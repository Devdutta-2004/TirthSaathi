import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { serviceCategories, nearbyServices } from '../data/services';
import {
  Utensils,
  Droplets,
  HeartPulse,
  Home,
  Bath,
  ShieldAlert,
  Car,
  Navigation,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin
} from 'lucide-react';

export const BhandaraNearbySection = () => {
  const { addToast } = useYatra();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'bhandara': return <Utensils className="w-5 h-5" />;
      case 'water': return <Droplets className="w-5 h-5" />;
      case 'medical': return <HeartPulse className="w-5 h-5" />;
      case 'rest': return <Home className="w-5 h-5" />;
      case 'toilet': return <Bath className="w-5 h-5" />;
      case 'police': return <ShieldAlert className="w-5 h-5" />;
      case 'parking': return <Car className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const filteredServices = nearbyServices.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handleGetDirections = (srv) => {
    addToast(
      `Route Loaded: ${srv.name}`,
      `Distance: ${srv.distance} (${srv.timeEstimate}). Guiding via nearest crowd-free walkway.`,
      'success'
    );
  };

  return (
    <section id="bhandaras" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Utensils className="w-3.5 h-3.5 text-yatra-saffron" /> Seva & Essential Amenities
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
              Find Food, Help & Essentials Nearby
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              Locate verified free Annakshetras (Bhandaras), clean drinking water ATMs, first-aid medical tents, and rest shelters in real-time.
            </p>
          </div>

          <div className="bg-blue-50/80 border border-blue-100 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs text-navy-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Free Verified Temple Community Seva</span>
          </div>
        </div>

        {/* Featured Seva Spotlight Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-card border border-slate-100 bg-navy-900 text-white grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto">
            <img
              src="/images/bhandara_prasad.jpg"
              alt="Volunteers serving holy satvik bhandara prasad to seated pilgrims"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-navy-900/60 hidden lg:block" />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
                ⭐ Community Prasad Seva Highlight
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                Shree Annapurna Mahaprasad Seva
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Freshly prepared, hygienic Satvik meals served with pure love and devotion to over 25,000 pilgrims daily. No pre-booking required. All devotees are warmly welcome.
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs text-slate-200 mb-6">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-amber-300" /> Open: 6:00 AM - 11:00 PM
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-yatra-sky" /> Adjacent to Temple Gate #3
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                  <Utensils className="w-3.5 h-3.5 text-emerald-300" /> Unlimited Free Thali
                </span>
              </div>
            </div>

            <button
              onClick={() => handleGetDirections({ name: 'Shree Annapurna Mahaprasad Seva', distance: '180m', timeEstimate: '2 mins' })}
              className="self-start py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" /> Get Walking Route (180m away)
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {serviceCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-yatra-blue text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((srv) => {
            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-float transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-yatra-light text-yatra-blue flex items-center justify-center shadow-sm">
                      {getCategoryIcon(srv.category)}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {srv.status}
                    </span>
                  </div>

                  {/* Title & Distance */}
                  <h4 className="font-bold text-navy-900 text-base mb-1 font-display line-clamp-1">{srv.name}</h4>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="font-bold text-yatra-blue bg-blue-50 px-2 py-0.5 rounded-md">
                      {srv.distance}
                    </span>
                    <span>• {srv.timeEstimate}</span>
                  </div>

                  {/* Details */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 mb-3">
                    <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{srv.timing}</span>
                    </div>
                    <div className="flex items-start gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{srv.locationDetail}</span>
                    </div>
                    {srv.foodType && (
                      <p className="text-[11px] text-amber-800 font-medium pt-1 border-t border-slate-200/60">
                        🍛 {srv.foodType}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  type="button"
                  onClick={() => handleGetDirections(srv)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-yatra-blue text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate ({srv.distance})</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
