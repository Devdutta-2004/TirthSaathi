// TirthSaathi Finder - Family & Group Connectivity Data Service

const STORAGE_KEY = 'tirthsaathi_family_group';

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
      role: 'Group Admin',
      phone: '+91 98300 12345',
      avatar: '🙋‍♂️',
      battery: 94,
      signal: '5G High',
      status: 'online',
      coords: { lat: 25.3109, lng: 83.0107 },
      lastKnownLocation: 'Kashi Vishwanath Corridor',
      lastSynced: 'Just now',
      distanceMeters: 0,
      emergencyContact: true
    },
    {
      id: 'usr-2',
      deviceId: 'DEV-MAA-02',
      name: 'Maa (Kalyani)',
      role: 'Senior Pilgrim',
      phone: '+91 98300 23456',
      avatar: '👵',
      battery: 86,
      signal: '4G Good',
      status: 'online',
      coords: { lat: 25.3115, lng: 83.0118 },
      lastKnownLocation: 'Gate 2 (Prasad Counter)',
      lastSynced: '2 mins ago',
      distanceMeters: 120,
      emergencyContact: true
    },
    {
      id: 'usr-3',
      deviceId: 'DEV-PIT-03',
      name: 'Pitaji (Ramesh)',
      role: 'Senior Pilgrim',
      phone: '+91 98300 34567',
      avatar: '👴',
      battery: 72,
      signal: '4G Good',
      status: 'online',
      coords: { lat: 25.3098, lng: 83.0125 },
      lastKnownLocation: 'Silversmith Lane Cloakroom Plaza',
      lastSynced: '4 mins ago',
      distanceMeters: 280,
      emergencyContact: true
    },
    {
      id: 'usr-4',
      deviceId: 'DEV-ROH-04',
      name: 'Rohan (Brother)',
      role: 'Companion',
      phone: '+91 98300 45678',
      avatar: '👦',
      battery: 64,
      signal: '5G High',
      status: 'online',
      coords: { lat: 25.3089, lng: 83.0089 },
      lastKnownLocation: 'Godowlia Main Gate Security Line',
      lastSynced: '1 min ago',
      distanceMeters: 430,
      emergencyContact: false
    }
  ]
};

export function getStoredFamilyGroup() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
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
    name: groupName || 'My Sacred Yatra Circle',
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
        role: 'Group Admin',
        phone: '+91 98300 00000',
        avatar: '🙋‍♂️',
        battery: 98,
        signal: '5G High',
        status: 'online',
        coords: { lat: 25.3109, lng: 83.0107 },
        lastKnownLocation: 'Current GPS Location',
        lastSynced: 'Just now',
        distanceMeters: 0,
        emergencyContact: true
      }
    ]
  };

  saveFamilyGroup(newGroup);
  return newGroup;
}

export function joinExistingFamilyGroup(code, yourName) {
  const existing = getStoredFamilyGroup();
  const newMember = {
    id: `usr-${Date.now()}`,
    deviceId: 'DEV-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    name: yourName || 'New Yatri Member',
    role: 'Member',
    phone: '+91 98000 11111',
    avatar: '🧑',
    battery: 90,
    signal: '4G Good',
    status: 'online',
    coords: { lat: 25.3109 + (Math.random() - 0.5) * 0.003, lng: 83.0107 + (Math.random() - 0.5) * 0.003 },
    lastKnownLocation: 'Temple Entrance Plaza',
    lastSynced: 'Just now',
    distanceMeters: 80,
    emergencyContact: false
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
