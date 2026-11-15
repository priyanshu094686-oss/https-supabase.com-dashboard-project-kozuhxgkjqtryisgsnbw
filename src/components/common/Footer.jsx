import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ArrowUp,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer({ onOpenBooking }) {
  const { settings, generateWhatsAppLink } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandName = settings?.business_name || 'Lotus Luxe Spa & Wellness';
  const shortName = settings?.short_name || 'LOTUS LUXE';
  const phone = settings?.primary_phone || '+91 98765 43210';
  const phoneTel = settings?.phone_tel || '+919876543210';
  const email = settings?.email || 'concierge@lotusluxespa.com';
  const hours = settings?.opening_hours || '24 Hours / 7 Days a Week';
  const address = `${settings?.address_line1 || 'L-Block, Mahipalpur Extension'}, ${settings?.address_line2 || 'Near IGI Airport T3 & Aerocity'}, ${settings?.city || 'New Delhi'} - ${settings?.pincode || '110037'}`;

  const servicesList = [
    { name: "Russian Banya Ritual", path: "/services/russian-banya" },
    { name: "Classic Swedish Massage", path: "/services/swedish-massage" },
    { name: "Deep Tissue Therapy", path: "/services/deep-tissue-massage" },
    { name: "Aromatherapy Sanctuary", path: "/services/aromatherapy-sanctuary" },
    { name: "Volcanic Hot Stone", path: "/services/hot-stone-therapy" },
    { name: "Royal Couples Sanctuary", path: "/services/couples-sanctuary" },
    { name: "Traditional Nuad Thai", path: "/services/thai-massage" },
    { name: "Ayurvedic Abhyanga", path: "/services/ayurvedic-massage" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
    { name: "Cookie Policy", path: "/cookie-policy" },
    { name: "Cancellation Policy", path: "/cancellation-policy" },
    { name: "Refund Policy", path: "/refund-policy" }
  ];

  return (
    <footer className="relative bg-[#07090d] border-t border-gold-500/20 text-stone-300 pt-16 pb-10 overflow-hidden">
      {/* Decorative Gold Glow in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Highlight Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-stone-900/90 via-[#141824] to-stone-900/90 border border-gold-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-semibold text-stone-100">
                Ready for Pure Royal Relaxation?
              </h4>
              <p className="text-sm text-stone-400 font-light">
                Private luxury suites, certified international therapists & 24/7 concierge.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-stone-950 shadow-gold hover:brightness-105 transition-all"
            >
              Reserve a Suite
            </button>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full text-sm font-semibold bg-[#25D366] text-stone-950 hover:bg-[#20bd5a] transition-all flex items-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={`tel:${phoneTel}`}
              className="px-5 py-3 rounded-full text-sm font-semibold border border-gold-500/50 text-gold-300 hover:bg-gold-500/10 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
          </div>
        </div>

        {/* 4 Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border border-gold-400 flex items-center justify-center bg-stone-950 shadow-gold-sm">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <span className="font-luxury text-xl font-bold tracking-[0.2em] text-stone-100 block uppercase">
                  {shortName}
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold-400 font-semibold block">
                  Spa & Wellness
                </span>
              </div>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed font-light">
              {settings?.description || "Sanctuary for authentic Slavic Russian Banya, classical European therapies, and private VIP couples indulgence. Rejuvenating travelers and connoisseurs."}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-gold-400 font-medium">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>{hours}</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-emerald-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-base font-serif font-semibold text-stone-100 mb-4 pb-2 border-b border-gold-500/20 inline-block">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home Experience', path: '/' },
                { name: 'Spa Services Menu', path: '/services' },
                { name: 'Certified Therapists', path: '/therapists' },
                { name: 'Pricing & Packages', path: '/pricing' },
                { name: 'Spa Locations & Maps', path: '/locations' },
                { name: 'About Lotus Luxe', path: '/about' },
                { name: 'Visual Gallery', path: '/gallery' },
                { name: 'FAQ & Etiquette', path: '/faq' },
                { name: 'Contact & Appointments', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-stone-400 hover:text-gold-300 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-gold-500/60 text-xs">◆</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Spa Treatments */}
          <div>
            <h4 className="text-base font-serif font-semibold text-stone-100 mb-4 pb-2 border-b border-gold-500/20 inline-block">
              Signature Treatments
            </h4>
            <ul className="space-y-2.5 text-sm">
              {servicesList.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-stone-400 hover:text-gold-300 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-gold-500/60 text-xs">◆</span>
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-semibold text-stone-100 mb-2 pb-2 border-b border-gold-500/20 inline-block">
              Sanctuary Concierge
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span className="text-stone-300 font-light">
                  {address}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`tel:${phoneTel}`}
                  className="text-stone-200 hover:text-gold-400 font-medium transition-colors"
                >
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-200 hover:text-emerald-400 font-medium transition-colors"
                >
                  WhatsApp: +{settings?.whatsapp_number || '919876543210'}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-stone-400 hover:text-gold-300 transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>

            {settings?.google_maps_url && (
              <div className="pt-2">
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:underline font-medium"
                >
                  <span>Get Google Maps Directions</span>
                  <span>→</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Legal Policies Navigation Row */}
        <div className="py-6 border-b border-stone-800 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-stone-400">
          {legalLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:text-gold-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/admin"
            className="text-stone-500 hover:text-gold-400 flex items-center gap-1 font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <div>
            <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
            <p className="mt-1 text-[11px] text-stone-600">
              Commercial Luxury Wellness & Spa Software Product.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-800 hover:border-gold-400 hover:text-gold-300 transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
