-- ==============================================================================
-- FIX FOREIGN KEY CONSTRAINT & SEED SERVICES AND THERAPISTS INTO SUPABASE
-- Run this in your Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Drop strict Foreign Key constraints on bookings table
-- This ensures bookings are never blocked if a service/specialist ID is 'any' or custom
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_therapist_id_fkey;

-- 2. Seed Default Business (if not already seeded)
INSERT INTO businesses (id, slug, name, domain)
VALUES ('00000000-0000-0000-0000-000000000001', 'lotus-luxe-spa', 'Lotus Luxe Spa & Wellness', 'lotusluxespa.com')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed All 10 Services into services table
INSERT INTO services (id, business_id, name, category, tagline, description, price, duration, image, featured, is_active, display_order)
VALUES
  (
    'russian-banya',
    '00000000-0000-0000-0000-000000000001',
    'Russian Banya Ritual',
    'Signature European',
    'Centuries-Old Slavic Thermal & Venik Birch Therapy',
    'An authentic Slavic steam bath ritual combining high heat, natural moisture, and invigorating venik massage.',
    3499,
    '90 Mins',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    true,
    true,
    1
  ),
  (
    'swedish-massage',
    '00000000-0000-0000-0000-000000000001',
    'Classic Swedish Massage',
    'European Classic',
    'Gentle Flowing Strokes for Total Muscle Relaxation',
    'The gold standard of Western therapeutic massage. Utilizes five classic long gliding strokes.',
    2799,
    '60 Mins',
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
    true,
    true,
    2
  ),
  (
    'deep-tissue-massage',
    '00000000-0000-0000-0000-000000000001',
    'Deep Tissue Therapy',
    'Therapeutic & Recovery',
    'Targeted Pressure on Chronic Myofascial Tension',
    'Firm, focused pressure designed to reach the deepest layers of muscle fibers and fascia.',
    3199,
    '60 Mins',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
    true,
    true,
    3
  ),
  (
    'couples-massage',
    '00000000-0000-0000-0000-000000000001',
    'Royal Couples Sanctuary Ritual',
    'Exclusive Duets',
    'Shared Tranquility in Private VIP Suite with Jacuzzi',
    'An intimate side-by-side journey in our candlelit VIP master suite with rose petal bath.',
    5999,
    '90 Mins',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    true,
    true,
    4
  ),
  (
    'hot-stone-therapy',
    '00000000-0000-0000-0000-000000000001',
    'Basalt Hot Stone Therapy',
    'Thermal & Restorative',
    'Volcanic Minerals Radiating Deep Soothing Heat',
    'Smooth, heated volcanic basalt stones placed along energy meridian lines.',
    3699,
    '90 Mins',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    true,
    true,
    5
  ),
  (
    'ayurvedic-abhyanga',
    '00000000-0000-0000-0000-000000000001',
    'Ayurvedic Abhyanga & Shirodhara',
    'Indian Holistic',
    'Ancient Vedic Warm Herb-Infused Oil Rhythms',
    'Full-body synchronized rhythmic massage with warm dosha-specific medicated oils.',
    3499,
    '90 Mins',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    true,
    true,
    6
  ),
  (
    'balinese-massage',
    '00000000-0000-0000-0000-000000000001',
    'Balinese Exotic Harmony',
    'Asian Traditions',
    'Aromatherapy, Acupressure, and Gentle Stretching',
    'Traditional Indonesian bodywork blending palm pressure and fragrant floral oils.',
    2899,
    '60 Mins',
    'https://images.unsplash.com/photo-1512290900672-1f41b3e9a595?auto=format&fit=crop&w=800&q=80',
    false,
    true,
    7
  ),
  (
    'thai-yoga-massage',
    '00000000-0000-0000-0000-000000000001',
    'Traditional Thai Yoga Bodywork',
    'Asian Traditions',
    'Assisted Yogic Asanas & Sen Line Energy Release',
    'Conducted dry on a comfortable floor futon using rhythmic acupressure.',
    2999,
    '75 Mins',
    'https://images.unsplash.com/photo-1519824145371-296894a0dc91?auto=format&fit=crop&w=800&q=80',
    false,
    true,
    8
  ),
  (
    'aromatherapy-ritual',
    '00000000-0000-0000-0000-000000000001',
    'Botanical Aromatherapy Serenity',
    'European Classic',
    'French Lavender, Bergamot, and Roman Chamomile',
    'Gentle lymphatic flow infused with customized pure grade botanical distillations.',
    2899,
    '60 Mins',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    false,
    true,
    9
  ),
  (
    'foot-reflexology',
    '00000000-0000-0000-0000-000000000001',
    'Royal Foot Reflexology & Scrub',
    'Targeted Relief',
    'Zone Acupressure for Deep Organ Equilibrium',
    'Targeted pressure-point therapy mapping foot nerve endings to vital body organs.',
    1999,
    '45 Mins',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
    false,
    true,
    10
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  image = EXCLUDED.image,
  is_active = true;

-- 4. Seed All 8 Therapists into therapists table
INSERT INTO therapists (id, business_id, name, category, specialization, experience_years, starting_price, bio, image, is_active, display_order)
VALUES
  (
    'ekaterina-ivanova',
    '00000000-0000-0000-0000-000000000001',
    'Ekaterina Ivanova',
    'Russian Therapists',
    'Slavic Russian Banya & Venik Thermal Therapy',
    '9 Years Experience',
    3499,
    'Trained in classical Russian Banya parenie, venik percussion, and contrast hydrotherapy.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
    true,
    1
  ),
  (
    'anastasia-smirnova',
    '00000000-0000-0000-0000-000000000001',
    'Anastasia Smirnova',
    'Russian Therapists',
    'European Deep Tissue & Postural Realignment',
    '7 Years Experience',
    3199,
    'Specializing in chronic myofascial relief, posture correction, and spinal decompression.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=80',
    true,
    2
  ),
  (
    'olga-kuznetsova',
    '00000000-0000-0000-0000-000000000001',
    'Olga Kuznetsova',
    'Russian Therapists',
    'Classic Swedish & French Botanical Aromatherapy',
    '8 Years Experience',
    2999,
    'Blends gentle Swedish effleurage with bespoke botanical aromatics.',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=700&q=80',
    true,
    3
  ),
  (
    'daria-petrova',
    '00000000-0000-0000-0000-000000000001',
    'Daria Petrova',
    'Russian Therapists',
    'Hot Stone Thermotherapy & Lymphatic Drainage',
    '6 Years Experience',
    3199,
    'Mastery over mineral basalt stones and rhythmic lymphatic stimulation.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    true,
    4
  ),
  (
    'meera-patel',
    '00000000-0000-0000-0000-000000000001',
    'Meera Patel',
    'Indian Therapists',
    'Authentic Ayurvedic Abhyanga & Shirodhara',
    '11 Years Experience',
    3499,
    'Certified in Kerala traditional panchakarma therapies and warm herbal marma bodywork.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    true,
    5
  ),
  (
    'priya-sharma',
    '00000000-0000-0000-0000-000000000001',
    'Priya Sharma',
    'Indian Therapists',
    'Balinese Harmony & Asian Fusion Acupressure',
    '8 Years Experience',
    2899,
    'Skilled in Indonesian palm friction, skin rolling, and targeted acupressure.',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    true,
    6
  ),
  (
    'ananya-deshmukh',
    '00000000-0000-0000-0000-000000000001',
    'Ananya Deshmukh',
    'Indian Therapists',
    'Royal Couple Duet Therapy & Botanical Wraps',
    '7 Years Experience',
    3299,
    'Renowned for synchronized couple treatments and botanical detox body polishes.',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    true,
    7
  ),
  (
    'rohit-verma',
    '00000000-0000-0000-0000-000000000001',
    'Rohit Verma',
    'Indian Therapists',
    'Traditional Thai Yoga Bodywork & Sports Recovery',
    '9 Years Experience',
    2999,
    'Trained at Wat Po Bangkok in passive stretching, joint mobilization, and sen lines.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    true,
    8
  ),
  (
    'any',
    '00000000-0000-0000-0000-000000000001',
    'Any Available Specialist',
    'General Pool',
    'All Modalities & Certified Wellness Staff',
    '5+ Years',
    2799,
    'Automatic assignment to the best available senior therapist on duty.',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
    true,
    99
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = true;
