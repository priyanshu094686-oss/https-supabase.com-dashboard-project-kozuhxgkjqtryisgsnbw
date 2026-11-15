import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function LightboxModal({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onNavigate
}) {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-stone-900/90 text-stone-300 hover:text-white border border-stone-700 flex items-center justify-center transition-all hover:scale-105"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prev Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex - 1 + images.length) % images.length);
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-stone-900/80 text-gold-400 hover:text-white border border-gold-500/30 flex items-center justify-center transition-all hover:scale-110 shadow-xl"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex + 1) % images.length);
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-stone-900/80 text-gold-400 hover:text-white border border-gold-500/30 flex items-center justify-center transition-all hover:scale-110 shadow-xl"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content Box */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl max-h-[85vh] z-10 flex flex-col items-center select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl bg-black">
            <img
              src={currentImage.image}
              alt={currentImage.title}
              className="max-h-[70vh] w-auto max-w-full object-contain"
            />
          </div>

          {/* Details Bar */}
          <div className="mt-4 text-center max-w-2xl px-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30">
                {currentImage.category}
              </span>
              <span className="text-xs text-stone-500">
                {currentIndex + 1} of {images.length}
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-serif font-medium text-stone-100">
              {currentImage.title}
            </h4>
            {currentImage.caption && (
              <p className="text-xs sm:text-sm text-stone-400 mt-1 font-light">
                {currentImage.caption}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

