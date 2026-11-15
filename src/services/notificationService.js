/**
 * Commercial Spa Notification & Email Templating Service
 * Generates luxury responsive HTML emails for:
 * 1. Customer Booking Confirmation
 * 2. Admin New Booking Alert
 * 3. Booking Cancellation Notice
 * 4. Booking Rescheduled Notice
 * 5. 24-Hour Appointment Reminder
 */

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
const ADMIN_NOTIFICATION_EMAIL = import.meta.env.VITE_ADMIN_ALERT_EMAIL || '';

export const notificationService = {
  /**
   * Check whether real email delivery credentials are configured
   */
  isEmailConfigured() {
    return Boolean(RESEND_API_KEY && RESEND_API_KEY.startsWith('re_'));
  },

  /**
   * 1. Customer Booking Confirmation HTML Template
   */
  renderCustomerConfirmationEmail(booking, settings) {
    const brandName = settings?.business_name || 'Lotus Luxe Spa & Wellness';
    const currency = settings?.currency_symbol || '₹';
    const address = `${settings?.address_line1 || ''}, ${settings?.city || ''}`;
    const phone = settings?.primary_phone || '';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Reservation at ${brandName}</title>
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
    .badge { display: inline-block; background: #25d366; color: #000; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 11px; }
    .footer { padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #1c2230; }
    .btn { display: inline-block; background: linear-gradient(135deg, #d4af37, #aa8214); color: #07080a; text-decoration: none; font-weight: bold; padding: 12px 28px; border-radius: 30px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">${brandName}</h1>
      <p class="subtitle">Appointment Confirmation • Ref: ${booking.booking_reference}</p>
    </div>
    <div class="body">
      <p>Dear <strong>${booking.customer_name}</strong>,</p>
      <p>Your royal suite reservation has been successfully placed. Our wellness team is preparing your private suite for an exquisite experience.</p>
      
      <div class="recap-box">
        <div class="row"><span class="label">Booking Reference</span><span class="gold-val">${booking.booking_reference}</span></div>
        <div class="row"><span class="label">Treatment</span><span class="val">${booking.service_name}</span></div>
        <div class="row"><span class="label">Dedicated Specialist</span><span class="val">${booking.therapist_name}</span></div>
        <div class="row"><span class="label">Appointment Date</span><span class="val">${booking.booking_date}</span></div>
        <div class="row"><span class="label">Reserved Time</span><span class="val">${booking.booking_time}</span></div>
        <div class="row"><span class="label">Session Duration</span><span class="val">${booking.duration || '60 Mins'}</span></div>
        <div class="row"><span class="label">Investment</span><span class="gold-val">${currency} ${Number(booking.total_price).toLocaleString()}</span></div>
        <div class="row"><span class="label">Payment Status</span><span class="val">${(booking.payment_status || 'unpaid').toUpperCase()} (${booking.payment_method || 'pay_at_spa'})</span></div>
      </div>

      <p style="font-size: 13px; color: #a1a1aa;">
        <strong>Sanctuary Address:</strong> ${address}<br>
        <strong>Concierge Desk:</strong> ${phone}<br>
        <em>Complimentary secure valet parking is provided upon arrival.</em>
      </p>

      <div style="text-align: center;">
        <a href="https://wa.me/${settings?.whatsapp_number || ''}" class="btn">Connect via WhatsApp</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
      <p>To reschedule or adjust suite preferences, please contact our concierge at least 2 hours prior to your slot.</p>
    </div>
  </div>
</body>
</html>
    `;
  },

  /**
   * 2. Admin New Booking Alert
   */
  renderAdminNewBookingEmail(booking, settings) {
    const brandName = settings?.business_name || 'Lotus Luxe Spa';

    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Booking: ${booking.booking_reference}</title></head>
<body style="font-family: Arial, sans-serif; background: #111; color: #eee; padding: 20px;">
  <div style="max-width: 550px; margin: 0 auto; background: #1c1f26; border: 1px solid #d4af37; border-radius: 12px; padding: 24px;">
    <h2 style="color: #d4af37; margin-top: 0;">🛎️ New Appointment Alert - ${brandName}</h2>
    <p>A new reservation was placed on the website:</p>
    <ul>
      <li><strong>Ref:</strong> ${booking.booking_reference}</li>
      <li><strong>Customer:</strong> ${booking.customer_name} (${booking.customer_phone} / ${booking.customer_email})</li>
      <li><strong>Service:</strong> ${booking.service_name}</li>
      <li><strong>Therapist:</strong> ${booking.therapist_name}</li>
      <li><strong>Schedule:</strong> ${booking.booking_date} at ${booking.booking_time} (${booking.duration || '60 Mins'})</li>
      <li><strong>Amount:</strong> ${settings?.currency_symbol || '₹'} ${booking.total_price}</li>
      <li><strong>Notes:</strong> ${booking.notes || 'None'}</li>
    </ul>
    <p><a href="/admin/bookings" style="color: #d4af37; font-weight: bold;">Review in Admin Panel &rarr;</a></p>
  </div>
</body>
</html>
    `;
  },

  /**
   * 3. Booking Cancellation Email
   */
  renderBookingCancellationEmail(booking, settings, reason) {
    const brandName = settings?.business_name || 'Lotus Luxe Spa';

    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reservation Cancellation</title></head>
<body style="font-family: Arial, sans-serif; background: #07090e; color: #e5e5e5; padding: 20px;">
  <div style="max-width: 550px; margin: 0 auto; background: #0e121b; border: 1px solid #ef4444; border-radius: 12px; padding: 24px;">
    <h2 style="color: #ef4444; margin-top: 0;">Reservation Cancellation Notice</h2>
    <p>Dear ${booking.customer_name},</p>
    <p>Your appointment <strong>${booking.booking_reference}</strong> for <strong>${booking.service_name}</strong> on <strong>${booking.booking_date} at ${booking.booking_time}</strong> has been cancelled.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>If you would like to book an alternate suite or time, please visit our website or contact our 24/7 concierge at ${settings?.primary_phone || ''}.</p>
  </div>
</body>
</html>
    `;
  },

  /**
   * 4. Booking Rescheduled Notice
   */
  renderBookingRescheduledEmail(booking, previousDetails, settings) {
    const brandName = settings?.business_name || 'Lotus Luxe Spa';

    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Appointment Rescheduled</title></head>
<body style="font-family: Arial, sans-serif; background: #07090e; color: #e5e5e5; padding: 20px;">
  <div style="max-width: 550px; margin: 0 auto; background: #0e121b; border: 1px solid #d4af37; border-radius: 12px; padding: 24px;">
    <h2 style="color: #d4af37; margin-top: 0;">🗓️ Appointment Rescheduled - ${brandName}</h2>
    <p>Dear ${booking.customer_name},</p>
    <p>Your appointment <strong>${booking.booking_reference}</strong> has been successfully rescheduled.</p>
    
    <div style="background-color: #141924; border: 1px solid #222938; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 4px 0; color: #9ca3af; text-decoration: line-through;">Previous: ${previousDetails.date} at ${previousDetails.time}</p>
      <p style="margin: 4px 0; color: #34d399; font-weight: bold; font-size: 15px;">New Schedule: ${booking.booking_date} at ${booking.booking_time}</p>
      <p style="margin: 4px 0; color: #d4af37;">Specialist: ${booking.therapist_name}</p>
      <p style="margin: 4px 0; color: #d1d5db;">Treatment: ${booking.service_name}</p>
    </div>

    <p style="font-size: 13px; color: #a1a1aa;">
      Need further adjustments? Call our concierge desk at ${settings?.primary_phone || ''}.
    </p>
  </div>
</body>
</html>
    `;
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
   * Dispatch notification (logs to console/service and records in notification logs)
   */
  async sendNotification(type, booking, settings, meta = {}) {
    const isConfigured = this.isEmailConfigured();

    if (!isConfigured) {
      console.info(
        `[Notification Service Notice] Email credentials (VITE_RESEND_API_KEY) are not set in .env. ` +
        `Simulating ${type} notification dispatch for ref ${booking?.booking_reference || booking?.id} to ${booking?.customer_email}. ` +
        `To enable live external email delivery, set VITE_RESEND_API_KEY and VITE_ADMIN_ALERT_EMAIL in .env.`
      );
      return {
        success: true,
        simulated: true,
        message: 'Email logged (unconfigured credentials mode). Live delivery requires VITE_RESEND_API_KEY.',
        timestamp: new Date().toISOString()
      };
    }

    try {
      // If Resend API key is available, call Edge Function or API endpoint
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: `${settings?.business_name || 'Lotus Luxe Spa'} <noreply@lotusluxespa.com>`,
          to: [booking.customer_email],
          subject:
            type === 'cancellation'
              ? `Cancelled: ${booking.booking_reference}`
              : type === 'reschedule'
              ? `Rescheduled: ${booking.booking_reference}`
              : `Confirmed: ${booking.booking_reference}`,
          html:
            type === 'cancellation'
              ? this.renderBookingCancellationEmail(booking, settings, meta.reason)
              : type === 'reschedule'
              ? this.renderBookingRescheduledEmail(booking, meta.previousDetails, settings)
              : this.renderCustomerConfirmationEmail(booking, settings)
        })
      });

      return { success: response.ok, timestamp: new Date().toISOString() };
    } catch (err) {
      console.error('[Notification Service] Failed to send real email via provider:', err);
      return { success: false, error: err.message };
    }
  }
};
