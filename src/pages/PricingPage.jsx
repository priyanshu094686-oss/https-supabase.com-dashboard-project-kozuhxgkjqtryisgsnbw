import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  Calendar,
  MessageCircle,
  Clock,
  ShieldCheck,
  Star,
  Award,
  Crown
} from 'lucide-react';
import { packagesData, membershipTiers } from '../data/packagesData';
import { useBooking } from '../context/BookingContext';
import { useSettings } from '../context/SettingsContext';
import { getDiscountPercentage } from '../utils/helpers';
import SectionHeader from '../components/common/SectionHeader';
import Button from '../components/common/Button';

export default function PricingPage({ onOpenBooking }) {
  const { services } = useBooking();
  const { settings, formatPrice, generateWhatsAppLink } = useSettings();

  useEffect(() => {
    document.title = `Transparent Luxury Pricing & VIP Memberships | ${settings?.business_name || 'Lotus Luxe Spa'}`;
    window.scrollTo(0, 0);
  }, [settings?.business_name]);

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Transparent Luxury"
          title="Curated Packages & Treatment Pricing"
          subtitle="All rates are all-inclusive with zero hidden costs. Every session includes private VIP suite access, organic botanical oils, and post-therapy Samovar tea."
        />

        {/* 1. Signature Luxury Packages Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Signature Multistage Wellness Rituals
            </h3>
            <p className="text-sm text-stone-400 font-light mt-1">
              Combining banya steam, contrast plunge, hydrotherapy, and full body massages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packagesData.map((pkg, idx) => {
              const discount = getDiscountPercentage(pkg.originalPrice, pkg.price);

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`p-8 sm:p-10 rounded-3xl bg-[#0f131f] border transition-all duration-300 relative flex flex-col justify-between ${
                    pkg.popular
                      ? 'border-gold-500/60 shadow-2xl shadow-gold-500/10'
                      : 'border-stone-800 hover:border-gold-500/30'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 right-8">
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-stone-950 shadow-md">
                        Most Requested
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                        {pkg.badge}
                      </span>
                      <span className="text-xs text-stone-500">•</span>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold-400" />
                        {pkg.duration}
                      </span>
                    </div>

                    <h4 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mb-1">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-gold-400/90 font-light italic mb-6">
                      "{pkg.tagline}"
                    </p>

                    {/* Features list */}
                    <div className="space-y-3 mb-6">
                      {pkg.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300">
                          <Check className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-400 font-light mb-6">
                      <strong className="text-stone-300">Recommended for:</strong> {pkg.recommendedFor}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                        All-Inclusive Package
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-serif font-bold text-stone-100 gold-text-gradient">
                          {formatPrice(pkg.price)}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-sm text-stone-500 line-through">
                            {formatPrice(pkg.originalPrice)}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            Save {discount}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        href={generateWhatsAppLink({ service: pkg.name })}
                        target="_blank"
                        variant="whatsapp"
                        size="sm"
                        icon={MessageCircle}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        onClick={() => onOpenBooking(pkg.id)}
                        variant="gold"
                        size="sm"
                        icon={Calendar}
                      >
                        Book Package
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 2. Ala-Carte Complete Menu Table */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Ala-Carte Bodywork Menu
            </h3>
            <p className="text-sm text-stone-400 font-light mt-1">
              Select any individual modality for your preferred duration.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0e121c] border border-stone-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-900/90 text-xs uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="py-4 px-6">Modality / Treatment</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Duration</th>
                    <th className="py-4 px-6">Standard Price</th>
                    <th className="py-4 px-6">Special Rate</th>
                    <th className="py-4 px-6 text-right">Reservation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850">
                  {(services || []).map((svc) => (
                    <tr key={svc.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-serif font-medium text-stone-100">
                        {svc.name}
                      </td>
                      <td className="py-4 px-6 text-xs text-gold-400">
                        {svc.category}
                      </td>
                      <td className="py-4 px-6 text-xs text-stone-400">
                        {svc.duration}
                      </td>
                      <td className="py-4 px-6 text-stone-500 line-through text-xs">
                        {formatPrice(svc.originalPrice)}
                      </td>
                      <td className="py-4 px-6 font-bold text-stone-100 gold-text-gradient">
                        {formatPrice(svc.price)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          onClick={() => onOpenBooking(svc.id)}
                          variant="gold"
                          size="sm"
                        >
                          Book
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. VIP Membership Club Tiers */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-gold-500/10 text-gold-400 border border-gold-500/30 mb-3">
              <Crown className="w-3.5 h-3.5" />
              <span>Privileged Membership</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              The Lotus Luxe Imperial Club
            </h3>
            <p className="text-sm text-stone-400 font-light mt-1 max-w-xl mx-auto">
              Preferred suite reservations, transferable guest privileges, and steep discounts on all bespoke treatments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTiers.map((tier, idx) => (
              <div
                key={tier.name}
                className={`p-8 rounded-3xl bg-[#0f131f] border relative flex flex-col justify-between ${
                  tier.popular
                    ? 'border-gold-400 shadow-2xl shadow-gold-500/15 scale-105'
                    : 'border-stone-800'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-stone-950 shadow-md">
                      Highest Value
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="text-2xl font-serif font-bold text-stone-100 mb-1">
                    {tier.name}
                  </h4>
                  <span className="text-xs text-gold-400 uppercase tracking-widest font-semibold block mb-4">
                    Valid for {tier.period}
                  </span>

                  <div className="py-4 my-4 border-y border-stone-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 gold-text-gradient">
                        {formatPrice(tier.price)}
                      </span>
                    </div>
                    <span className="text-xs text-stone-400 block mt-1">
                      {tier.sessions} Included
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/30 inline-block">
                      {tier.discount}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-stone-300 mb-8">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  href={generateWhatsAppLink({ service: `${tier.name} Membership Inquiry` })}
                  target="_blank"
                  variant={tier.popular ? "gold" : "gold-outline"}
                  fullWidth
                  size="md"
                  icon={MessageCircle}
                >
                  Join {tier.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
