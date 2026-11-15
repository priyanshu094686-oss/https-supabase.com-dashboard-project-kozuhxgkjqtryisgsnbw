import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MessageCircle,
  Phone,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Button from '../common/Button';

export default function QuickBookingBanner({ onOpenBooking }) {
  const { settings, generateWhatsAppLink } = useSettings();
  return (
    <section className="py-20 bg-gradient-to-b from-[#0a0d14] via-[#101522] to-[#07090e] relative overflow-hidden border-t border-gold-500/20">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-gold-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Immediate 24/7 Availability</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100 leading-tight mb-4">
          Reserve Your Private <span className="gold-text-gradient">Luxury Suite</span> Today
        </h2>

        <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
          Escape the chaos of the city. Experience authentic Russian Banya parenie, aromatic jacuzzis, and deep muscle revival near Delhi IGI Airport Aerocity.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            onClick={() => onOpenBooking()}
            variant="gold"
            size="lg"
            icon={Calendar}
          >
            Book Appointment Now
          </Button>

          <Button
            href={generateWhatsAppLink()}
            target="_blank"
            variant="whatsapp"
            size="lg"
            icon={MessageCircle}
          >
            Instant WhatsApp Booking
          </Button>

          <Button
            href={`tel:${settings?.phone_tel || settings?.phone || ''}`}
            variant="dark"
            size="lg"
            icon={Phone}
          >
            Direct Call Concierge
          </Button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-400" />
            <span>{settings?.opening_hours || 'Open 24/7 All Days'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>{settings?.address || 'Mahipalpur Aerocity, New Delhi'}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Advance Deposit Required</span>
          </div>
        </div>
      </div>
    </section>
  );
}

