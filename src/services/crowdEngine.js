// TirthSaathi Flow - Intelligent Crowd & Gate Management Engine

export const initialTemples = [
  {
    id: 'kashi',
    name: 'Kashi Vishwanath Temple',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    image: '/images/varanasi_kashi.jpg',
    description: 'Ancient sacred temple along the holy Ganga River. Features 4 primary pilgrim entry corridors.',
    totalDailyCapacity: 80000,
    currentOccupancy: 48200,
    gates: [
      {
        id: 'gate-a',
        code: 'Gate A',
        name: 'Ganga Ghat Entrance (Gate 1)',
        description: 'Direct access from Dashashwamedh & Manikarnika Ghats via River Corridor',
        capacity: 1000,
        currentCount: 820,
        status: 'OPEN',
        baseWaitPer100: 5, // mins per 100 people
        distanceMeters: 400,
        trend: 'rising', // 'rising', 'stable', 'falling'
        elderlyFriendly: false,
        wheelchairAccessible: false,
        recommendedForLargeGroups: false
      },
      {
        id: 'gate-b',
        code: 'Gate B',
        name: 'Godowlia Main Corridor (Gate 2)',
        description: 'Wide pedestrianized corridor with automated mist coolers & battery buggies',
        capacity: 1000,
        currentCount: 315,
        status: 'OPEN',
        baseWaitPer100: 3.8,
        distanceMeters: 650,
        trend: 'falling',
        elderlyFriendly: true,
        wheelchairAccessible: true,
        recommendedForLargeGroups: true
      },
      {
        id: 'gate-c',
        code: 'Gate C',
        name: 'Chhattadwar / Gyanvapi Plaza (Gate 3)',
        description: 'Traditional entry via Vishwanath Gali market corridor',
        capacity: 800,
        currentCount: 512,
        status: 'OPEN',
        baseWaitPer100: 5.5,
        distanceMeters: 250,
        trend: 'stable',
        elderlyFriendly: false,
        wheelchairAccessible: false,
        recommendedForLargeGroups: false
      },
      {
        id: 'gate-d',
        code: 'Gate D',
        name: 'Dhunilal Silversmith Gate (Gate 4)',
        description: 'Designated Senior Citizen, Differently-Abled & Online Token Pass line',
        capacity: 600,
        currentCount: 180,
        status: 'OPEN',
        baseWaitPer100: 2.5,
        distanceMeters: 750,
        trend: 'falling',
        elderlyFriendly: true,
        wheelchairAccessible: true,
        recommendedForLargeGroups: false
      }
    ]
  },
  {
    id: 'ayodhya',
    name: 'Shree Ram Janmabhoomi Mandir',
    city: 'Ayodhya',
    state: 'Uttar Pradesh',
    image: '/images/ayodhya_ram_mandir.jpg',
    description: 'Grand Ram Mandir complex equipped with 4 entry pathways and automated crowd control barriers.',
    totalDailyCapacity: 120000,
    currentOccupancy: 64000,
    gates: [
      {
        id: 'gate-ram-a',
        code: 'Sugriva Qila Gate',
        name: 'Rampath North Gate',
        description: 'Main pedestrian boulevard with battery buggy shuttle transit',
        capacity: 1200,
        currentCount: 760,
        status: 'OPEN',
        baseWaitPer100: 4.0,
        distanceMeters: 500,
        trend: 'stable',
        elderlyFriendly: true,
        wheelchairAccessible: true,
        recommendedForLargeGroups: true
      },
      {
        id: 'gate-ram-b',
        code: 'Hanuman Garhi Path',
        name: 'South Corridor Entrance',
        description: 'Direct link from Hanuman Garhi staircase plaza',
        capacity: 1000,
        currentCount: 390,
        status: 'OPEN',
        baseWaitPer100: 3.5,
        distanceMeters: 620,
        trend: 'falling',
        elderlyFriendly: true,
        wheelchairAccessible: true,
        recommendedForLargeGroups: true
      },
      {
        id: 'gate-ram-c',
        code: 'VIP & Sugriva Pass',
        name: 'West Gate 3',
        description: 'Online pre-booked slot token entrance',
        capacity: 800,
        currentCount: 650,
        status: 'OPEN',
        baseWaitPer100: 4.5,
        distanceMeters: 800,
        trend: 'rising',
        elderlyFriendly: true,
        wheelchairAccessible: true,
        recommendedForLargeGroups: false
      }
    ]
  },
  {
    id: 'tirupati',
    name: 'Sri Venkateswara Swamy Temple',
    city: 'Tirupati (Tirumala)',
    state: 'Andhra Pradesh',
    image: '/images/tirupati_balaji.jpg',
    description: 'Seven sacred hills temple managed with multi-compartment Vaikuntam Queue Complexes.',
    totalDailyCapacity: 90000,
    currentOccupancy: 76000,
    gates: [
      {
        id: 'gate-ttd-1',
        code: 'VQC-1',
        name: 'Sarvadarshanam Free Queue Complex 1',
        description: 'General darshan line for unreserved devotees',
        capacity: 2000,
        currentCount: 1680,
        status: 'OPEN',
        baseWaitPer100: 8.0,
        distanceMeters: 400,
        trend: 'rising',
        elderlyFriendly: false,
        wheelchairAccessible: false,
        recommendedForLargeGroups: true
      },
      {
        id: 'gate-ttd-2',
        code: 'VQC-2',
        name: 'Time Slot (SSD) Token Queue Complex 2',
        description: 'Free token verified darshan with barcode wristband',
        capacity: 1500,
        currentCount: 520,
        status: 'OPEN',
        baseWaitPer100: 3.0,
        distanceMeters: 600,
        trend: 'falling',
        elderlyFriendly: true,
        wheelchairAccessible: true,
        recommendedForLargeGroups: true
      },
      {
        id: 'gate-ttd-3',
        code: 'Mahadwaram',
        name: 'Senior Citizen & Infant Special Line',
        description: 'Dedicated air-conditioned corridor for 65+ age & infant parents',
        capacity: 600,
        currentCount: 190,
        status: 'OPEN',
        baseWaitPer100: 2.0,
        distanceMeters: 300,
        trend: 'stable',
        elderlyFriendly: true,
        wheelchairAccessible: true,
        recommendedForLargeGroups: false
      }
    ]
  }
];

