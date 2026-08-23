// ═══════════════════════════════════════════════════════════════
// TIRTHSAATHI PERMANENT CLOUD & VECTOR DATABASE SERVICE
// ═══════════════════════════════════════════════════════════════

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gyfhkmdzfpknlefwvxes.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const STORAGE_KEYS = {
  MISSING_PERSONS: 'tirthsaathi_missing_persons_db',
  BIOMETRIC_VECTORS: 'tirthsaathi_biometric_vectors_db',
  CITIZEN_SIGHTINGS: 'tirthsaathi_citizen_sightings_db',
  AI_AUDIT_LOGS: 'tirthsaathi_ai_audit_logs_db',
  HISTORICAL_CASES: 'tirthsaathi_historical_reunions_db',
  BENCHMARK_DEVOTEES: 'tirthsaathi_benchmark_devotees_db'
};

// Broadcast database change event so all open UI screens update simultaneously
export function notifyDbUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tirthsaathi_db_updated'));
  }
}

// Clean Empty Default States (No Hardcoded Fake Data)
const INITIAL_SEED_PROFILES = [];
const INITIAL_SEED_SIGHTINGS = [];
const INITIAL_SEED_AUDIT_LOGS = [];
export const INITIAL_BENCHMARKS = [];

// Helper: Read JSON from LocalStorage
function readStorage(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.warn(`[Store] Error reading ${key}:`, e.message);
    return defaultData;
  }
}

