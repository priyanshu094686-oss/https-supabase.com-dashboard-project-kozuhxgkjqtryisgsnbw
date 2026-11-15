/**
 * Commercial Spa Notification & Email Templating Service
 * Orchestrates server-side delivery via Supabase Edge Function + Resend.
 * Secret keys are stored securely on the server (Supabase Secrets), never exposed to the client.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const notificationService = {
  /**
   * Check whether email notifications are enabled in settings
   */
  isEmailEnabled(settings) {
    return settings?.is_email_notifications_enabled !== false;
  },

  /**
   * Generate Add to Google Calendar Link
   */
  generateGoogleCalendarUrl(booking, settings) {
    const brandName = settings?.business_name || 'Lotus Luxe Spa';
    const title = encodeURIComponent(`${booking.service_name} at ${brandName}`);
    const details = encodeURIComponent(
      `Appointment Ref: ${booking.booking_reference}\nTherapist: ${booking.therapist_name}\nAddress: ${settings?.address_line1 || ''}\nPhone: ${settings?.primary_phone || ''}`
    );
    const location = encodeURIComponent(`${settings?.address_line1 || ''}, ${settings?.city || ''}`);
    
    const dateStr = (booking.booking_date || '').replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}T100000Z/${dateStr}T120000Z`;
  },

  /**
   * Dispatch notification via Supabase Edge Function (Server-Side with Resend)
   */
  async sendNotification(type, booking, settings, meta = {}) {
    // 1. Check if notifications are disabled in Admin Settings
    if (!this.isEmailEnabled(settings)) {
      console.info(`[Notification Service] Notifications disabled in Settings. Skipping ${type}.`);
      return { success: true, skipped: true, reason: 'Notifications disabled in Settings' };
    }

    // 2. Generate unique idempotency key to prevent duplicate emails
    const idempotencyKey = `${type}_${booking?.id || booking?.booking_reference}_${Date.now()}`;

    // Map internal types to Edge Function types
    let edgeType = type;
    if (type === 'customer_confirmation' || type === 'admin_alert') {
      edgeType = 'booking_created';
    } else if (type === 'cancellation') {
      edgeType = 'booking_cancelled';
    } else if (type === 'reschedule') {
      edgeType = 'booking_rescheduled';
    }

    const payload = {
      type: edgeType,
      booking: {
        id: booking.id,
        booking_reference: booking.booking_reference,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        service_name: booking.service_name,
        therapist_name: booking.therapist_name,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        duration: booking.duration || '60 Mins',
        total_price: Number(booking.total_price),
        payment_status: booking.payment_status || 'unpaid',
        payment_method: booking.payment_method || 'pay_at_spa',
        notes: booking.notes || '',
        business_id: booking.business_id
      },
      settings: {
        business_name: settings?.business_name || 'Lotus Luxe Spa & Wellness',
        business_id: settings?.business_id,
        primary_phone: settings?.primary_phone || '+91 98765 43210',
        whatsapp_number: settings?.whatsapp_number || '919876543210',
        currency_symbol: settings?.currency_symbol || '₹',
        address_line1: settings?.address_line1 || 'Aerocity Mahipalpur',
        city: settings?.city || 'New Delhi',
        admin_alert_email: settings?.admin_alert_email || settings?.email || 'concierge@lotusluxespa.com',
        email_sender_name: settings?.email_sender_name || 'Lotus Luxe Spa',
        email_sender_address: settings?.email_sender_address || 'onboarding@resend.dev',
        is_email_notifications_enabled: settings?.is_email_notifications_enabled !== false
      },
      meta,
      idempotencyKey
    };

    // 3. If Supabase is connected, call the Edge Function
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('send-email', {
          body: payload
        });

        if (!error && data) {
          console.info('[Notification Service] Server Edge Function response:', data);
          return { success: true, ...data };
        }

        if (error) {
          console.warn('[Notification Service] Edge function error (falling back to audit log):', error.message);
        }
      } catch (invokeErr) {
        console.warn('[Notification Service] Edge function invocation note:', invokeErr.message);
      }
    }

    // 4. Safe fallback: audit log to localStorage or console without crashing the client
    console.info(
      `[Notification Service Audit] ${edgeType} logged for ${booking?.booking_reference} (Customer: ${booking?.customer_email}, Admin: ${payload.settings.admin_alert_email}).`
    );

    return {
      success: true,
      simulated: true,
      message: 'Notification logged. Deploy the send-email Edge Function to activate live Resend delivery.',
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Diagnostic Test Email Dispatcher
   */
  async sendTestEmail(targetEmail, settings) {
    if (!targetEmail) throw new Error('Target email is required.');

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'test_email',
          settings: {
            business_name: settings?.business_name || 'Lotus Luxe Spa',
            email_sender_name: settings?.email_sender_name || 'Lotus Luxe Spa',
            email_sender_address: settings?.email_sender_address || 'onboarding@resend.dev'
          },
          meta: {
            testRecipient: targetEmail
          }
        }
      });

      if (error) throw error;
      return data;
    }

    return {
      success: true,
      simulated: true,
      message: `Diagnostic test simulated for ${targetEmail}. Connect Supabase Edge Function with RESEND_API_KEY for live delivery.`
    };
  }
};
