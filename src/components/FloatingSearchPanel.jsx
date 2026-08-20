import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Utensils,
  Users,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { destinations } from '../data/destinations';

export const FloatingSearchPanel = () => {
  const { searchParams, setSearchParams, addToast, setSelectedDestination, setActiveModal } = useYatra();
  const [activeTab, setActiveTab] = useState('pilgrimages');

  const tabs = [
    { id: 'pilgrimages', label: 'Pilgrimages', icon: '🛕', targetSection: 'destinations' },
    { id: 'nearby', label: 'Nearby Services', icon: '📍', targetSection: 'bhandaras' },
    { id: 'people', label: 'Find People', icon: '👨‍👩‍👧', targetSection: 'find-people' },
    { id: 'bhandaras', label: 'Bhandaras', icon: '🍛', targetSection: 'bhandaras' },
    { id: 'events', label: 'Events & Aarti', icon: '📅', targetSection: 'events' },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab.id);
    const el = document.getElementById(tab.targetSection);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExplore = (e) => {
    e.preventDefault();
    const matchedDest = destinations.find(
      (d) => d.name.toLowerCase() === searchParams.destination.toLowerCase()
    ) || destinations[0];

    setSelectedDestination(matchedDest);
    addToast(
      `Exploring ${matchedDest.name} Yatra`,
      `Crowd Level: ${matchedDest.crowdLevel} (${matchedDest.crowdPercentage}%). Darshan wait: ${matchedDest.darshanWait}.`,
      'info'
    );

    if (searchParams.assistance === 'Family Safety') {
      const el = document.getElementById('find-people');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (searchParams.assistance === 'Lost Person') {
      const el = document.getElementById('lost-found');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (searchParams.assistance === 'Emergency') {
      setActiveModal('sos');
    } else {
      const el = document.getElementById('destinations');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative -mt-12 sm:-mt-16 z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl sm:rounded-4xl shadow-float border border-slate-100 p-4 sm:p-6 lg:p-7 backdrop-blur-xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 pb-4 sm:pb-5 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-yatra-light text-yatra-blue border border-yatra-blue/30 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Controls Grid */}
        <form onSubmit={handleExplore} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Destination Field */}
          <div className="lg:col-span-4 bg-slate-50/80 hover:bg-blue-50/50 p-3 rounded-2xl border border-slate-200/80 transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-yatra-blue" /> Where are you going?
            </label>
            <select
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              className="w-full bg-transparent text-sm font-bold text-navy-900 focus:outline-none cursor-pointer"
            >
              <option value="Varanasi">Varanasi (Kashi Vishwanath)</option>
              <option value="Ayodhya">Ayodhya (Ram Janmabhoomi)</option>
              <option value="Tirupati">Tirupati (Sri Venkateswara)</option>
              <option value="Haridwar">Haridwar (Har Ki Pauri)</option>
              <option value="Kedarnath">Kedarnath Dham (Himalayas)</option>
              <option value="Amritsar">Amritsar (Golden Temple)</option>
              <option value="Rameshwaram">Rameshwaram (Ramanathaswamy)</option>
            </select>
          </div>

          {/* Date Field */}
          <div className="lg:col-span-3 bg-slate-50/80 hover:bg-blue-50/50 p-3 rounded-2xl border border-slate-200/80 transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-yatra-blue" /> Select Yatra Date
            </label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              className="w-full bg-transparent text-sm font-bold text-navy-900 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Assistance Type */}
          <div className="lg:col-span-3 bg-slate-50/80 hover:bg-blue-50/50 p-3 rounded-2xl border border-slate-200/80 transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-yatra-blue" /> Choose Assistance
            </label>
            <select
              value={searchParams.assistance}
              onChange={(e) => setSearchParams({ ...searchParams, assistance: e.target.value })}
              className="w-full bg-transparent text-sm font-bold text-navy-900 focus:outline-none cursor-pointer"
            >
              <option value="Family Safety">👨‍👩‍👧 Family Safety & Beacon</option>
              <option value="Lost Person">🔍 Lost Person Help</option>
              <option value="Emergency">🚨 Emergency & SOS</option>
              <option value="Nearby Services">🍛 Free Bhandara & Water</option>
              <option value="General">🛕 Darshan & Queue Guide</option>
            </select>
          </div>

          {/* Explore Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-4 px-5 rounded-2xl bg-yatra-blue hover:bg-yatra-bright text-white font-bold text-sm shadow-card hover:shadow-float transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
