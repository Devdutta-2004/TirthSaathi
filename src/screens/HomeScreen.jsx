import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { createEntryPass, getStoredPasses } from '../services/passService';
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
  CheckCircle2,
  Calendar,
  Zap,
  QrCode,
  Users,
  Footprints,
  ArrowRight,
  Check
} from 'lucide-react';

export const HomeScreen = () => {
  const {
    setCurrentScreen,
    activeTemple,
    setActiveTemple,
    temples,
    refreshPasses,
    addToast
  } = useYatra();

  const [activeCategory, setActiveCategory] = useState('for_you');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive State -> Shrine -> Booking Flow
  const [selectedState, setSelectedState] = useState(null);
  const [bookingTemple, setBookingTemple] = useState(null);
  const [selectedDate, setSelectedDate] = useState('Today (23 Aug)');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:00 AM');
  const [selectedGate, setSelectedGate] = useState(null);
  const [groupSize, setGroupSize] = useState(2);
  const [generatedPass, setGeneratedPass] = useState(null);
  const [genericDetailModal, setGenericDetailModal] = useState(null);

  // Minimal Category Bar Items
  const categories = [
    { id: 'for_you', label: 'For you', icon: Sparkles },
    { id: 'temples', label: 'Temples', icon: Compass },
    { id: 'bhandara', label: 'Bhandaras', icon: Utensils },
    { id: 'events', label: 'Aartis', icon: Flame },
    { id: 'cabs', label: 'Cabs & Auto', icon: Car },
    { id: 'shelters', label: 'Dharamshala', icon: Home }
  ];

  // Rich Full-Width State Destination Cards with Famous Shrines
  const stateDestinations = [
    {
      id: 'up',
      stateName: 'Uttar Pradesh',
      tagline: 'Kashi Vishwanath, Ayodhya Ram Mandir & Mathura',
      badge: '3 Holy Dhams',
      bgImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      shrines: [
        {
          id: 'kashi',
          name: 'Kashi Vishwanath Temple',
          city: 'Varanasi',
          image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
          tag: 'Jyotirlinga',
          liveWait: '18 mins',
          slotsLeft: 420,
          gates: ['Gate 1 (Ganga Ghat)', 'Gate 2 (Godowlia)', 'Gate 3 (Chhattadwar)', 'Gate 4 (Dhunilal)']
        },
        {
          id: 'ayodhya',
          name: 'Shree Ram Janmabhoomi Mandir',
          city: 'Ayodhya',
          image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=600&q=80',
          tag: 'Ram Janmabhoomi',
          liveWait: '25 mins',
          slotsLeft: 310,
          gates: ['Rampath Gate 1', 'Bhakti Path Gate 2', 'Janmabhoomi Gate 3', 'Ram Ki Paidi Gate 4']
        },
        {
          id: 'vrindavan',
          name: 'Banke Bihari Mandir',
          city: 'Vrindavan',
          image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=600&q=80',
          tag: 'Krishna Dham',
          liveWait: '30 mins',
          slotsLeft: 180,
          gates: ['VIP Entry Gate', 'Main Plaza Corridor', 'Parikrama Gate']
        }
      ]
    },
    {
      id: 'jk',
      stateName: 'Jammu & Kashmir',
      tagline: 'Mata Vaishno Devi Holy Cave Shrine',
      badge: 'Trikuta Mountain',
      bgImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      shrines: [
        {
          id: 'vaishno_devi',
          name: 'Shri Mata Vaishno Devi Shrine',
          city: 'Katra',
          image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
          tag: 'Shakti Peeth',
          liveWait: '15 mins',
          slotsLeft: 640,
          gates: ['Banganga Gate 1', 'Tarakote Marg Gate 2', 'Sanjichhat Gate 3', 'Himkoti Gate 4']
        },
        {
          id: 'shiv_khori',
          name: 'Shiv Khori Cave Shrine',
          city: 'Reasi',
          image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=600&q=80',
          tag: 'Holy Cave',
          liveWait: '10 mins',
          slotsLeft: 290,
          gates: ['Main Cave Entry', 'Helipad Track']
        }
      ]
    },
    {
      id: 'ap',
      stateName: 'Andhra Pradesh',
      tagline: 'Tirumala Tirupati Venkateswara Swamy',
      badge: 'Kaliyuga Vaikuntam',
      bgImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      shrines: [
        {
          id: 'tirupati',
          name: 'Tirumala Venkateswara Temple',
          city: 'Tirupati',
          image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
          tag: 'Seven Hills',
          liveWait: '40 mins',
          slotsLeft: 510,
          gates: ['Vaikuntam QC-1', 'Vaikuntam QC-2 (SED)', 'Supatham Gate', 'Srivari Mettu Gate']
        }
      ]
    },
    {
      id: 'uk',
      stateName: 'Uttarakhand',
      tagline: 'Char Dham: Kedarnath, Badrinath & Haridwar',
      badge: 'Himalayan Shrines',
      bgImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      shrines: [
        {
          id: 'kedarnath',
          name: 'Kedarnath Dham',
          city: 'Rudraprayag',
          image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
          tag: 'Char Dham Jyotirlinga',
          liveWait: '20 mins',
          slotsLeft: 220,
          gates: ['Main Mandir Corridor', 'Helipad Fast Track', 'VIP Darshan Gate']
        },
        {
          id: 'badrinath',
          name: 'Badrinath Temple',
          city: 'Chamoli',
          image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=600&q=80',
          tag: 'Vishnu Dham',
          liveWait: '15 mins',
          slotsLeft: 340,
          gates: ['Alaknanda River Gate', 'Brahma Kapal Entry']
        }
      ]
    }
  ];

  // Visual Events & Aartis
  const topAartis = [
    {
      id: 'ganga_aarti',
      title: 'Maha Ganga Aarti',
      subtitle: 'Dashashwamedh Ghat, Varanasi',
      time: '6:30 PM',
      badge: 'Live at Sunset',
      image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80',
      description: 'World famous Grand Evening Aarti performed by 7 priests on the holy ghats of Kashi with conch shells and sacred brass lamps.'
    },
    {
      id: 'ram_aarti',
      title: 'Ram Lalla Sandhya Aarti',
      subtitle: 'Ram Janmabhoomi, Ayodhya',
      time: '7:00 PM',
      badge: 'Today 7:00 PM',
      image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=600&q=80',
      description: 'Daily evening Sandhya Aarti inside the grand sanctum sanctorum of Shree Ram Mandir.'
    },
    {
      id: 'vaishno_atka',
      title: 'Bhawan Atka Aarti',
      subtitle: 'Holy Cave, Vaishno Devi',
      time: '6:00 AM & 6:00 PM',
      badge: 'Twice Daily',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      description: 'Sacred live Bhajan Aarti performed in front of the Holy Pindies atop Trikuta Hills.'
    }
  ];

  // Free Community Bhandaras
  const bhandaras = [
    {
      id: 'bhandara-1',
      name: 'Annapurna Seva Annakshetra',
      city: 'Varanasi',
      distance: '180m',
      timing: '7:00 AM - 11:00 PM',
      foodType: 'Full Satvik Thali & Hot Milk Seva',
      status: 'Open Now',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'bhandara-2',
      name: 'Ram Janmabhoomi Prasad Bhavan',
      city: 'Ayodhya',
      distance: '320m',
      timing: '6:00 AM - 10:30 PM',
      foodType: 'Free Satvik Prasad, Puri Sabji & Kheer',
      status: 'Open Now',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'bhandara-3',
      name: 'Matrusri Vengamamba Nitya Annadanam',
      city: 'Tirupati',
      distance: '250m',
      timing: '24 Hours Free Meals',
      foodType: 'Unlimited Hot Sambar Rice, Chutney & Payasam',
      status: 'Open 24/7',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80'
    }
  ];

  // Verified Fair-Price Cabs & Auto Rate Cards
  const fairTransit = [
    {
      id: 'erickshaw',
      type: 'E-Rickshaw (Shared)',
      price: '₹20 – ₹40',
      badge: 'Eco-Friendly',
      icon: '🛺',
      rateDetail: 'Govt Fixed Shared Fare per person for short temple corridor hops.'
    },
    {
      id: 'prepaid_auto',
      type: 'Prepaid Auto Rickshaw',
      price: '₹50 Base + ₹12/km',
      badge: 'Meter Verified',
      icon: '🛺',
      rateDetail: 'Official RTO Approved Meter Fare directly from railway stations.'
    },
    {
      id: 'pilgrim_buggy',
      type: 'Senior Citizen Electric Buggy',
      price: '₹0 (Free Seva)',
      badge: '100% Free Seva',
      icon: '⚡',
      rateDetail: 'Free electric buggy transport for seniors and differently-abled devotees.'
    },
    {
      id: 'ac_taxi',
      type: 'Authorized Pilgrim Taxi',
      price: '₹14 / km',
      badge: 'Fixed Tariff',
      icon: '🚕',
      rateDetail: 'Standard Outstation & Local Airport/Cantt Station tariff.'
    }
  ];

  // Handle Temple Selection from State
  const handleOpenTempleBooking = (temple) => {
    setSelectedState(null);
    setBookingTemple(temple);
    setSelectedGate(temple.gates[0]);
  };

  // Confirm Booking & Feed ML Leading Indicator
  const handleConfirmBooking = () => {
    if (!bookingTemple || !selectedGate) return;

    const pass = createEntryPass({
      templeId: bookingTemple.id,
      templeName: bookingTemple.name,
      gateId: `gate-${Date.now()}`,
      gateCode: selectedGate,
      gateName: selectedGate,
      groupSize,
      slotTime: selectedSlot
    });

    refreshPasses();
    setBookingTemple(null);
    setGeneratedPass(pass);
    addToast(
      '🎟️ Darshan Pass Confirmed & ML Indexed!',
      `Pass #${pass.passCode} issued for ${bookingTemple.name}. Leading crowd signal updated!`,
      'success'
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn pb-24 bg-amber-50/20 min-h-screen">
      {/* ── 1. SACRED TOP BAR (LOCATION & PROFILE) ── */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentScreen('crowd')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h2 className="font-extrabold text-sm text-amber-950 font-display">{activeTemple.city || 'Varanasi'}</h2>
              <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-[11px] text-amber-800/80 font-medium">{activeTemple.name}</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('profile')}
          className="w-10 h-10 rounded-2xl bg-white border border-amber-200 text-amber-800 flex items-center justify-center hover:bg-amber-50 transition-colors shadow-xs"
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* ── 2. SACRED SEARCH BAR ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-amber-600 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search temples, aartis, bhandaras, cabs, ghats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-amber-200/90 text-xs text-amber-950 placeholder:text-amber-700/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        />
      </div>

      {/* ── 3. CORE CROWD MANAGEMENT LIVE RADAR WIDGET (MAIN PURPOSE OF APP) ── */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 rounded-3xl p-5 text-white shadow-lg border border-amber-400/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-100 text-[10px] font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Live ML Crowd Engine</span>
              <span className="text-white/30">•</span>
              <span className="text-emerald-300">Continuous AI Prediction</span>
            </div>

            <h3 className="text-lg font-black font-display tracking-tight text-white">
              {activeTemple.name}
            </h3>

            <div className="flex items-center gap-3 text-xs text-amber-100">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Est. Wait: <strong>~18 mins</strong></span>
              </span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-bold">🟢 Recommended: Gate 2</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('crowd')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs shadow-md transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Compass className="w-4 h-4 text-amber-700" />
            <span>Open Live Crowd Router →</span>
          </button>
        </div>
      </div>

      {/* ── 4. HORIZONTAL CATEGORY ICON BAR (DISTRICT MINIMAL PILLS) ── */}
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
                  ? 'bg-amber-600 text-white shadow-sm border border-amber-500'
                  : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200/80 shadow-xs'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 5. STATE PILGRIMAGE DESTINATIONS (SPACIOUS FULL-WIDTH CARDS) ── */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-amber-950 font-display tracking-tight">
            Pilgrimage States & Holy Dhams
          </h3>
          <span className="text-[11px] font-bold text-amber-700">Tap state to view temples</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stateDestinations.map((state) => (
            <div
              key={state.id}
              onClick={() => setSelectedState(state)}
              className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group border border-amber-200/80"
            >
              <img
                src={state.bgImage}
                alt={state.stateName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500 text-navy-950 shadow-sm font-display">
                  {state.badge}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                <h4 className="font-extrabold text-base tracking-tight font-display">{state.stateName}</h4>
                <p className="text-[11px] text-amber-200/90 truncate">{state.tagline}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold pt-1">
                  <span>{state.shrines.length} Famous Temples • Slotted Darshan Pass</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. TOP AARTIS & HOLY EVENTS (POSTER CARDS) ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-amber-950 font-display tracking-tight">
            Top Aartis & Holy Events
          </h3>
          <button
            onClick={() => setCurrentScreen('events')}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {topAartis.map((event) => (
            <div
              key={event.id}
              onClick={() => setGenericDetailModal(event)}
              className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-navy-950 shadow-sm">
                  {event.badge}
                </span>
              </div>

              <div className="p-3.5 space-y-0.5">
                <h4 className="font-bold text-xs text-amber-950 truncate">{event.title}</h4>
                <p className="text-[11px] text-amber-800/70 truncate">{event.subtitle}</p>
                <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold pt-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. FREE SATVIK BHANDARAS & PRASAD ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-amber-950 font-display tracking-tight">
            Free Satvik Bhandaras & Prasad Seva
          </h3>
          <button
            onClick={() => setCurrentScreen('nearby')}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {bhandaras.map((b) => (
            <div
              key={b.id}
              onClick={() => setGenericDetailModal(b)}
              className="bg-white rounded-3xl p-3.5 border border-amber-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
            >
              <img
                src={b.image}
                alt={b.name}
                className="w-14 h-14 rounded-2xl object-cover border border-amber-100 flex-shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {b.status}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700">{b.distance}</span>
                </div>
                <h4 className="font-bold text-xs text-amber-950 truncate">{b.name}</h4>
                <p className="text-[10px] text-amber-800/80 truncate">{b.foodType}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. VERIFIED FAIR-PRICE TRANSIT & CABS ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-amber-950 font-display tracking-tight">
            Verified Fair-Price Transit & Auto Rates
          </h3>
          <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Govt Approved Tariff
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fairTransit.map((t) => (
            <div
              key={t.id}
              onClick={() => setGenericDetailModal(t)}
              className="bg-white rounded-2xl p-3 border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{t.icon}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {t.badge}
                </span>
              </div>
              <div>
                <h5 className="font-bold text-xs text-amber-950 truncate">{t.type}</h5>
                <strong className="text-sm font-black text-emerald-800 font-display block">{t.price}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL 1: STATE TEMPLES SELECTOR
          ═══════════════════════════════════════════════════════════ */}
      {selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-200 space-y-4">
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 p-5 text-white relative">
              <button
                onClick={() => setSelectedState(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
                {selectedState.badge}
              </span>
              <h3 className="font-extrabold text-lg text-white mt-0.5">{selectedState.stateName}</h3>
              <p className="text-xs text-amber-100/90">{selectedState.tagline}</p>
            </div>

            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                Select Temple for Slotted Darshan Booking:
              </span>

              {selectedState.shrines.map((shrine) => (
                <div
                  key={shrine.id}
                  onClick={() => handleOpenTempleBooking(shrine)}
                  className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200 hover:border-amber-400 hover:bg-amber-50/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <img
                    src={shrine.image}
                    alt={shrine.name}
                    className="w-14 h-14 rounded-xl object-cover border border-amber-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-amber-950 truncate group-hover:text-amber-700">
                        {shrine.name}
                      </h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                        {shrine.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800/70">{shrine.city} • Est. Wait {shrine.liveWait}</p>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      🟢 {shrine.slotsLeft} Online Passes Available Today
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 2: MOVIE / TRAVEL STYLE SLOTTED DARSHAN TICKET BOOKING
          ═══════════════════════════════════════════════════════════ */}
      {bookingTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200 space-y-4">
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 p-5 text-white relative">
              <button
                onClick={() => setBookingTemple(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={bookingTemple.image}
                  alt={bookingTemple.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-base text-white">{bookingTemple.name}</h3>
                  <p className="text-xs text-amber-100">{bookingTemple.city} • Official Slotted Darshan Pass</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              {/* Select Date */}
              <div>
                <label className="font-extrabold text-amber-950 block mb-1.5">1. Select Darshan Date:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today (23 Aug)', 'Tomorrow (24 Aug)', 'Sunday (25 Aug)'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`py-2 px-1 rounded-xl text-center font-bold border transition-all text-[11px] ${
                        selectedDate === d
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-amber-50/40 text-amber-900 border-amber-200 hover:bg-amber-100/60'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Slotted Time Window (Movie Style) */}
              <div>
                <label className="font-extrabold text-amber-950 block mb-1.5">2. Choose Entry Time Slot:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { slot: '05:30 AM - 06:30 AM', label: 'Dawn Mangala Aarti', left: '180 slots' },
                    { slot: '08:00 AM - 09:00 AM', label: 'Morning Darshan', left: '320 slots' },
                    { slot: '10:00 AM - 11:00 AM', label: 'Peak Mid-Day Flow', left: '120 slots' },
                    { slot: '06:00 PM - 07:00 PM', label: 'Sandhya Aarti', left: '45 slots (Fast Filling)' }
                  ].map((s) => (
                    <button
                      key={s.slot}
                      type="button"
                      onClick={() => setSelectedSlot(s.slot)}
                      className={`p-2.5 rounded-2xl text-left border transition-all space-y-0.5 ${
                        selectedSlot === s.slot
                          ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500/30'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-xs text-navy-900 block">{s.slot}</span>
                      <span className="text-[10px] text-slate-500 block">{s.label}</span>
                      <span className="text-[9px] font-bold text-emerald-700 block">● {s.left}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Slotted Gate */}
              <div>
                <label className="font-extrabold text-amber-950 block mb-1.5">3. Select Entry Gate:</label>
                <div className="grid grid-cols-2 gap-2">
                  {bookingTemple.gates.map((gateName) => (
                    <button
                      key={gateName}
                      type="button"
                      onClick={() => setSelectedGate(gateName)}
                      className={`p-2.5 rounded-xl text-left font-bold text-xs border transition-all ${
                        selectedGate === gateName
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-1 ring-emerald-400'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{gateName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Members */}
              <div>
                <label className="font-extrabold text-amber-950 block mb-1.5">4. Group Members (Pilgrims):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGroupSize(n)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        groupSize === n
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n} {n === 1 ? 'Person' : 'Pilgrims'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setBookingTemple(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold shadow-md"
                >
                  Confirm & Issue Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 3: GENERATED VERIFIED QR PASS
          ═══════════════════════════════════════════════════════════ */}
      {generatedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-amber-200 text-center space-y-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
              <button
                onClick={() => setGeneratedPass(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-3xl bg-white/20 border border-white/30 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg mt-2">Verified Darshan Pass</h3>
              <p className="text-xs text-emerald-100 font-mono">Pass #{generatedPass.passCode}</p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shrine:</span>
                  <strong className="text-navy-900">{generatedPass.templeName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Entry Gate:</span>
                  <strong className="text-emerald-700">{generatedPass.gateCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Slot:</span>
                  <span className="font-bold text-slate-800">{generatedPass.slotTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Group Size:</span>
                  <span className="font-bold text-navy-900">{generatedPass.groupSize} Pilgrims</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-2">
                <div className="w-32 h-32 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white shadow-sm">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Present at RFID / Turnstile Scanner</span>
              </div>

              <button
                onClick={() => setGeneratedPass(null)}
                className="w-full py-3 rounded-2xl bg-navy-950 text-white font-bold text-xs shadow-md"
              >
                Save & Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 4: GENERIC DETAIL MODAL (ON-DEMAND)
          ═══════════════════════════════════════════════════════════ */}
      {genericDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-amber-200 space-y-4">
            {genericDetailModal.image && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={genericDetailModal.image}
                  alt={genericDetailModal.title || genericDetailModal.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setGenericDetailModal(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy-900/80 hover:bg-navy-900 text-white flex items-center justify-center transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-5 pt-1 space-y-3 text-xs">
              <h3 className="font-bold text-base text-navy-950">
                {genericDetailModal.title || genericDetailModal.name || genericDetailModal.type}
              </h3>

              <p className="text-slate-600 leading-relaxed text-xs">
                {genericDetailModal.description || genericDetailModal.foodType || genericDetailModal.rateDetail}
              </p>

              {genericDetailModal.timing && (
                <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 text-amber-900 flex items-center justify-between">
                  <span className="text-amber-700">Timings:</span>
                  <strong>{genericDetailModal.timing}</strong>
                </div>
              )}

              {genericDetailModal.price && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <span className="text-emerald-700 font-bold">Standard Tariff:</span>
                  <strong className="text-sm font-black">{genericDetailModal.price}</strong>
                </div>
              )}

              <button
                onClick={() => {
                  setGenericDetailModal(null);
                  addToast('Directions Loaded', `Guiding route to destination...`, 'success');
                }}
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
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
