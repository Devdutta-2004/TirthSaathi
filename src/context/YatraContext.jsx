import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTemples } from '../services/crowdEngine';
import { getFamilyGroup, saveFamilyGroup, createNewFamilyGroup, joinExistingFamilyGroup } from '../services/familyStore';
import { getStoredPasses } from '../services/passService';
import { initOfflineSync, getOfflineQueue } from '../services/offlineSyncService';
import { realtimeClient } from '../services/realtimeClient';
import { peerMeshService } from '../services/peerService';
import { watchDeviceGPS, stopWatchingGPS, getDeviceBattery, playSpiritualChimeBeacon } from '../services/geoService';

const YatraContext = createContext();

export const YatraProvider = ({ children }) => {
  // 1. Navigation & Role State
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userRole, setUserRole] = useState('pilgrim');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // 2. Preferences & Accessibility
  const [seniorMode, setSeniorMode] = useState(false);
  const [festivalTheme, setFestivalTheme] = useState('default');
  const [language, setLanguage] = useState('English');

  // 3. Network & Offline State
  const [networkStatus, setNetworkStatus] = useState('online');
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // 4. Live Real GPS & Device State
  const [myCoords, setMyCoords] = useState({ lat: 25.3109, lng: 83.0107 });
  const [myAccuracy, setMyAccuracy] = useState(10);
  const [myHeading, setMyHeading] = useState(0);
  const [myBattery, setMyBattery] = useState(90);

  // 5. Active Temples & Crowd Management Engine
  const [temples, setTemples] = useState(initialTemples);
  const [activeTemple, setActiveTemple] = useState(initialTemples[0]);

  // 6. Family Group & Telemetry
  const [familyGroup, setFamilyGroup] = useState(getFamilyGroup());

  // 7. Passes & Tickets
  const [passes, setPasses] = useState(getStoredPasses());

  // 8. Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // ─────────────────────────────────────────────────────────────
  // A. INITIALIZE DUAL-ENGINE: WEBRTC DIRECT P2P + WEBSOCKET MESH
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let watchId = null;

    try {
      const deviceId = localStorage.getItem('tirthsaathi_device_id') || 'DEV-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      localStorage.setItem('tirthsaathi_device_id', deviceId);

      const groupCode = familyGroup.groupCode || 'TS-FAM-7X29A';
      const userName = localStorage.getItem('tirthsaathi_user_name') || 'Devdutta';

      // 1. Initialize Direct WebRTC Peer-to-Peer Mesh
      try { peerMeshService.init(groupCode, deviceId, userName, 'Devotee'); } catch (e) { console.warn('[Init] PeerJS:', e.message); }

      // 2. Initialize Local WebSocket Client (skips on production automatically)
      try { realtimeClient.connect(); } catch (e) { console.warn('[Init] WebSocket:', e.message); }

      // 3. Read Device Battery
      getDeviceBattery().then((lvl) => setMyBattery(lvl)).catch(() => {});

      // 4. Start Physical GPS Location Tracking
      watchId = watchDeviceGPS(
        (pos) => {
          setMyCoords({ lat: pos.lat, lng: pos.lng });
          setMyAccuracy(pos.accuracy);
          setMyHeading(pos.heading);

          try {
            peerMeshService.sendTelemetry({ lat: pos.lat, lng: pos.lng }, pos.accuracy, myBattery, pos.heading);
            realtimeClient.sendTelemetry({ lat: pos.lat, lng: pos.lng }, pos.accuracy, myBattery, pos.heading);
          } catch (e) { /* telemetry send failed, non-fatal */ }
        },
        (err) => {
          console.warn('[GPS Provider] GPS satellite search:', err.message);
        }
      );
    } catch (initError) {
      console.warn('[YatraContext] Initialization notice:', initError.message);
    }

    // 5. Handle WebRTC P2P Incoming Data
    const unsubscribePeer = peerMeshService.subscribe((event) => {
      const { type, payload } = event;

      switch (type) {
        case 'PEER_READY':
          setIsRealtimeConnected(true);
          break;

        case 'PEER_HELLO':
          addToast(
            '👨‍👩‍👧 Family Phone Connected Live!',
            `${payload.name} connected directly over WebRTC.`,
            'success'
          );
          setFamilyGroup((prev) => {
            const exists = prev.members.some((m) => m.deviceId === payload.deviceId);
            if (exists) return prev;
            return {
              ...prev,
              members: [
                ...prev.members,
                {
                  id: `usr-${payload.deviceId}`,
                  deviceId: payload.deviceId,
                  name: payload.name,
                  role: payload.role || 'Member',
                  phone: '+91 Mobile Sync',
                  avatar: '🧑',
                  battery: 92,
                  status: 'online',
                  coords: { lat: 25.3109, lng: 83.0107 },
                  lastSynced: 'Just now',
                  distanceMeters: 10,
                  isOnline: true
                }
              ]
            };
          });
          break;

        case 'GPS_TELEMETRY':
          // Update live GPS coordinates of peer phone in real time!
          setFamilyGroup((prev) => ({
            ...prev,
            members: prev.members.map((m) => {
              if (m.deviceId === payload.deviceId || m.name === payload.name) {
                return {
                  ...m,
                  coords: payload.coords,
                  accuracy: payload.accuracy,
                  battery: payload.battery,
                  heading: payload.heading,
                  lastSynced: 'Just now',
                  isOnline: true
                };
              }
              return m;
            })
          }));
          break;

        case 'BEACON_ALERT':
          // Sound loud audio chime on this phone
          playSpiritualChimeBeacon();
          addToast(
            '🔔 Spiritual Chime Beacon Alert!',
            `Loud chime beacon sounded by ${payload.senderName || 'Family Member'}.`,
            'warning'
          );
          break;

        case 'GATE_SCAN_EVENT':
          // Live crowd gate sync across phones
          setTemples((prevTemples) =>
            prevTemples.map((t) => {
              if (t.id === payload.templeId) {
                return {
                  ...t,
                  gates: t.gates.map((g) => {
                    if (g.id === payload.gateId) {
                      const newCount = Math.max(0, g.currentCount + Number(payload.delta || 0));
                      return {
                        ...g,
                        currentCount: newCount,
                        occupancyPercent: Math.round((newCount / g.capacity) * 100)
                      };
                    }
                    return g;
                  })
                };
              }
              return t;
            })
          );
          break;

        default:
          break;
      }
    });

    // 6. Handle WebSocket Broadcasts
    const unsubscribeWs = realtimeClient.subscribe((event) => {
      const { type, payload } = event;
      if (type === 'CONNECTION_STATE') {
        setIsRealtimeConnected(payload.connected || peerMeshService.isReady);
      }
    });

    return () => {
      stopWatchingGPS(watchId);
      unsubscribePeer();
      unsubscribeWs();
    };
  }, []);

  // Update activeTemple when temples array updates
  useEffect(() => {
    const updated = temples.find((t) => t.id === activeTemple.id);
    if (updated) {
      setActiveTemple(updated);
    }
  }, [temples]);

  // Family Group Operations
  const createFamily = (groupName, yourName) => {
    const newGroup = createNewFamilyGroup(groupName, yourName);
    setFamilyGroup(newGroup);
    const deviceId = localStorage.getItem('tirthsaathi_device_id') || 'DEV-ME-01';

    peerMeshService.init(newGroup.groupCode, deviceId, yourName, 'Lead Devotee');
    realtimeClient.joinGroup(newGroup.groupCode, yourName, 'Lead Devotee', myCoords, myBattery);

    addToast('Family Circle Created', `Private Code: ${newGroup.groupCode}`, 'success');
  };

  const joinFamily = (groupCode, yourName) => {
    const joined = joinExistingFamilyGroup(groupCode, yourName);
    setFamilyGroup(joined);
    const deviceId = localStorage.getItem('tirthsaathi_device_id') || 'DEV-PHONE2';

    peerMeshService.init(groupCode, deviceId, yourName, 'Devotee');
    realtimeClient.joinGroup(groupCode, yourName, 'Devotee', myCoords, myBattery);

    addToast('Connected to Family Circle', `Joined room ${groupCode}`, 'success');
  };

  const triggerBeacon = (targetMember) => {
    playSpiritualChimeBeacon();
    const targetId = targetMember.deviceId || targetMember.id;
    peerMeshService.triggerBeacon(targetId, 'Devdutta');
    realtimeClient.triggerBeacon(targetId, 'Devdutta');
    addToast('Loud Chime Beacon Dispatched', `Beacon audio dispatched to ${targetMember.name || targetMember}.`, 'warning');
  };

  // Authority & Gate Management Broadcasts
  const updateGateCrowd = (templeId, gateId, delta) => {
    setTemples((prev) =>
      prev.map((t) => {
        if (t.id === templeId) {
          return {
            ...t,
            gates: t.gates.map((g) => {
              if (g.id === gateId) {
                const newCount = Math.max(0, g.currentCount + delta);
                return {
                  ...g,
                  currentCount: newCount,
                  occupancyPercent: Math.round((newCount / g.capacity) * 100)
                };
              }
              return g;
            })
          };
        }
        return t;
      })
    );

    // Broadcast to peer phones over WebRTC & WebSocket
    peerMeshService.sendGateScan(templeId, gateId, delta, delta > 0 ? 'ENTRY' : 'EXIT');
    realtimeClient.sendGateScan(templeId, gateId, delta, delta > 0 ? 'ENTRY' : 'EXIT');
  };

  const toggleGateStatus = (templeId, gateId) => {
    setTemples((prev) =>
      prev.map((t) => {
        if (t.id === templeId) {
          return {
            ...t,
            gates: t.gates.map((g) => {
              if (g.id === gateId) {
                const newStatus = g.status === 'OPEN' ? 'CLOSED' : 'OPEN';
                realtimeClient.toggleGateStatus(templeId, gateId, newStatus);
                return { ...g, status: newStatus };
              }
              return g;
            })
          };
        }
        return t;
      })
    );
  };

  const refreshPasses = () => {
    setPasses(getStoredPasses());
  };

  return (
    <YatraContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        userRole,
        setUserRole,
        activeModal,
        setActiveModal,
        selectedDestination,
        setSelectedDestination,
        seniorMode,
        setSeniorMode,
        festivalTheme,
        setFestivalTheme,
        language,
        setLanguage,
        networkStatus,
        setNetworkStatus,
        offlineQueueCount,
        isRealtimeConnected,
        myCoords,
        myAccuracy,
        myHeading,
        myBattery,
        temples,
        activeTemple,
        setActiveTemple,
        updateGateCrowd,
        toggleGateStatus,
        familyGroup,
        createFamily,
        joinFamily,
        triggerBeacon,
        passes,
        refreshPasses,
        toasts,
        addToast
      }}
    >
      {children}
    </YatraContext.Provider>
  );
};

export const useYatra = () => {
  const context = useContext(YatraContext);
  if (!context) {
    throw new Error('useYatra must be used within a YatraProvider');
  }
  return context;
};
