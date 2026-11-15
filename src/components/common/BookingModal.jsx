import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronLeft,
  ExternalLink,
  Info
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
  const { services, therapists, getSlotAvailability, createBooking } = useBooking();
  const { settings, formatPrice, generateWhatsAppLink } = useSettings();

  // Multi-step navigation: 1: Service & Specialist, 2: Schedule, 3: Guest Info, 4: Review Details
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_id: '',
    service_name: '',
    therapist_id: 'any',
    therapist_name: 'Any Available Specialist',
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

  // Sync initial service & therapist when opened
  useEffect(() => {
    if (isOpen) {
      setConfirmedBooking(null);
      setCurrentStep(1);
      setErrors({});

      // Set default tomorrow date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];

      // Find initial service or default
      const svc = services.find((s) => s.id === initialServiceId) || services[0];
      const th = therapists.find((t) => t.id === initialTherapistId);

      setFormData((prev) => ({
        ...prev,
        service_id: svc?.id || 'russian-banya',
        service_name: svc?.name || 'Russian Banya Ritual',
        total_price: svc?.price || 3499,
        duration: svc?.duration || '90 Mins',
        therapist_id: th?.id || 'any',
        therapist_name: th ? `${th.name}` : 'Any Available Specialist',
        booking_date: prev.booking_date || defaultDateStr,
        booking_time: ''
      }));
    }
  }, [isOpen, initialServiceId, initialTherapistId, services, therapists]);

  // Lock body scroll when modal is active
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

  // Compute dynamic slot availability based on therapist, date, duration, buffer
  const calculatedSlots = useMemo(() => {
    if (!formData.booking_date) return [];
    return getSlotAvailability
      ? getSlotAvailability(formData.therapist_id, formData.booking_date, formData.duration)
      : [];
  }, [formData.therapist_id, formData.booking_date, formData.duration, getSlotAvailability]);

  // Automatically select first available slot if currently selected slot becomes invalid
  useEffect(() => {
    if (calculatedSlots.length > 0) {
      const currentSlotObj = calculatedSlots.find((s) => s.slot === formData.booking_time);
      if (!currentSlotObj || !currentSlotObj.available) {
        const firstOpen = calculatedSlots.find((s) => s.available);
        if (firstOpen) {
          setFormData((prev) => ({ ...prev, booking_time: firstOpen.slot }));
        } else {
          setFormData((prev) => ({ ...prev, booking_time: '' }));
        }
      }
    }
  }, [calculatedSlots]);

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
        therapist_name: 'Any Available Specialist'
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

  const validateStep = (step) => {
    const errs = {};
    if (formData.honeypot) return false;

    if (step === 1) {
      if (!formData.service_id) errs.service_id = 'Please choose a treatment service.';
    } else if (step === 2) {
      if (!formData.booking_date) errs.booking_date = 'Please choose an appointment date.';
      if (!formData.booking_time) errs.booking_time = 'Please pick an open time slot.';
    } else if (step === 3) {
      if (!formData.name.trim()) errs.name = 'Full name is required.';
      if (!formData.phone.trim()) {
        errs.phone = 'Phone number is required.';
      } else if (!/^[0-9+-\s()]{7,16}$/.test(formData.phone.trim())) {
        errs.phone = 'Please enter a valid phone number.';
      }
      if (!formData.email.trim()) {
        errs.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setSubmitting(true);
    setErrors({});
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
      setErrors({ form: err.message || 'Failed to confirm appointment. Please choose another time.' });
      setCurrentStep(2); // Jump back to step 2 so user can pick another slot
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = [
    { num: 1, title: 'Treatment' },
    { num: 2, title: 'Date & Slot' },
    { num: 3, title: 'Guest Info' },
    { num: 4, title: 'Review & Book' }
  ];

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
            <div className="px-6 py-4 bg-gradient-to-r from-stone-900 via-[#151a24] to-stone-900 border-b border-gold-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-gold-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-100">
                    Reserve Your Royal Suite
                  </h3>
                  <p className="text-[11px] text-gold-400 font-light">
                    {settings?.business_name || 'Lotus Luxe Spa'} • Instant Server Confirmation
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

            {/* Stepper Progress Bar (when not confirmed) */}
            {!confirmedBooking && (
              <div className="px-6 pt-4 pb-2 bg-[#090c12] border-b border-stone-850">
                <div className="flex items-center justify-between">
                  {stepLabels.map((st, idx) => (
                    <div key={st.num} className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                          currentStep === st.num
                            ? 'bg-gold-500 text-stone-950 shadow-gold-sm'
                            : currentStep > st.num
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-stone-800 text-stone-500'
                        }`}
                      >
                        {currentStep > st.num ? '✓' : st.num}
                      </div>
                      <span
                        className={`text-xs hidden sm:inline ${
                          currentStep === st.num
                            ? 'text-gold-400 font-semibold'
                            : currentStep > st.num
                            ? 'text-stone-300'
                            : 'text-stone-600'
                        }`}
                      >
                        {st.title}
                      </span>
                      {idx < stepLabels.length - 1 && (
                        <div
                          className={`w-8 sm:w-12 h-0.5 mx-1 transition-all ${
                            currentStep > st.num ? 'bg-gold-500/60' : 'bg-stone-800'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
              {confirmedBooking ? (
                /* STEP 8: CONFIRMATION RECAP */
                <div className="text-center py-2 space-y-5">
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
                      Confirmation notice logged and prepared for{' '}
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
                      <span className="font-semibold text-stone-100">
                        {confirmedBooking.booking_date} • {confirmedBooking.booking_time}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Session Duration:</span>
                      <span className="font-semibold text-stone-200">{confirmedBooking.duration || '60 Mins'}</span>
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
                <div className="space-y-5">
                  {/* Honeypot field (hidden from real users, traps bots) */}
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

                  {/* STEP 1: SERVICE & THERAPIST */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5 flex items-center justify-between">
                          <span>1. Select Treatment Modality *</span>
                          <span className="text-[11px] text-gold-400 font-normal">
                            {formatPrice(formData.total_price)} • {formData.duration}
                          </span>
                        </label>
                        <select
                          value={formData.service_id}
                          onChange={(e) => handleServiceChange(e.target.value)}
                          className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                        >
                          {services
                            .filter((s) => s.is_active !== false)
                            .map((svc) => (
                              <option key={svc.id} value={svc.id}>
                                {svc.name} — {formatPrice(svc.price)} ({svc.duration})
                              </option>
                            ))}
                        </select>
                        {errors.service_id && <p className="text-xs text-red-400 mt-1">{errors.service_id}</p>}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                          2. Choose Specialist or Auto-Assignment
                        </label>
                        <select
                          value={formData.therapist_id}
                          onChange={(e) => handleTherapistChange(e.target.value)}
                          className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                        >
                          <option value="any">✨ Any Available Certified Specialist (Fastest Available)</option>
                          <optgroup label="Russian Master Therapists">
                            {therapists
                              .filter((t) => t.category?.includes('Russian') && t.is_active !== false)
                              .map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} — {t.specialization} ({t.experience_years || t.experienceYears || '5+ Yrs'})
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Indian Holistic Practitioners">
                            {therapists
                              .filter((t) => t.category?.includes('Indian') && t.is_active !== false)
                              .map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} — {t.specialization} ({t.experience_years || t.experienceYears || '5+ Yrs'})
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
                        <Info className="w-4 h-4 text-gold-400 shrink-0" />
                        <span>
                          Choosing <strong>Any Available Specialist</strong> checks the availability of all active therapists simultaneously so you get the best flexibility.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DATE & DYNAMIC TIME SLOTS */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5 flex items-center justify-between">
                          <span>3. Appointment Date *</span>
                          <span className="text-[11px] text-stone-400 font-normal">Past dates blocked</span>
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

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs uppercase tracking-wider text-stone-300 font-semibold">
                            4. Available Time Slots ({formData.duration} session + 15m buffer) *
                          </label>
                          <div className="flex items-center gap-2 text-[10px] text-stone-400">
                            <span className="inline-block w-2 h-2 rounded-full bg-gold-400" /> Open
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1" /> Reserved/Past
                          </div>
                        </div>

                        {calculatedSlots.length === 0 ? (
                          <p className="text-xs text-stone-500 py-3">Please choose a date above to display available times.</p>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {calculatedSlots.map(({ slot, available, reason }) => {
                              const isSelected = formData.booking_time === slot;

                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={!available}
                                  onClick={() => setFormData({ ...formData, booking_time: slot })}
                                  className={`py-2 px-1.5 rounded-xl text-[11px] font-semibold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                                    !available
                                      ? 'bg-stone-900/40 text-stone-600 border-stone-850 cursor-not-allowed opacity-40'
                                      : isSelected
                                      ? 'bg-gold-500 text-stone-950 border-gold-400 shadow-gold-sm font-bold scale-[1.02]'
                                      : 'bg-[#141824] text-stone-200 border-stone-700 hover:border-gold-500/50 hover:text-gold-300'
                                  }`}
                                >
                                  <span>{slot.split(' ')[0]} {slot.split(' ')[1]}</span>
                                  {!available ? (
                                    <span className="text-[9px] text-red-400 font-normal truncate max-w-full">
                                      {reason || 'Booked'}
                                    </span>
                                  ) : (
                                    <span className={`text-[9px] ${isSelected ? 'text-stone-900 font-medium' : 'text-emerald-400'}`}>
                                      Available
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {errors.booking_time && (
                          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.booking_time}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: GUEST CONTACT DETAILS */}
                  {currentStep === 3 && (
                    <div className="space-y-3.5">
                      <span className="text-xs uppercase tracking-wider text-stone-300 font-semibold block">
                        5. Guest Contact Information
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                            Phone Number (SMS / WhatsApp) *
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
                            placeholder="guest@example.com"
                            className="w-full bg-[#131722] border border-stone-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400"
                          />
                        </div>
                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 uppercase font-semibold mb-1">
                          Special Requests or Flight Details (Optional)
                        </label>
                        <textarea
                          rows="2"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="e.g. Focus on shoulder tension, flight layover arrival at 1:30 AM..."
                          className="w-full bg-[#131722] border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: REVIEW BOOKING DETAILS & CONFIRM */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
                          6. Review Your Reservation Details
                        </h4>
                        <p className="text-xs text-stone-400">
                          Please verify your suite schedule and preferences before confirming.
                        </p>
                      </div>

                      {/* Review Card */}
                      <div className="p-4 rounded-2xl bg-[#141824] border border-gold-500/30 text-xs space-y-2.5">
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Selected Treatment:</span>
                          <strong className="text-stone-100">{formData.service_name}</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Dedicated Specialist:</span>
                          <span className="text-gold-400 font-semibold">{formData.therapist_name}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Date & Reserved Slot:</span>
                          <span className="text-stone-100 font-semibold">
                            {formData.booking_date} at {formData.booking_time}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Session Duration:</span>
                          <span className="text-stone-300">{formData.duration} (+ 15m turnover buffer)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Guest Name:</span>
                          <span className="text-stone-200">{formData.name}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Contact:</span>
                          <span className="text-stone-200">{formData.phone} • {formData.email}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Total Investment:</span>
                          <span className="font-serif font-bold text-base text-gold-400">
                            {formatPrice(formData.total_price)}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-stone-400">Payment Option:</span>
                          <span className="text-stone-300 font-medium">Pay at Spa upon arrival (Cash/Card/UPI)</span>
                        </div>
                      </div>

                      {formData.notes && (
                        <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                          <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-0.5">Notes:</span>
                          <p className="text-stone-300 italic">"{formData.notes}"</p>
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Zero advance payment required. Instant confirmation with database concurrency guard.</span>
                      </div>
                    </div>
                  )}

                  {/* Navigation CTA Buttons */}
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={goToPrevStep}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 flex items-center gap-1.5 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-stone-950 shadow-gold-sm flex items-center gap-1.5 transition-all"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={submitting}
                        variant="gold"
                        size="md"
                        icon={Calendar}
                      >
                        {submitting ? 'Confirming Suite...' : `Confirm Suite Reservation (${formatPrice(formData.total_price)})`}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
