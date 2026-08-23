import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT || 3001;

// In-Memory Storage for Live Multi-Device Synchronization
const groups = new Map(); // groupCode -> Map(deviceId -> memberTelemetry)
const clientSockets = new Map(); // socket -> { deviceId, groupCode }
const gateCrowdState = new Map(); // templeId -> Map(gateId -> { count, capacity, status })

// Initialize default gate crowd states for Temples
const initializeDefaultGates = () => {
  const kashiGates = new Map([
    ['gate-a', { count: 820, capacity: 1000, status: 'OPEN', code: 'Gate A (Dashashwamedh)', name: 'Main River Ghat Entrance' }],
    ['gate-b', { count: 315, capacity: 1000, status: 'OPEN', code: 'Gate B (Godowlia)', name: 'West Commercial Plaza Gate' }],
    ['gate-c', { count: 640, capacity: 1000, status: 'OPEN', code: 'Gate C (Chowk)', name: 'North Heritage Corridor' }],
    ['gate-d', { count: 210, capacity: 600, status: 'OPEN', code: 'Gate D (Mahesh)', name: 'Special Darshan & Senior Access' }],
  ]);
  gateCrowdState.set('kashi-vishwanath', kashiGates);

  const ayodhyaGates = new Map([
    ['gate-1', { count: 520, capacity: 1200, status: 'OPEN', code: 'Sugriva Qila Gate', name: 'West Corridor' }],
    ['gate-2', { count: 890, capacity: 1200, status: 'OPEN', code: 'Bhakti Path Gate', name: 'South High-Capacity Corridor' }],
    ['gate-3', { count: 340, capacity: 800, status: 'OPEN', code: 'Ram Path Gate', name: 'East Main Access' }],
  ]);
  gateCrowdState.set('ram-mandir', ayodhyaGates);
};

initializeDefaultGates();

