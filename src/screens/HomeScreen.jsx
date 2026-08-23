import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import {
  MapPin,
  Search,
  User,
  Sparkles,
  Utensils,
  Car,
  Home,
  Flame,
  Clock,
  Compass,
  ChevronRight,
  ShieldCheck,
  X,
  Navigation,
  Phone,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const HomeScreen = () => {
  const {
    setCurrentScreen,
    activeTemple,
    setActiveTemple,
    temples,
    setActiveModal,
    addToast
  } = useYatra();

  const [activeCategory, setActiveCategory] = useState('for_you');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  // Minimal Category Bar Items
  const categories = [
    { id: 'for_you', label: 'For you', icon: Sparkles },
    { id: 'temples', label: 'Temples', icon: Compass },
    { id: 'bhandara', label: 'Bhandaras', icon: Utensils },
    { id: 'events', label: 'Aartis', icon: Flame },
    { id: 'cabs', label: 'Cabs & Auto', icon: Car },
    { id: 'shelters', label: 'Dharamshala', icon: Home }
  ];

  // Visual Sacred Shrines (Circular Avatar Style like District "Artists in your District")
  const sacredShrines = [
    {
      id: 'kashi',
      name: 'Kashi Vishwanath',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      avatar: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80',
      description: 'Ancient Jyotirlinga along the holy Ganga River. Features 4 primary entry corridors.',
      timing: '03:00 AM - 11:00 PM',
      gatesCount: 4,
      liveWait: '18 mins'
    },
    {
      id: 'ayodhya',
      name: 'Ram Mandir',
      city: 'Ayodhya',
      state: 'Uttar Pradesh',
      avatar: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=400&q=80',
      description: 'Grand Ram Janmabhoomi complex with Rampath and Bhakti Path entry corridors.',
      timing: '06:30 AM - 10:00 PM',
      gatesCount: 4,
      liveWait: '25 mins'
    },
    {
      id: 'vaishno_devi',
      name: 'Vaishno Devi',
      city: 'Katra',
      state: 'Jammu & Kashmir',
      avatar: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80',
      description: 'Holy cave shrine in the Trikuta Mountains with Banganga & Tarakote corridors.',
      timing: '24 Hours Open',
      gatesCount: 4,
      liveWait: '15 mins'
    },
    {
      id: 'tirupati',
      name: 'Tirupati Balaji',
      city: 'Tirumala',
      state: 'Andhra Pradesh',
      avatar: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
      description: 'Venkateswara Swamy Temple featuring historic Vaikuntam Queue Complex.',
      timing: '02:30 AM - 11:30 PM',
      gatesCount: 4,
      liveWait: '40 mins'
    }
  ];

  // Visual Events & Aartis (Poster Card Style like District "Top Movies Near You")
  const topAartis = [
    {
      id: 'ganga_aarti',
      title: 'Maha Ganga Aarti',
      subtitle: 'Dashashwamedh Ghat, Varanasi',
      time: '6:30 PM',
      badge: 'Live at Sunset',
      badgeColor: 'bg-amber-500 text-navy-950',
      image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80',
      description: 'World famous Grand Evening Aarti performed by 7 priests on the holy ghats of Kashi with conch shells and sacred brass lamps.',
      duration: '45 mins',
      entry: 'Free for all devotees'
    },
    {
      id: 'ram_aarti',
      title: 'Ram Lalla Sandhya Aarti',
      subtitle: 'Ram Janmabhoomi, Ayodhya',
      time: '7:00 PM',
      badge: 'Today 7:00 PM',
      badgeColor: 'bg-emerald-500 text-white',
      image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=600&q=80',
      description: 'Daily evening Sandhya Aarti inside the grand sanctum sanctorum of Shree Ram Mandir.',
      duration: '30 mins',
      entry: 'Pre-booked pass or queue entry'
    },
    {
      id: 'vaishno_atka',
      title: 'Bhawan Atka Aarti',
      subtitle: 'Holy Cave, Vaishno Devi',
      time: '6:00 AM & 6:00 PM',
      badge: 'Twice Daily',
      badgeColor: 'bg-blue-600 text-white',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      description: 'Sacred live Bhajan Aarti performed in front of the Holy Pindies atop Trikuta Hills.',
      duration: '1 Hour',
      entry: 'Free viewing track'
    },
    {
      id: 'saryu_deepotsav',
      title: 'Saryu Maha Deepotsav',
      subtitle: 'Ram Ki Paidi, Ayodhya',
      time: '6:45 PM',
      badge: 'Special Darshan',
      badgeColor: 'bg-purple-600 text-white',
      image: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80',
      description: 'Thousands of floating earthen diyas lighting up the tranquil waters of Saryu River.',
      duration: '1 Hour',
      entry: 'Free riverfront access'
    }
  ];

  // Free Community Bhandaras & Prasad
  const bhandaras = [
    {
      id: 'bhandara-1',
      name: 'Annapurna Seva Annakshetra',
      location: 'Near Vishwanath Corridor Gate 2',
      city: 'Varanasi',
      distance: '180m',
      timing: '7:00 AM - 11:00 PM',
      foodType: 'Full Satvik Thali & Hot Milk Seva',
      status: 'Open Now',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
      verifiedBy: 'Kashi Vishwanath Trust'
    },
    {
      id: 'bhandara-2',
      name: 'Ram Janmabhoomi Prasad Bhavan',
      location: 'Rampath Gate 3 Plaza',
      city: 'Ayodhya',
      distance: '320m',
      timing: '6:00 AM - 10:30 PM',
      foodType: 'Free Satvik Prasad, Puri Sabji & Kheer',
      status: 'Open Now',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
      verifiedBy: 'Teerth Vikas Parishad'
    },
    {
      id: 'bhandara-3',
      name: 'Matrusri Vengamamba Nitya Annadanam',
      location: 'East Mada Street Complex',
      city: 'Tirupati',
      distance: '250m',
      timing: '24 Hours Free Meals',
      foodType: 'Unlimited Hot Sambar Rice, Chutney & Payasam',
      status: 'Open 24/7',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
      verifiedBy: 'TTD Trust Board'
    }
  ];

  // Verified Fair-Price Cabs & Auto Rate Cards
  const fairTransit = [
    {
      id: 'erickshaw',
      type: 'E-Rickshaw (Shared)',
      price: '₹20 – ₹40',
      rateDetail: 'Govt Fixed Shared Fare per person',
      badge: 'Eco-Friendly',
      icon: '🛺',
      suitable: 'Short corridor hops & ghat connections'
    },
    {
      id: 'prepaid_auto',
      type: 'Prepaid Auto Rickshaw',
      price: '₹50 Base + ₹12/km',
      rateDetail: 'Official RTO Approved Meter Fare',
      badge: 'Meter Verified',
      icon: '🛺',
      suitable: 'Direct station to temple transit'
    },
    {
      id: 'pilgrim_buggy',
      type: 'Senior Citizen Electric Buggy',
      price: '₹0 (Free Seva)',
      rateDetail: 'Free for Seniors & Differently-Abled',
      badge: '100% Free Seva',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: '⚡',
      suitable: 'Main corridor direct gate drop'
    },
    {
      id: 'ac_taxi',
      type: 'Authorized Pilgrim Taxi',
      price: '₹14 / km',
      rateDetail: 'Standard Outstation & Local Tariff',
      badge: 'Fixed Rate',
      icon: '🚕',
      suitable: 'Airport, Cantt Station & Inter-Temple'
    }
  ];

  const handleSelectShrine = (shrine) => {
    const match = temples.find((t) => t.id === shrine.id || t.name.toLowerCase().includes(shrine.name.toLowerCase()));
    if (match) {
      setActiveTemple(match);
      addToast(`Selected ${shrine.name}`, `Live flow & gate status loaded for ${shrine.city}.`, 'info');
      setCurrentScreen('crowd');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn pb-20">
      {/* ── 1. CLEAN TOP HEADER (LOCATION & PROFILE) ── */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentScreen('crowd')}>
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h2 className="font-extrabold text-sm text-navy-950">{activeTemple.city || 'Varanasi'}</h2>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{activeTemple.name}</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('profile')}
          className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <User className="w-4 h-4" />
        </button>
      </div>

      {/* ── 2. MINIMAL SEARCH INPUT ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search temples, aartis, bhandaras, cabs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
        />
      </div>

      {/* ── 3. HORIZONTAL CATEGORY ICON BAR (DISTRICT STYLE) ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                if (cat.id === 'temples') setCurrentScreen('crowd');
                if (cat.id === 'bhandara' || cat.id === 'cabs' || cat.id === 'shelters') setCurrentScreen('nearby');
                if (cat.id === 'events') setCurrentScreen('events');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 4. SACRED SHRINES (CIRCULAR AVATAR DISCOVERY) ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-navy-950 tracking-tight">
            Sacred Shrines in your Yatra
          </h3>
          <button
            onClick={() => setCurrentScreen('crowd')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>View Gates</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-5 overflow-x-auto no-scrollbar pb-2">
          {sacredShrines.map((shrine) => (
            <div
              key={shrine.id}
              onClick={() => handleSelectShrine(shrine)}
              className="flex flex-col items-center text-center space-y-1.5 cursor-pointer group flex-shrink-0"
            >
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-gold-500 shadow-sm transition-all group-hover:scale-105">
                <img
                  src={shrine.avatar}
                  alt={shrine.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-navy-900 group-hover:text-gold-600 transition-colors truncate max-w-[85px]">
                {shrine.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. LIVE AARTIS & HOLY EVENTS (POSTER CARDS) ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-navy-950 tracking-tight">
            Top Aartis & Holy Events Near You
          </h3>
          <button
            onClick={() => setCurrentScreen('events')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {topAartis.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedItemDetail(event)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm ${event.badgeColor}`}>
                  {event.badge}
                </span>
              </div>

              <div className="p-3 space-y-0.5">
                <h4 className="font-bold text-xs text-navy-950 truncate">{event.title}</h4>
                <p className="text-[11px] text-slate-400 truncate">{event.subtitle}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold pt-1">
                  <Clock className="w-3 h-3" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. FREE COMMUNITY BHANDARAS (MINIMAL FOOD CARDS) ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-navy-950 tracking-tight">
            Free Satvik Bhandaras & Prasad Seva
          </h3>
          <button
            onClick={() => setCurrentScreen('nearby')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {bhandaras.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedItemDetail(b)}
              className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
            >
              <img
                src={b.image}
                alt={b.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {b.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{b.distance}</span>
                </div>
                <h4 className="font-bold text-xs text-navy-900 truncate">{b.name}</h4>
                <p className="text-[10px] text-slate-500 truncate">{b.foodType}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. VERIFIED FAIR-PRICE TRANSIT & CABS RATE CARD ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-navy-950 tracking-tight">
            Verified Fair-Price Transit & Auto Rates
          </h3>
          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Govt Approved Tariff
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fairTransit.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedItemDetail(t)}
              className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{t.icon}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                  {t.badge}
                </span>
              </div>
              <div>
                <h5 className="font-bold text-xs text-navy-900 truncate">{t.type}</h5>
                <strong className="text-sm font-black text-emerald-700 font-display block">{t.price}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. ON-DEMAND DETAIL MODAL (SHOWS DETAILS ONLY WHEN CLICKED) ── */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 space-y-4">
            {selectedItemDetail.image && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={selectedItemDetail.image}
                  alt={selectedItemDetail.title || selectedItemDetail.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItemDetail(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy-900/80 hover:bg-navy-900 text-white flex items-center justify-center transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-5 pt-1 space-y-3 text-xs">
              {!selectedItemDetail.image && (
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedItemDetail.icon || '📍'}</span>
                    <h3 className="font-bold text-base text-navy-950">
                      {selectedItemDetail.title || selectedItemDetail.name || selectedItemDetail.type}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedItemDetail(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {selectedItemDetail.image && (
                <h3 className="font-bold text-base text-navy-950">
                  {selectedItemDetail.title || selectedItemDetail.name}
                </h3>
              )}

              <p className="text-slate-600 leading-relaxed text-xs">
                {selectedItemDetail.description || selectedItemDetail.foodType || selectedItemDetail.rateDetail}
              </p>

              {selectedItemDetail.timing && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 flex items-center justify-between">
                  <span className="text-slate-400">Timings:</span>
                  <strong>{selectedItemDetail.timing}</strong>
                </div>
              )}

              {selectedItemDetail.price && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <span className="text-emerald-700 font-bold">Standard Tariff:</span>
                  <strong className="text-sm font-black">{selectedItemDetail.price}</strong>
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedItemDetail(null);
                  addToast(
                    'Directions Loaded',
                    `Guiding route to ${selectedItemDetail.title || selectedItemDetail.name || selectedItemDetail.type}...`,
                    'success'
                  );
                }}
                className="w-full py-3 rounded-2xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions & View Map</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
