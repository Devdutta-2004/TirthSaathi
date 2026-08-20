// TirthSaathi Offline Sync Queue Manager

const QUEUE_KEY = 'tirthsaathi_offline_sync_queue';

export function getOfflineQueue() {
  try {
    const saved = localStorage.getItem(QUEUE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading offline sync queue', e);
  }
  return [];
}

export function queueOfflineAction(action) {
  const item = {
    id: `queue-${Date.now()}`,
    timestamp: new Date().toISOString(),
    displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'PENDING_SYNC',
    ...action
  };

  const queue = getOfflineQueue();
  const updated = [...queue, item];
  localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return item;
}

export function clearOfflineQueue() {
  localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
}

export function syncOfflineQueue(onSuccess) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;

  // Simulate network synchronization of all queued items
  const count = queue.length;
  clearOfflineQueue();
  if (onSuccess) onSuccess(count);
  return count;
}

export function initOfflineSync() {
  return getOfflineQueue();
}
