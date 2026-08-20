/**
 * TirthSaathi Geolocation, Haversine Distance & Audio Chime Engine
 */

// Earth radius in meters
const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculate precise distance in meters between two GPS coordinates using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in meters (rounded to 1 decimal place)
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_METERS * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Calculate compass bearing (0-360 degrees) from Point A to Point B
 * @returns {number} heading angle in degrees (0 = North, 90 = East, etc.)
 */
export function calculateCompassBearing(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dLon = toRad(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);

  let bearing = toDeg(Math.atan2(y, x));
  return Math.round((bearing + 360) % 360);
}

/**
 * Start watching physical device GPS coordinates
 * @param {Function} onLocationUpdate Callback with { lat, lng, accuracy, heading, speed, timestamp }
 * @param {Function} onError Callback if GPS access is denied or unavailable
 * @returns {number|null} watchId to clear watch
 */
export function watchDeviceGPS(onLocationUpdate, onError) {
  if (!('geolocation' in navigator)) {
    onError && onError(new Error('Geolocation is not supported by this browser'));
    return null;
  }

  const options = {
    enableHighAccuracy: true, // Uses real GPS sensor on mobile devices
    timeout: 10000,
    maximumAge: 0
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy, heading, speed } = position.coords;
      onLocationUpdate({
        lat: latitude,
        lng: longitude,
        accuracy: Math.round(accuracy || 5),
        heading: heading || 0,
        speed: speed || 0,
        timestamp: position.timestamp || Date.now()
      });
    },
    (err) => {
      console.warn('[TirthSaathi GPS] Warning or fallback:', err.message);
      onError && onError(err);
    },
    options
  );

  return watchId;
}

export function stopWatchingGPS(watchId) {
  if (watchId !== null && 'geolocation' in navigator) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Read battery level of the device
 * @returns {Promise<number>} Battery percentage (e.g. 85)
 */
export async function getDeviceBattery() {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      return Math.round(battery.level * 100);
    }
  } catch (err) {
    // Battery API not supported or blocked
  }
  return 88;
}

/**
 * Play Sacred Temple Bell / Shankha Harmonic Chime using Web Audio API
 * Runs natively on any smartphone speaker without external audio files!
 */
export function playSpiritualChimeBeacon() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Frequencies for sacred meditative temple gong (528Hz Solfeggio Love/Miracle & 432Hz Cosmic tuning)
    const frequencies = [432, 528, 864, 1056];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Smooth chime decay envelope
      gain.gain.setValueAtTime(0.3 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.2);
    });

    // Secondary pulse chime after 1.5s
    setTimeout(() => {
      if (ctx.state === 'running') {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(648, ctx.currentTime);
        gain2.gain.setValueAtTime(0.25, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 2.6);
      }
    }, 1500);

    // Vibrate device if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([300, 150, 300, 150, 500]);
    }
  } catch (e) {
    console.warn('[TirthSaathi Audio] Web Audio not allowed yet without user gesture:', e);
  }
}
