// ==============================================================================
// SUPABASE EDGE FUNCTION: LUXURY SPA AUTOMATIC EMAIL NOTIFICATION DISPATCHER
// Powered by Resend (Server-Side, Bank-Grade Secret Storage)
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  type: "booking_created" | "booking_confirmed" | "booking_cancelled" | "booking_rescheduled" | "test_email";
  booking?: {
    id: string;
    booking_reference: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_name: string;
    therapist_name: string;
    booking_date: string;
    booking_time: string;
    duration?: string;
    total_price: number;
    payment_status?: string;
    payment_method?: string;
    notes?: string;
    business_id?: string;
  };
  settings?: {
    business_name?: string;
    business_id?: string;
    primary_phone?: string;
    whatsapp_number?: string;
    currency_symbol?: string;
    address_line1?: string;
    city?: string;
    admin_alert_email?: string;
    email_sender_name?: string;
    email_sender_address?: string;
    is_email_notifications_enabled?: boolean;
  };
  meta?: {
    reason?: string;
    previousDetails?: {
      date: string;
      time: string;
    };
    testRecipient?: string;
  };
  idempotencyKey?: string;
}

// ------------------------------------------------------------------------------
// 1. LUXURY HTML EMAIL TEMPLATE GENERATORS
// ------------------------------------------------------------------------------