/**
 * Gate Scoring Engine:
 * Evaluates gate viability based on occupancy %, wait time, distance, group size, and trend.
 * Lower Score = Better Recommendation!
 */
export function calculateGateScore(gate, groupSize = 1, preferElderly = false) {
  if (gate.status !== 'OPEN') {
    return 99999; // unavailable
  }

  const occupancyPercent = (gate.currentCount / gate.capacity) * 100;
  const estimatedWaitMin = Math.round((gate.currentCount / 100) * gate.baseWaitPer100);
  const distanceScore = gate.distanceMeters / 100; // e.g. 6.5 for 650m

  let trendPenalty = 0;
  if (gate.trend === 'rising') trendPenalty = 15;
  if (gate.trend === 'falling') trendPenalty = -10;

  let groupPenalty = 0;
  if (groupSize > 4 && !gate.recommendedForLargeGroups) {
    groupPenalty = 20;
  }

  let accessibilityBonus = 0;
  if (preferElderly && gate.elderlyFriendly) {
    accessibilityBonus = -25;
  }

  // Combined weighted score formula
  const score = (occupancyPercent * 0.45) + (estimatedWaitMin * 0.35) + (distanceScore * 0.2) + trendPenalty + groupPenalty + accessibilityBonus;
  return {
    score: Math.max(1, Math.round(score)),
    occupancyPercent: Math.round(occupancyPercent),
    estimatedWaitMin: Math.max(5, estimatedWaitMin)
  };
}

/**
 * Evaluates all gates for a temple and returns ranked list + top recommendation
 */
export function evaluateTempleGates(temple, groupSize = 1, preferElderly = false) {
  const evaluated = temple.gates.map((gate) => {
    const metrics = calculateGateScore(gate, groupSize, preferElderly);
    return {
      ...gate,
      ...metrics
    };
  });

  // Sort by score ascending (lowest score is best)
  evaluated.sort((a, b) => a.score - b.score);

  return {
    recommendedGate: evaluated[0],
    allGates: evaluated
  };
}
