import { db } from './firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDocs,
  serverTimestamp,
  updateDoc,
  increment
} from 'firebase/firestore';

/**
 * Check if Firebase Cloud is connected and configured
 */
export function isCloudConfigured() {
  return db !== null;
}

/**
 * Listen to real-time member updates for a private Family Circle in Firestore
 * @param {string} groupCode
 * @param {Function} onMembersUpdate Callback receiving array of members
 * @returns {Function} Unsubscribe function
 */
export function subscribeToFamilyCircle(groupCode, onMembersUpdate) {
  if (!db || !groupCode) return () => {};

  try {
    const membersRef = collection(db, 'familyGroups', groupCode, 'members');
    const unsubscribe = onSnapshot(
      membersRef,
      (snapshot) => {
        const members = [];
        snapshot.forEach((docSnap) => {
          members.push({ id: docSnap.id, ...docSnap.data() });
        });
        onMembersUpdate(members);
      },
      (error) => {
        console.warn('[Firestore] Family Circle subscription error:', error.message);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[Firestore] Error subscribing to family circle:', e);
    return () => {};
  }
}

/**
 * Stream physical GPS coordinates to Firestore Cloud
 */
export async function updateMyCloudGPS(groupCode, deviceId, memberData) {
  if (!db || !groupCode || !deviceId) return;

  try {
    const memberDocRef = doc(db, 'familyGroups', groupCode, 'members', deviceId);
    await setDoc(
      memberDocRef,
      {
        ...memberData,
        lastSeen: Date.now(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('[Firestore] Error updating cloud GPS:', e.message);
  }
}

/**
 * Subscribe to real-time Temple Gate Crowd counts in Firestore
 */
export function subscribeToCrowdGates(templeId, onGatesUpdate) {
  if (!db || !templeId) return () => {};

  try {
    const gatesRef = collection(db, 'temples', templeId, 'gates');
    const unsubscribe = onSnapshot(
      gatesRef,
      (snapshot) => {
        const gates = [];
        snapshot.forEach((docSnap) => {
          gates.push({ id: docSnap.id, ...docSnap.data() });
        });
        onGatesUpdate(gates);
      },
      (error) => {
        console.warn('[Firestore] Gates subscription error:', error.message);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[Firestore] Error subscribing to gates:', e);
    return () => {};
  }
}

/**
 * Record a gate scan (+5 or -5) in Firestore Cloud
 */
export async function updateGateScanInCloud(templeId, gateId, delta, scanType, passCode) {
  if (!db || !templeId || !gateId) return;

  try {
    const gateRef = doc(db, 'temples', templeId, 'gates', gateId);
    await updateDoc(gateRef, {
      currentCount: increment(delta),
      lastScanType: scanType,
      lastPassCode: passCode || '',
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn('[Firestore] Error recording gate scan in cloud:', e.message);
  }
}