function renderCustomerCreatedEmail(booking: any, settings: any): string {
  const brand = settings?.business_name || "Lotus Luxe Spa & Wellness";
  const currency = settings?.currency_symbol || "₹";
  const address = `${settings?.address_line1 || "Aerocity Mahipalpur"}, ${settings?.city || "New Delhi"}`;
  const phone = settings?.primary_phone || "+91 98765 43210";
  const whatsapp = settings?.whatsapp_number || "919876543210";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Reservation at ${brand}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #07090e; color: #e5e5e5; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #0e121b; border: 1px solid #d4af37; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #161b26, #0e121b); padding: 32px; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.3); }
    .title { color: #d4af37; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; }
    .subtitle { color: #9e9da6; font-size: 13px; text-transform: uppercase; margin-top: 6px; letter-spacing: 1px; }
    .body { padding: 32px; }
    .recap-box { background-color: #141924; border: 1px solid #222938; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1c2230; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { color: #8e94a5; }
    .val { color: #ffffff; font-weight: 600; }
    .gold-val { color: #d4af37; font-weight: bold; }
    .footer { padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #1c2230; }
    .btn { display: inline-block; background: linear-gradient(135deg, #d4af37, #aa8214); color: #07080a; text-decoration: none; font-weight: bold; padding: 12px 28px; border-radius: 30px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">${brand}</h1>
      <p class="subtitle">Reservation Received • Ref: ${booking.booking_reference}</p>
    </div>
    <div class="body">
      <p>Dear <strong>${booking.customer_name}</strong>,</p>
      <p>Thank you for choosing ${brand}. Your private royal suite reservation has been successfully placed into our scheduling queue.</p>
      
      <div class="recap-box">
        <div class="row"><span class="label">Booking Reference</span><span class="gold-val">${booking.booking_reference}</span></div>
        <div class="row"><span class="label">Treatment</span><span class="val">${booking.service_name}</span></div>
        <div class="row"><span class="label">Specialist</span><span class="val">${booking.therapist_name}</span></div>
        <div class="row"><span class="label">Appointment Schedule</span><span class="val">${booking.booking_date} at ${booking.booking_time}</span></div>
        <div class="row"><span class="label">Session Duration</span><span class="val">${booking.duration || "60 Mins"}</span></div>
        <div class="row"><span class="label">Total Investment</span><span class="gold-val">${currency} ${Number(booking.total_price).toLocaleString()}</span></div>
        <div class="row"><span class="label">Payment Option</span><span class="val">${(booking.payment_method || "pay_at_spa").toUpperCase()}</span></div>
      </div>

      <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6;">
        <strong>Sanctuary Location:</strong> ${address}<br>
        <strong>24/7 Concierge:</strong> ${phone}<br>
        <em>Complimentary secure valet parking is provided upon arrival.</em>
      </p>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://wa.me/${whatsapp}" class="btn">Connect with Concierge on WhatsApp</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${brand}. All rights reserved.</p>
      <p>Need to adjust your reservation? Contact our concierge at least 2 hours prior to your scheduled slot.</p>
    </div>
  </div>
</body>
</html>`;
}

function renderCustomerConfirmedEmail(booking: any, settings: any): string {
  const brand = settings?.business_name || "Lotus Luxe Spa & Wellness";
  const currency = settings?.currency_symbol || "₹";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Suite Confirmed - ${brand}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #07090e; color: #e5e5e5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0e121b; border: 1px solid #10b981; border-radius: 16px; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background: #064e3b; color: #34d399; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
        Appointment Confirmed & Suite Prepared
      </span>
      <h2 style="color: #34d399; margin: 12px 0 0 0;">Your Suite is Confirmed</h2>
      <p style="color: #9ca3af; font-size: 13px;">Booking Ref: <strong>${booking.booking_reference}</strong></p>
    </div>

    <p>Dear <strong>${booking.customer_name}</strong>,</p>
    <p>Our senior concierge has confirmed your appointment. Specialist <strong>${booking.therapist_name}</strong> is reserved and preparing the private suite for your session.</p>

    <div style="background-color: #141924; border: 1px solid #222938; border-radius: 12px; padding: 18px; margin: 20px 0;">
      <p style="margin: 6px 0; color: #d1d5db;"><strong>Treatment:</strong> ${booking.service_name}</p>
      <p style="margin: 6px 0; color: #d1d5db;"><strong>Schedule:</strong> ${booking.booking_date} at ${booking.booking_time}</p>
      <p style="margin: 6px 0; color: #d1d5db;"><strong>Specialist:</strong> ${booking.therapist_name}</p>
      <p style="margin: 6px 0; color: #34d399; font-weight: bold;"><strong>Investment:</strong> ${currency} ${Number(booking.total_price).toLocaleString()}</p>
    </div>

    <p style="font-size: 12px; color: #9ca3af;">Please arrive 10 minutes prior to your slot to enjoy our complimentary welcome herbal infusion.</p>
  </div>
</body>
</html>`;
}

function renderCustomerCancelledEmail(booking: any, settings: any, reason?: string): string {
  const brand = settings?.business_name || "Lotus Luxe Spa";
  const phone = settings?.primary_phone || "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reservation Cancellation</title></head>
<body style="font-family: Arial, sans-serif; background-color: #07090e; color: #e5e5e5; padding: 20px;">
  <div style="max-width: 550px; margin: 0 auto; background-color: #0e121b; border: 1px solid #ef4444; border-radius: 12px; padding: 28px;">
    <h2 style="color: #ef4444; margin-top: 0;">Reservation Cancellation Notice</h2>
    <p>Dear ${booking.customer_name},</p>
    <p>Your appointment <strong>${booking.booking_reference}</strong> for <strong>${booking.service_name}</strong> on <strong>${booking.booking_date} at ${booking.booking_time}</strong> has been cancelled.</p>
    ${reason ? `<div style="background: #181114; border-left: 3px solid #ef4444; padding: 10px 14px; margin: 16px 0; font-size: 13px; color: #fca5a5;"><strong>Reason:</strong> ${reason}</div>` : ""}
    <p style="font-size: 13px; color: #9ca3af;">If you would like to book an alternate suite or specialist, please visit our website or contact our concierge desk directly at ${phone}.</p>
  </div>
</body>
</html>`;
}

function renderCustomerRescheduledEmail(booking: any, settings: any, prevDetails?: any): string {
  const brand = settings?.business_name || "Lotus Luxe Spa";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Appointment Rescheduled</title></head>
<body style="font-family: Arial, sans-serif; background-color: #07090e; color: #e5e5e5; padding: 20px;">
  <div style="max-width: 550px; margin: 0 auto; background-color: #0e121b; border: 1px solid #d4af37; border-radius: 12px; padding: 28px;">
    <h2 style="color: #d4af37; margin-top: 0;">🗓️ Appointment Rescheduled - ${brand}</h2>
    <p>Dear ${booking.customer_name},</p>
    <p>Your appointment <strong>${booking.booking_reference}</strong> has been successfully rescheduled.</p>
    
    <div style="background-color: #141924; border: 1px solid #222938; border-radius: 10px; padding: 16px; margin: 18px 0;">
      ${prevDetails?.date ? `<p style="margin: 4px 0; color: #9ca3af; text-decoration: line-through; font-size: 13px;">Previous Schedule: ${prevDetails.date} at ${prevDetails.time}</p>` : ""}
      <p style="margin: 6px 0; color: #34d399; font-weight: bold; font-size: 15px;">New Schedule: ${booking.booking_date} at ${booking.booking_time}</p>
      <p style="margin: 4px 0; color: #d4af37;">Specialist: ${booking.therapist_name}</p>
      <p style="margin: 4px 0; color: #d1d5db;">Treatment: ${booking.service_name} (${booking.duration || "60 Mins"})</p>
    </div>

    <p style="font-size: 12px; color: #9ca3af;">Our certified team is looking forward to welcoming you at your updated slot.</p>
  </div>
</body>
</html>`;
}

function renderAdminAlertEmail(booking: any, settings: any, eventType: string, meta?: any): string {
  const brand = settings?.business_name || "Lotus Luxe Spa";
  const currency = settings?.currency_symbol || "₹";

  const eventTitle =
    eventType === "booking_cancelled"
      ? "🚨 Cancellation Alert"
      : eventType === "booking_rescheduled"
      ? "🗓️ Reschedule Alert"
      : "🛎️ New Appointment Alert";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${eventTitle}</title></head>
<body style="font-family: Arial, sans-serif; background: #07090e; color: #eee; padding: 20px;">
  <div style="max-width: 550px; margin: 0 auto; background: #141924; border: 1px solid #d4af37; border-radius: 12px; padding: 24px;">
    <h3 style="color: #d4af37; margin-top: 0;">${eventTitle} - ${brand}</h3>
    
    <div style="background: #0e121b; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; line-height: 1.6;">
      <div><strong>Booking Ref:</strong> ${booking.booking_reference}</div>
      <div><strong>Customer:</strong> ${booking.customer_name}</div>
      <div><strong>Phone:</strong> <a href="tel:${booking.customer_phone}" style="color: #d4af37;">${booking.customer_phone}</a></div>
      <div><strong>Email:</strong> ${booking.customer_email}</div>
      <div><strong>Treatment:</strong> ${booking.service_name} (${booking.duration || "60 Mins"})</div>
      <div><strong>Specialist:</strong> ${booking.therapist_name}</div>
      <div><strong>Schedule:</strong> ${booking.booking_date} at ${booking.booking_time}</div>
      <div><strong>Total Amount:</strong> ${currency} ${Number(booking.total_price).toLocaleString()}</div>
      ${meta?.reason ? `<div style="color: #ef4444;"><strong>Cancellation Reason:</strong> ${meta.reason}</div>` : ""}
      ${meta?.previousDetails?.date ? `<div style="color: #fbbf24;"><strong>Previous Schedule:</strong> ${meta.previousDetails.date} at ${meta.previousDetails.time}</div>` : ""}
      ${booking.notes ? `<div><strong>Customer Notes:</strong> <em>"${booking.notes}"</em></div>` : ""}
    </div>

    <p style="font-size: 12px; color: #9ca3af;">Access your Admin Dashboard to manage or reassign this appointment.</p>
  </div>
</body>
</html>`;
}

// ------------------------------------------------------------------------------
// 2. HTTP SERVER HANDLER
// ------------------------------------------------------------------------------

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { type, booking, settings, meta, idempotencyKey } = payload;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY");

    // Initialize Supabase client for audit logging & idempotency
    const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      : null;

    // 1. Check if email notifications are explicitly disabled in Admin Settings
    if (settings?.is_email_notifications_enabled === false) {
      return new Response(
        JSON.stringify({
          success: true,
          skipped: true,
          reason: "Email notifications are disabled in Admin Settings.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Prevent Duplicate Notifications via Idempotency Key
    if (idempotencyKey && supabase) {
      const { data: existingLog } = await supabase
        .from("notification_logs")
        .select("id, status")
        .eq("idempotency_key", idempotencyKey)
        .eq("status", "sent")
        .maybeSingle();

      if (existingLog) {
        return new Response(
          JSON.stringify({
            success: true,
            skipped: true,
            reason: "Duplicate notification prevented by idempotency guard.",
            existingLogId: existingLog.id,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 3. Sender Identity Configuration
    const senderName = settings?.email_sender_name || "Lotus Luxe Spa";
    // Default to onboarding@resend.dev for zero-config testing if custom domain not verified
    const senderEmail = settings?.email_sender_address || "onboarding@resend.dev";
    const fromAddress = `${senderName} <${senderEmail}>`;
    const adminAlertEmail = settings?.admin_alert_email || "concierge@lotusluxespa.com";

    // 4. Handle "test_email" type
    if (type === "test_email") {
      const targetEmail = meta?.testRecipient || adminAlertEmail;
      if (!RESEND_API_KEY) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "RESEND_API_KEY is not configured in Supabase secrets.",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [targetEmail],
          subject: `✓ Connectivity Test: ${senderName}`,
          html: `<div style="font-family: Arial; padding: 20px; background: #07090e; color: #fff;">
            <h2 style="color: #d4af37;">✓ Email Delivery Verified</h2>
            <p>Your Supabase Edge Function successfully connected to Resend!</p>
            <p>Sender: <strong>${fromAddress}</strong></p>
            <p>Recipient: <strong>${targetEmail}</strong></p>
          </div>`,
        }),
      });

      const resendData = await resendRes.json();
      return new Response(
        JSON.stringify({ success: resendRes.ok, resendData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!booking) {
      return new Response(
        JSON.stringify({ success: false, error: "Booking data is missing." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Select Customer and Admin Email Templates
    let customerSubject = "";
    let customerHtml = "";
    let adminSubject = "";
    let adminHtml = "";

    switch (type) {
      case "booking_created":
        customerSubject = `Appointment Confirmation • Ref: ${booking.booking_reference}`;
        customerHtml = renderCustomerCreatedEmail(booking, settings);
        adminSubject = `🛎️ New Booking: ${booking.booking_reference} - ${booking.customer_name}`;
        adminHtml = renderAdminAlertEmail(booking, settings, type, meta);
        break;

      case "booking_confirmed":
        customerSubject = `✓ Suite Confirmed • Ref: ${booking.booking_reference}`;
        customerHtml = renderCustomerConfirmedEmail(booking, settings);
        break;

      case "booking_cancelled":
        customerSubject = `Cancellation Notice • Ref: ${booking.booking_reference}`;
        customerHtml = renderCustomerCancelledEmail(booking, settings, meta?.reason);
        adminSubject = `🚨 Cancellation: ${booking.booking_reference} - ${booking.customer_name}`;
        adminHtml = renderAdminAlertEmail(booking, settings, type, meta);
        break;

      case "booking_rescheduled":
        customerSubject = `🗓️ Appointment Rescheduled • Ref: ${booking.booking_reference}`;
        customerHtml = renderCustomerRescheduledEmail(booking, settings, meta?.previousDetails);
        adminSubject = `🗓️ Rescheduled: ${booking.booking_reference} - ${booking.customer_name}`;
        adminHtml = renderAdminAlertEmail(booking, settings, type, meta);
        break;

      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }

    // 6. Check if RESEND_API_KEY is available
    if (!RESEND_API_KEY) {
      // Record simulated delivery in notification_logs
      if (supabase && booking.business_id) {
        await supabase.from("notification_logs").insert([
          {
            business_id: booking.business_id,
            booking_id: booking.id,
            booking_reference: booking.booking_reference,
            recipient_email: booking.customer_email,
            recipient_role: "customer",
            notification_type: type,
            subject: customerSubject,
            status: "simulated",
            error_message: "RESEND_API_KEY not configured in Supabase Secrets.",
            idempotency_key: idempotencyKey || `${type}_${booking.id}_cust`,
          },
        ]);
      }

      return new Response(
        JSON.stringify({
          success: true,
          simulated: true,
          message: "Notification logged (RESEND_API_KEY not yet set in Supabase Secrets).",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const dispatchResults: any[] = [];

    // 7. Dispatch Customer Email via Resend
    if (customerHtml && booking.customer_email) {
      try {
        const customerRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [booking.customer_email],
            subject: customerSubject,
            html: customerHtml,
          }),
        });

        const customerResData = await customerRes.json();
        const customerSuccess = customerRes.ok;

        dispatchResults.push({ role: "customer", success: customerSuccess, data: customerResData });

        if (supabase && booking.business_id) {
          await supabase.from("notification_logs").insert([
            {
              business_id: booking.business_id,
              booking_id: booking.id,
              booking_reference: booking.booking_reference,
              recipient_email: booking.customer_email,
              recipient_role: "customer",
              notification_type: type,
              subject: customerSubject,
              status: customerSuccess ? "sent" : "failed",
              provider_message_id: customerResData?.id || null,
              error_message: customerSuccess ? null : customerResData?.message,
              idempotency_key: idempotencyKey ? `${idempotencyKey}_cust` : null,
            },
          ]);
        }
      } catch (err: any) {
        dispatchResults.push({ role: "customer", success: false, error: err.message });
      }
    }

    // 8. Dispatch Admin Notification Email via Resend
    if (adminHtml && adminAlertEmail) {
      try {
        const adminRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [adminAlertEmail],
            subject: adminSubject,
            html: adminHtml,
          }),
        });

        const adminResData = await adminRes.json();
        const adminSuccess = adminRes.ok;

        dispatchResults.push({ role: "admin", success: adminSuccess, data: adminResData });

        if (supabase && booking.business_id) {
          await supabase.from("notification_logs").insert([
            {
              business_id: booking.business_id,
              booking_id: booking.id,
              booking_reference: booking.booking_reference,
              recipient_email: adminAlertEmail,
              recipient_role: "admin",
              notification_type: `${type}_admin`,
              subject: adminSubject,
              status: adminSuccess ? "sent" : "failed",
              provider_message_id: adminResData?.id || null,
              error_message: adminSuccess ? null : adminResData?.message,
              idempotency_key: idempotencyKey ? `${idempotencyKey}_admin` : null,
            },
          ]);
        }
      } catch (err: any) {
        dispatchResults.push({ role: "admin", success: false, error: err.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        dispatches: dispatchResults,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

