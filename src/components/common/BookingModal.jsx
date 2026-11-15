import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Sparkles,
  CheckCircle,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import { notificationService } from '../../services/notificationService';
import Button from './Button';

export default function BookingModal({
  isOpen,
  onClose,
  initialServiceId = '',
  initialTherapistId = ''
}) {
  const { services, therapists, isSlotBooked, createBooking } = useBooking();
  const { settings, formatPrice, generateWhatsAppLink } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_id: '',
    service_name: '',
    therapist_id: 'any',
    therapist_name: 'Any Certified Specialist',
    booking_date: '',
    booking_time: '',
    total_price: 2999,
    duration: '60 Mins',
    notes: '',
    payment_method: 'pay_at_spa',
    honeypot: '' // Anti-bot spam prevention
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

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
    '01:00 AM (24/7)',
    '03:00 AM (24/7)'
  ];

  // Sync initial service & therapist when opened
  useEffect(() => {
    if (isOpen) {
      setConfirmedBooking(null);
      setErrors({});

      // Set default tomorrow date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];

      // Find initial service or default
      let svc = services.find((s) => s.id === initialServiceId) || services[0];
      let th = therapists.find((t) => t.id === initialTherapistId);

      setFormData((prev) => ({
        ...prev,
        service_id: svc?.id || 'russian-banya',
        service_name: svc?.name || 'Russian Banya Ritual',
        total_price: svc?.price || 3499,
        duration: svc?.duration || '90 Mins',
        therapist_id: th?.id || 'any',
        therapist_name: th ? `${th.name} (${th.category?.includes('Russian') ? 'Russian Specialist' : 'Indian Specialist'})` : 'Any Certified Specialist',
        booking_date: prev.booking_date || defaultDateStr,
        booking_time: prev.booking_time || timeSlots[2]
      }));
    }
  }, [isOpen, initialServiceId, initialTherapistId, services, therapists]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleServiceChange = (serviceId) => {
    const svc = services.find((s) => s.id === serviceId);
    if (svc) {
      setFormData((prev) => ({
        ...prev,
        service_id: svc.id,
        service_name: svc.name,
        total_price: svc.price,
        duration: svc.duration
      }));
    }
  };

  const handleTherapistChange = (therapistId) => {
    if (therapistId === 'any') {
      setFormData((prev) => ({
        ...prev,
        therapist_id: 'any',
        therapist_name: 'Any Certified Specialist'
      }));
    } else {
      const th = therapists.find((t) => t.id === therapistId);
      if (th) {
        setFormData((prev) => ({
          ...prev,
          therapist_id: th.id,
          therapist_name: th.name
        }));
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (formData.honeypot) return false; // bot detected

    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Contact phone number is required.';
    } else if (!/^[0-9+-\s()]{7,16}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.booking_date) errs.booking_date = 'Please choose a date.';
    if (!formData.booking_time) errs.booking_time = 'Please select an available time slot.';

    // Check double-booking conflict
    if (isSlotBooked(formData.therapist_id, formData.booking_date, formData.booking_time)) {
      errs.booking_time = 'This specialist is already booked for this slot. Please pick another time.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const bookingRecord = {
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email.trim(),
        service_id: formData.service_id,
        service_name: formData.service_name,
        therapist_id: formData.therapist_id,
        therapist_name: formData.therapist_name,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        duration: formData.duration,
        total_price: Number(formData.total_price),
        notes: formData.notes.trim(),
        payment_method: formData.payment_method
      };

      const created = await createBooking(bookingRecord);
      setConfirmedBooking(created);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit appointment.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0e121a] border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden my-6 z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-stone-900 via-[#151a24] to-stone-900 border-b border-gold-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-gold-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-100">
                    Reserve Your Royal Suite
                  </h3>
                  <p className="text-xs text-gold-400 font-light">
                    {settings?.business_name || 'Lotus Luxe Spa'} • Instant Confirmation
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto">
              {confirmedBooking ? (
                /* STEP 8: CONFIRMATION RECAP */
                <div className="text-center py-4 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block mb-1">
                      Suite Reserved Successfully
                    </span>
                    <h4 className="text-2xl font-serif font-bold text-stone-100">
                      We Look Forward to Welcoming You
                    </h4>
                    <p className="text-xs text-stone-400 mt-1">
                      A confirmation email has been dispatched to{' '}
                      <strong className="text-stone-200">{confirmedBooking.customer_email}</strong>.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-2xl bg-stone-900/80 border border-gold-500/30 text-left text-xs space-y-2.5 max-w-md mx-auto shadow-xl">
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Booking Reference:</span>
                      <span className="font-mono font-bold text-gold-400">{confirmedBooking.booking_reference}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Treatment:</span>
                      <span className="font-semibold text-stone-100">{confirmedBooking.service_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Dedicated Specialist:</span>
                      <span className="font-semibold text-gold-400">{confirmedBooking.therapist_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Appointment Schedule:</span>
                      <span className="font-semibold text-stone-100">{confirmedBooking.booking_date} • {confirmedBooking.booking_time}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-400">Total Investment:</span>
                      <span className="font-bold text-stone-100 font-serif">{formatPrice(confirmedBooking.total_price)}</span>
                    </div>
                  </div>

                  {/* Calendar & WhatsApp Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      href={generateWhatsAppLink({
                        service: confirmedBooking.service_name,
                        therapist: confirmedBooking.therapist_name,
                        date: confirmedBooking.booking_date,
                        time: confirmedBooking.booking_time,
                        name: confirmedBooking.customer_name,
                        phone: confirmedBooking.customer_phone
                      })}
                      target="_blank"
                      variant="whatsapp"
                      size="md"
                      icon={MessageCircle}
                    >
                      Open WhatsApp Summary
                    </Button>

                    <Button
                      href={notificationService.generateGoogleCalendarUrl(confirmedBooking, settings)}
                      target="_blank"
                      variant="gold-outline"
                      size="md"
                      icon={Calendar}
                    >
                      Add to Google Calendar
                    </Button>
                  </div>
                </div>
              ) : (
                /* 7-STEP BOOKING FORM */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot field (hidden from real users, traps spam bots) */}
                  <input
                    type="text"
                    name="extra_website_check"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    style={{ display: 'none' }}
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  {errors.form && (
                    <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.form}</span>
                    </div>
                  )}

                  {/* Step 1: Service Selection */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5 flex items-center justify-between">
                      <span>1. Choose Treatment Modality *</span>
                      <span className="text-[11px] text-gold-400 font-normal">
                        Investment: {formatPrice(formData.total_price)} ({formData.duration})
                      </span>
                    </label>
                    <select
                      value={formData.service_id}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                    >
                      {services.filter(s => s.is_active !== false).map((svc) => (
                        <option key={svc.id} value={svc.id}>
                          {svc.name} — {formatPrice(svc.price)} ({svc.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Therapist Selection */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                      2. Choose Specialist Preference
                    </label>
                    <select
                      value={formData.therapist_id}
                      onChange={(e) => handleTherapistChange(e.target.value)}
                      className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                    >
                      <option value="any">Any Available Certified Specialist</option>
                      <optgroup label="Russian Master Therapists">
                        {therapists
                          .filter((t) => t.category?.includes('Russian') && t.is_active !== false)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} — {t.specialization} ({t.experienceYears || t.experience_years})
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Indian Holistic Practitioners">
                        {therapists
                          .filter((t) => t.category?.includes('Indian') && t.is_active !== false)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} — {t.specialization} ({t.experienceYears || t.experience_years})
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Step 3 & 4: Date & Dynamic Available Time Slots */}
                  <div className="space-y-3 pt-1 border-t border-stone-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                          3. Appointment Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.booking_date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                          className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                        />
                        {errors.booking_date && <p className="text-xs text-red-400 mt-1">{errors.booking_date}</p>}
                      </div>

                      <div className="flex flex-col justify-end">
                        <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span>Open Slot</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 ml-2" />
                          <span>Booked (Guarded)</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 & 5: Time Slot Matrix with Real-Time Conflict Guard */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                        4. Select Available Time Slot *
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => {
                          const booked = isSlotBooked(
                            formData.therapist_id,
                            formData.booking_date,
                            slot
                          );
                          const isSelected = formData.booking_time === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={booked}
                              onClick={() => setFormData({ ...formData, booking_time: slot })}
                              className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                                booked
                                  ? 'bg-stone-900/40 text-stone-600 border-stone-800 line-through cursor-not-allowed opacity-40'
                                  : isSelected
                                  ? 'bg-gold-500 text-stone-950 border-gold-400 shadow-gold-sm font-bold'
                                  : 'bg-[#141824] text-stone-300 border-stone-700 hover:border-gold-500/50 hover:text-gold-300'
                              }`}
                            >
                              <span>{slot.split(' ')[0]} {slot.split(' ')[1]}</span>
                              {booked && <span className="text-[9px] text-red-400 font-normal">Reserved</span>}
                            </button>
                          );
                        })}
                      </div>
                      {errors.booking_time && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.booking_time}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Step 6: Guest Contact Information */}
                  <div className="space-y-3 pt-3 border-t border-stone-800">
                    <span className="text-xs uppercase tracking-wider text-stone-300 font-semibold block">
                      5. Guest Information
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-stone-400 uppercase font-semibold mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Elena Rostova"
                            className="w-full bg-[#131722] border border-stone-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400"
                          />
                        </div>
                        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 uppercase font-semibold mb-1">
                          Phone Number (for SMS & WhatsApp) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full bg-[#131722] border border-stone-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400"
                          />
                        </div>
                        {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 uppercase font-semibold mb-1">
                        Email Address (for Confirmation & Reminders) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="elena@example.com"
                          className="w-full bg-[#131722] border border-stone-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400"
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 uppercase font-semibold mb-1">
                        Special Requests / Layover Flight Details
                      </label>
                      <textarea
                        rows="2"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. Flight layover landing at 1:30 AM, or focus on upper shoulder knots..."
                        className="w-full bg-[#131722] border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 resize-none"
                      />
                    </div>
                  </div>

                  {/* Step 7: Payment Mode Selection */}
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs space-y-2">
                    <span className="font-semibold text-stone-300 block">
                      Payment Preference
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pay_mode"
                        checked={formData.payment_method === 'pay_at_spa'}
                        onChange={() => setFormData({ ...formData, payment_method: 'pay_at_spa' })}
                        className="text-gold-500 focus:ring-gold-400"
                      />
                      <span className="text-stone-300">
                        Pay at Spa upon arrival (Cash, UPI, Credit Card) — Zero advance needed
                      </span>
                    </label>
                  </div>

                  {/* Submission CTA */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      variant="gold"
                      fullWidth
                      size="lg"
                      icon={Calendar}
                    >
                      {submitting ? 'Confirming Suite...' : `Reserve Appointment (${formatPrice(formData.total_price)})`}
                    </Button>
                    <p className="text-[11px] text-stone-500 text-center mt-2.5">
                      🔒 No credit card required now. We confirm your suite immediately.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
