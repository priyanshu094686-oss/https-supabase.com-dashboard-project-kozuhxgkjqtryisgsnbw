import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Sparkles, Eye } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useSettings } from '../context/SettingsContext';
import SectionHeader from '../components/common/SectionHeader';
import LightboxModal from '../components/common/LightboxModal';

export default function GalleryPage() {
  const { gallery } = useBooking();
  const { settings } = useSettings();
  const [activeCategory, setActiveCategory] = useState("All Highlights");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = gallery || [];

  const categories = [
    "All Highlights",
    ...new Set(images.map((img) => img.category).filter(Boolean))
  ];

  useEffect(() => {
    document.title = `Visual Gallery & Luxury Interiors | ${settings?.business_name || 'Lotus Luxe Spa'}`;
    window.scrollTo(0, 0);
  }, [settings?.business_name]);

  const filteredImages = images.filter((item) => {
    if (activeCategory === "All Highlights") return true;
    return item.category === activeCategory;
  });

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Atmospheric Luxury"
          title="Inside Our VIP Sanctuaries"
          subtitle="Explore the opulent aesthetics of Lotus Luxe Spa—from our handcrafted Siberian cedar Russian Banya and sunken Jacuzzi suites to private aromatherapy relaxation lounges."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold scale-105'
                  : 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-gold-500/40 hover:text-gold-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Responsive Image Grid with Lightbox Trigger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredImages.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden border border-stone-800 hover:border-gold-500/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-gold-500/10 h-72 sm:h-80"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Badges */}
              <div className="absolute top-3.5 left-3.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-950/80 text-gold-400 border border-gold-500/30 backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-stone-950/80 text-stone-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-gold-400" />
              </div>

              {/* Caption Bottom Bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-base sm:text-lg font-serif font-semibold text-stone-100 group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-400 mt-1 line-clamp-1 font-light">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <LightboxModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={filteredImages}
          currentIndex={lightboxIndex}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      </div>
    </div>
  );
}
