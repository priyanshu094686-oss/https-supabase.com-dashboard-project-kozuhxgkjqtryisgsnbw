import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import { getDiscountPercentage } from '../../utils/helpers';
import SectionHeader from '../common/SectionHeader';
import Button from '../common/Button';

export default function FeaturedServices({ onOpenBooking }) {
  const { services } = useBooking();
  const { formatPrice } = useSettings();
  const [activeCategory, setActiveCategory] = useState("All Treatments");

  const activeServices = services.filter((s) => s.is_active !== false);

  // Extract unique categories dynamically
  const categories = [
    "All Treatments",
    ...new Set(activeServices.map((s) => s.category).filter(Boolean))
  ];

  const filteredServices = activeServices.filter((service) => {
    if (activeCategory === "All Treatments") return true;
    return service.category === activeCategory;
  });

  return (
    <section className="py-24 bg-[#0a0d14] relative overflow-hidden">
      {/* Decorative Gold Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Royal Wellness Menu"
          title="Curated Luxury Spa Services"
          subtitle="Explore our signature modalities spanning traditional Slavic heat therapy, European deep tissue, and tranquil Asian holistic bodywork."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold shadow-gold-sm scale-105'
                  : 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-gold-500/40 hover:text-gold-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid (Rounded Luxury Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.slice(0, 6).map((service, idx) => {
            const originalPrice = service.originalPrice || service.original_price;
            const discount = getDiscountPercentage(originalPrice, service.price);
            const benefitsList = Array.isArray(service.benefits)
              ? service.benefits
              : typeof service.benefits === 'string'
              ? service.benefits.split(',').map((b) => b.trim())
              : [];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-2xl bg-[#0f131d] border border-stone-800/80 hover:border-gold-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-gold-500/10"
              >
                {/* Card Image Container */}
                <Link to={`/services/${service.id}`} className="relative h-60 w-full overflow-hidden block">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f131d] via-transparent to-black/30" />

                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold-500 text-stone-950 shadow-md">
                        {service.badge}
                      </span>
                    </div>
                  )}

                  {/* Duration Pill */}
                  <div className="absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-950/80 text-stone-200 border border-stone-700 backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      {service.duration}
                    </span>
                  </div>

                  {/* Discount percentage tag */}
                  {discount > 0 && (
                    <div className="absolute bottom-3 right-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                        Save {discount}%
                      </span>
                    </div>
                  )}
                </Link>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gold-400/90 font-semibold block mb-1">
                      {service.category}
                    </span>
                    <Link to={`/services/${service.id}`}>
                      <h3 className="text-xl font-serif font-bold text-stone-100 group-hover:text-gold-300 transition-colors">
                        {service.name}
                      </h3>
                    </Link>
                    {service.tagline && (
                      <p className="text-xs text-stone-400 font-light mt-1 italic">
                        "{service.tagline}"
                      </p>
                    )}
                    <p className="text-sm text-stone-300 font-light mt-3 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Key Benefits */}
                  {benefitsList.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                      {benefitsList.slice(0, 3).map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-400">
                          <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span className="truncate">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing and Action */}
                  <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                        Investment
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold font-serif text-stone-100 gold-text-gradient">
                          {formatPrice(service.price)}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-stone-500 line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        to={`/services/${service.id}`}
                        variant="ghost"
                        size="sm"
                      >
                        Details
                      </Button>
                      <Button
                        onClick={() => onOpenBooking(service.id)}
                        variant="gold"
                        size="sm"
                        icon={Calendar}
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Services CTA Button */}
        <div className="mt-14 text-center">
          <Button
            to="/services"
            variant="gold-outline"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            View All {activeServices.length} Luxury Services & Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
}
