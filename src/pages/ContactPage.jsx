import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Send,
  Navigation
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useBooking } from '../context/BookingContext';
import SectionHeader from '../components/common/SectionHeader';
import Button from '../components/common/Button';

export default function ContactPage() {
  const { settings, generateWhatsAppLink } = useSettings();
  const { services, therapists } = useBooking();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: services?.[0]?.name || 'Russian Banya Ritual',
    therapist: 'Any Available Specialist',
    date: '',
    time: '02:00 PM',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState('');

  useEffect(() => {
    document.title = `Contact Us & Book Appointments | ${settings?.business_name || 'Lotus Luxe Spa'}`;
    window.scrollTo(0, 0);

    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData((prev) => ({
      ...prev,
      date: prev.date || tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+-\s()]{7,16}$/.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid phone number.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.service) errs.service = 'Please select a treatment.';
    if (!formData.date) errs.date = 'Please pick a preferred date.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const waUrl = generateWhatsAppLink({
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      therapist: formData.therapist,
      date: formData.date,
      time: formData.time,
      notes: formData.notes
    });

    setSubmittedWhatsAppUrl(waUrl);
    setIsSubmitted(true);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
    '08:30 PM',
    '10:00 PM',
    '11:30 PM',
    '01:00 AM (24/7 Layover)',
    '03:00 AM (24/7 Layover)'
  ];

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Concierge & Reservations"
          title="Contact Lotus Luxe Spa"
          subtitle="Reserve your private luxury suite or connect with our 24/7 concierge desk. Located near Delhi IGI Airport Aerocity with complimentary valet parking."
        />

        {/* 4 Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Direct Phone */}
          <div className="p-6 rounded-2xl bg-[#0e121c] border border-stone-800 hover:border-gold-500/40 transition-colors shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-4 shadow-gold-sm">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
              Call Concierge
            </span>
            <a
              href={`tel:${settings?.phone_tel || settings?.phone || ''}`}
              className="text-base font-bold text-stone-100 hover:text-gold-300 transition-colors block"
            >
              {settings?.phone || '+91 98765 43210'}
            </a>
            <span className="text-xs text-stone-400 mt-1 block font-light">
              24/7 Direct Line & Layover Booking
            </span>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="p-6 rounded-2xl bg-[#0e121c] border border-stone-800 hover:border-emerald-500/40 transition-colors shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
              WhatsApp Concierge
            </span>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-stone-100 hover:text-emerald-400 transition-colors block"
            >
              +{settings?.whatsapp_number || '919876543210'}
            </a>
            <span className="text-xs text-stone-400 mt-1 block font-light">
              Instant Chat & Suite Inquiries
            </span>
          </div>

          {/* Card 3: Email */}
          <div className="p-6 rounded-2xl bg-[#0e121c] border border-stone-800 hover:border-gold-500/40 transition-colors shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-4 shadow-gold-sm">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
              Email Reservations
            </span>
            <a
              href={`mailto:${settings?.email || 'concierge@lotusluxespa.com'}`}
              className="text-sm font-bold text-stone-100 hover:text-gold-300 transition-colors block truncate"
            >
              {settings?.email || 'concierge@lotusluxespa.com'}
            </a>
            <span className="text-xs text-stone-400 mt-1 block font-light">
              Corporate & VIP Enquiries
            </span>
          </div>

          {/* Card 4: Hours & Valet */}
          <div className="p-6 rounded-2xl bg-[#0e121c] border border-stone-800 hover:border-gold-500/40 transition-colors shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-4 shadow-gold-sm">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
              Operating Hours
            </span>
            <span className="text-base font-bold text-stone-100 block">
              Open 24 Hours / 7 Days
            </span>
            <span className="text-xs text-gold-400 mt-1 block font-light">
              Complimentary Valet Parking
            </span>
          </div>
        </div>

        {/* Main Grid: Interactive Booking Form + Map & Address */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#0f131f] border border-gold-500/30 p-8 sm:p-10 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-800">
              <div className="w-10 h-10 rounded-full bg-gold-500/15 text-gold-400 flex items-center justify-center border border-gold-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-100">
                  Appointment Reservation Form
                </h3>
                <p className="text-xs text-stone-400 font-light">
                  Generates an immediate WhatsApp booking for priority scheduling.
                </p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="text-center py-10 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-2xl font-serif font-bold text-stone-100 mb-2">
                    Booking Request Prepared!
                  </h4>
                  <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-gold-400 font-semibold">{formData.name}</span>. Your reservation for <span className="text-gold-400 font-semibold">{formData.service}</span> on <span className="text-gold-400 font-semibold">{formData.date} at {formData.time}</span> has been compiled.
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    href={submittedWhatsAppUrl}
                    target="_blank"
                    variant="whatsapp"
                    size="md"
                    icon={MessageCircle}
                  >
                    Open WhatsApp Chat
                  </Button>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="gold-outline"
                    size="md"
                  >
                    Submit Another Request
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                      Guest Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Kapoor"
                        className={`w-full bg-[#141824] border rounded-xl pl-10 pr-3.5 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 ${
                          errors.name ? 'border-red-500 focus:ring-red-500' : 'border-stone-700 focus:border-gold-400 focus:ring-gold-400'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={`w-full bg-[#141824] border rounded-xl pl-10 pr-3.5 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 ${
                          errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-stone-700 focus:border-gold-400 focus:ring-gold-400'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="guest@example.com"
                      className={`w-full bg-[#141824] border rounded-xl pl-10 pr-3.5 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-700 focus:border-gold-400 focus:ring-gold-400'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>

                {/* Service & Therapist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                      Select Service *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#141824] border border-stone-700 rounded-xl px-3.5 py-3 text-sm text-stone-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                    >
                      {(services || []).map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} — ₹{s.price} ({s.duration})
                        </option>
                      ))}
                      <option value="Imperial Slavic Banya Retreat">Imperial Slavic Banya Retreat (₹4,999)</option>
                      <option value="Royal Couples Nirvana Suite">Royal Couples Nirvana Suite (₹8,999)</option>
                      <option value="Executive Jetlag Reset">Executive Jetlag Reset (₹3,899)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                      Preferred Therapist
                    </label>
                    <select
                      value={formData.therapist}
                      onChange={(e) => setFormData({ ...formData, therapist: e.target.value })}
                      className="w-full bg-[#141824] border border-stone-700 rounded-xl px-3.5 py-3 text-sm text-stone-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                    >
                      <option value="Any Available Specialist">Any Certified Specialist</option>
                      <optgroup label="Russian Therapists">
                        {(therapists || []).filter(t => t.category?.includes('Russian')).map(t => (
                          <option key={t.id} value={`${t.name} (Russian)`}>{t.name} — {t.specialization}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Indian Therapists">
                        {(therapists || []).filter(t => t.category?.includes('Indian')).map(t => (
                          <option key={t.id} value={`${t.name} (Indian)`}>{t.name} — {t.specialization}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full bg-[#141824] border rounded-xl px-3.5 py-3 text-sm text-stone-100 focus:outline-none focus:ring-1 ${
                        errors.date ? 'border-red-500 focus:ring-red-500' : 'border-stone-700 focus:border-gold-400 focus:ring-gold-400'
                      }`}
                    />
                    {errors.date && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                      Time Slot
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-[#141824] border border-stone-700 rounded-xl px-3.5 py-3 text-sm text-stone-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts}>{ts}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message / Flight Layover Notes */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                    Special Requests / Layover Details (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Provide any specific focus areas, couple suite preference, or arrival details..."
                    className="w-full bg-[#141824] border border-stone-700 rounded-xl p-3.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    fullWidth
                    size="lg"
                    icon={MessageCircle}
                  >
                    Confirm & Send WhatsApp Booking
                  </Button>
                  <p className="text-xs text-stone-500 text-center mt-2.5">
                    Zero payment required now. Our concierge will confirm availability within minutes.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Location & Map Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f131f] border border-stone-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-5">
              <h3 className="text-xl font-serif font-bold text-stone-100">
                Flagship Sanctuary Details
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-200 block">
                      {settings?.business_name || 'Lotus Luxe Spa'}
                    </strong>
                    <span className="text-stone-400 text-xs">
                      {settings?.address || 'Mahipalpur Aerocity, New Delhi'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                  <span className="text-stone-300 font-medium">
                    {settings?.opening_hours || 'Open 24 Hours / 7 Days'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                  <a
                    href={`tel:${settings?.phone_tel || settings?.phone || ''}`}
                    className="text-stone-200 hover:text-gold-400 font-semibold"
                  >
                    {settings?.phone || '+91 98765 43210'}
                  </a>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Button
                  href={settings?.google_maps_url || 'https://maps.google.com'}
                  target="_blank"
                  variant="gold-outline"
                  fullWidth
                  size="md"
                  icon={Navigation}
                >
                  Open in Google Maps
                </Button>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="h-72 rounded-3xl overflow-hidden border border-stone-800 shadow-xl relative">
              <iframe
                title="Spa Map Location"
                src={settings?.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14018.665780590886!2d77.11894474720993!3d28.549747377038593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1c3a647900b7%3A0xa645089e5a8fcb14!2sMahipalpur%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter invert-[90%] hue-rotate-180 contrast-125"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
