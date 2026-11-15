import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  Clock,
  Star,
  Award,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import SectionHeader from '../common/SectionHeader';
import Button from '../common/Button';

export default function TherapistsHighlight({ onOpenBooking, onSelectTherapist }) {
  const { therapists } = useBooking();
  const { settings, formatPrice, generateWhatsAppLink } = useSettings();
  const [activeTab, setActiveTab] = useState("Russian Therapists");

  const phoneTel = settings?.phone_tel || '+919876543210';
  const activeTherapists = therapists.filter((t) => t.is_active !== false);

  const filteredTherapists = activeTherapists.filter((therapist) => {
    if (activeTab === "All Specialists") return true;
    return therapist.category === activeTab;
  });

  return (
    <section className="py-24 bg-[#07090e] relative overflow-hidden">
      {/* Decorative Golden Ambient Vignette */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="World-Class Practitioners"
          title="Certified Russian & Indian Therapists"
          subtitle="Trained in Moscow, St. Petersburg, and Kerala. Our certified wellness specialists offer unparalleled mastery over authentic Slavic thermal banya and classical therapeutic bodywork."
        />

        {/* Category Switch Tabs (Russian vs Indian) */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-14">
          {["Russian Therapists", "Indian Therapists", "All Specialists"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold scale-105'
                  : 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-gold-500/40 hover:text-gold-300'
              }`}
            >
              {tab === "Russian Therapists" ? "🇷🇺 Russian Therapists" : tab === "Indian Therapists" ? "🇮🇳 Indian Therapists" : "All Certified Specialists"}
            </button>
          ))}
        </div>

        {/* Therapist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredTherapists.map((therapist, idx) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl bg-[#0f131e] border border-stone-800 hover:border-gold-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-gold-500/10"
            >
              {/* Photo Container */}
              <div
                className="relative h-64 w-full overflow-hidden cursor-pointer"
                onClick={() => onSelectTherapist(therapist)}
              >
                <img
                  src={therapist.image}
                  alt={therapist.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f131e] via-transparent to-black/30" />

                {/* Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-950/90 text-gold-400 border border-gold-500/40 backdrop-blur-md">
                    {therapist.experienceYears || therapist.experience_years}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-950/80 text-stone-200 border border-stone-700 backdrop-blur-md">
                    <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                    {therapist.rating}
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold-400/90 font-semibold">
                      {therapist.category}
                    </span>
                    <span className="text-[10px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {therapist.sessionDuration || therapist.session_duration}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectTherapist(therapist)}
                    className="text-lg font-serif font-bold text-stone-100 group-hover:text-gold-300 transition-colors cursor-pointer"
                  >
                    {therapist.name}
                  </h3>

                  <p className="text-xs text-gold-400/90 font-medium mt-0.5">
                    {therapist.specialization}
                  </p>

                  <p className="text-xs text-stone-300 font-light mt-2.5 line-clamp-2 leading-relaxed">
                    {therapist.bio}
                  </p>
                </div>

                {/* Price and Duration */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                      Session From
                    </span>
                    <span className="text-base font-bold font-serif text-stone-100 gold-text-gradient">
                      {formatPrice(therapist.startingPrice || therapist.starting_price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTherapist(therapist)}
                    className="text-xs text-gold-400 hover:text-gold-300 font-medium underline"
                  >
                    View Bio
                  </button>
                </div>

                {/* Direct Action Buttons: Call Now & WhatsApp */}
                <div className="pt-1 grid grid-cols-2 gap-2">
                  <Button
                    href={`tel:${phoneTel}`}
                    variant="dark"
                    size="sm"
                    icon={Phone}
                    title="Direct Call"
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
                    title="WhatsApp"
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Therapists CTA */}
        <div className="mt-14 text-center">
          <Button
            to="/therapists"
            variant="gold-outline"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
          >
            Meet All Certified Russian & Indian Specialists
          </Button>
        </div>
      </div>
    </section>
  );
}
