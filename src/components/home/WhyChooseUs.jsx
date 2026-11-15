import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  ShieldCheck,
  Crown,
  Sparkles,
  Clock,
  Compass
} from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: Award,
      title: "Certified Professional Therapists",
      description: "Our certified practitioners are personally selected from Russia, Europe, and India. Every therapist holds diplomas in anatomy, balneology, and classical bodywork."
    },
    {
      icon: ShieldCheck,
      title: "Premium Hygiene Standards",
      description: "Hospital-grade UV sterilization, single-use organic linens, and sanitized jacuzzis between every guest session. We maintain an uncompromising 5-star cleanliness standard."
    },
    {
      icon: Crown,
      title: "Private Luxury Suites",
      description: "Expansive soundproof VIP chambers equipped with en-suite sunken jacuzzis, custom mood chromotherapy, private rain showers, and plush velvet relaxation loungers."
    },
    {
      icon: Sparkles,
      title: "Professional Massage Services",
      description: "Tailored treatments calibrated to your body's unique musculoskeletal needs—from centuries-old Slavic venik banya to deep myofascial and hot stone therapy."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Open 24 hours a day, 365 days a year. Perfect for international transit passengers landing at Delhi Airport T3, business executives, and late-night wellness seekers."
    },
    {
      icon: Compass,
      title: "Convenient Prime Location",
      description: "Situated in Mahipalpur Aerocity right along NH-48, just 3 minutes from Delhi International Airport Terminal 3, with complimentary secure valet parking for every guest."
    }
  ];

  return (
    <section className="py-24 bg-[#080a10] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="The Royal Standard"
          title="Why Connoisseurs Choose Lotus Luxe"
          subtitle="We combine centuries of European bathhouse wisdom with modern luxury hospitality to deliver an unparalleled wellness escape."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-2xl bg-[#0e121b] border border-stone-800/90 hover:border-gold-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Box */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-6 group-hover:border-gold-400 group-hover:scale-110 transition-all shadow-gold-sm">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-serif font-bold text-stone-100 group-hover:text-gold-300 transition-colors mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-stone-300 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/60 flex items-center gap-2 text-xs text-gold-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>5-Star Hospitality Guarantee</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

