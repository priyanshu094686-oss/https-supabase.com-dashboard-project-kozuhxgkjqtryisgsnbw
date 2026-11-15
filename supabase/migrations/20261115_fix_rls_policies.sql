-- ==============================================================================
-- FIX ROW LEVEL SECURITY (RLS) POLICIES FOR SPA APPOINTMENTS & CUSTOMERS
-- Run this in your Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Enable RLS on bookings & customers (if not already enabled)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 2. Drop any previous conflicting policies on bookings
DROP POLICY IF EXISTS "Public Insert Bookings" ON bookings;
DROP POLICY IF EXISTS "Public Read Bookings" ON bookings;
DROP POLICY IF EXISTS "Admin Manage Bookings" ON bookings;
DROP POLICY IF EXISTS "Admin Update Bookings" ON bookings;
DROP POLICY IF EXISTS "Admin Delete Bookings" ON bookings;
DROP POLICY IF EXISTS "Enable insert for all users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;

-- 3. Policy: Allow customers (anonymous/public) to insert reservations
CREATE POLICY "Public Insert Bookings" ON bookings
FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

-- 4. Policy: Allow reading bookings (needed for slot availability checks & return confirmations)
CREATE POLICY "Public Read Bookings" ON bookings
FOR SELECT
TO public, anon, authenticated
USING (true);

-- 5. Policy: Allow admins to update bookings (confirm, cancel, reschedule, complete)
CREATE POLICY "Admin Update Bookings" ON bookings
FOR UPDATE
TO public, anon, authenticated
USING (true)
WITH CHECK (true);

-- 6. Policy: Allow admins to delete bookings
CREATE POLICY "Admin Delete Bookings" ON bookings
FOR DELETE
TO authenticated
USING (true);

-- 7. Customers RLS Policies
DROP POLICY IF EXISTS "Public Insert Customers" ON customers;
DROP POLICY IF EXISTS "Public Read Customers" ON customers;
DROP POLICY IF EXISTS "Admin View Customers" ON customers;
DROP POLICY IF EXISTS "Admin Manage Customers" ON customers;

CREATE POLICY "Public Insert Customers" ON customers
FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public Update Customers" ON customers
FOR UPDATE
TO public, anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public Read Customers" ON customers
FOR SELECT
TO public, anon, authenticated
USING (true);

