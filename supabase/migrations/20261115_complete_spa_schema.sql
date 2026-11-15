-- ==============================================================================
-- STEP 3: COMPLETE COMMERCIAL SPA DATABASE SCHEMA & MIGRATION (SUPABASE)
-- Multi-Tenant (business_id), Row Level Security (RLS), Storage, Auth Roles
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. BUSINESSES (Tenants)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Business
INSERT INTO businesses (id, slug, name, domain)
VALUES ('00000000-0000-0000-0000-000000000001', 'lotus-luxe-spa', 'Lotus Luxe Spa & Wellness', 'lotusluxespa.com')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. PROFILES (Linked to Supabase auth.users & roles)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. BUSINESS SETTINGS (White-Label Configuration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE UNIQUE,
  business_name VARCHAR(255) NOT NULL DEFAULT 'Lotus Luxe Spa & Wellness',
  short_name VARCHAR(100) DEFAULT 'Lotus Luxe',
  tagline VARCHAR(255) DEFAULT 'The Pinnacle of Royal European Wellness & Russian Banya',
  description TEXT DEFAULT 'Premier sanctuary for authentic Slavic Russian Banya rituals, certified European & Indian bodywork, and private VIP jacuzzi suites.',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '/favicon.svg',
  primary_phone VARCHAR(50) DEFAULT '+91 98765 43210',
  phone_tel VARCHAR(50) DEFAULT '+919876543210',
  whatsapp_number VARCHAR(50) DEFAULT '919876543210',
  secondary_phone VARCHAR(50) DEFAULT '+91 98111 22334',
  secondary_phone_tel VARCHAR(50) DEFAULT '+919811122334',
  email VARCHAR(255) DEFAULT 'concierge@lotusluxespa.com',
  support_email VARCHAR(255) DEFAULT 'reservations@lotusluxespa.com',
  address_line1 TEXT DEFAULT 'L-Block, Mahipalpur Extension',
  address_line2 TEXT DEFAULT 'Near IGI Airport Terminal 3 & Aerocity',
  city VARCHAR(100) DEFAULT 'New Delhi',
  state VARCHAR(100) DEFAULT 'Delhi NCR',
  pincode VARCHAR(20) DEFAULT '110037',
  country VARCHAR(100) DEFAULT 'India',
  google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=Mahipalpur+Aerocity+New+Delhi',
  map_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14018.665961605728!2d77.11585!3d28.54972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1c0722396bb3%3A0xb38df13f707fdfc1!2sMahipalpur%2C%20New%20Delhi%2C%20Delhi%20110037!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  opening_hours TEXT DEFAULT '24 Hours / 7 Days a Week',
  is_24_hours BOOLEAN DEFAULT true,
  currency_symbol VARCHAR(10) DEFAULT '₹',
  currency_code VARCHAR(10) DEFAULT 'INR',
  primary_gold_color VARCHAR(20) DEFAULT '#D4AF37',
  accent_color VARCHAR(20) DEFAULT '#C5A059',
  instagram_url TEXT DEFAULT 'https://instagram.com/lotusluxespa',
  facebook_url TEXT DEFAULT 'https://facebook.com/lotusluxespa',
  youtube_url TEXT DEFAULT 'https://youtube.com/@lotusluxespa',
  promo_badge TEXT DEFAULT 'Special Seasonal Privilege',
  promo_headline TEXT DEFAULT 'Flat 20% Off on All Russian Banya & Signature Couple Suites',
  promo_code TEXT DEFAULT 'LUXE20',
  promo_subtext TEXT DEFAULT 'Complimentary Herbal Infusions & Essential Steam with Every 90-Min Session',
  is_promo_enabled BOOLEAN DEFAULT true,
  payment_provider VARCHAR(50) DEFAULT 'none',
  payment_deposit_percent INT DEFAULT 0,
  publishable_key TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Settings
INSERT INTO business_settings (business_id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (business_id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. SERVICES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(100) PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  tagline VARCHAR(255),
  description TEXT NOT NULL,
  full_description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  duration VARCHAR(50) NOT NULL,
  duration_options JSONB DEFAULT '["60 Mins", "90 Mins"]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  includes JSONB DEFAULT '[]'::jsonb,
  image TEXT NOT NULL,
  badge VARCHAR(100),
  rating NUMERIC(3, 2) DEFAULT 4.95,
  reviews_count INT DEFAULT 120,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. THERAPISTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS therapists (
  id VARCHAR(100) PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  experience_years VARCHAR(50) DEFAULT '5+ Years',
  rating NUMERIC(3, 2) DEFAULT 4.95,
  starting_price NUMERIC(10, 2) NOT NULL,
  session_duration VARCHAR(50) DEFAULT '60 - 90 Mins',
  languages JSONB DEFAULT '["English"]'::jsonb,
  certifications TEXT,
  bio TEXT NOT NULL,
  image TEXT NOT NULL,
  badge VARCHAR(100),
  specialties JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. THERAPIST AVAILABILITY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS therapist_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  therapist_id VARCHAR(100) NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL DEFAULT '10:00:00',
  end_time TIME NOT NULL DEFAULT '22:00:00',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_therapist_day UNIQUE (therapist_id, day_of_week)
);

-- ------------------------------------------------------------------------------
-- 7. CUSTOMERS (CRM Directory)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  notes TEXT,
  total_bookings INT DEFAULT 1,
  total_spent NUMERIC(10, 2) DEFAULT 0,
  last_visit TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_customer_email_per_business UNIQUE (business_id, email)
);

-- ------------------------------------------------------------------------------
-- 8. BOOKINGS (With double-booking protection trigger)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(100) PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  service_id VARCHAR(100) REFERENCES services(id) ON DELETE SET NULL,
  service_name VARCHAR(255) NOT NULL,
  therapist_id VARCHAR(100) REFERENCES therapists(id) ON DELETE SET NULL,
  therapist_name VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(50) NOT NULL,
  duration VARCHAR(50) DEFAULT '60 Mins',
  buffer_minutes INT DEFAULT 15,
  total_price NUMERIC(10, 2) NOT NULL,
  booking_status VARCHAR(50) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'deposit_paid', 'paid', 'refunded')),
  payment_method VARCHAR(50) DEFAULT 'pay_at_spa',
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure buffer_minutes exists if table was previously created
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS buffer_minutes INT DEFAULT 15;

