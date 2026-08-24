// TirthSaathi Finder - Futuristic Family & Group Telemetry Data Service

const STORAGE_KEY = 'tirthsaathi_family_group';

// Curated high-resolution avatar image pool
export const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', // Leader (Devdutta)
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', // Senior Woman (Maa)
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', // Senior Man (Pitaji)
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', // Brother (Rohan)
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', // Sister
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', // Companion
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', // Yatri
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'  // Devotee
];

export const initialFamilyGroup = {
  id: 'group-sharma-2026',
  groupCode: 'TS-FAM-7X29A',
  name: 'Sharma Family Yatra Circle',
  createdBy: 'Devdutta (Group Leader)',
  createdAt: new Date().toISOString(),
  templeDestination: 'Kashi Vishwanath, Varanasi',
  safePerimeterRadiusMeters: 150,
  lastSyncTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isOfflineCached: false,
  members: [
    {
      id: 'usr-1',
      deviceId: 'DEV-ME-01',
      name: 'Devdutta (You)',
      role: 'Circle Leader',
      phone: '+91 98300 12345',
      avatar: AVATAR_IMAGES[0],
      battery: 94,
      signal: '5G UWB High',
      status: 'online',
      coords: { lat: 25.3109, lng: 83.0107 },
      lastKnownLocation: 'Kashi Vishwanath Corridor',
      lastSynced: 'Just now',
      distanceMeters: 0,
      emergencyContact: true,
      uwbChannel: 'CH-9 (7.98 GHz)',
      rssi: -38
    },
    {
      id: 'usr-2',
      deviceId: 'DEV-MAA-02',
      name: 'Maa (Kalyani)',
      role: 'Senior Devotee',
      phone: '+91 98300 23456',
      avatar: AVATAR_IMAGES[1],
      battery: 86,
      signal: '4G Mesh Good',
      status: 'online',
      coords: { lat: 25.3115, lng: 83.0118 },
      lastKnownLocation: 'Gate 2 (Prasad Counter)',
      lastSynced: '2 mins ago',
      distanceMeters: 120,
      emergencyContact: true,
      uwbChannel: 'CH-9 (7.98 GHz)',
      rssi: -62
    },
    {
      id: 'usr-3',
      deviceId: 'DEV-PIT-03',
      name: 'Pitaji (Ramesh)',
      role: 'Senior Devotee',
      phone: '+91 98300 34567',
      avatar: AVATAR_IMAGES[2],
      battery: 72,
      signal: '4G Mesh Good',
      status: 'online',
      coords: { lat: 25.3098, lng: 83.0125 },
      lastKnownLocation: 'Silversmith Lane Cloakroom Plaza',
      lastSynced: '4 mins ago',
      distanceMeters: 280,
      emergencyContact: true,
      uwbChannel: 'CH-9 (7.98 GHz)',
      rssi: -78
    },
    {
      id: 'usr-4',
      deviceId: 'DEV-ROH-04',
      name: 'Rohan (Brother)',
      role: 'Companion',
      phone: '+91 98300 45678',
      avatar: AVATAR_IMAGES[3],
      battery: 64,
      signal: '5G UWB High',
      status: 'online',
      coords: { lat: 25.3089, lng: 83.0089 },
      lastKnownLocation: 'Godowlia Main Gate Security Line',
      lastSynced: '1 min ago',
      distanceMeters: 430,
      emergencyContact: false,
      uwbChannel: 'CH-9 (7.98 GHz)',
      rssi: -84
    }
  ]
};

export function getStoredFamilyGroup() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure avatars are valid image URLs rather than old cached emojis
      if (parsed?.members) {
        parsed.members = parsed.members.map((m, idx) => {
          if (!m.avatar || typeof m.avatar !== 'string' || !m.avatar.startsWith('http')) {
            return { ...m, avatar: AVATAR_IMAGES[idx % AVATAR_IMAGES.length] };
          }
          return m;
        });
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading family group from storage', e);
  }
  return initialFamilyGroup;
}

export const getFamilyGroup = getStoredFamilyGroup;

export function saveFamilyGroup(group) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(group));
  } catch (e) {
    console.error('Error saving family group to storage', e);
  }
}

export function createNewFamilyGroup(groupName, yourName) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomCode = 'TS-FAM-';
  for (let i = 0; i < 5; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const newGroup = {
    id: `group-${Date.now()}`,
    groupCode: randomCode,
    name: groupName || 'Quantum Yatra Circle',
    createdBy: yourName || 'You',
    createdAt: new Date().toISOString(),
    templeDestination: 'Current Pilgrimage',
    safePerimeterRadiusMeters: 150,
    lastSyncTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isOfflineCached: false,
    members: [
      {
        id: `usr-${Date.now()}`,
        deviceId: 'DEV-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        name: `${yourName || 'You'} (Leader)`,
        role: 'Circle Leader',
        phone: '+91 98300 00000',
        avatar: AVATAR_IMAGES[0],
        battery: 98,
        signal: '5G UWB High',
        status: 'online',
        coords: { lat: 25.3109, lng: 83.0107 },
        lastKnownLocation: 'Current GPS Location',
        lastSynced: 'Just now',
        distanceMeters: 0,
        emergencyContact: true,
        uwbChannel: 'CH-9 (7.98 GHz)',
        rssi: -35
      }
    ]
  };

  saveFamilyGroup(newGroup);
  return newGroup;
}

export function joinExistingFamilyGroup(code, yourName) {
  const existing = getStoredFamilyGroup();
  const avatarIndex = (existing.members?.length || 0) % AVATAR_IMAGES.length;
  const newMember = {
    id: `usr-${Date.now()}`,
    deviceId: 'DEV-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    name: yourName || 'New Yatri Node',
    role: 'Node Member',
    phone: '+91 98000 11111',
    avatar: AVATAR_IMAGES[avatarIndex],
    battery: 90,
    signal: '5G UWB High',
    status: 'online',
    coords: { lat: 25.3109 + (Math.random() - 0.5) * 0.003, lng: 83.0107 + (Math.random() - 0.5) * 0.003 },
    lastKnownLocation: 'Temple Entrance Plaza',
    lastSynced: 'Just now',
    distanceMeters: 80,
    emergencyContact: false,
    uwbChannel: 'CH-9 (7.98 GHz)',
    rssi: -50
  };

  const updated = {
    ...existing,
    groupCode: code.toUpperCase(),
    members: [...existing.members, newMember]
  };
  saveFamilyGroup(updated);
  return updated;
}

export const joinFamilyGroupByCode = joinExistingFamilyGroup;
