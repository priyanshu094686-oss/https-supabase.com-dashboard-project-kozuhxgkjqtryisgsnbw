import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Award,
  Globe,
  Clock,
  Phone,
  MessageCircle,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Button from './Button';

export default function TherapistModal({
  isOpen,
  onClose,
  therapist,
  onBookTherapist
}) {
  const { settings, formatPrice, generateWhatsAppLink } = useSettings();

  if (!isOpen || !therapist) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-[#0e121a] border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Banner with Image & Badges */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden">
            <img
              src={therapist.image}
              alt={therapist.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e121a] via-[#0e121a]/40 to-transparent" />

            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-500 text-stone-950 shadow-gold mb-2">
                {therapist.badge || therapist.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                {therapist.name}
              </h3>
              <p className="text-sm text-gold-400 font-medium">
                {therapist.specialization}
              </p>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 text-center">
              <div>
                <span className="block text-[11px] text-stone-400 uppercase tracking-wider">Experience</span>
                <span className="text-sm font-semibold text-stone-200">{therapist.experienceYears}</span>
              </div>
              <div className="border-x border-stone-800">
                <span className="block text-[11px] text-stone-400 uppercase tracking-wider">Rating</span>
                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gold-400">
                  <Star className="w-3.5 h-3.5 fill-gold-400" />
                  <span>{therapist.rating}</span>
                </div>
              </div>
              <div>
                <span className="block text-[11px] text-stone-400 uppercase tracking-wider">Starting At</span>
                <span className="text-sm font-bold text-gold-400">{formatPrice(therapist.startingPrice)}</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1.5">
                About Specialist
              </h4>
              <p className="text-sm text-stone-300 leading-relaxed font-light">
                {therapist.bio}
              </p>
            </div>

            {/* Certifications & Languages */}
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-stone-300">
                <Award className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Accreditation:</strong> {therapist.certifications}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Globe className="w-4 h-4 text-gold-400 shrink-0" />
                <span><strong>Languages Spoken:</strong> {therapist.languages?.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span><strong>Session Duration:</strong> {therapist.sessionDuration}</span>
              </div>
            </div>

            {/* Specialties Badges */}
            {therapist.specialties && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">
                  Key Treatment Modalities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {therapist.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-1 rounded-full text-xs bg-stone-900 border border-gold-500/30 text-stone-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <Button
                onClick={() => {
                  onClose();
                  onBookTherapist(therapist.id);
                }}
                variant="gold"
                fullWidth
                size="md"
                icon={Calendar}
              >
                Book Appointment with {therapist.name.split(' ')[0]}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  href={`tel:${settings?.phone_tel || settings?.phone || ''}`}
                  variant="dark"
                  fullWidth
                  size="sm"
                  icon={Phone}
                >
                  Call Now
                </Button>
                <Button
                  href={generateWhatsAppLink({
                    therapist: therapist.name,
                    service: therapist.specialties?.[0] || 'Massage Treatment'
                  })}
                  target="_blank"
                  variant="whatsapp"
                  fullWidth
                  size="sm"
                  icon={MessageCircle}
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

