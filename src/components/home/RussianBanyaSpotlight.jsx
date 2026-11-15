import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Droplets,
  Wind,
  Coffee,
  Sparkles,
  Calendar,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Button from '../common/Button';

export default function RussianBanyaSpotlight({ onOpenBooking }) {
  const { generateWhatsAppLink } = useSettings();
  const steps = [
    {
      icon: Flame,
      title: "1. Cedar Steam Pre-Heating",
      desc: "Warm up in authentic Siberian cedar chambers at 70°C infused with wild eucalyptus aromatics to open pores."
    },
    {
      icon: Wind,
      title: "2. Venik Birch Percussion",
      desc: "Rhythmic parenie drumming with damp birch and oak leaf bundles stimulates lymphatic drainage and circulation."
    },
    {
      icon: Droplets,
      title: "3. Contrast Ice Plunge",
      desc: "Submerge in the 10°C cold hydrotherapy pool to tighten pores, invigorate vascular tone, and awaken immunity."
    },
    {
      icon: Coffee,
      title: "4. Samovar Herbal Ceremony",
      desc: "Conclude with soothing mountain berry and Ivan-Chai herbal infusions paired with natural honeycomb."
    }
  ];

  return (
    <section className="py-24 bg-[#0a0c13] relative overflow-hidden border-y border-gold-500/15">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-5 luxury-pattern-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Story & Steps */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Centuries-Old Slavic Tradition</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-100 leading-tight">
              Authentic <span className="gold-text-gradient">Russian Banya</span> Ritual in New Delhi
            </h2>

            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed">
              Unlike ordinary saunas, our handcrafted Siberian cedar banya creates a harmonious balance of deep thermal heat and rich humidity. Guided by our certified Russian banya specialists, the ritual delivers deep cellular detoxification and profound mental clarity.
            </p>

            {/* 4 Pillars of Banya */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-gold-500/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mb-2.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-serif font-semibold text-stone-200 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-stone-400 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button
                onClick={() => onOpenBooking('russian-banya')}
                variant="gold"
                size="md"
                icon={Calendar}
              >
                Book Russian Banya Ritual
              </Button>

              <Button
                href={generateWhatsAppLink({ service: "Russian Banya Experience" })}
                target="_blank"
                variant="whatsapp"
                size="md"
                icon={MessageCircle}
              >
                Inquire via WhatsApp
              </Button>
            </div>
          </div>

          {/* Right Column: Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="relative rounded-2xl overflow-hidden border border-gold-500/40 shadow-2xl shadow-black">
                <img
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85"
                  alt="Authentic Russian Banya Cedar Steam"
                  className="w-full h-96 sm:h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="p-4 rounded-xl bg-stone-950/90 border border-gold-500/30 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider block">
                          Signature Slavic Ritual
                        </span>
                        <span className="text-lg font-serif font-bold text-stone-100">
                          Starting from ₹3,499
                        </span>
                      </div>
                      <span className="text-xs text-stone-400">90 Mins Complete Detox</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Badge */}
              <div className="absolute -top-4 -right-4 p-4 rounded-xl bg-stone-900 border border-gold-500/50 shadow-gold backdrop-blur-md hidden sm:block">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  <div>
                    <span className="text-xs font-bold text-stone-100 block">Siberian Cedarwood</span>
                    <span className="text-[10px] text-stone-400">100% Organic & Chemical-Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

