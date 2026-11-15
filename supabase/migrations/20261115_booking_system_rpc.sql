-- ==============================================================================
-- LUXURY SPA APPOINTMENT BOOKING ENGINE - ATOMIC DATABASE RPC & CONCURRENCY LOCKS
-- Prevents double bookings, overlapping appointments, past-date bookings, and race conditions
-- ==============================================================================

-- 1. Ensure buffer_minutes column exists in business_settings and bookings
ALTER TABLE business_settings 
ADD COLUMN IF NOT EXISTS booking_buffer_minutes INT DEFAULT 15;

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS buffer_minutes INT DEFAULT 15,
ADD COLUMN IF NOT EXISTS duration_minutes INT DEFAULT 60;

-- 2. Atomic Booking RPC with Concurrency Lock & Availability Checks
CREATE OR REPLACE FUNCTION book_spa_appointment(
  p_business_id UUID,
  p_service_id VARCHAR,
  p_service_name VARCHAR,
  p_therapist_id VARCHAR,
  p_therapist_name VARCHAR,
  p_booking_date DATE,
  p_booking_time VARCHAR,
  p_duration VARCHAR,
  p_total_price NUMERIC,
  p_customer_name VARCHAR,
  p_customer_phone VARCHAR,
  p_customer_email VARCHAR,
  p_payment_method VARCHAR DEFAULT 'pay_at_spa',
  p_notes TEXT DEFAULT NULL,
  p_buffer_minutes INT DEFAULT 15
)
RETURNS JSONB AS $$
DECLARE
  v_assigned_therapist_id VARCHAR;
  v_assigned_therapist_name VARCHAR;
  v_booking_ref VARCHAR;
  v_booking_id VARCHAR;
  v_lock_key BIGINT;
  v_result JSONB;