-- Server-Side Double-Booking Prevention Trigger
CREATE OR REPLACE FUNCTION check_booking_conflict()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.therapist_id IS NOT NULL AND NEW.therapist_id != 'any' AND NEW.booking_status IN ('pending', 'confirmed') THEN
    IF EXISTS (
      SELECT 1 FROM bookings
      WHERE business_id = NEW.business_id
        AND therapist_id = NEW.therapist_id
        AND booking_date = NEW.booking_date
        AND booking_time = NEW.booking_time
        AND id != NEW.id
        AND booking_status IN ('pending', 'confirmed')
    ) THEN
      RAISE EXCEPTION 'Double-Booking Conflict: This specialist is already booked for % on %.', NEW.booking_time, NEW.booking_date;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_double_booking ON bookings;
CREATE TRIGGER trigger_prevent_double_booking
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION check_booking_conflict();

-- ------------------------------------------------------------------------------
-- 9. GALLERY IMAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'Interiors & Suites',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. TESTIMONIALS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  location VARCHAR(100),
  treatment VARCHAR(255),
  rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  avatar_url TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_services_business ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_therapists_business ON therapists(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_business ON bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(business_id, booking_date, booking_time);
CREATE INDEX IF NOT EXISTS idx_customers_business ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_gallery_business ON gallery_images(business_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_business ON testimonials(business_id);

-- ------------------------------------------------------------------------------
-- SUPABASE STORAGE BUCKETS (Public Read, Admin Write)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('business-logos', 'business-logos', true),
  ('service-images', 'service-images', true),
  ('therapist-photos', 'therapist-photos', true),
  ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view assets
CREATE POLICY "Public Read All Spa Assets" ON storage.objects
FOR SELECT USING (bucket_id IN ('business-logos', 'service-images', 'therapist-photos', 'gallery-images'));

-- Storage RLS: Authenticated users can upload assets
CREATE POLICY "Admin Upload Spa Assets" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id IN ('business-logos', 'service-images', 'therapist-photos', 'gallery-images')
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch current admin's business_id
CREATE OR REPLACE FUNCTION get_user_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Businesses
CREATE POLICY "Public Read Businesses" ON businesses FOR SELECT USING (true);
CREATE POLICY "Admin Manage Business" ON businesses FOR ALL USING (id = get_user_business_id());

-- 2. Profiles
CREATE POLICY "Users Can Read Own Profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users Can Update Own Profile" ON profiles FOR UPDATE USING (id = auth.uid());

-- 3. Business Settings
CREATE POLICY "Public Read Settings" ON business_settings FOR SELECT USING (true);
CREATE POLICY "Admin Update Settings" ON business_settings FOR ALL USING (business_id = get_user_business_id());

-- 4. Services
CREATE POLICY "Public Read Active Services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admin Manage Services" ON services FOR ALL USING (business_id = get_user_business_id());

-- 5. Therapists
CREATE POLICY "Public Read Active Therapists" ON therapists FOR SELECT USING (is_active = true);
CREATE POLICY "Admin Manage Therapists" ON therapists FOR ALL USING (business_id = get_user_business_id());

-- 6. Therapist Availability
CREATE POLICY "Public Read Availability" ON therapist_availability FOR SELECT USING (true);
CREATE POLICY "Admin Manage Availability" ON therapist_availability FOR ALL USING (business_id = get_user_business_id());

-- 7. Customers
CREATE POLICY "Public Insert Customers" ON customers FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Public Update Customers" ON customers FOR UPDATE TO public, anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Customers" ON customers FOR SELECT TO public, anon, authenticated USING (true);

-- 8. Bookings
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Public Read Bookings" ON bookings FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Admin Update Bookings" ON bookings FOR UPDATE TO public, anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Delete Bookings" ON bookings FOR DELETE TO authenticated USING (true);

-- 9. Gallery Images
CREATE POLICY "Public Read Gallery" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Admin Manage Gallery" ON gallery_images FOR ALL USING (business_id = get_user_business_id());

-- 10. Testimonials
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Admin Manage Testimonials" ON testimonials FOR ALL USING (business_id = get_user_business_id());