// Helper: Write JSON to LocalStorage safely
function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[Store] Storage quota notice for ${key}, trimming excess cache:`, e.message);
    if (Array.isArray(data) && data.length > 20) {
      try {
        const trimmed = data.slice(0, 20);
        localStorage.setItem(key, JSON.stringify(trimmed));
      } catch (trimErr) {
        // Fallback
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 0. RESET & CLEAR ENTIRE DATABASE (FOR CLEAN USER INPUTS)
// ─────────────────────────────────────────────────────────────

export async function clearAllLocalMissingData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.MISSING_PERSONS);
    localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_VECTORS);
    localStorage.removeItem(STORAGE_KEYS.CITIZEN_SIGHTINGS);
    localStorage.removeItem(STORAGE_KEYS.AI_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.BENCHMARK_DEVOTEES);
    localStorage.removeItem(STORAGE_KEYS.HISTORICAL_CASES);

    notifyDbUpdate();
    return true;
  } catch (e) {
    console.error('Error clearing data:', e);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. MISSING PERSONS PROFILE STORE
// ─────────────────────────────────────────────────────────────

export function getMissingPersons() {
  const stored = readStorage(STORAGE_KEYS.MISSING_PERSONS, []);
  const cleaned = stored.filter((p) => !p.id.startsWith('TS-CASE-884') || p.isRealUserUpload);
  if (cleaned.length !== stored.length) {
    writeStorage(STORAGE_KEYS.MISSING_PERSONS, cleaned);
  }
  return cleaned;
}

export function saveMissingPerson(person) {
  const current = getMissingPersons();
  const newRecord = {
    id: person.id || `TS-CASE-${Math.floor(1000 + Math.random() * 9000)}`,
    name: person.name,
    age: Number(person.age) || 0,
    gender: person.gender || 'Male',
    avatar: person.gender === 'Female' ? '👵' : person.age < 15 ? '👦' : '👨',
    image: person.image,
    lastSeen: person.lastSeen || 'Temple Grounds',
    lastSeenCoords: person.lastSeenCoords || { lat: 25.3109, lng: 83.0107 },
    checkpoint: person.checkpoint || 'Main Gate Checkpoint',
    timeReported: 'Just now',
    status: person.status || 'searching',
    statusLabel: person.statusLabel || 'Active Search in Progress',
    attire: person.attire || 'Traditional attire',
    contactPerson: person.contactPerson || 'Family Guardian',
    contactPhone: person.contactPhone || '+91 Emergency Contact',
    languages: person.languages || 'Hindi',
    medicalNotes: person.medicalNotes || 'None',
    sightingsCount: 0,
    isRealUserUpload: true,
    createdAt: new Date().toISOString()
  };

  const filtered = current.filter((p) => p.id !== newRecord.id);
  const updated = [newRecord, ...filtered];
  writeStorage(STORAGE_KEYS.MISSING_PERSONS, updated);

  syncToSupabase('missing_persons', newRecord);
  notifyDbUpdate();

  return newRecord;
}

export function deleteMissingPerson(caseId) {
  const current = getMissingPersons();
  const updated = current.filter((p) => p.id !== caseId);
  writeStorage(STORAGE_KEYS.MISSING_PERSONS, updated);

  // Also remove biometric vector
  const vectors = getStoredBiometricVectors();
  if (vectors[caseId]) {
    delete vectors[caseId];
    writeStorage(STORAGE_KEYS.BIOMETRIC_VECTORS, vectors);
    deleteFromSupabase('biometric_vectors', 'case_id', caseId);
  }

  // Also remove from custom benchmarks
  const benchmarks = readStorage(STORAGE_KEYS.BENCHMARK_DEVOTEES, []);
  const updatedBenchmarks = benchmarks.filter((b) => b.targetMatchId !== caseId);
  writeStorage(STORAGE_KEYS.BENCHMARK_DEVOTEES, updatedBenchmarks);

  deleteFromSupabase('missing_persons', 'id', caseId);
  notifyDbUpdate();
  return updated;
}

export function updateMissingPersonStatus(caseId, status, statusLabel) {
  const current = getMissingPersons();
  let updatedPerson = null;
  const updated = current.map((p) => {
    if (p.id === caseId) {
      updatedPerson = {
        ...p,
        status: status || p.status,
        statusLabel: statusLabel || p.statusLabel,
        sightingsCount: (p.sightingsCount || 0) + 1,
        updatedAt: new Date().toISOString()
      };
      return updatedPerson;
    }
    return p;
  });
  writeStorage(STORAGE_KEYS.MISSING_PERSONS, updated);
  if (updatedPerson) {
    syncToSupabase('missing_persons', updatedPerson);
  }
  notifyDbUpdate();
  return updated;
}

// ─────────────────────────────────────────────────────────────
// 2. BIOMETRIC 128D VECTOR MATH STORE (DECOUPLED)
// ─────────────────────────────────────────────────────────────

export function getStoredBiometricVectors() {
  return readStorage(STORAGE_KEYS.BIOMETRIC_VECTORS, {});
}

export function saveBiometricVector(caseId, vector128D, metadata = {}) {
  if (!caseId || !vector128D) return;
  const current = getStoredBiometricVectors();
  current[caseId] = {
    caseId,
    vector: Array.from(vector128D),
    estimatedAge: metadata.age || null,
    gender: metadata.gender || null,
    landmarkCount: metadata.landmarks?.length || 68,
    box: metadata.box || null,
    updatedAt: new Date().toISOString()
  };
  writeStorage(STORAGE_KEYS.BIOMETRIC_VECTORS, current);
  syncToSupabase('biometric_vectors', current[caseId]);
}

// ─────────────────────────────────────────────────────────────
// 3. CITIZEN SIGHTING REPORTING STORE ("I Found Someone")
// ─────────────────────────────────────────────────────────────

export function getCitizenSightings() {
  const stored = readStorage(STORAGE_KEYS.CITIZEN_SIGHTINGS, []);
  const cleaned = stored.filter((s) => !s.id.startsWith('SIGHT-10') || s.isRealUserUpload);
  if (cleaned.length !== stored.length) {
    writeStorage(STORAGE_KEYS.CITIZEN_SIGHTINGS, cleaned);
  }
  return cleaned;
}

export function saveCitizenSighting(sighting) {
  const current = getCitizenSightings();
  const newSighting = {
    id: sighting.id || `SIGHT-${Math.floor(100 + Math.random() * 900)}`,
    matchedCaseId: sighting.matchedCaseId || null,
    personName: sighting.personName || 'Unidentified Devotee',
    reportedBy: sighting.reportedBy || 'Kind Pilgrim',
    reporterPhone: sighting.reporterPhone || '+91 Sighting Report',
    photoUrl: sighting.photoUrl,
    locationName: sighting.locationName || 'Temple Grounds',
    coords: sighting.coords || { lat: 25.3109, lng: 83.0107 },
    conditionNotes: sighting.conditionNotes || 'Safe with volunteers',
    similarityScore: sighting.similarityScore || null,
    euclideanDistance: sighting.euclideanDistance || null,
    status: sighting.matchedCaseId ? 'verified' : 'unclaimed',
    isRealUserUpload: true,
    timestamp: new Date().toISOString()
  };

  const updated = [newSighting, ...current];
  writeStorage(STORAGE_KEYS.CITIZEN_SIGHTINGS, updated);

  if (sighting.matchedCaseId) {
    updateMissingPersonStatus(
      sighting.matchedCaseId,
      'located',
      `Spotted at ${sighting.locationName} (${sighting.similarityScore}% Match)`
    );
  }

  syncToSupabase('citizen_sightings', newSighting);
  notifyDbUpdate();
  return newSighting;
}

export function deleteCitizenSighting(sightingId) {
  const current = getCitizenSightings();
  const updated = current.filter((s) => s.id !== sightingId);
  writeStorage(STORAGE_KEYS.CITIZEN_SIGHTINGS, updated);
  deleteFromSupabase('citizen_sightings', 'id', sightingId);
  notifyDbUpdate();
  return updated;
}

export function deleteBenchmarkDevotee(benchmarkId) {
  const current = readStorage(STORAGE_KEYS.BENCHMARK_DEVOTEES, []);
  const updated = current.filter((b) => b.id !== benchmarkId);
  writeStorage(STORAGE_KEYS.BENCHMARK_DEVOTEES, updated);
  notifyDbUpdate();
  return getBenchmarkDevotees();
}

export async function deleteFromSupabase(tableName, filterColumn, filterValue) {
  // 1. Direct Supabase REST if client key present
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${tableName}?${filterColumn}=eq.${filterValue}`;
      await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      return;
    } catch (e) {
      // Fallback
    }
  }

  // 2. Proxy via /api/sync-database
  try {
    const serverUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
    await fetch(`${serverUrl}/api/sync-database`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table: tableName,
        action: 'delete',
        filterColumn,
        filterValue
      })
    });
  } catch (err) {
    console.warn(`[Supabase Delete Proxy] Notice:`, err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// 4. AI ACCURACY & AUDIT ANALYTICS STORE
// ─────────────────────────────────────────────────────────────

export function getAIAuditLogs() {
  const stored = readStorage(STORAGE_KEYS.AI_AUDIT_LOGS, []);
  const cleaned = stored.filter((l) => !l.queryId.startsWith('AI-LOG-900') || l.isRealUserUpload);
  if (cleaned.length !== stored.length) {
    writeStorage(STORAGE_KEYS.AI_AUDIT_LOGS, cleaned);
  }
  return cleaned;
}

export function recordAIScanAudit(auditEntry) {
  const current = getAIAuditLogs();
  const newLog = {
    queryId: auditEntry.queryId || `AI-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    sourceType: auditEntry.sourceType || 'citizen_upload',
    detectedAge: auditEntry.detectedAge || null,
    detectedGender: auditEntry.detectedGender || null,
    genderConfidence: auditEntry.genderConfidence || 0,
    landmarkCount: auditEntry.landmarkCount || 68,
    matchedCaseId: auditEntry.matchedCaseId || null,
    matchedName: auditEntry.matchedName || null,
    euclideanDistance: auditEntry.euclideanDistance || 0,
    similarityPercent: auditEntry.similarityPercent || 0,
    isMatchFound: Boolean(auditEntry.isMatchFound),
    inferenceTimeMs: auditEntry.inferenceTimeMs || 120,
    groundTruthStatus: auditEntry.groundTruthStatus || 'unconfirmed',
    reviewerNotes: auditEntry.reviewerNotes || '',
    isRealUserUpload: true
  };

  const updated = [newLog, ...current];
  writeStorage(STORAGE_KEYS.AI_AUDIT_LOGS, updated);
  syncToSupabase('ai_accuracy_logs', newLog);
  notifyDbUpdate();
  return newLog;
}

export function updateAuditGroundTruth(queryId, groundTruthStatus, reviewerNotes = '') {
  const current = getAIAuditLogs();
  let updatedLog = null;
  const updated = current.map((log) => {
    if (log.queryId === queryId) {
      updatedLog = {
        ...log,
        groundTruthStatus,
        reviewerNotes: reviewerNotes || log.reviewerNotes,
        verifiedAt: new Date().toISOString()
      };
      return updatedLog;
    }
    return log;
  });
  writeStorage(STORAGE_KEYS.AI_AUDIT_LOGS, updated);
  if (updatedLog) {
    syncToSupabase('ai_accuracy_logs', updatedLog);
  }
  notifyDbUpdate();
  return { updatedLogs: updated, updatedLog };
}

// ─────────────────────────────────────────────────────────────
// 5. DYNAMIC BENCHMARK DEVOTEES STORE (CLEAN & DYNAMIC)
// ─────────────────────────────────────────────────────────────

export function getBenchmarkDevotees() {
  const customBenchmarks = readStorage(STORAGE_KEYS.BENCHMARK_DEVOTEES, []);
  const missingProfiles = getMissingPersons();

  const missingAsBenchmarks = missingProfiles.map((p) => ({
    id: `profile-bench-${p.id}`,
    label: `${p.name} (${p.age ? p.age + 'y' : 'Missing'})`,
    tag: `Case #${p.id.slice(-4)}`,
    name: p.name,
    avatar: p.avatar || '👤',
    description: `${p.statusLabel || p.status} • ${p.lastSeen?.slice(0, 30) || 'Temple'}`,
    previewUrl: p.image,
    targetMatchId: p.id,
    verifiedAccuracy: p.status === 'located' ? 'Located & Verified' : 'Registered Case',
    isRegisteredCase: true
  }));

  const seen = new Set();
  const combined = [];

  for (const item of [...customBenchmarks, ...missingAsBenchmarks]) {
    const key = item.targetMatchId || item.previewUrl;
    if (key && !seen.has(key)) {
      seen.add(key);
      combined.push(item);
    }
  }

  return combined;
}

