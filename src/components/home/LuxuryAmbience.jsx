import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Award,
  Crown,
  HeartHandshake
} from 'lucide-react';
import Button from '../common/Button';

export default function LuxuryAmbience({ onOpenBooking }) {
  const highlights = [
    { title: "10+ Years of Refined Heritage", desc: "Serving distinguished international travelers, diplomatic guests, and local connoisseurs." },
    { title: "Hospital-Grade Hygiene Standards", desc: "Every suite and jacuzzi undergoes UV sterilization and complete linen turnover." },
    { title: "Private VIP Jacuzzi Suites", desc: "100% private soundproof chambers featuring steam, rainfall shower, and jacuzzi." },
    { title: "Certified International Therapists", desc: "Handpicked practitioners trained in authentic Slavic, European, and Vedic arts." }
  ];

  return (
    <section className="py-24 bg-[#07080c] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Large Spa Interior Images Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* Primary Large Interior Image */}
              <div className="relative rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85"
                  alt="Lotus Luxe Spa Presidential Interior Suite"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              {/* Overlapping Secondary Image */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 w-1/2 rounded-xl overflow-hidden border-2 border-gold-500/50 shadow-2xl shadow-black hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80"
                  alt="Luxury Jacuzzi Hydrotherapy"
                  className="w-full h-44 object-cover"
                />
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute -top-6 -left-4 sm:-left-6 p-4 rounded-xl bg-stone-900/95 border border-gold-500/50 shadow-gold backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-serif font-bold text-lg">
                    10+
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-100 block">Years of Royal Service</span>
                    <span className="text-[10px] text-gold-400 font-medium">Est. 2014 • New Delhi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Company Story */}
          <div className="lg:col-span-6 space-y-6 pt-6 sm:pt-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary of Refinement</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-100 leading-tight">
              A Legacy of <span className="gold-text-gradient">Pure Indulgence</span> & Slavic Mastery
            </h2>

            <p className="text-base text-stone-300 font-light leading-relaxed">
              Founded in 2014 in Mahipalpur near Delhi's IGI Airport Aerocity, Lotus Luxe Spa was conceived as a true haven for weary global travelers and discerning residents. We bridged the gap between authentic centuries-old Russian Banya traditions and royal 5-star European spa luxury.
            </p>

            <p className="text-sm text-stone-400 font-light leading-relaxed">
              Our signature treatments take place within 100% private luxury suites designed with imported Italian marble, Siberian cedarwood, and soundproof acoustics. Every detail—from our cold-pressed organic almond oils to our bespoke aromatherapy infusions—is calibrated for sensory perfection.
            </p>

            {/* Core Values / Features */}
            <div className="space-y-3 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-sm font-semibold text-stone-200 block">{item.title}</strong>
                    <span className="text-xs text-stone-400 font-light">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button
                onClick={() => onOpenBooking()}
                variant="gold"
                size="md"
                icon={Calendar}
              >
                Reserve Your Experience
              </Button>

              <Button
                to="/about"
                variant="ghost"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
              >
                Learn Our Philosophy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

