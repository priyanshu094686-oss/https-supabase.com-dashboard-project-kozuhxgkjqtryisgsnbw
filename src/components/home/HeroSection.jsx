import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Award,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Button from '../common/Button';

export default function HeroSection({ onOpenBooking }) {
  const { settings, generateWhatsAppLink } = useSettings();

  const brandName = settings?.business_name || 'Lotus Luxe Spa & Wellness';
  const phone = settings?.primary_phone || '+91 98765 43210';
  const phoneTel = settings?.phone_tel || '+919876543210';
  const promoHeadline = settings?.promo_headline || 'Flat 20% Off on All Russian Banya & Signature Couple Suites';
  const promoBadge = settings?.promo_badge || 'Special Seasonal Privilege';
  const isPromoEnabled = settings?.is_promo_enabled !== false;
  const hours = settings?.opening_hours || 'Open 24/7 (All Layover Flights & Weekends)';
  const addressShort = `${settings?.address_line2 || 'Mahipalpur Aerocity'}, Near IGI Airport ${settings?.city || 'Delhi'}`;

  const stats = [
    { value: "10+", label: "Years of Excellence", icon: Award },
    { value: "28+", label: "Certified Therapists", icon: Sparkles },
    { value: "35k+", label: "Delighted Guests", icon: ShieldCheck },
    { value: "4.9★", label: "Customer Rating", icon: Star },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-16 overflow-hidden bg-[#07080a]">
      {/* Background Spa Imagery with Luxury Overlays */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center scale-105 transition-transform duration-10000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85')`
          }}
        />
        {/* Layered Gradient Overlays for High Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/80 to-[#07080a]/60" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Decorative Golden Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
        {/* Special Offer & Privilege Badge */}
        {isPromoEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-stone-900/90 via-stone-800/90 to-stone-900/90 border border-gold-500/50 shadow-gold-sm text-xs sm:text-sm text-gold-300 font-medium mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="uppercase tracking-wider font-semibold text-gold-400">{promoBadge}:</span>
            <span>{promoHeadline}</span>
          </motion.div>
        )}

        {/* Location & 24/7 Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-300 font-light mb-4"
        >
          <span className="flex items-center gap-1.5 text-gold-400">
            <Clock className="w-4 h-4" />
            <strong className="font-semibold">{hours}</strong>
          </span>
          <span className="hidden sm:inline text-stone-600">•</span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>{addressShort}</span>
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-serif font-bold tracking-tight text-stone-100 max-w-5xl mx-auto leading-[1.1] mb-6"
        >
          The Pinnacle of <span className="gold-text-gradient">Russian Banya</span> & Royal European Wellness
        </motion.h1>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-xl text-stone-300 font-light max-w-3xl mx-auto leading-relaxed mb-10"
        >
          {settings?.description || "Immerse yourself in authentic Siberian cedarwood steam, therapeutic Venik birch leaf rituals, and bespoke body therapies performed by certified Russian and Indian specialists. Private VIP Jacuzzi suites and 24/7 valet service."}
        </motion.p>

        {/* CTAs: 3 Buttons as Requested */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
        >
          <Button
            onClick={onOpenBooking}
            variant="gold"
            size="lg"
            icon={Calendar}
            className="w-full sm:w-auto"
          >
            Book Appointment
          </Button>

          <Button
            href={generateWhatsAppLink()}
            target="_blank"
            variant="whatsapp"
            size="lg"
            icon={MessageCircle}
            className="w-full sm:w-auto"
          >
            WhatsApp Booking
          </Button>

          <Button
            href={`tel:${phoneTel}`}
            variant="dark"
            size="lg"
            icon={Phone}
            className="w-full sm:w-auto"
          >
            Call Concierge
          </Button>
        </motion.div>

        {/* Assurance Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-stone-400 font-light"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Hospital-Grade Hygiene & Sterilization
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            100% Private VIP Jacuzzi Suites
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Zero Advance Deposit Needed
          </span>
        </motion.div>
      </div>

      {/* Integrated Statistics Bar at Hero Bottom */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl bg-stone-900/80 border border-gold-500/25 backdrop-blur-xl shadow-2xl"
        >
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`text-center p-3 sm:p-4 ${
                  idx < stats.length - 1 ? 'lg:border-r border-stone-800' : ''
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-gold-400/80" />
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-100 gold-text-gradient">
                    {item.value}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-400 font-light tracking-wide">
                  {item.label}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