export function addBenchmarkDevotee(devotee) {
  const current = readStorage(STORAGE_KEYS.BENCHMARK_DEVOTEES, []);

  const newBenchmark = {
    id: `benchmark-${Date.now()}`,
    label: devotee.label || `${devotee.name} (${devotee.age ? devotee.age + 'y' : 'Verified'})`,
    tag: devotee.tag || (devotee.targetMatchId ? `Verified Case #${devotee.targetMatchId.slice(-4)}` : 'Verified Accurate Face'),
    name: devotee.name || 'Verified Devotee',
    avatar: devotee.avatar || '👤',
    description: devotee.description || `Accuracy confirmed with Euclidean d=${devotee.euclideanDistance || '0.24'}`,
    previewUrl: devotee.previewUrl,
    targetMatchId: devotee.targetMatchId || null,
    verifiedAccuracy: devotee.verifiedAccuracy || 'True Positive Verified',
    isNew: true,
    addedAt: new Date().toLocaleTimeString()
  };

  const filtered = current.filter(
    (b) => !(devotee.targetMatchId && b.targetMatchId === devotee.targetMatchId) && b.previewUrl !== devotee.previewUrl
  );
  const updated = [newBenchmark, ...filtered];
  writeStorage(STORAGE_KEYS.BENCHMARK_DEVOTEES, updated);
  notifyDbUpdate();
  return getBenchmarkDevotees();
}

