import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin
} from 'lucide-react';
import { faqData, faqCategories } from '../data/faqData';
import { useSettings } from '../context/SettingsContext';
import SectionHeader from '../components/common/SectionHeader';
import Button from '../components/common/Button';

export default function FaqPage() {
  const { settings, generateWhatsAppLink } = useSettings();
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState(["services-overview", "banya-explanation"]);

  useEffect(() => {
    document.title = `Frequently Asked Questions & Spa Etiquette | ${settings?.business_name || 'Lotus Luxe Spa'}`;
    window.scrollTo(0, 0);
  }, [settings?.business_name]);

  const toggleAccordion = (id) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory =
      activeCategory === "All Questions" || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Inquiries & Spa Etiquette"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our Russian Banya rituals, certified therapists, pricing, couple suites, and 24/7 airport layover bookings."
        />

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10 relative">
          <div className="relative">
            <Search className="w-5 h-5 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments, pricing, couple suites, timings..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[#0e121c] border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
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

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-[#0e121c] border border-stone-800">
            <HelpCircle className="w-12 h-12 text-gold-500/50 mx-auto mb-3" />
            <h4 className="text-lg font-serif font-bold text-stone-200">No Matching Questions Found</h4>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Our 24/7 concierge is available to answer any questions directly via phone or WhatsApp.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button
                href={generateWhatsAppLink()}
                target="_blank"
                variant="whatsapp"
                size="sm"
                icon={MessageCircle}
              >
                Ask via WhatsApp
              </Button>
            </div>
          </div>
        ) : (
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
        )}

        {/* Bottom Concierge Helper Card */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-stone-900 via-[#131724] to-stone-900 border border-gold-500/30 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>24/7 Concierge Support</span>
            </span>
            <h4 className="text-2xl font-serif font-bold text-stone-100">
              Have a Specific Treatment Question?
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 font-light max-w-lg leading-relaxed">
              Our front desk concierge is on standby around the clock to assist with custom timings, therapist preferences, couples suites, and airport transit layovers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              href={`tel:${settings?.phone_tel || settings?.phone || '+919876543210'}`}
              variant="dark"
              size="md"
              icon={Phone}
            >
              Call Concierge
            </Button>
            <Button
              href={generateWhatsAppLink()}
              target="_blank"
              variant="whatsapp"
              size="md"
              icon={MessageCircle}
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

