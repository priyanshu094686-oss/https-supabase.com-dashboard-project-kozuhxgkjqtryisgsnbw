import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { reviewsData } from '../../data/reviewsData';
import SectionHeader from '../common/SectionHeader';

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const current = reviewsData[currentIndex];

  return (
    <section className="py-24 bg-[#090c13] relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-72 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Royal Impressions"
          title="What Our Distinguished Guests Say"
          subtitle="Real guest experiences and feedback. Discover why diplomats, global travelers, and spa enthusiasts consistently rate Lotus Luxe 5 stars."
        />

        {/* Notice Badge regarding Sample Content */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-stone-900 border border-stone-800 text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Sample Guest Reviews Displayed for Demonstration (Transparently Identified)</span>
          </span>
        </div>

        {/* Main Testimonial Card Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-[#0f131f] border border-gold-500/30 shadow-2xl overflow-hidden">
            {/* Large Quote Icon in Background */}
            <Quote className="absolute top-6 right-8 w-24 h-24 text-gold-500/10 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {/* 5 Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-400 fill-gold-400" />
                  ))}
                  <span className="ml-2 text-xs uppercase tracking-wider text-gold-400 font-semibold">
                    5.0 Star Experience
                  </span>
                </div>

                {/* Review Body */}
                <p className="text-lg sm:text-2xl font-serif text-stone-100 font-normal leading-relaxed italic">
                  "{current.comment}"
                </p>

                {/* Author Info */}
                <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/40 shadow-md"
                    />
                    <div>
                      <h4 className="text-base font-serif font-bold text-stone-100">
                        {current.name}
                      </h4>
                      <p className="text-xs text-stone-400">
                        {current.location} • <span className="text-gold-400">{current.treatment}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 font-light">
                    <span>{current.date}</span> • <span className="text-stone-400">{current.sampleNotice}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-stone-800/80">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {reviewsData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i
                        ? 'w-8 bg-gold-400'
                        : 'w-2 bg-stone-700 hover:bg-stone-500'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevReview}
                  className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 text-stone-300 hover:text-gold-400 hover:border-gold-500/50 flex items-center justify-center transition-colors"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextReview}
                  className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 text-stone-300 hover:text-gold-400 hover:border-gold-500/50 flex items-center justify-center transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

