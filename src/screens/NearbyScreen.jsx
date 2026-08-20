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
  MapPin,
  Search
} from 'lucide-react';

export const NearbyScreen = () => {
  const { addToast } = useYatra();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredServices = nearbyServices.filter((srv) => {
    const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.locationDetail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleNavigate = (srv) => {
    addToast(
      `Navigation Loaded: ${srv.name}`,
      `Guiding via nearest low-congestion walkway (${srv.distance} away).`,
      'success'
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* 1. HEADER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
            Verified Community Seva & Amenities
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold font-display text-navy-900 mt-1">
            Nearby Essential Facilities
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Locate free Satvik Annakshetras (Bhandaras), clean water points, medical tents, and toilets.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search facility name or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 text-navy-900"
          />
        </div>
      </div>

      {/* 2. CATEGORY PILLS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {serviceCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-yatra-blue text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-yatra-light text-yatra-blue flex items-center justify-center shadow-2xs">
                  {getCategoryIcon(srv.category)}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {srv.status}
                </span>
              </div>

              <h3 className="font-bold text-navy-900 text-sm font-display leading-tight mb-1">
                {srv.name}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="font-bold text-yatra-blue bg-blue-50 px-2 py-0.5 rounded-md">
                  {srv.distance}
                </span>
                <span>• {srv.timeEstimate}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{srv.timing}</span>
                </div>
                <div className="flex items-start gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="truncate">{srv.locationDetail}</span>
                </div>
                {srv.foodType && (
                  <p className="text-[11px] text-amber-800 font-medium pt-1 border-t border-slate-200/60">
                    🍛 {srv.foodType}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleNavigate(srv)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-yatra-blue text-slate-800 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Walking Route</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
