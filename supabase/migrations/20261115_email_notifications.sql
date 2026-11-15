-- ==============================================================================
-- STEP 5: AUTOMATIC EMAIL NOTIFICATIONS SCHEMA & AUDIT LOGS (RESEND & EDGE FUNCTIONS)
-- Multi-Tenant Settings, Idempotency Guard, Delivery Audit Trail
-- ==============================================================================

-- 1. Add Email Configuration Columns to business_settings
ALTER TABLE business_settings 
ADD COLUMN IF NOT EXISTS is_email_notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS admin_alert_email VARCHAR(255) DEFAULT 'concierge@lotusluxespa.com',
ADD COLUMN IF NOT EXISTS email_sender_name VARCHAR(255) DEFAULT 'Lotus Luxe Spa & Wellness',
ADD COLUMN IF NOT EXISTS email_sender_address VARCHAR(255) DEFAULT 'onboarding@resend.dev';

-- 2. Create Notification Logs Table (For delivery audit trail & deduplication)
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  booking_id VARCHAR(100),
  booking_reference VARCHAR(50),
  recipient_email VARCHAR(255) NOT NULL,
  recipient_role VARCHAR(50) NOT NULL CHECK (recipient_role IN ('customer', 'admin', 'test')),
  notification_type VARCHAR(100) NOT NULL,
  subject TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'simulated', 'skipped', 'duplicate')),
  provider VARCHAR(50) DEFAULT 'resend',
  provider_message_id TEXT,
  error_message TEXT,
  idempotency_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) for notification_logs
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Notification Logs" ON notification_logs;
DROP POLICY IF EXISTS "Public Read Notification Logs" ON notification_logs;
DROP POLICY IF EXISTS "Admin Manage Notification Logs" ON notification_logs;

CREATE POLICY "Public Insert Notification Logs" ON notification_logs
FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public Read Notification Logs" ON notification_logs
FOR SELECT
TO public, anon, authenticated
USING (true);

CREATE POLICY "Admin Manage Notification Logs" ON notification_logs
FOR ALL
TO authenticated
USING (true);

-- Index for speedy idempotency checking
CREATE INDEX IF NOT EXISTS idx_notification_logs_idempotency ON notification_logs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_notification_logs_booking_ref ON notification_logs(booking_reference);