BEGIN
  -- A. Prevent Past Bookings
  IF p_booking_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Invalid reservation date: Cannot book appointments in the past.';
  END IF;

  -- B. Resolve "Any Specialist" to an available therapist if requested
  IF p_therapist_id IS NULL OR p_therapist_id = 'any' OR LOWER(p_therapist_id) LIKE '%any%' THEN
    SELECT id, name INTO v_assigned_therapist_id, v_assigned_therapist_name
    FROM therapists t
    WHERE t.business_id = p_business_id
      AND t.is_active = true
      AND NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.business_id = p_business_id
          AND b.therapist_id = t.id
          AND b.booking_date = p_booking_date
          AND b.booking_time = p_booking_time
          AND b.booking_status IN ('pending', 'confirmed')
      )
    ORDER BY (
      SELECT COUNT(*) FROM bookings bk 
      WHERE bk.therapist_id = t.id AND bk.booking_date = p_booking_date AND bk.booking_status IN ('pending', 'confirmed')
    ) ASC
    LIMIT 1;

    IF v_assigned_therapist_id IS NULL THEN
      RAISE EXCEPTION 'No therapists are available on % at %. Please select another slot.', p_booking_date, p_booking_time;
    END IF;
  ELSE
    v_assigned_therapist_id := p_therapist_id;
    v_assigned_therapist_name := p_therapist_name;
  END IF;

  -- C. Transaction-level Advisory Lock (prevents race condition when 2 clients book simultaneously)
  v_lock_key := ('x' || substr(md5(p_business_id::text || ':' || v_assigned_therapist_id || ':' || p_booking_date::text || ':' || p_booking_time), 1, 15))::bit(64)::bigint;
  PERFORM pg_advisory_xact_lock(v_lock_key);

  -- D. Server-side Conflict Guard
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE business_id = p_business_id
      AND therapist_id = v_assigned_therapist_id
      AND booking_date = p_booking_date
      AND booking_time = p_booking_time
      AND booking_status IN ('pending', 'confirmed')
  ) THEN
    RAISE EXCEPTION 'Double-Booking Conflict: Specialist % is already booked for % on %.', v_assigned_therapist_name, p_booking_time, p_booking_date;
  END IF;

  -- E. Generate Unique Reference and ID
  v_booking_ref := 'LL-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::text, 4, '0');
  v_booking_id := 'bk-' || EXTRACT(EPOCH FROM NOW())::bigint || '-' || LPAD(FLOOR(RANDOM() * 900 + 100)::text, 3, '0');

  -- F. Insert Booking Record
  INSERT INTO bookings (
    id,
    business_id,
    booking_reference,
    customer_name,
    customer_phone,
    customer_email,
    service_id,
    service_name,
    therapist_id,
    therapist_name,
    booking_date,
    booking_time,
    duration,
    buffer_minutes,
    total_price,
    booking_status,
    payment_status,
    payment_method,
    notes,
    created_at,
    updated_at
  ) VALUES (
    v_booking_id,
    p_business_id,
    v_booking_ref,
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_service_id,
    p_service_name,
    v_assigned_therapist_id,
    v_assigned_therapist_name,
    p_booking_date,
    p_booking_time,
    p_duration,
    p_buffer_minutes,
    p_total_price,
    'pending',
    'unpaid',
    p_payment_method,
    p_notes,
    NOW(),
    NOW()
  );

  -- G. Upsert Customer Record
  INSERT INTO customers (
    business_id,
    name,
    phone,
    email,
    notes,
    total_bookings,
    total_spent,
    last_visit,
    created_at,
    updated_at
  ) VALUES (
    p_business_id,
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_notes,
    1,
    p_total_price,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (business_id, email) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    total_bookings = customers.total_bookings + 1,
    total_spent = customers.total_spent + EXCLUDED.total_spent,
    last_visit = NOW(),
    updated_at = NOW();

  -- H. Return the created booking
  SELECT to_jsonb(b) INTO v_result
  FROM bookings b
  WHERE b.id = v_booking_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Atomic Reschedule RPC
CREATE OR REPLACE FUNCTION reschedule_spa_appointment(
  p_booking_id VARCHAR,
  p_new_date DATE,
  p_new_time VARCHAR,
  p_new_therapist_id VARCHAR DEFAULT NULL,
  p_new_therapist_name VARCHAR DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_booking RECORD;
  v_target_therapist_id VARCHAR;
  v_target_therapist_name VARCHAR;
  v_lock_key BIGINT;
  v_result JSONB;
BEGIN
  -- A. Fetch existing booking
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found with id: %', p_booking_id;
  END IF;

  -- B. Prevent rescheduling to past
  IF p_new_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Cannot reschedule to a past date.';
  END IF;

  v_target_therapist_id := COALESCE(p_new_therapist_id, v_booking.therapist_id);
  v_target_therapist_name := COALESCE(p_new_therapist_name, v_booking.therapist_name);

  -- C. Transaction Lock
  v_lock_key := ('x' || substr(md5(v_booking.business_id::text || ':' || v_target_therapist_id || ':' || p_new_date::text || ':' || p_new_time), 1, 15))::bit(64)::bigint;
  PERFORM pg_advisory_xact_lock(v_lock_key);

  -- D. Conflict Check
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE business_id = v_booking.business_id
      AND therapist_id = v_target_therapist_id
      AND booking_date = p_new_date
      AND booking_time = p_new_time
      AND id != p_booking_id
      AND booking_status IN ('pending', 'confirmed')
  ) THEN
    RAISE EXCEPTION 'Slot is already booked for specialist % on % at %.', v_target_therapist_name, p_new_date, p_new_time;
  END IF;

  -- E. Update Booking
  UPDATE bookings SET
    booking_date = p_new_date,
    booking_time = p_new_time,
    therapist_id = v_target_therapist_id,
    therapist_name = v_target_therapist_name,
    booking_status = 'confirmed',
    updated_at = NOW()
  WHERE id = p_booking_id;

  SELECT to_jsonb(b) INTO v_result
  FROM bookings b
  WHERE b.id = p_booking_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

