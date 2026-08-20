/**
 * TirthSaathi Realtime Client Manager
 * Manages WebSocket connection to the local backend server for multi-device sync
 */

class RealtimeClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectInterval = 3000;
    this.listeners = new Set();
    this.currentGroupCode = null;
    this.deviceId = this.getOrCreateDeviceId();
  }

  getOrCreateDeviceId() {
    let id = localStorage.getItem('tirthsaathi_device_id');
    if (!id) {
      id = 'DEV-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      localStorage.setItem('tirthsaathi_device_id', id);
    }
    return id;
  }

  getWebSocketUrl() {
    const hostname = window.location.hostname || 'localhost';
    const port = 3001;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${hostname}:${port}`;
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = this.getWebSocketUrl();
    console.log(`[Realtime Client] Connecting to ${wsUrl}...`);

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[Realtime Client] Connected to TirthSaathi Realtime Server ⚡');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyListeners({ type: 'CONNECTION_STATE', payload: { connected: true } });

        // Auto re-join group if was previously connected
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
        console.log('[Realtime Client] Disconnected from server.');
        this.isConnected = false;
        this.notifyListeners({ type: 'CONNECTION_STATE', payload: { connected: false } });
        this.attemptReconnect();
      };

      this.socket.onerror = (err) => {
        console.warn('[Realtime Client] WebSocket error (offline or server starting):', err);
      };
    } catch (e) {
      console.warn('[Realtime Client] Could not initialize WebSocket:', e);
      this.attemptReconnect();
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[Realtime Client] Reconnecting in ${this.reconnectInterval / 1000}s (Attempt ${this.reconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  send(type, payload = {}) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('[Realtime Client] Cannot send, socket not open');
    }
  }

  joinGroup(groupCode, name, role = 'Member', coords = null, battery = 90) {
    this.currentGroupCode = groupCode;
    localStorage.setItem('tirthsaathi_user_name', name || 'Devotee');
    this.send('JOIN_GROUP', {
      groupCode,
      deviceId: this.deviceId,
      name,
      role,
      coords,
      battery
    });
  }

  sendTelemetry(coords, accuracy = 5, battery = 90, heading = 0) {
    this.send('TELEMETRY_UPDATE', {
      coords,
      accuracy,
      battery,
      heading
    });
  }

  triggerBeacon(targetDeviceId, senderName) {
    this.send('BEACON_ALERT', {
      targetDeviceId,
      senderName: senderName || 'Family Member'
    });
  }

  sendGateScan(templeId, gateId, delta, scanType = 'ENTRY', passCode = '') {
    this.send('GATE_SCAN_EVENT', {
      templeId,
      gateId,
      delta,
      scanType,
      passCode
    });
  }

  toggleGateStatus(templeId, gateId, status) {
    this.send('GATE_STATUS_TOGGLE', {
      templeId,
      gateId,
      status
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    for (const listener of this.listeners) {
      try {
        listener(data);
      } catch (err) {
        console.error('[Realtime Client] Error in listener:', err);
      }
    }
  }
}

export const realtimeClient = new RealtimeClient();