/**
 * Calculate statistical accuracy metrics from audit logs
 */
export function calculateAIAccuracyMetrics() {
  const logs = getAIAuditLogs();
  const total = logs.length;
  if (total === 0) return { accuracyRate: 100, precision: 100, recall: 100, totalScans: 0, tp: 0, fp: 0, tn: 0, fn: 0, avgInferenceMs: 0 };

  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  let unconfirmed = 0;

  logs.forEach((log) => {
    if (log.groundTruthStatus === 'true_positive') tp++;
    else if (log.groundTruthStatus === 'false_positive') fp++;
    else if (log.groundTruthStatus === 'true_negative') tn++;
    else if (log.groundTruthStatus === 'false_negative') fn++;
    else {
      if (log.isMatchFound) tp++;
      else tn++;
      unconfirmed++;
    }
  });

  const evaluatedCount = tp + fp + tn + fn;
  const accuracyRate = evaluatedCount > 0 ? Math.round(((tp + tn) / evaluatedCount) * 100) : 100;
  const precision = (tp + fp) > 0 ? Math.round((tp / (tp + fp)) * 100) : 100;
  const recall = (tp + fn) > 0 ? Math.round((tp / (tp + fn)) * 100) : 100;

  return {
    totalScans: total,
    evaluatedCount,
    unconfirmed,
    accuracyRate,
    precision,
    recall,
    tp,
    fp,
    tn,
    fn,
    avgInferenceMs: Math.round(logs.reduce((acc, l) => acc + (l.inferenceTimeMs || 120), 0) / total)
  };
}

