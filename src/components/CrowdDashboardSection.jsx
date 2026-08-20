import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { Users, Sun, HeartPulse, ShieldAlert, Car, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { destinations } from '../data/destinations';

export const CrowdDashboardSection = () => {
  const { addToast } = useYatra();
  const [selectedCity, setSelectedCity] = useState('Varanasi');

  const currentDest = destinations.find((d) => d.name === selectedCity) || destinations[0];

  const hourlyTrends = [
    { time: '6 AM', crowd: 40 },
    { time: '9 AM', crowd: 85 },
    { time: '12 PM', crowd: 92 },
    { time: '3 PM', crowd: 60 },
    { time: '6 PM', crowd: 95 },
    { time: '9 PM', crowd: 50 },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-yatra-blue text-xs font-bold uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" /> Real-Time Telemetry
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
              Know Before You Go
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              Live crowd density, queue wait times, weather, and verified medical availability updated every 60 seconds from temple sensor grids.
            </p>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            {['Varanasi', 'Ayodhya', 'Tirupati', 'Haridwar'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  addToast(`Telemetry Switched`, `Displaying live data for ${city} Dham.`, 'info');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCity === city
                    ? 'bg-yatra-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mb-10">
          {/* Card 1: Crowd Level */}
          <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-yatra-blue flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Crowd Level</span>
              <h4 className="text-xl font-bold text-navy-900 mt-0.5">{currentDest.crowdLevel}</h4>
              <span className="text-xs text-yatra-blue font-semibold">{currentDest.crowdPercentage}% Capacity</span>
            </div>
          </div>

          {/* Card 2: Darshan Queue */}
          <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Darshan Wait</span>
              <h4 className="text-xl font-bold text-navy-900 mt-0.5">{currentDest.darshanWait.split(' ')[0]} min</h4>
              <span className="text-xs text-amber-700 font-semibold">Normal Flow</span>
            </div>
          </div>

          {/* Card 3: Temple Status */}
          <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sanctum Status</span>
              <h4 className="text-xl font-bold text-emerald-700 mt-0.5">Open Now</h4>
              <span className="text-xs text-slate-500">Closes 11:00 PM</span>
            </div>
          </div>

          {/* Card 4: Weather */}
          <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-yatra-sky flex items-center justify-center mb-3">
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Weather</span>
              <h4 className="text-xl font-bold text-navy-900 mt-0.5">24°C</h4>
              <span className="text-xs text-slate-500">Pleasant & Clear</span>
            </div>
          </div>

          {/* Card 5: Emergency Points */}
          <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Security Booths</span>
              <h4 className="text-xl font-bold text-navy-900 mt-0.5">{currentDest.emergencyPoints} Active</h4>
              <span className="text-xs text-emerald-600 font-semibold">QRF Patrolling</span>
            </div>
          </div>

          {/* Card 6: Parking */}
          <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Parking P1/P2</span>
              <h4 className="text-xl font-bold text-navy-900 mt-0.5">Available</h4>
              <span className="text-xs text-slate-500">142 Free Spots</span>
            </div>
          </div>
        </div>

        {/* Hourly Crowd Graph Banner */}
        <div className="bg-gradient-to-r from-navy-900 to-[#0C2A4F] rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold font-display">Daily Crowd Flow Forecast ({selectedCity})</h3>
              <p className="text-xs text-sky-200">Plan your darshan during green/low-density intervals for elderly family ease.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Best Time (3-4 PM)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Peak Aarti (6-7 PM)</span>
            </div>
          </div>

          {/* Interactive Flow Bar Chart */}
          <div className="grid grid-cols-6 gap-3 items-end h-32 pt-4 border-b border-white/10 pb-2">
            {hourlyTrends.map((bar, idx) => {
              let color = 'bg-yatra-sky';
              if (bar.crowd > 80) color = 'bg-amber-400';
              if (bar.crowd < 55) color = 'bg-emerald-400';
              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold font-mono">
                    {bar.crowd}%
                  </span>
                  <div
                    style={{ height: `${bar.crowd}%` }}
                    className={`w-full rounded-t-xl transition-all duration-500 ${color} group-hover:brightness-125 shadow-sm`}
                  />
                  <span className="text-[11px] font-semibold text-slate-300">{bar.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
