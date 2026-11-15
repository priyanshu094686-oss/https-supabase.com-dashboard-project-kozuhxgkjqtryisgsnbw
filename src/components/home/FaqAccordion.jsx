import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Phone,
  Sparkles
} from 'lucide-react';
import { faqData, faqCategories } from '../../data/faqData';
import { useSettings } from '../../context/SettingsContext';
import SectionHeader from '../common/SectionHeader';
import Button from '../common/Button';

export default function FaqAccordion() {
  const { settings, generateWhatsAppLink } = useSettings();
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [openIds, setOpenIds] = useState(["services-overview", "banya-explanation"]);

  const toggleAccordion = (id) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = faqData.filter((item) => {
    if (activeCategory === "All Questions") return true;
    return item.category === activeCategory;
  });

  return (
    <section className="py-24 bg-[#07090e] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Inquiries & Guidance"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our Russian Banya rituals, certified therapists, pricing, couple suites, and 24/7 airport layover bookings."
        />

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {faqCategories.map((category) => (
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

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#10141e] border-gold-500/40 shadow-lg'
                    : 'bg-[#0b0e15] border-stone-800/80 hover:border-gold-500/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-medium text-stone-100 flex items-center gap-3">
                    <span className="text-gold-400 text-xs font-sans">Q.</span>
                    <span>{faq.question}</span>
                  </span>

                  <span
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-gold-500 text-stone-950 border-gold-400 rotate-180'
                        : 'bg-stone-900 text-stone-400 border-stone-700'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-300 font-light leading-relaxed border-t border-stone-800/50"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Concierge Helper */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-stone-800 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-serif font-semibold text-stone-100">
              Have a Specific Treatment Question?
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 font-light">
              Our 24/7 concierge is on standby to assist with custom requests and timings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              href={`tel:${settings?.phone_tel || settings?.phone || ''}`}
              variant="dark"
              size="sm"
              icon={Phone}
            >
              Call Concierge
            </Button>
            <Button
              href={generateWhatsAppLink()}
              target="_blank"
              variant="whatsapp"
              size="sm"
              icon={MessageCircle}
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