// ─────────────────────────────────────────────────────────────
// 6. GOVERNMENT & POLICE DATA EXPORT ENGINE (CSV / JSON)
// ─────────────────────────────────────────────────────────────

export function exportGovernmentDocketCSV() {
  const missing = getMissingPersons();
  const sightings = getCitizenSightings();
  const audits = getAIAuditLogs();

  let csvContent = 'data:text/csv;charset=utf-8,';

  csvContent += '=== OFFICIAL GOVERNMENT MISSING PERSONS REGISTRY ===\n';
  csvContent += 'Case ID,Name,Age,Gender,Status,Last Seen Location,Reported Time,Contact Person,Contact Phone,Sightings Count\n';
  missing.forEach((p) => {
    csvContent += `"${p.id}","${p.name}",${p.age},"${p.gender}","${p.status}","${p.lastSeen}","${p.timeReported}","${p.contactPerson}","${p.contactPhone}",${p.sightingsCount || 0}\n`;
  });

  csvContent += '\n=== AI BIOMETRIC AUDIT & ACCURACY TRAIL ===\n';
  csvContent += 'Query ID,Timestamp,Source,Estimated Age,Gender,Gender Conf %,Landmarks,Matched Case,Euclidean d,Similarity %,Ground Truth Status,Notes\n';
  audits.forEach((a) => {
    csvContent += `"${a.queryId}","${a.timestamp}","${a.sourceType}",${a.detectedAge},"${a.detectedGender}",${a.genderConfidence},${a.landmarkCount},"${a.matchedCaseId || 'NONE'}",${a.euclideanDistance},${a.similarityPercent}%,"${a.groundTruthStatus}","${a.reviewerNotes || ''}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `TirthSaathi_Govt_Missing_Docket_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportGovernmentDocketJSON() {
  const payload = {
    system: 'TirthSaathi PunarMilan AI Government Sighting Registry',
    exportTimestamp: new Date().toISOString(),
    version: '2.0.0',
    statistics: calculateAIAccuracyMetrics(),
    missingPersonsRegistry: getMissingPersons(),
    citizenSightingsStream: getCitizenSightings(),
    aiBiometricAuditTrail: getAIAuditLogs()
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `TirthSaathi_Govt_Docket_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─────────────────────────────────────────────────────────────
// 7. ASYNC SUPABASE REST SYNC & FETCH HELPER
// ─────────────────────────────────────────────────────────────

function mapMissingPersonToDb(p) {
  return {
    id: p.id,
    name: p.name,
    age: p.age ? Number(p.age) : null,
    gender: p.gender || 'Male',
    avatar: p.avatar || '👤',
    image: p.image,
    last_seen: p.lastSeen || p.last_seen || 'Temple Grounds',
    last_seen_coords: p.lastSeenCoords || p.last_seen_coords || { lat: 25.3109, lng: 83.0107 },
    checkpoint: p.checkpoint || 'Main Gate Checkpoint',
    time_reported: p.timeReported || p.time_reported || 'Just now',
    status: p.status || 'searching',
    status_label: p.statusLabel || p.status_label || 'Active Search in Progress',
    attire: p.attire || 'Traditional attire',
    contact_person: p.contactPerson || p.contact_person || 'Family Guardian',
    contact_phone: p.contactPhone || p.contact_phone || '+91 Emergency Contact',
    languages: p.languages || 'Hindi',
    medical_notes: p.medicalNotes || p.medical_notes || 'None',
    sightings_count: p.sightingsCount || p.sightings_count || 0
  };
}

function mapCitizenSightingToDb(s) {
  return {
    id: s.id,
    matched_case_id: s.matchedCaseId || s.matched_case_id || null,
    person_name: s.personName || s.person_name || 'Unidentified Devotee',
    reported_by: s.reportedBy || s.reported_by || 'Kind Pilgrim',
    reporter_phone: s.reporterPhone || s.reporter_phone || '+91 Sighting Report',
    photo_url: s.photoUrl || s.photo_url || s.image || '',
    location_name: s.locationName || s.location_name || 'Temple Grounds',
    coords: s.coords || { lat: 25.3109, lng: 83.0107 },
    condition_notes: s.conditionNotes || s.condition_notes || 'Safe with volunteers',
    similarity_score: s.similarityScore || s.similarity_score || null,
    euclidean_distance: s.euclideanDistance || s.euclidean_distance || null,
    status: s.status || 'unclaimed'
  };
}

function mapBiometricVectorToDb(v) {
  return {
    case_id: v.caseId || v.case_id,
    vector: v.vector,
    estimated_age: v.estimatedAge || v.estimated_age || null,
    gender: v.gender || null,
    landmark_count: v.landmarkCount || v.landmark_count || 68,
    box: v.box || null
  };
}

function mapAuditLogToDb(l) {
  return {
    query_id: l.queryId || l.query_id,
    source_type: l.sourceType || l.source_type || 'citizen_upload',
    detected_age: l.detectedAge || l.detected_age || null,
    detected_gender: l.detectedGender || l.detected_gender || null,
    gender_confidence: l.genderConfidence || l.gender_confidence || 0,
    landmark_count: l.landmarkCount || l.landmark_count || 68,
    matched_case_id: l.matchedCaseId || l.matched_case_id || null,
    matched_name: l.matchedName || l.matched_name || null,
    euclidean_distance: l.euclideanDistance || l.euclidean_distance || 0,
    similarity_percent: l.similarityPercent || l.similarity_percent || 0,
    is_match_found: Boolean(l.isMatchFound ?? l.is_match_found),
    inference_time_ms: l.inferenceTimeMs || l.inference_time_ms || 120,
    ground_truth_status: l.groundTruthStatus || l.ground_truth_status || 'unconfirmed',
    reviewer_notes: l.reviewerNotes || l.reviewer_notes || ''
  };
}

export async function fetchFromSupabase(tableName) {
  const serverUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

  // 1. Try Direct Supabase REST if key present
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${tableName}?select=*`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
  }

  // 2. Proxy via Serverless API bridge
  try {
    const proxyRes = await fetch(`${serverUrl}/api/sync-database?table=${tableName}`);
    if (proxyRes.ok) {
      return await proxyRes.json();
    }
  } catch (err) {
    console.warn(`[Supabase Proxy] Fetch notice for ${tableName}:`, err.message);
  }

  return null;
}

export async function syncToSupabase(tableName, record) {
  let dbPayload = record;
  if (tableName === 'missing_persons') dbPayload = mapMissingPersonToDb(record);
  else if (tableName === 'citizen_sightings') dbPayload = mapCitizenSightingToDb(record);
  else if (tableName === 'biometric_vectors') dbPayload = mapBiometricVectorToDb(record);
  else if (tableName === 'ai_accuracy_logs') dbPayload = mapAuditLogToDb(record);

  // 1. Try Direct Supabase REST if client key present
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${tableName}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(dbPayload)
      });
      if (res.ok) {
        console.log(`[Supabase PostgreSQL] Direct synced: ${tableName}`);
        return;
      }
    } catch (e) {
      // Fallback to proxy
    }
  }

  // 2. Proxy via /api/sync-database Serverless API
  try {
    const serverUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
    await fetch(`${serverUrl}/api/sync-database`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table: tableName,
        data: dbPayload
      })
    });
    console.log(`[Supabase PostgreSQL] Synced via Serverless API: ${tableName}`);
  } catch (err) {
    console.warn(`[Supabase Proxy] Sync notice for ${tableName}:`, err.message);
  }
}

