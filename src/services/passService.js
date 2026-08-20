// TirthSaathi Flow - Entry Pass Generation & QR Gate Scanning Service

const PASSES_KEY = 'tirthsaathi_user_passes';
const SCANS_KEY = 'tirthsaathi_gate_scans';

export function createEntryPass({ templeId, templeName, gateId, gateCode, gateName, groupSize = 1, slotTime = 'Next 30 mins' }) {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomCode = 'TS-PASS-';
  for (let i = 0; i < 6; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const pass = {
    id: `pass-${Date.now()}`,
    passCode: randomCode,
    templeId,
    templeName,
    gateId,
    gateCode,
    gateName,
    groupSize: Number(groupSize),
    slotTime,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'ACTIVE', // 'ACTIVE', 'SCANNED_ENTERED', 'SCANNED_EXITED', 'EXPIRED'
    qrPayload: JSON.stringify({
      code: randomCode,
      tId: templeId,
      gId: gateId,
      size: Number(groupSize),
      issuedAt: Date.now()
    })
  };

  const currentPasses = getUserPasses();
  localStorage.setItem(PASSES_KEY, JSON.stringify([pass, ...currentPasses]));
  return pass;
}

export function getUserPasses() {
  try {
    const saved = localStorage.getItem(PASSES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading user passes', e);
  }
  return [];
}

export const getStoredPasses = getUserPasses;

export function recordGateScan({ passCode, gateId, scanType = 'ENTRY', customGroupSize = null }) {
  const passes = getUserPasses();
  const matchedPass = passes.find((p) => p.passCode === passCode.trim().toUpperCase());

  const groupCount = customGroupSize || (matchedPass ? matchedPass.groupSize : 2);

  const scanRecord = {
    id: `scan-${Date.now()}`,
    passCode: passCode.toUpperCase(),
    gateId,
    scanType, // 'ENTRY' or 'EXIT'
    groupCount,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    verified: true,
    message: matchedPass
      ? `Verified Pass for Group of ${groupCount} (${matchedPass.templeName})`
      : `Manual Override Scan Verified (+${groupCount} Pilgrims)`
  };

  try {
    const scans = getGateScans();
    localStorage.setItem(SCANS_KEY, JSON.stringify([scanRecord, ...scans]));
  } catch (e) {
    console.error('Error saving gate scan', e);
  }

  return scanRecord;
}

export function getGateScans() {
  try {
    const saved = localStorage.getItem(SCANS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading gate scans', e);
  }
  return [
    {
      id: 'scan-init-1',
      passCode: 'TS-PASS-8B71XA',
      gateId: 'gate-b',
      scanType: 'ENTRY',
      groupCount: 4,
      timestamp: '10 mins ago',
      verified: true,
      message: 'Verified Pass for Group of 4'
    },
    {
      id: 'scan-init-2',
      passCode: 'TS-PASS-4F92KL',
      gateId: 'gate-b',
      scanType: 'EXIT',
      groupCount: 3,
      timestamp: '14 mins ago',
      verified: true,
      message: 'Exit recorded for Group of 3'
    }
  ];
}
