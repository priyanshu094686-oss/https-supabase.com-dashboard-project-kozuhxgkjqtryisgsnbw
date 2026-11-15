import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  Clock,
  Star,
  Award,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useSettings } from '../context/SettingsContext';
import SectionHeader from '../components/common/SectionHeader';
import Button from '../components/common/Button';

export default function TherapistsPage({ onOpenBooking, onSelectTherapist }) {
  const { therapists } = useBooking();
  const { settings, formatPrice, generateWhatsAppLink } = useSettings();
  const [activeCategory, setActiveCategory] = useState("All Specialists");

  const activeTherapists = (therapists || []).filter((t) => t.is_active !== false);

  useEffect(() => {
    document.title = `Certified Russian & Indian Therapists | ${settings?.business_name || 'Lotus Luxe Spa'}`;
    window.scrollTo(0, 0);
  }, [settings?.business_name]);

  const filteredTherapists = activeTherapists.filter((therapist) => {
    if (activeCategory === "All Specialists") return true;
    return therapist.category === activeCategory;
  });

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Elite International Specialists"
          title="Certified Russian & Indian Therapists"
          subtitle="Every member of our prestigious team is internationally certified in anatomy, balneological steam therapy, and deep manual bodywork. Select your preferred practitioner for a truly tailored experience."
        />

        {/* Category Switch Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {["All Specialists", "Russian Therapists", "Indian Therapists"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold scale-105'
                  : 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-gold-500/40 hover:text-gold-300'
              }`}
            >
              {cat === "Russian Therapists" ? "🇷🇺 Russian Master Specialists" : cat === "Indian Therapists" ? "🇮🇳 Indian Holistic Practitioners" : "All Certified Specialists"}
            </button>
          ))}
        </div>

        {/* Therapist Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTherapists.map((therapist, idx) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-2xl bg-[#0e121c] border border-stone-800 hover:border-gold-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-gold-500/10 group"
            >
              {/* Photo */}
              <div
                className="relative h-72 w-full overflow-hidden cursor-pointer"
                onClick={() => onSelectTherapist(therapist)}
              >
                <img
                  src={therapist.image}
                  alt={therapist.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e121c] via-transparent to-black/30" />

                {/* Badges */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-stone-950 shadow-md">
                    {therapist.badge || therapist.category}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-950/80 text-stone-200 border border-stone-700 backdrop-blur-md">
                    <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                    {therapist.rating}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3.5 right-3.5">
                  <span className="text-[10px] text-stone-300 uppercase tracking-widest font-semibold block">
                    {therapist.experienceYears}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    onClick={() => onSelectTherapist(therapist)}
                    className="text-xl font-serif font-bold text-stone-100 group-hover:text-gold-300 transition-colors cursor-pointer"
                  >
                    {therapist.name}
                  </h3>

                  <p className="text-xs text-gold-400 font-medium mt-0.5">
                    {therapist.specialization}
                  </p>

                  <p className="text-xs text-stone-300 font-light mt-3 line-clamp-3 leading-relaxed">
                    {therapist.bio}
                  </p>

                  {/* Accreditations */}
                  <div className="mt-3 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-start gap-1.5">
                    <Award className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                    <span className="truncate">{therapist.certifications}</span>
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                      Starting Investment
                    </span>
                    <span className="text-lg font-bold font-serif text-stone-100 gold-text-gradient">
                      {formatPrice(therapist.startingPrice)}
                    </span>
                  </div>

                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {therapist.sessionDuration}
                  </span>
                </div>

                {/* Direct Action Buttons: Call Now, WhatsApp, and Reserve */}
                <div className="space-y-2 pt-1">
                  <Button
                    onClick={() => onSelectTherapist(therapist)}
                    variant="gold"
                    fullWidth
                    size="sm"
                    icon={Calendar}
                  >
                    Book with {therapist.name.split(' ')[0]}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      href={`tel:${settings?.phone_tel || settings?.phone || ''}`}
                      variant="dark"
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
                      size="sm"
                      icon={MessageCircle}
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
