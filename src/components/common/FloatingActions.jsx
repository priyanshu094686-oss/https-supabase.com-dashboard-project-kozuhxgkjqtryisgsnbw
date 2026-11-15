import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function FloatingActions() {
  const { settings, generateWhatsAppLink } = useSettings();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phone = settings?.primary_phone || '+91 98765 43210';
  const phoneTel = settings?.phone_tel || '+919876543210';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            onClick={scrollToTop}
            className="pointer-events-auto w-11 h-11 rounded-full bg-stone-900/90 text-gold-400 border border-gold-500/40 shadow-xl flex items-center justify-center hover:bg-gold-500 hover:text-stone-950 transition-all active:scale-95"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Call Button */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        href={`tel:${phoneTel}`}
        className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-stone-900/95 text-stone-100 border border-gold-500/50 shadow-2xl backdrop-blur-md group hover:border-gold-400 transition-colors"
        title="Direct Call"
      >
        <div className="w-8 h-8 rounded-full bg-gold-500 text-stone-950 flex items-center justify-center shadow-gold-sm">
          <Phone className="w-4 h-4" />
        </div>
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[10px] text-gold-400 uppercase tracking-wider font-semibold">24/7 Call</span>
          <span className="text-xs font-bold text-stone-200 group-hover:text-gold-300">{phone}</span>
        </div>
      </motion.a>

      {/* Floating WhatsApp Button */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        href={generateWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#25D366] text-stone-950 shadow-xl shadow-emerald-950/40 font-semibold text-sm transition-all hover:bg-[#20bd5a]"
        title="Chat with Concierge"
      >
        {/* Pulse indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>

        <MessageCircle className="w-5 h-5 text-stone-950 fill-stone-950/20" />
        <span className="hidden sm:inline font-bold">WhatsApp Booking</span>
      </motion.a>
    </div>
  );
}