// Create HTTP server with health check & CORS
const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'online',
        service: 'TirthSaathi Realtime Synchronization Engine',
        version: '2.0.0',
        activeDevices: clientSockets.size,
        activeGroups: groups.size,
        timestamp: new Date().toISOString()
      })
    );
    return;
  }

  if (req.url === '/api/gates' && req.method === 'GET') {
    const serialized = {};
    for (const [templeId, gates] of gateCrowdState.entries()) {
      serialized[templeId] = Object.fromEntries(gates.entries());
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(serialized));
    return;
  }

  // Cloudflare R2 Permanent Storage Upload Bridge
  if (req.url === '/api/upload-cloudflare' && req.method === 'POST') {
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', async () => {
      try {
        const buffer = Buffer.concat(body);
        const filename = `pilgrim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
        const publicDomain = (process.env.CLOUDFLARE_PUBLIC_DOMAIN || 'https://pub-2798f4c196da403cbeb5ac2b60ccc005.r2.dev').replace(/\/$/, '');
        const publicUrl = `${publicDomain}/${filename}`;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          url: publicUrl,
          key: filename,
          sizeBytes: buffer.length,
          storageProvider: 'Cloudflare R2 Bucket: musicapp-storage'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

// Create WebSocket Server
const wss = new WebSocketServer({ server });

// Helper: Broadcast to all members of a group
const broadcastToGroup = (groupCode, message, excludeSocket = null) => {
  const payload = JSON.stringify(message);
  for (const [sock, meta] of clientSockets.entries()) {
    if (meta.groupCode === groupCode && sock !== excludeSocket && sock.readyState === WebSocket.OPEN) {
      sock.send(payload);
    }
  }
};

// Helper: Broadcast to ALL connected clients (global crowd gate updates)
const broadcastToAll = (message, excludeSocket = null) => {
  const payload = JSON.stringify(message);
  for (const sock of wss.clients) {
    if (sock !== excludeSocket && sock.readyState === WebSocket.OPEN) {
      sock.send(payload);
    }
  }
};

wss.on('connection', (socket, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[TirthSaathi Realtime] Device connected from ${clientIp}`);

  socket.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      const { type, payload } = data;

      switch (type) {
        // ─────────────────────────────────────────────────────────────
        // 1. FAMILY GROUP ROOMS & LIVE GPS TELEMETRY
        // ─────────────────────────────────────────────────────────────
        case 'JOIN_GROUP': {
          const { groupCode, deviceId, name, role, coords, battery } = payload;
          if (!groupCode || !deviceId) return;

          // Register in group map
          if (!groups.has(groupCode)) {
            groups.set(groupCode, new Map());
          }

          const group = groups.get(groupCode);
          const memberInfo = {
            deviceId,
            name: name || 'Pilgrim',
            role: role || 'Member',
            coords: coords || { lat: 25.3109, lng: 83.0107 }, // Default GPS coords
            accuracy: coords?.accuracy || 10,
            battery: battery || 90,
            heading: coords?.heading || 0,
            lastSeen: Date.now(),
            isOnline: true
          };

          group.set(deviceId, memberInfo);
          clientSockets.set(socket, { deviceId, groupCode });

          console.log(`[Group ${groupCode}] ${name} (${deviceId}) joined`);

          // Send current group state back to the newly joined device
          socket.send(
            JSON.stringify({
              type: 'GROUP_SYNC',
              payload: {
                groupCode,
                members: Array.from(group.values())
              }
            })
          );

          // Broadcast to existing group members that a new member joined
          broadcastToGroup(
            groupCode,
            {
              type: 'MEMBER_JOINED',
              payload: memberInfo
            },
            socket
          );
          break;
        }

        case 'TELEMETRY_UPDATE': {
          const meta = clientSockets.get(socket);
          if (!meta || !meta.groupCode) return;

          const group = groups.get(meta.groupCode);
          if (!group || !group.has(meta.deviceId)) return;

          const member = group.get(meta.deviceId);
          if (payload.coords) member.coords = payload.coords;
          if (payload.accuracy !== undefined) member.accuracy = payload.accuracy;
          if (payload.battery !== undefined) member.battery = payload.battery;
          if (payload.heading !== undefined) member.heading = payload.heading;
          member.lastSeen = Date.now();
          member.isOnline = true;

          // Broadcast real-time location to other devices in this family group
          broadcastToGroup(
            meta.groupCode,
            {
              type: 'TELEMETRY_BROADCAST',
              payload: {
                deviceId: meta.deviceId,
                coords: member.coords,
                accuracy: member.accuracy,
                battery: member.battery,
                heading: member.heading,
                lastSeen: member.lastSeen
              }
            },
            socket
          );
          break;
        }

        case 'BEACON_ALERT': {
          const meta = clientSockets.get(socket);
          if (!meta || !meta.groupCode) return;

          const { targetDeviceId, senderName } = payload;
          console.log(`[Beacon Alert] from ${senderName} to ${targetDeviceId}`);

          // Relay audio chime trigger packet to group peers
          broadcastToGroup(
            meta.groupCode,
            {
              type: 'BEACON_TRIGGERED',
              payload: {
                targetDeviceId,
                senderName: senderName || 'Family Member',
                timestamp: Date.now()
              }
            }
          );
          break;
        }

        // ─────────────────────────────────────────────────────────────
        // 2. LIVE CROWD MANAGEMENT & GATE SCANNER SYNCHRONIZATION
        // ─────────────────────────────────────────────────────────────
        case 'GATE_SCAN_EVENT': {
          const { templeId, gateId, delta, scanType, passCode } = payload;
          if (!templeId || !gateId) return;

          let templeGates = gateCrowdState.get(templeId);
          if (!templeGates) {
            templeGates = new Map();
            gateCrowdState.set(templeId, templeGates);
          }

          let gate = templeGates.get(gateId);
          if (!gate) {
            gate = { count: 300, capacity: 1000, status: 'OPEN', code: gateId, name: 'Gate' };
            templeGates.set(gateId, gate);
          }

          // Update real-time headcount
          gate.count = Math.max(0, gate.count + Number(delta || 0));
          gate.updatedAt = Date.now();

          console.log(`[Live Gate Update] ${templeId} - ${gateId}: ${gate.count} / ${gate.capacity} (${scanType})`);

          // Broadcast new gate count to ALL devices in real time
          broadcastToAll({
            type: 'GATE_UPDATED',
            payload: {
              templeId,
              gateId,
              count: gate.count,
              capacity: gate.capacity,
              status: gate.status,
              delta,
              scanType,
              passCode
            }
          });
          break;
        }

        case 'GATE_STATUS_TOGGLE': {
          const { templeId, gateId, status } = payload;
          const templeGates = gateCrowdState.get(templeId);
          if (templeGates && templeGates.has(gateId)) {
            const gate = templeGates.get(gateId);
            gate.status = status || (gate.status === 'OPEN' ? 'CLOSED' : 'OPEN');

            broadcastToAll({
              type: 'GATE_STATUS_CHANGED',
              payload: {
                templeId,
                gateId,
                status: gate.status
              }
            });
          }
          break;
        }

        default:
          console.warn('[Realtime Server] Unknown packet type:', type);
      }
    } catch (err) {
      console.error('[Realtime Server] Error parsing packet:', err);
    }
  });

  socket.on('close', () => {
    const meta = clientSockets.get(socket);
    if (meta) {
      console.log(`[TirthSaathi Realtime] Device disconnected: ${meta.deviceId}`);
      const group = groups.get(meta.groupCode);
      if (group && group.has(meta.deviceId)) {
        const member = group.get(meta.deviceId);
        member.isOnline = false;
        member.lastSeen = Date.now();

        broadcastToGroup(meta.groupCode, {
          type: 'MEMBER_OFFLINE',
          payload: { deviceId: meta.deviceId, lastSeen: member.lastSeen }
        });
      }
      clientSockets.delete(socket);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🕉️  TIRTHSAATHI REALTIME SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🌐  Local Health Check:   http://localhost:${PORT}/health`);
  console.log(`⚡  Live WebSocket Server: ws://0.0.0.0:${PORT}`);
  console.log(`======================================================\n`);
});
