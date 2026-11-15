import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  Calendar,
  Sparkles,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  Star,
  Award,
  Flame,
  Droplets,
  Heart,
  ArrowLeft,
  Check,
  Phone
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useSettings } from '../context/SettingsContext';
import { getDiscountPercentage } from '../utils/helpers';
import Button from '../components/common/Button';

export default function ServiceDetailsPage({ onOpenBooking, onSelectTherapist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services, therapists } = useBooking();
  const { settings, formatPrice, generateWhatsAppLink } = useSettings();

  const [selectedDuration, setSelectedDuration] = useState('');

  // Find active service
  const service = services.find((s) => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (service) {
      document.title = `${service.name} | Luxury Spa Rituals | ${settings?.business_name || 'Lotus Luxe Spa'}`;
      if (service.durationOptions && service.durationOptions.length > 0) {
        setSelectedDuration(service.durationOptions[0]);
      } else {
        setSelectedDuration(service.duration || '60 Mins');
      }
    }
  }, [service, settings?.business_name]);

  if (!service) {
    return (
      <div className="pt-40 pb-24 bg-[#07090e] min-h-screen text-stone-100 text-center">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-100 mb-2">Treatment Not Found</h2>
          <p className="text-sm text-stone-400 mb-6 font-light">
            The treatment modality you are looking for is either archived or unavailable.
          </p>
          <Button to="/services" variant="gold" icon={ArrowLeft}>
            Explore All Services
          </Button>
        </div>
      </div>
    );
  }

  const originalPrice = service.originalPrice || service.original_price;
  const discount = getDiscountPercentage(originalPrice, service.price);

  const benefitsList = Array.isArray(service.benefits)
    ? service.benefits
    : typeof service.benefits === 'string'
    ? service.benefits.split(',').map((b) => b.trim())
    : [];

  const inclusionsList = Array.isArray(service.includes)
    ? service.includes
    : typeof service.includes === 'string'
    ? service.includes.split(',').map((i) => i.trim())
    : [
        'Private Luxury Suite Access',
        'Hospital-Grade UV Sterilization',
        'Cold-Pressed Botanical Almond Oils',
        'Organic Herbal Samovar Tea Ceremony'
      ];

  // Ritual protocol steps
  const protocolSteps = [
    {
      step: '01',
      title: 'Consultation & Foot Cleansing Ritual',
      desc: 'Begin with a warm Himalayan pink salt foot soak and botanical scrub while discussing specific muscular tension areas with your practitioner.'
    },
    {
      step: '02',
      title: 'Thermal Acclimatization',
      desc: 'Subtle eucalyptus-infused dry or wet steam warmth opens the dermal pores and prepares deep muscle fibers for therapeutic bodywork.'
    },
    {
      step: '03',
      title: 'Core Modality & Manual Bodywork',
      desc: service.tagline || 'Customized rhythmic effleurage and pressure-point manipulation targeting tension and fatigue.'
    },
    {
      step: '04',
      title: 'Contrast Hydrotherapy & Relaxation',
      desc: 'Gentle cool or warm mist shower followed by an unhurried rest in our relaxation lounge with herbal Samovar tea infusions.'
    }
  ];

  // Related services
  const relatedServices = services
    .filter((s) => s.id !== service.id && s.is_active !== false)
    .slice(0, 3);

  // Relevant therapists
  const assignedTherapists = therapists.filter(
    (t) =>
      t.is_active !== false &&
      (t.specialties?.some((spec) =>
        spec.toLowerCase().includes(service.name.toLowerCase().split(' ')[0])
      ) ||
        t.category?.toLowerCase().includes('therapist'))
  ).slice(0, 3);

  return (
    <div className="pt-28 pb-24 bg-[#07090e] min-h-screen text-stone-100">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <nav className="flex items-center gap-2 text-xs text-stone-400 font-light">
          <Link to="/" className="hover:text-gold-300 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
          <Link to="/services" className="hover:text-gold-300 transition-colors">Services</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
          <span className="text-gold-400 font-medium truncate">{service.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Two-Column Service Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
          {/* Left Column: Image & Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl group">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e121c] via-transparent to-black/30" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {service.badge && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-stone-950 shadow-md">
                    {service.badge}
                  </span>
                )}
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-stone-950/80 text-gold-400 border border-gold-500/30 backdrop-blur-md">
                  {service.category}
                </span>
              </div>

              {discount > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Save {discount}%
                  </span>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6">
                <div className="p-4 rounded-xl bg-stone-950/90 border border-gold-500/30 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-200 text-xs">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span>Standard Session: <strong>{service.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-gold-400 text-xs font-semibold">
                    <Star className="w-4 h-4 fill-gold-400" />
                    <span>{service.rating || '4.98'} ({service.reviewsCount || '150+'} Reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#0e121c] border border-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[11px] text-stone-300 block font-medium">100% Private</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0e121c] border border-stone-800">
                <Sparkles className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                <span className="text-[11px] text-stone-300 block font-medium">Organic Oils</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0e121c] border border-stone-800">
                <Award className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                <span className="text-[11px] text-stone-300 block font-medium">Certified Staff</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Booking Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block mb-1">
                Luxury Treatment Modality
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-100 leading-tight">
                {service.name}
              </h1>
              {service.tagline && (
                <p className="text-sm sm:text-base text-gold-400/90 font-light italic mt-2">
                  "{service.tagline}"
                </p>
              )}
            </div>

            {/* Price & Duration Box */}
            <div className="p-6 rounded-2xl bg-[#0f131f] border border-gold-500/30 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-400 block uppercase tracking-wider">
                    Investment Rate
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 gold-text-gradient">
                      {formatPrice(service.price)}
                    </span>
                    {originalPrice && (
                      <span className="text-base text-stone-500 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-stone-400 font-light">All Taxes & Suite Inclusions Covered</span>
              </div>

              {/* Duration Options */}
              {service.durationOptions && service.durationOptions.length > 0 && (
                <div className="pt-2 border-t border-stone-800">
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    Select Session Duration:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {service.durationOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedDuration(opt)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          selectedDuration === opt
                            ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold-sm'
                            : 'bg-stone-900 text-stone-400 border border-stone-800 hover:border-gold-500/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <Button
                  onClick={() => onOpenBooking(service.id)}
                  variant="gold"
                  fullWidth
                  size="lg"
                  icon={Calendar}
                >
                  Reserve Suite for {service.name}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    href={`tel:${settings?.phone_tel || settings?.phone || '+919876543210'}`}
                    variant="dark"
                    fullWidth
                    size="sm"
                    icon={Phone}
                  >
                    Call Concierge
                  </Button>
                  <Button
                    href={generateWhatsAppLink({ service: service.name })}
                    target="_blank"
                    variant="whatsapp"
                    fullWidth
                    size="sm"
                    icon={MessageCircle}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* Narrative Overview */}
            <div className="space-y-3">
              <h3 className="text-base font-serif font-bold text-stone-200">
                Therapeutic Overview
              </h3>
              <p className="text-sm text-stone-300 font-light leading-relaxed">
                {service.fullDescription || service.description}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits & Inclusions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Key Benefits */}
          <div className="p-8 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-100">
                  Key Therapeutic Benefits
                </h3>
                <p className="text-xs text-stone-400">Calibrated physiological restoration</p>
              </div>
            </div>

            <ul className="space-y-3 pt-2">
              {benefitsList.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-300">
                  <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suite Inclusions */}
          <div className="p-8 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-100">
                  Presidential Suite Inclusions
                </h3>
                <p className="text-xs text-stone-400">All-inclusive VIP hospitality</p>
              </div>
            </div>

            <ul className="space-y-3 pt-2">
              {inclusionsList.map((inc, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-300">
                  <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4-Step Treatment Protocol Walkthrough */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block mb-1">
              Ritual Sequence
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              The 4-Stage Sensory Journey
            </h3>
            <p className="text-sm text-stone-400 font-light mt-1 max-w-xl mx-auto">
              How our certified practitioners orchestrate your appointment from arrival to refreshment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {protocolSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0f131f] border border-stone-800 hover:border-gold-500/40 transition-colors space-y-3 relative overflow-hidden"
              >
                <span className="text-3xl font-serif font-bold text-gold-500/20 block">
                  {step.step}
                </span>
                <h4 className="text-base font-serif font-bold text-stone-100">
                  {step.title}
                </h4>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Specialists for this treatment */}
        {assignedTherapists.length > 0 && (
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                  Master Practitioners
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                  Certified Specialists for {service.name}
                </h3>
              </div>
              <Button to="/therapists" variant="ghost" size="sm">
                View All Specialists
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedTherapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className="p-5 rounded-2xl bg-[#0e121c] border border-stone-800 hover:border-gold-500/40 transition-colors flex items-center gap-4"
                >
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-16 h-16 rounded-xl object-cover object-top border border-gold-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block truncate">
                      {therapist.badge || therapist.category}
                    </span>
                    <h4 className="text-base font-serif font-bold text-stone-100 truncate">
                      {therapist.name}
                    </h4>
                    <p className="text-xs text-stone-400 truncate font-light">
                      {therapist.specialization}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => onSelectTherapist && onSelectTherapist(therapist)}
                        className="text-xs text-gold-400 hover:text-gold-300 font-medium underline"
                      >
                        View Profile
                      </button>
                      <span className="text-stone-700">•</span>
                      <button
                        onClick={() => onOpenBooking(service.id, therapist.id)}
                        className="text-xs text-stone-300 hover:text-white font-medium"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explore Related Treatments */}
        {relatedServices.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                Other Signature Modalities
              </h3>
              <p className="text-sm text-stone-400 font-light mt-1">
                Discover complementary therapies favored by our distinguished guests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/services/${rel.id}`}
                  className="group rounded-2xl bg-[#0e121c] border border-stone-800 hover:border-gold-500/40 transition-all overflow-hidden flex flex-col"
                >
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e121c] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-serif font-bold text-stone-100 block">
                        {rel.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-xs text-gold-400 font-serif font-bold">
                      {formatPrice(rel.price)}
                    </span>
                    <span className="text-xs text-stone-400 flex items-center gap-1 group-hover:text-gold-300 transition-colors">
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

