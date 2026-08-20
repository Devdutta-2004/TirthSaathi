import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTemples } from '../services/crowdEngine';
import { getFamilyGroup, saveFamilyGroup, createNewFamilyGroup, joinExistingFamilyGroup } from '../services/familyStore';
import { getStoredPasses } from '../services/passService';
import { initOfflineSync, getOfflineQueue } from '../services/offlineSyncService';
import { realtimeClient } from '../services/realtimeClient';
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
  // A. INITIALIZE REALTIME WEBSOCKET & GPS HARDWARE ENGINE
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Initialize Realtime WebSocket
    realtimeClient.connect();

    // 2. Read Device Battery
    getDeviceBattery().then((lvl) => setMyBattery(lvl));

    // 3. Start Physical GPS Location Tracking
    const watchId = watchDeviceGPS(
      (pos) => {
        setMyCoords({ lat: pos.lat, lng: pos.lng });
        setMyAccuracy(pos.accuracy);
        setMyHeading(pos.heading);

        // Stream real GPS update to WebSocket backend
        realtimeClient.sendTelemetry({ lat: pos.lat, lng: pos.lng }, pos.accuracy, myBattery, pos.heading);
      },
      (err) => {
        console.warn('[GPS Provider] Running with default location or permission pending:', err.message);
      }
    );

    // 4. Subscribe to Realtime Server Broadcasts
    const unsubscribe = realtimeClient.subscribe((event) => {
      const { type, payload } = event;

      switch (type) {
        case 'CONNECTION_STATE':
          setIsRealtimeConnected(payload.connected);
          break;

        case 'GROUP_SYNC':
          // Full group sync from server
          if (payload.members && payload.members.length > 0) {
            setFamilyGroup((prev) => ({
              ...prev,
              groupCode: payload.groupCode,
              members: payload.members
            }));
          }
          break;

        case 'MEMBER_JOINED':
          addToast(
            '👨‍👩‍👧 Family Member Joined!',
            `${payload.name} has joined group ${familyGroup.groupCode}.`,
            'success'
          );
          setFamilyGroup((prev) => {
            const exists = prev.members.some((m) => m.deviceId === payload.deviceId);
            if (exists) return prev;
            return { ...prev, members: [...prev.members, payload] };
          });
          break;

        case 'TELEMETRY_BROADCAST':
          // Update live GPS coordinates of peer phone
          setFamilyGroup((prev) => ({
            ...prev,
            members: prev.members.map((m) => {
              if (m.deviceId === payload.deviceId) {
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

        case 'BEACON_TRIGGERED':
          // Play loud chime beacon if triggered by another phone
          playSpiritualChimeBeacon();
          addToast(
            '🔔 Spiritual Chime Beacon Alert!',
            `Loud chime beacon sounded by ${payload.senderName}.`,
            'warning'
          );
          break;

        case 'GATE_UPDATED':
          // Instant multi-device gate occupancy sync
          setTemples((prevTemples) =>
            prevTemples.map((t) => {
              if (t.id === payload.templeId) {
                return {
                  ...t,
                  gates: t.gates.map((g) => {
                    if (g.id === payload.gateId) {
                      return {
                        ...g,
                        currentCount: payload.count,
                        capacity: payload.capacity,
                        occupancyPercent: Math.round((payload.count / payload.capacity) * 100)
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

        case 'GATE_STATUS_CHANGED':
          setTemples((prevTemples) =>
            prevTemples.map((t) => {
              if (t.id === payload.templeId) {
                return {
                  ...t,
                  gates: t.gates.map((g) => (g.id === payload.gateId ? { ...g, status: payload.status } : g))
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

    // Auto join default family room
    const currentCode = familyGroup.groupCode || 'TS-FAM-7X29A';
    realtimeClient.joinGroup(currentCode, 'Devdutta', 'Lead Devotee', myCoords, myBattery);

    return () => {
      stopWatchingGPS(watchId);
      unsubscribe();
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
    realtimeClient.joinGroup(newGroup.groupCode, yourName, 'Lead Devotee', myCoords, myBattery);
    addToast('Family Group Created', `Private Circle Code: ${newGroup.groupCode}`, 'success');
  };

  const joinFamily = (groupCode, yourName) => {
    const joined = joinExistingFamilyGroup(groupCode, yourName);
    setFamilyGroup(joined);
    realtimeClient.joinGroup(groupCode, yourName, 'Devotee', myCoords, myBattery);
    addToast('Connected to Family Circle', `Joined room ${groupCode}`, 'success');
  };

  const triggerBeacon = (targetMember) => {
    playSpiritualChimeBeacon();
    const targetId = targetMember.deviceId || targetMember.id;
    realtimeClient.triggerBeacon(targetId, 'Devdutta');
    addToast('Loud Chime Beacon Dispatched', `Beacon audio dispatched to ${targetMember.name || targetMember}.`, 'warning');
  };

  // Authority & Gate Management Broadcasts
  const updateGateCrowd = (templeId, gateId, delta) => {
    // 1. Update local state
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

    // 2. Broadcast to all other connected phones via WebSocket
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
