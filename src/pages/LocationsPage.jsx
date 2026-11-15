import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Navigation,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { locationsData } from '../data/locationsData';
import { useSettings } from '../context/SettingsContext';
import SectionHeader from '../components/common/SectionHeader';
import Button from '../components/common/Button';

export default function LocationsPage() {
  const { settings, generateWhatsAppLink } = useSettings();
  const [selectedLocation, setSelectedLocation] = useState(locationsData[0]);

  useEffect(() => {
    document.title = `Our Spa Locations & 24/7 Sanctuaries | ${settings?.business_name || 'Lotus Luxe Spa'}`;
    window.scrollTo(0, 0);
  }, [settings?.business_name]);

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Prime Sanctuaries"
          title="Lotus Luxe Spa Locations"
          subtitle="Strategically located across Delhi NCR. Featuring our 24/7 Flagship Lounge right near IGI Airport Terminal 3 Aerocity, alongside South Extension and Gurugram."
        />

        {/* Location Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {locationsData.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedLocation.id === loc.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold scale-105'
                  : 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-gold-500/40 hover:text-gold-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{loc.name.split(' ')[0]} Lounge</span>
            </button>
          ))}
        </div>

        {/* Featured Location Spotlight with Interactive Map */}
        <div className="mb-20 p-8 sm:p-10 rounded-3xl bg-[#0e121c] border border-gold-500/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Info details */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-stone-950 shadow-md">
                  {selectedLocation.badge}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Available Now
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                {selectedLocation.name}
              </h3>

              <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
                {selectedLocation.description}
              </p>

              <div className="space-y-3 pt-2 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-200 block">{selectedLocation.address}</strong>
                    <span className="text-xs text-gold-400/90 italic font-light">{selectedLocation.landmark}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                  <span className="text-stone-200 font-medium">{selectedLocation.hours}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                  <a href={`tel:${selectedLocation.phoneTel}`} className="text-stone-200 hover:text-gold-400 transition-colors font-semibold">
                    {selectedLocation.phone}
                  </a>
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
                  Lounge Features & Amenities
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.amenities.map((am) => (
                    <span
                      key={am}
                      className="px-2.5 py-1 rounded-full text-xs bg-stone-900 border border-gold-500/30 text-stone-300"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: 3 required triggers */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Button
                  href={selectedLocation.mapUrl}
                  target="_blank"
                  variant="gold"
                  size="md"
                  icon={Navigation}
                >
                  Google Maps Directions
                </Button>

                <Button
                  href={`tel:${selectedLocation.phoneTel}`}
                  variant="dark"
                  size="md"
                  icon={Phone}
                >
                  Call Now
                </Button>

                <Button
                  href={generateWhatsAppLink({ notes: `Inquiry for ${selectedLocation.name}` })}
                  target="_blank"
                  variant="whatsapp"
                  size="md"
                  icon={MessageCircle}
                >
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Interactive Map Embed */}
            <div className="lg:col-span-6 h-96 sm:h-[420px] rounded-2xl overflow-hidden border border-stone-800 shadow-xl relative">
              <iframe
                title={selectedLocation.name}
                src={selectedLocation.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter invert-[90%] hue-rotate-180 contrast-125"
              />
            </div>
          </div>
        </div>

        {/* All Location Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locationsData.map((loc) => (
            <div
              key={loc.id}
              className={`p-6 rounded-2xl bg-[#0f131f] border transition-all duration-300 flex flex-col justify-between ${
                selectedLocation.id === loc.id
                  ? 'border-gold-500/60 shadow-xl shadow-gold-500/10'
                  : 'border-stone-800 hover:border-gold-500/30'
              }`}
            >
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-stone-950">
                    {loc.badge}
                  </span>
                </div>

                <h4 className="text-xl font-serif font-bold text-stone-100 mb-1">
                  {loc.name}
                </h4>

                <p className="text-xs text-stone-400 font-light mb-4 line-clamp-2">
                  {loc.address}
                </p>

                <div className="text-xs text-gold-400 font-medium mb-4 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{loc.hours}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-stone-800 grid grid-cols-3 gap-2">
                <Button
                  href={loc.mapUrl}
                  target="_blank"
                  variant="gold-outline"
                  size="sm"
                  className="px-2 text-[11px]"
                >
                  Map
                </Button>
                <Button
                  href={`tel:${loc.phoneTel}`}
                  variant="dark"
                  size="sm"
                  className="px-2 text-[11px]"
                >
                  Call
                </Button>
                <Button
                  href={generateWhatsAppLink({ notes: `Inquiry for ${loc.name}` })}
                  target="_blank"
                  variant="whatsapp"
                  size="sm"
                  className="px-2 text-[11px]"
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
