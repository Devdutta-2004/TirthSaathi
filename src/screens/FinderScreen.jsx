import React, { useState } from 'react';
import { useYatra } from '../context/YatraContext';
import { calculateHaversineDistance, calculateCompassBearing } from '../services/geoService';
import { LiveGPSMap } from '../components/map/LiveGPSMap';
import {
  Users,
  QrCode,
  Share2,
  Copy,
  Check,
  MapPin,
  Bell,
  Phone,
  Navigation,
  RefreshCw,
  Battery,
  Wifi,
  Shield,
  Clock,
  UserPlus,
  Compass,
  AlertCircle,
  Sparkles,
  Radio,
  Eye,
  X
} from 'lucide-react';

export const FinderScreen = () => {
  const {
    familyGroup,
    createFamily,
    joinFamily,
    triggerBeacon,
    networkStatus,
    isRealtimeConnected,
    myCoords,
    myAccuracy,
    myHeading,
    myBattery,
    addToast
  } = useYatra();

  const [activeTab, setActiveTab] = useState('gps-map'); // 'gps-map', 'radar', 'members', 'manage'
  const [selectedMember, setSelectedMember] = useState(familyGroup.members[1] || familyGroup.members[0]);
  const [showFindPersonModal, setShowFindPersonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Group creation / join modal forms
  const [groupNameInput, setGroupNameInput] = useState('');
  const [yourNameInput, setYourNameInput] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCopyCode = () => {
    setCopied(true);
    addToast(
      'Family Code Copied',
      `Code ${familyGroup.groupCode} copied. Open app on your second phone and join this code!`,
      'success'
    );
    navigator.clipboard && navigator.clipboard.writeText(familyGroup.groupCode);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setShowFindPersonModal(true);
  };

  const handleCreateGroupSubmit = (e) => {
    e.preventDefault();
    if (!groupNameInput) return;
    createFamily(groupNameInput, yourNameInput);
    setShowCreateModal(false);
    setGroupNameInput('');
  };

  const handleJoinGroupSubmit = (e) => {
    e.preventDefault();
    if (!joinCodeInput) return;
    joinFamily(joinCodeInput, yourNameInput);
    setShowJoinModal(false);
    setJoinCodeInput('');
  };

  // Get real-time distance to selected member
  const getLiveDistance = (member) => {
    if (!member?.coords || !myCoords) return member?.distanceMeters || 0;
    return calculateHaversineDistance(myCoords.lat, myCoords.lng, member.coords.lat, member.coords.lng);
  };

  const getLiveBearing = (member) => {
    if (!member?.coords || !myCoords) return 0;
    return calculateCompassBearing(myCoords.lat, myCoords.lng, member.coords.lat, member.coords.lng);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
          1. GROUP STATUS & REAL-TIME WEBSOCKET MESH HEADER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 text-[10px] font-bold uppercase tracking-wider">
              Real Multi-Device GPS Mesh Active
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
              isRealtimeConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isRealtimeConnected ? 'WebSocket Live Sync' : 'Local Standalone'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold font-heritage text-navy-900">
            {familyGroup.name}
          </h1>

          <p className="text-xs text-slate-500 font-medium mt-0.5 flex flex-wrap items-center gap-2">
            <span>Circle Code: <strong className="font-mono text-navy-900 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">{familyGroup.groupCode}</strong></span>
            <span>• {familyGroup.members.length} Devices Synced</span>
            <span>• GPS: ±{myAccuracy}m accuracy</span>
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleCopyCode}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-navy-900 transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gold-600" />}
            <span>{copied ? 'Copied' : 'Share Circle Code'}</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-yatra-blue hover:bg-yatra-bright text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Circle</span>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
          >
            Join on Phone 2
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. NAVIGATION TABS (Live GPS Map vs Radar vs Members)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'gps-map', label: 'Live OpenStreetMap GPS', icon: MapPin, badge: 'Real GPS' },
          { id: 'radar', label: 'Temple Perimeter Radar', icon: Compass, badge: null },
          { id: 'members', label: 'Connected Devices List', icon: Users, badge: `${familyGroup.members.length}` },
          { id: 'manage', label: 'Group QR & Multi-Phone Setup', icon: QrCode, badge: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-yatra-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB CONTENT
      ───────────────────────────────────────────────────────────── */}

      {/* TAB A: REAL OPENSTREETMAP GPS LAYER */}
      {activeTab === 'gps-map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Real Map Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-navy-900 uppercase tracking-wide">
                  Live Multi-Device GPS Satellite Stream
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Lat: {myCoords.lat.toFixed(4)}, Lng: {myCoords.lng.toFixed(4)}
              </span>
            </div>

            {/* Real Interactive Leaflet / OpenStreetMap Layer */}
            <div className="h-[420px] w-full">
              <LiveGPSMap
                myCoords={myCoords}
                myAccuracy={myAccuracy}
                myHeading={myHeading}
                members={familyGroup.members}
                selectedMember={selectedMember}
                onSelectMember={handleSelectMember}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
              <span>📍 Tap any avatar to activate <strong>"Find Person Walking Mode"</strong></span>
              <span className="text-emerald-700 font-semibold">
                ● Live updates streaming across connected smartphones
              </span>
            </div>
          </div>

          {/* Quick Peer Telemetry Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Connected Pilgrims & Distance
            </h3>

            <div className="space-y-2.5">
              {familyGroup.members.map((m) => {
                const isSelected = selectedMember?.id === m.id || selectedMember?.deviceId === m.deviceId;
                const distance = getLiveDistance(m);
                const bearing = getLiveBearing(m);

                return (
                  <div
                    key={m.deviceId || m.id}
                    onClick={() => handleSelectMember(m)}
                    className={`p-3.5 rounded-2xl bg-white border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-gold-500 ring-2 ring-gold-400/30 shadow-card'
                        : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shadow-2xs">
                        {m.avatar || '👤'}
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-900 text-xs font-heritage">
                          {m.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {distance === 0 ? 'Anchor (This Phone)' : `~${distance}m away`} • {bearing}° Bearing
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md block">
                        {m.battery || 90}% 🔋
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">
                        {m.lastSynced || 'Live'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audio Chime Trigger Button */}
            {selectedMember && (
              <button
                onClick={() => triggerBeacon(selectedMember)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 text-xs font-bold shadow-gold-sm transition-all flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                <span>Ring Sacred Audio Chime on {selectedMember.name}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB B: TEMPLE PERIMETER RADAR */}
      {activeTab === 'radar' && (
        <div className="bg-navy-900 rounded-3xl p-5 sm:p-6 border border-slate-700 text-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-xs">
            <span className="font-mono font-bold text-slate-200 uppercase">
              Perimeter SafeZone Radar (150m Circle)
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">● SATELLITE MESH ONLINE</span>
          </div>

          <div className="relative aspect-[4/3] max-w-xl mx-auto rounded-2xl bg-gradient-to-br from-navy-950 via-[#071830] to-navy-900 border border-slate-700 flex items-center justify-center overflow-hidden">
            {/* Radar circles */}
            <div className="w-72 h-72 rounded-full border border-gold-400/20 absolute" />
            <div className="w-48 h-48 rounded-full border border-gold-400/30 absolute" />
            <div className="w-24 h-24 rounded-full border border-gold-400/40 absolute" />

            {/* Sanctum Center */}
            <div className="text-center z-10">
              <span className="text-2xl">🛕</span>
              <span className="text-[9px] block text-gold-300 font-bold uppercase mt-1">Sanctum</span>
            </div>

            {/* You marker */}
            <div className="absolute bottom-1/4 left-1/3 p-1.5 rounded-full bg-yatra-blue text-white text-[10px] font-bold shadow-glow flex items-center gap-1">
              <span>📍 You</span>
            </div>

            {/* Peer markers */}
            {familyGroup.members.slice(1).map((m, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectMember(m)}
                style={{ top: `${30 + idx * 20}%`, right: `${25 + idx * 15}%` }}
                className="absolute cursor-pointer p-1.5 rounded-full bg-amber-400 text-navy-950 text-[10px] font-bold shadow-md hover:scale-110 transition-transform"
              >
                <span>{m.avatar || '👤'} {m.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: CONNECTED DEVICES LIST */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyGroup.members.map((member) => {
            const distance = getLiveDistance(member);
            const bearing = getLiveBearing(member);

            return (
              <div
                key={member.deviceId || member.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center text-2xl">
                        {member.avatar || '👤'}
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-900 text-sm font-heritage">{member.name}</h3>
                        <p className="text-xs text-gold-700 font-semibold">{member.role}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {member.isOnline ? 'Online Synced' : 'Active in Perimeter'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Distance</span>
                      <strong className="text-navy-900 text-xs font-mono">{distance}m</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Battery</span>
                      <strong className="text-emerald-700 text-xs font-mono">{member.battery || 90}%</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Bearing</span>
                      <strong className="text-gold-700 text-xs font-mono">{bearing}°</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-600 space-y-1">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-yatra-blue flex-shrink-0 mt-0.5" />
                      <span className="truncate">
                        <strong>GPS Coords:</strong> {member.coords?.lat?.toFixed(4)}, {member.coords?.lng?.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectMember(member)}
                    className="flex-1 py-2.5 rounded-xl bg-yatra-blue hover:bg-navy-900 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 text-gold-300" />
                    <span>Find & Navigate</span>
                  </button>
                  <button
                    onClick={() => triggerBeacon(member)}
                    className="px-3.5 py-2.5 rounded-xl bg-gold-100 hover:bg-gold-200 text-navy-950 text-xs font-bold transition-colors"
                    title="Send Spiritual Chime Beacon"
                  >
                    <Bell className="w-4 h-4 text-gold-700" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB D: MULTI-PHONE SETUP & QR INVITE */}
      {activeTab === 'manage' && (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-6 border border-slate-200 shadow-card text-center space-y-5">
          <div>
            <span className="px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase">
              Multi-Device Live Sync Setup
            </span>
            <h3 className="text-xl font-bold font-heritage text-navy-900 mt-2">
              Connect Phone 2 to this Circle
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Open <strong>http://192.168.1.100:3000/</strong> on your second smartphone and enter this circle code to start live real-time GPS tracking.
            </p>
          </div>

          {/* QR Box */}
          <div className="inline-block p-4 bg-white rounded-3xl border-2 border-dashed border-gold-400 shadow-inner">
            <div className="w-48 h-48 bg-navy-950 rounded-2xl p-3 flex flex-col justify-between text-white font-mono text-xs">
              <div className="flex justify-between">
                <div className="w-12 h-12 border-2 border-gold-400 rounded-lg p-1.5 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gold-400 rounded-sm" />
                </div>
                <div className="w-12 h-12 border-2 border-gold-400 rounded-lg p-1.5 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gold-400 rounded-sm" />
                </div>
              </div>
              <div className="text-center text-[11px] text-gold-300 font-bold tracking-wider">
                {familyGroup.groupCode}
              </div>
              <div className="flex justify-between items-end">
                <div className="w-12 h-12 border-2 border-gold-400 rounded-lg p-1.5 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gold-400 rounded-sm" />
                </div>
                <span className="text-[9px] text-gold-200">TIRTHSAATHI</span>
              </div>
            </div>
          </div>

          {/* Circle Code Share Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="font-mono text-base font-bold text-navy-900 tracking-wider">
              {familyGroup.groupCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 rounded-xl bg-yatra-blue hover:bg-navy-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. "FIND MY PERSON" MODAL WITH REAL-TIME WALKING ROUTE
      ───────────────────────────────────────────────────────────── */}
      {showFindPersonModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 flex items-center justify-center text-2xl border border-gold-200">
                  {selectedMember.avatar || '👤'}
                </div>
                <div>
                  <h3 className="font-bold font-heritage text-navy-900 text-base">Tracking {selectedMember.name}...</h3>
                  <p className="text-xs text-gold-700 font-semibold">{selectedMember.role}</p>
                </div>
              </div>
              <button
                onClick={() => setShowFindPersonModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Telemetry */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Live GPS Distance:</span>
                <span className="font-bold text-yatra-blue text-sm font-mono">
                  ~{getLiveDistance(selectedMember)} meters away
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Compass Bearing:</span>
                <span className="font-bold text-gold-700 font-mono">
                  {getLiveBearing(selectedMember)}° Heading
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Device Battery:</span>
                <span className="font-medium text-emerald-700">{selectedMember.battery || 90}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => triggerBeacon(selectedMember)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-navy-950 text-xs font-bold shadow-gold-sm transition-all flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                <span>Ring Loud Spiritual Chime Beacon on Their Device</span>
              </button>

              <button
                onClick={() => {
                  setShowFindPersonModal(false);
                  setActiveTab('gps-map');
                  addToast('Navigation Active', `OpenStreetMap route loaded directly to ${selectedMember.name}.`, 'success');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-yatra-blue hover:bg-navy-900 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-gold-300" />
                <span>View Fullscreen Walking Path on Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CIRCLE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <form onSubmit={handleCreateGroupSubmit} className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heritage text-navy-900">Create Private Family Circle</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Group Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sharma Family Yatra"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Devdutta"
                value={yourNameInput}
                onChange={(e) => setYourNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-yatra-blue text-white text-xs font-bold shadow-sm"
              >
                Create Circle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* JOIN CIRCLE MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <form onSubmit={handleJoinGroupSubmit} className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heritage text-navy-900">Join Family Circle</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Circle Code (from Phone 1)</label>
              <input
                type="text"
                required
                placeholder="e.g. TS-FAM-7X29A"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs uppercase font-mono focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Sunita"
                value={yourNameInput}
                onChange={(e) => setYourNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-yatra-blue text-white text-xs font-bold shadow-sm"
              >
                Connect Devices
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
