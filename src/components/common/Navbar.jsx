import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  Calendar,
  Menu,
  X,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Button from './Button';

export default function Navbar({ onOpenBooking }) {
  const { settings, generateWhatsAppLink } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Therapists', path: '/therapists' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Locations', path: '/locations' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const brandName = settings?.business_name || 'Lotus Luxe Spa & Wellness';
  const shortName = settings?.short_name || 'LOTUS LUXE';
  const phone = settings?.primary_phone || '+91 98765 43210';
  const phoneTel = settings?.phone_tel || '+919876543210';
  const hours = settings?.opening_hours || '24 Hours / 7 Days a Week';
  const city = settings?.city || 'New Delhi';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Privilege / Contact Bar */}
      <div className="bg-[#0b0e14] border-b border-stone-800/80 text-stone-300 text-xs hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-gold-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Russian Banya & 5-Star European Bodywork</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400">
              <Clock className="w-3.5 h-3.5 text-gold-500/80" />
              <span>{hours}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-gold-500/80" />
              <span>{settings?.address_line2 || 'Near IGI Airport T3, Aerocity'}, {city}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${phoneTel}`}
              className="flex items-center gap-1.5 text-stone-300 hover:text-gold-400 transition-colors"
              title="Direct Call"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-semibold">{phone}</span>
            </a>
            <span className="text-stone-700">|</span>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge</span>
            </a>
            <span className="text-stone-700">|</span>
            <Link
              to="/admin"
              className="text-stone-400 hover:text-gold-400 flex items-center gap-1 text-[11px]"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3 h-3 text-gold-500" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090b10]/95 backdrop-blur-md border-b border-gold-500/20 shadow-2xl py-3'
            : 'bg-gradient-to-b from-[#07080a]/90 via-[#07080a]/60 to-transparent py-4 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={brandName}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gold-500/50 flex items-center justify-center bg-gradient-to-b from-stone-900 to-stone-950 shadow-gold-sm group-hover:border-gold-400 transition-colors">
                  <svg className="w-6 h-6 text-gold-400" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 20 C42 35 40 55 50 75 C60 55 58 35 50 20 Z" opacity="0.95"/>
                    <path d="M50 42 C34 45 22 55 25 72 C35 76 45 68 50 60 Z" opacity="0.8"/>
                    <path d="M50 42 C66 45 78 55 75 72 C65 76 55 68 50 60 Z" opacity="0.8"/>
                  </svg>
                  <div className="absolute inset-0 rounded-full bg-gold-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-luxury text-lg sm:text-xl font-bold tracking-[0.2em] text-stone-100 group-hover:text-gold-300 transition-colors uppercase">
                  {shortName}
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold-400/90 font-medium">
                  Spa & Wellness
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                      active
                        ? 'text-gold-400 font-semibold'
                        : 'text-stone-300 hover:text-gold-300 hover:bg-white/[0.03]'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-2.5">
              <Button
                href={`tel:${phoneTel}`}
                variant="dark"
                size="sm"
                icon={Phone}
                title="Call Now"
              >
                Call Now
              </Button>

              <Button
                href={generateWhatsAppLink()}
                target="_blank"
                variant="whatsapp"
                size="sm"
                icon={MessageCircle}
                title="Chat on WhatsApp"
              >
                WhatsApp
              </Button>

              <Button
                onClick={onOpenBooking}
                variant="gold"
                size="sm"
                icon={Calendar}
              >
                Book Now
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <a
                href={`tel:${phoneTel}`}
                className="w-9 h-9 rounded-full bg-stone-900 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:border-gold-400"
                aria-label="Call Spa"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600/90 text-white flex items-center justify-center"
                aria-label="WhatsApp Spa"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-stone-300 hover:text-gold-400 hover:bg-stone-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0a0c12]/98 backdrop-blur-xl border-b border-gold-500/20 shadow-2xl px-5 py-6 overflow-hidden"
          >
            <div className="flex flex-col space-y-2 mb-6">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-base font-medium transition-colors ${
                      active
                        ? 'bg-gold-500/15 text-gold-400 font-semibold border-l-2 border-gold-400'
                        : 'text-stone-300 hover:bg-white/[0.04] hover:text-gold-300'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-stone-500" />
                  </Link>
                );
              })}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 text-xs text-stone-400 hover:text-gold-400"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                  <span>Admin Control Portal</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile CTAs */}
            <div className="flex flex-col gap-3 pt-4 border-t border-stone-800">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                variant="gold"
                fullWidth
                size="md"
                icon={Calendar}
              >
                Book Appointment
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  href={`tel:${phoneTel}`}
                  variant="dark"
                  fullWidth
                  size="sm"
                  icon={Phone}
                >
                  Call Now
                </Button>
                <Button
                  href={generateWhatsAppLink()}
                  target="_blank"
                  variant="whatsapp"
                  fullWidth
                  size="sm"
                  icon={MessageCircle}
                >
                  WhatsApp
                </Button>
              </div>

              <div className="mt-3 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                <span>{hours} • {city}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
