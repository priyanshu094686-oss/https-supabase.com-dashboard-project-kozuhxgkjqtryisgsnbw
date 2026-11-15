import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Crown,
  Heart,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import SectionHeader from '../components/common/SectionHeader';
import Button from '../components/common/Button';

export default function AboutPage({ onOpenBooking }) {
  const { settings, generateWhatsAppLink } = useSettings();

  useEffect(() => {
    document.title = `About Our Heritage & Philosophy | ${settings?.business_name || 'Lotus Luxe Spa'}`;
    window.scrollTo(0, 0);
  }, [settings?.business_name]);

  const standards = [
    {
      title: "Hospital-Grade Hygiene Standards",
      desc: "Every suite undergoes rigorous UV sanitization and hot steam sterilization after each guest. Linens are 100% single-use and organic cold-pressed oils are sealed individually."
    },
    {
      title: "100% Private Luxury Suites",
      desc: "No shared waiting rooms or communal changing areas. You step directly into a private soundproof VIP chamber featuring an en-suite jacuzzi, private rain shower, and dressing vanity."
    },
    {
      title: "Certified International Therapists",
      desc: "Our therapists are certified by prestigious institutions across Russia (Moscow & St. Petersburg) and India (Kerala Ayurveda Academy). Each therapist undergoes continuous bi-monthly training."
    },
    {
      title: "99.4% Guest Satisfaction Rate",
      desc: "Over 35,000 delighted guests since 2014, including diplomats, airline pilots, business moguls, and wellness connoisseurs seeking reliable five-star treatment."
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Heritage & Philosophy"
          title="The Lotus Luxe Story"
          subtitle="Redefining luxury bodywork and Slavic thermal rituals in the capital of India. An oasis of tranquility where centuries-old wisdom meets five-star hospitality."
        />

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85"
                alt="Lotus Luxe Spa Presidential Interior"
                className="w-full h-[450px] object-cover"
              />
            </div>
            {/* Floating Experience Box */}
            <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-stone-900 border border-gold-500/50 shadow-gold backdrop-blur-md hidden sm:block">
              <span className="text-3xl font-serif font-bold text-stone-100 gold-text-gradient block">
                10+ Years
              </span>
              <span className="text-xs text-stone-400 font-medium">Of Uncompromising Excellence</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Conceived for Global Travelers & Discerning Seekers
            </h3>

            <p className="text-base text-stone-300 font-light leading-relaxed">
              Established in 2014 in Mahipalpur near Delhi's Indira Gandhi International Airport (Aerocity), Lotus Luxe Spa was born from a singular vision: to create an uncompromised sanctuary where the timeless healing power of authentic Russian Banya and European manual therapy could be experienced in regal luxury.
            </p>

            <p className="text-sm text-stone-400 font-light leading-relaxed">
              We understood that true wellness cannot exist in rushed, impersonal environments. Hence, we eliminated communal areas in favor of expansive, soundproof VIP suites where guests enjoy total discretion, bespoke aromatherapy, and unhurried hospitality.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <div className="flex items-center gap-2 text-gold-400 font-medium text-sm">
                <Clock className="w-4 h-4" />
                <span>Open 24/7/365</span>
              </div>
              <span className="text-stone-700">|</span>
              <div className="flex items-center gap-2 text-stone-300 text-sm">
                <Users className="w-4 h-4 text-gold-400" />
                <span>28+ Certified Therapists</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Our Unwavering Standards
            </h3>
            <p className="text-sm text-stone-400 font-light mt-1">
              Why thousands of discerning guests trust Lotus Luxe time and again.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {standards.map((std, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-[#0e121c] border border-stone-800 hover:border-gold-500/40 transition-colors shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-stone-100">
                    {std.title}
                  </h4>
                </div>
                <p className="text-sm text-stone-300 font-light leading-relaxed pl-11">
                  {std.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Private Suites Amenities Highlight */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-stone-900 via-[#131824] to-stone-900 border border-gold-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h4 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Experience the Presidential VIP Suites
            </h4>
            <p className="text-sm text-stone-300 font-light max-w-xl">
              Complete with sunken hot jacuzzis, custom chromotherapy, private eucalyptus steam, and soothing acoustics. Complimentary valet parking upon arrival.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => onOpenBooking()}
              variant="gold"
              size="lg"
              icon={Calendar}
            >
              Book Your Suite
            </Button>
            <Button
              href={generateWhatsAppLink()}
              target="_blank"
              variant="whatsapp"
              size="lg"
              icon={MessageCircle}
            >
              WhatsApp Concierge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
