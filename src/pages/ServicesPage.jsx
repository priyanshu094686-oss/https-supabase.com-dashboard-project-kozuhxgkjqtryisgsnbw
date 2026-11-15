import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  Calendar,
  Sparkles,
  MessageCircle,
  Tag,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useSettings } from '../context/SettingsContext';
import { getDiscountPercentage } from '../utils/helpers';
import SectionHeader from '../components/common/SectionHeader';
import Button from '../components/common/Button';

export default function ServicesPage({ onOpenBooking }) {
  const { services } = useBooking();
  const { settings, formatPrice, generateWhatsAppLink } = useSettings();
  const [activeCategory, setActiveCategory] = useState("All Treatments");

  const activeServices = (services || []).filter((s) => s.is_active !== false);

  const categories = [
    "All Treatments",
    ...new Set(activeServices.map((s) => s.category).filter(Boolean))
  ];

  useEffect(() => {
    document.title = `Spa Services & Treatment Menu | ${settings?.business_name || 'Lotus Luxe Spa'}`;
    window.scrollTo(0, 0);
  }, [settings?.business_name]);

  const filteredServices = activeServices.filter((service) => {
    if (activeCategory === "All Treatments") return true;
    return service.category === activeCategory;
  });

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Banner Header */}
        <SectionHeader
          badge="Complete Wellness Menu"
          title="Curated European & Oriental Therapies"
          subtitle="Explore all 10 signature modalities designed for deep physical recovery, lymphatic detoxification, and royal relaxation. Available 24/7 in our private luxury suites."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold scale-105'
                  : 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-gold-500/40 hover:text-gold-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 10 Services Detailed Cards Grid */}
        <div className="space-y-12">
          {filteredServices.map((service, idx) => {
            const discount = getDiscountPercentage(service.originalPrice, service.price);
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl bg-[#0e121c] border border-stone-800/90 hover:border-gold-500/40 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col lg:flex-row group"
              >
                {/* Image Section */}
                <Link to={`/services/${service.id}`} className={`relative lg:w-5/12 h-72 sm:h-80 lg:h-auto overflow-hidden block ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e121c] lg:from-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0e121c]/40 via-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {service.badge && (
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-stone-950 shadow-md">
                        {service.badge}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-950/80 text-gold-400 border border-gold-500/30 backdrop-blur-md">
                      {service.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-950/80 text-stone-200 border border-stone-700 backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      {service.duration} Standard Session
                    </span>
                  </div>
                </Link>

                {/* Content Section */}
                <div className={`p-6 sm:p-10 lg:w-7/12 flex flex-col justify-between space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                        Exclusive Treatment
                      </span>
                      {discount > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          Save {discount}% Today
                        </span>
                      )}
                    </div>

                    <Link to={`/services/${service.id}`}>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 group-hover:text-gold-300 transition-colors">
                        {service.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gold-400/90 font-light italic mt-1">
                      "{service.tagline}"
                    </p>

                    <p className="text-sm sm:text-base text-stone-300 font-light mt-4 leading-relaxed">
                      {service.fullDescription || service.description}
                    </p>
                  </div>

                  {/* Inclusions & Benefits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-800">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">
                        Key Therapeutic Benefits
                      </h4>
                      <ul className="space-y-1.5 text-xs text-stone-300">
                        {service.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">
                        Suite Inclusions
                      </h4>
                      <ul className="space-y-1.5 text-xs text-stone-300">
                        {service.includes ? (
                          service.includes.map((inc, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>Private Steam & Rain Shower</span>
                          </li>
                        )}
                        <li className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span>Organic Herbal Tea Ceremony</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                        Treatment Investment
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 gold-text-gradient">
                          {formatPrice(service.price)}
                        </span>
                        {service.originalPrice && (
                          <span className="text-sm text-stone-500 line-through">
                            {formatPrice(service.originalPrice)}
                          </span>
                        )}
                        <span className="text-xs text-stone-400">/ {service.duration}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        to={`/services/${service.id}`}
                        variant="ghost"
                        size="md"
                      >
                        View Details
                      </Button>
                      <Button
                        href={generateWhatsAppLink({ service: service.name })}
                        target="_blank"
                        variant="whatsapp"
                        size="md"
                        icon={MessageCircle}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        onClick={() => onOpenBooking(service.id)}
                        variant="gold"
                        size="md"
                        icon={Calendar}
                      >
                        Reserve Suite
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