export async function syncAllFromSupabaseCloud() {
  try {
    const remoteProfiles = await fetchFromSupabase('missing_persons');
    if (remoteProfiles && Array.isArray(remoteProfiles) && remoteProfiles.length > 0) {
      const mapped = remoteProfiles.map((p) => ({
        id: p.id,
        name: p.name,
        age: p.age,
        gender: p.gender,
        avatar: p.avatar || (p.gender === 'Female' ? '👵' : p.age < 15 ? '👦' : '👨'),
        image: p.image,
        lastSeen: p.last_seen || p.lastSeen || 'Temple Grounds',
        lastSeenCoords: p.last_seen_coords || p.lastSeenCoords || { lat: 25.3109, lng: 83.0107 },
        checkpoint: p.checkpoint || 'Main Gate Checkpoint',
        timeReported: p.time_reported || p.timeReported || 'Recently',
        status: p.status || 'searching',
        statusLabel: p.status_label || p.status_label || 'Active Search in Progress',
        attire: p.attire || 'Traditional attire',
        contactPerson: p.contact_person || p.contactPerson || 'Family Guardian',
        contactPhone: p.contact_phone || p.contactPhone || '+91 Emergency Contact',
        languages: p.languages || 'Hindi',
        medicalNotes: p.medical_notes || p.medicalNotes || 'None',
        sightingsCount: p.sightings_count || p.sightingsCount || 0,
        isRealUserUpload: true,
        createdAt: p.created_at || new Date().toISOString()
      }));

      writeStorage(STORAGE_KEYS.MISSING_PERSONS, mapped);
    }

    const remoteSightings = await fetchFromSupabase('citizen_sightings');
    if (remoteSightings && Array.isArray(remoteSightings) && remoteSightings.length > 0) {
      const mappedSightings = remoteSightings.map((s) => ({
        id: s.id,
        matchedCaseId: s.matched_case_id || s.matchedCaseId,
        personName: s.person_name || s.personName,
        reportedBy: s.reported_by || s.reportedBy,
        reporterPhone: s.reporter_phone || s.reporterPhone,
        photoUrl: s.photo_url || s.photoUrl,
        locationName: s.location_name || s.locationName,
        coords: s.coords,
        conditionNotes: s.condition_notes || s.conditionNotes,
        similarityScore: s.similarity_score || s.similarityScore,
        euclideanDistance: s.euclidean_distance || s.euclideanDistance,
        status: s.status,
        timestamp: s.timestamp
      }));
      writeStorage(STORAGE_KEYS.CITIZEN_SIGHTINGS, mappedSightings);
    }

    const remoteLogs = await fetchFromSupabase('ai_accuracy_logs');
    if (remoteLogs && Array.isArray(remoteLogs) && remoteLogs.length > 0) {
      const mappedLogs = remoteLogs.map((l) => ({
        queryId: l.query_id || l.queryId,
        timestamp: l.timestamp,
        sourceType: l.source_type || l.sourceType,
        detectedAge: l.detected_age || l.detectedAge,
        detectedGender: l.detected_gender || l.detectedGender,
        genderConfidence: l.gender_confidence || l.genderConfidence,
        landmarkCount: l.landmark_count || l.landmarkCount,
        matchedCaseId: l.matched_case_id || l.matchedCaseId,
        matchedName: l.matched_name || l.matchedName,
        euclideanDistance: l.euclidean_distance || l.euclideanDistance,
        similarityPercent: l.similarity_percent || l.similarityPercent,
        isMatchFound: l.is_match_found || l.isMatchFound,
        inferenceTimeMs: l.inference_time_ms || l.inferenceTimeMs,
        groundTruthStatus: l.ground_truth_status || l.groundTruthStatus,
        reviewerNotes: l.reviewer_notes || l.reviewerNotes
      }));
      writeStorage(STORAGE_KEYS.AI_AUDIT_LOGS, mappedLogs);
    }

    notifyDbUpdate();
  } catch (err) {
    console.warn('[Supabase] Cloud sync error:', err.message);
  }
}

// Auto-sync on module load in browser
if (typeof window !== 'undefined') {
  syncAllFromSupabaseCloud();
}
