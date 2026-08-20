/**
 * TirthSaathi Realtime Client Manager
 * Manages WebSocket connection to the local backend server for multi-device sync.
 * On production (Vercel), WebSocket is skipped — PeerJS WebRTC handles all sync.
 */

class RealtimeClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.reconnectInterval = 5000;
    this.listeners = new Set();
    this.currentGroupCode = null;
    this.deviceId = this._getOrCreateDeviceId();
  }

  _getOrCreateDeviceId() {
    try {
      let id = localStorage.getItem('tirthsaathi_device_id');
      if (!id) {
        id = 'DEV-' + Math.random().toString(36).substring(2, 7).toUpperCase();
        localStorage.setItem('tirthsaathi_device_id', id);
      }
      return id;
    } catch (e) {
      return 'DEV-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    }
  }

  _isLocalNetwork() {
    try {
      const h = window.location.hostname;
      return h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.');
    } catch (e) {
      return false;
    }
  }

  connect() {
    // Only attempt WebSocket connection on local network (localhost / 192.168.x.x)
    // On production (Vercel), PeerJS WebRTC handles all real-time sync
    if (!this._isLocalNetwork()) {
      console.log('[Realtime Client] Production detected — WebRTC PeerJS handles sync. WebSocket skipped.');
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const hostname = window.location.hostname || 'localhost';
    const wsUrl = `ws://${hostname}:3001`;
    console.log(`[Realtime Client] Connecting to ${wsUrl}...`);

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[Realtime Client] Connected to TirthSaathi Realtime Server ⚡');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyListeners({ type: 'CONNECTION_STATE', payload: { connected: true } });

        if (this.currentGroupCode) {
          const userName = localStorage.getItem('tirthsaathi_user_name') || 'Pilgrim';
          this.joinGroup(this.currentGroupCode, userName);
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (err) {
          console.error('[Realtime Client] Error parsing packet:', err);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.notifyListeners({ type: 'CONNECTION_STATE', payload: { connected: false } });
        this._attemptReconnect();
      };

      this.socket.onerror = () => {
        // Silently handle — expected when server.js is not running
      };
    } catch (e) {
      console.warn('[Realtime Client] Could not initialize WebSocket:', e.message);
    }
  }

  _attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  send(type, payload = {}) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  joinGroup(groupCode, name, role = 'Member', coords = null, battery = 90) {
    this.currentGroupCode = groupCode;
    try { localStorage.setItem('tirthsaathi_user_name', name || 'Devotee'); } catch (e) {}
    this.send('JOIN_GROUP', { groupCode, deviceId: this.deviceId, name, role, coords, battery });
  }

  sendTelemetry(coords, accuracy = 5, battery = 90, heading = 0) {
    this.send('TELEMETRY_UPDATE', { coords, accuracy, battery, heading });
  }

  triggerBeacon(targetDeviceId, senderName) {
    this.send('BEACON_ALERT', { targetDeviceId, senderName: senderName || 'Family Member' });
  }

  sendGateScan(templeId, gateId, delta, scanType = 'ENTRY', passCode = '') {
    this.send('GATE_SCAN_EVENT', { templeId, gateId, delta, scanType, passCode });
  }

  toggleGateStatus(templeId, gateId, status) {
    this.send('GATE_STATUS_TOGGLE', { templeId, gateId, status });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    for (const listener of this.listeners) {
      try { listener(data); } catch (err) { /* swallow */ }
    }
  }
}

export const realtimeClient = new RealtimeClient();
