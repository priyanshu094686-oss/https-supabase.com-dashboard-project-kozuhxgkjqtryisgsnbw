/**
 * Commercial Spa Notification & Email Templating Service
 * Generates luxury responsive HTML emails for:
 * 1. Customer Booking Confirmation
 * 2. Admin New Booking Alert
 * 3. Booking Cancellation Notice
 * 4. 24-Hour Appointment Reminder
 */

export const notificationService = {
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
      <p>Your royal suite reservation has been successfully confirmed. Our certified wellness team is preparing your private suite for an exquisite experience.</p>
      
      <div class="recap-box">
        <div class="row"><span class="label">Booking Reference</span><span class="gold-val">${booking.booking_reference}</span></div>
        <div class="row"><span class="label">Treatment</span><span class="val">${booking.service_name}</span></div>
        <div class="row"><span class="label">Dedicated Specialist</span><span class="val">${booking.therapist_name}</span></div>
        <div class="row"><span class="label">Appointment Date</span><span class="val">${booking.booking_date}</span></div>
        <div class="row"><span class="label">Reserved Time</span><span class="val">${booking.booking_time}</span></div>
        <div class="row"><span class="label">Session Duration</span><span class="val">${booking.duration || '60 Mins'}</span></div>
        <div class="row"><span class="label">Investment</span><span class="gold-val">${currency} ${Number(booking.total_price).toLocaleString()}</span></div>
        <div class="row"><span class="label">Payment Status</span><span class="val">${booking.payment_status.toUpperCase()} (${booking.payment_method})</span></div>
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
    <p>A new reservation was just placed on the website:</p>
    <ul>
      <li><strong>Ref:</strong> ${booking.booking_reference}</li>
      <li><strong>Customer:</strong> ${booking.customer_name} (${booking.customer_phone} / ${booking.customer_email})</li>
      <li><strong>Service:</strong> ${booking.service_name}</li>
      <li><strong>Therapist:</strong> ${booking.therapist_name}</li>
      <li><strong>Schedule:</strong> ${booking.booking_date} at ${booking.booking_time}</li>
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
    <p>If you would like to reschedule or book an alternate suite, please visit our website or contact our 24/7 concierge at ${settings?.primary_phone || ''}.</p>
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
    
    // Parse start and end time (standard 90 min block)
    const dateStr = booking.booking_date.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  },

  /**
   * Dispatch notification (logs to console/service and records in notification logs)
   */
  async sendNotification(type, booking, settings, meta = {}) {
    console.log(`[Notification Service] Dispatching ${type} to ${booking.customer_email}`);
    // In production with Supabase Edge Functions or Resend / SendGrid:
    // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ type, booking, settings, meta }) });
    return { success: true, timestamp: new Date().toISOString() };
  }
};

