-- ═══════════════════════════════════════════════════════════════
-- TIRTHSAATHI SUPABASE POSTGRESQL SCHEMA (SQL DATABASE TABLES)
-- Copy and paste this into your Supabase SQL Editor and click RUN
-- ═══════════════════════════════════════════════════════════════

-- 1. Table: Missing Persons Registry
CREATE TABLE IF NOT EXISTS public.missing_persons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    avatar TEXT DEFAULT '👤',
    image TEXT NOT NULL, -- Permanent Cloudflare R2 Public CDN URL
    last_seen TEXT,
    last_seen_coords JSONB DEFAULT '{"lat": 25.3109, "lng": 83.0107}'::jsonb,
    checkpoint TEXT DEFAULT 'Main Temple Gate',
    time_reported TEXT,
    status TEXT DEFAULT 'searching', -- 'searching', 'sighting_reported', 'located', 'reunited'
    status_label TEXT DEFAULT 'Active Search Broadcast Sent',
    attire TEXT,
    contact_person TEXT,
    contact_phone TEXT,
    languages TEXT DEFAULT 'Hindi',
    medical_notes TEXT,
    sightings_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: 128D Biometric Facial Vector Embeddings (Decoupled Math Table)
CREATE TABLE IF NOT EXISTS public.biometric_vectors (
    case_id TEXT PRIMARY KEY REFERENCES public.missing_persons(id) ON DELETE CASCADE,
    vector JSONB NOT NULL, -- 128-dimensional Float32Array facial descriptor
    estimated_age INTEGER,
    gender TEXT,
    landmark_count INTEGER DEFAULT 68,
    box JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: Citizen Sightings Stream ("I Found Someone")
CREATE TABLE IF NOT EXISTS public.citizen_sightings (
    id TEXT PRIMARY KEY,
    matched_case_id TEXT REFERENCES public.missing_persons(id) ON DELETE SET NULL,
    person_name TEXT,
    reported_by TEXT DEFAULT 'Kind Devotee',
    reporter_phone TEXT,
    photo_url TEXT NOT NULL, -- Cloudflare R2 Sighting Photo URL
    location_name TEXT,
    coords JSONB DEFAULT '{"lat": 25.3109, "lng": 83.0107}'::jsonb,
    condition_notes TEXT,
    similarity_score NUMERIC,
    euclidean_distance NUMERIC,
    status TEXT DEFAULT 'unclaimed', -- 'verified' or 'unclaimed'
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: AI Accuracy & Government Audit Trail
CREATE TABLE IF NOT EXISTS public.ai_accuracy_logs (
    query_id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    source_type TEXT DEFAULT 'citizen_upload',
    detected_age INTEGER,
    detected_gender TEXT,
    gender_confidence NUMERIC DEFAULT 0,
    landmark_count INTEGER DEFAULT 68,
    matched_case_id TEXT,
    matched_name TEXT,
    euclidean_distance NUMERIC,
    similarity_percent NUMERIC,
    is_match_found BOOLEAN DEFAULT FALSE,
    inference_time_ms INTEGER DEFAULT 120,
    ground_truth_status TEXT DEFAULT 'unconfirmed', -- 'true_positive', 'false_positive', 'true_negative', 'false_negative'
    reviewer_notes TEXT,
    verified_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────────────
-- Enable Public Read & Write Row Level Security (RLS) Policies
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.missing_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_accuracy_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read and insert/upsert for Pilgrims and AI nodes
CREATE POLICY "Allow public read on missing_persons" ON public.missing_persons FOR SELECT USING (true);
CREATE POLICY "Allow public insert on missing_persons" ON public.missing_persons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on missing_persons" ON public.missing_persons FOR UPDATE USING (true);

CREATE POLICY "Allow public read on biometric_vectors" ON public.biometric_vectors FOR SELECT USING (true);
CREATE POLICY "Allow public insert on biometric_vectors" ON public.biometric_vectors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on biometric_vectors" ON public.biometric_vectors FOR UPDATE USING (true);

CREATE POLICY "Allow public read on citizen_sightings" ON public.citizen_sightings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on citizen_sightings" ON public.citizen_sightings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on ai_accuracy_logs" ON public.ai_accuracy_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ai_accuracy_logs" ON public.ai_accuracy_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on ai_accuracy_logs" ON public.ai_accuracy_logs FOR UPDATE USING (true);
