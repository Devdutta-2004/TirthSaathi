// ═══════════════════════════════════════════════════════════════
// PUNARMILAN AI (पुनर्मिलन AI) - FACIAL RECOGNITION ENGINE
// ═══════════════════════════════════════════════════════════════

export const INITIAL_FACE_DATABASE = [
  {
    id: 'CASE-8841',
    name: 'Rameshwar Lal Sharma',
    age: '68 Years',
    gender: 'Male',
    avatar: '👨‍🦳',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    location: 'Godowlia Gate No. 2 Help Desk, Varanasi',
    checkpoint: 'CCTV Sector 4 (Live Stream)',
    detectedTime: '12 mins ago',
    status: 'Safe at Pilgrim Shelter',
    statusCode: 'located',
    confidence: 98.6,
    faceFeatures: {
      faceShape: 'Oval',
      hairColor: 'Silver Grey',
      facialHair: 'Clean Shaven',
      glasses: 'Gold Rimmed',
      landmarks: 68,
      vectorScore: '0.986'
    },
    attire: 'White Kurta, Yellow Shawl',
    contactOfficer: 'Inspector R. K. Singh (Duty Post 2)',
    officerPhone: '+91 94544 00112'
  },
  {
    id: 'CASE-8842',
    name: 'Aarav Gupta',
    age: '8 Years',
    gender: 'Male',
    avatar: '👦',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    location: 'Saryu Ghat Child Assistance Booth, Ayodhya',
    checkpoint: 'CCTV Gate B Entry Scanner',
    detectedTime: '34 mins ago',
    status: 'In Volunteer Care',
    statusCode: 'located',
    confidence: 96.4,
    faceFeatures: {
      faceShape: 'Round',
      hairColor: 'Dark Black',
      facialHair: 'None',
      glasses: 'None',
      landmarks: 68,
      vectorScore: '0.964'
    },
    attire: 'Blue Cartoon T-shirt, Denim Shorts',
    contactOfficer: 'Volunteer Head S. Trivedi',
    officerPhone: '+91 98890 22334'
  },
  {
    id: 'CASE-8843',
    name: 'Devaki Ammal',
    age: '72 Years',
    gender: 'Female',
    avatar: '👵',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    location: 'Alipiri Footpath Medical Camp 3, Tirupati',
    checkpoint: 'Shelter Checkpoint 12',
    detectedTime: '1 hour ago',
    status: 'Resting with Seva Dal',
    statusCode: 'located',
    confidence: 94.8,
    faceFeatures: {
      faceShape: 'Round',
      hairColor: 'Grey/White',
      facialHair: 'None',
      glasses: 'Reading Glasses',
      landmarks: 68,
      vectorScore: '0.948'
    },
    attire: 'Maroon Cotton Saree, Rudraksha Mala',
    contactOfficer: 'Dr. Meena Swaminathan',
    officerPhone: '+91 87722 55667'
  },
  {
    id: 'CASE-8844',
    name: 'Santosh Kumar Verma',
    age: '54 Years',
    gender: 'Male',
    avatar: '👨',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    location: 'Har Ki Pauri Central Ghat Control Room, Haridwar',
    checkpoint: 'Ganga Sabha Facial Scan Node 8',
    detectedTime: '2 hours ago',
    status: 'Awaiting Family Verification',
    statusCode: 'located',
    confidence: 92.1,
    faceFeatures: {
      faceShape: 'Square',
      hairColor: 'Black & Grey',
      facialHair: 'Moustache',
      glasses: 'Frameless',
      landmarks: 68,
      vectorScore: '0.921'
    },
    attire: 'Saffron Angavastram, Brown Kurta',
    contactOfficer: 'Officer B. S. Negi',
    officerPhone: '+91 98370 11223'
  }
];

export const PRESET_TEST_PHOTOS = [
  {
    id: 'preset-1',
    label: 'Grandfather (68y)',
    tag: 'Senior Devotee',
    name: 'Rameshwar Sharma',
    avatar: '👨‍🦳',
    description: 'White kurta, gold rimmed glasses',
    previewUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    targetMatchId: 'CASE-8841'
  },
  {
    id: 'preset-2',
    label: 'Lost Child (8y)',
    tag: 'Child Case',
    name: 'Aarav Gupta',
    avatar: '👦',
    description: 'Blue t-shirt, cartoon print',
    previewUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    targetMatchId: 'CASE-8842'
  },
  {
    id: 'preset-3',
    label: 'Grandmother (72y)',
    tag: 'Senior Devotee',
    name: 'Devaki Ammal',
    avatar: '👵',
    description: 'Maroon cotton saree, rudraksha',
    previewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    targetMatchId: 'CASE-8843'
  }
];

/**
 * Simulates Neural Face Recognition Analysis
 * @param {string|File} photoInput - Photo URL, Data URI or preset ID
 * @param {Function} onProgress - Callback for scanning steps
 * @returns {Promise<Object>} Scan results with matches and feature metrics
 */
export const runPunarMilanScan = (photoInput, onProgress) => {
  return new Promise((resolve) => {
    const steps = [
      { step: 1, text: 'Detecting facial bounding box & orientation...', progress: 20 },
      { step: 2, text: 'Extracting 68-point biometric landmark mesh...', progress: 45 },
      { step: 3, text: 'Generating 512D deep neural face embedding vectors...', progress: 70 },
      { step: 4, text: 'Cross-referencing 14,200+ temple CCTV logs & shelter records...', progress: 90 },
      { step: 5, text: 'Facial similarity analysis complete.', progress: 100 }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        onProgress && onProgress(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);

        // Find match based on preset or fuzzy similarity
        let matchedRecord = INITIAL_FACE_DATABASE[0];
        let confidence = (94 + Math.random() * 5.2).toFixed(1);

        if (typeof photoInput === 'string') {
          const matchedPreset = PRESET_TEST_PHOTOS.find((p) => p.id === photoInput || photoInput.includes(p.targetMatchId));
          if (matchedPreset) {
            matchedRecord = INITIAL_FACE_DATABASE.find((r) => r.id === matchedPreset.targetMatchId) || INITIAL_FACE_DATABASE[0];
          }
        }

        resolve({
          timestamp: new Date().toLocaleTimeString(),
          processedLandmarks: 68,
          extractedEmbeddings: '512-dim Float32 Vector',
          similarityScore: confidence,
          topMatch: {
            ...matchedRecord,
            confidence: Number(confidence)
          },
          otherCandidates: INITIAL_FACE_DATABASE.filter((r) => r.id !== matchedRecord.id).slice(0, 2)
        });
      }
    }, 450);
  });
};
