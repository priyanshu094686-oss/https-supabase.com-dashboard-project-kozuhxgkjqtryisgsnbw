import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedServices from '../components/home/FeaturedServices';
import RussianBanyaSpotlight from '../components/home/RussianBanyaSpotlight';
import TherapistsHighlight from '../components/home/TherapistsHighlight';
import LuxuryAmbience from '../components/home/LuxuryAmbience';
import WhyChooseUs from '../components/home/WhyChooseUs';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import FaqAccordion from '../components/home/FaqAccordion';
import QuickBookingBanner from '../components/home/QuickBookingBanner';

export default function HomePage({ onOpenBooking, onSelectTherapist }) {
  useEffect(() => {
    document.title = "Lotus Luxe Spa & Wellness | Authentic Russian Banya & Luxury Bodywork";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section with Background, Overlay, Headings, Offers, 3 Buttons & Stats */}
      <HeroSection onOpenBooking={onOpenBooking} />

      {/* 2. Featured Services with Category Filters and Rounded Cards */}
      <FeaturedServices onOpenBooking={onOpenBooking} />

      {/* 3. Signature Russian Banya Spotlight */}
      <RussianBanyaSpotlight onOpenBooking={onOpenBooking} />

      {/* 4. Dedicated Russian & Indian Therapists Section */}
      <TherapistsHighlight
        onOpenBooking={onOpenBooking}
        onSelectTherapist={onSelectTherapist}
      />

      {/* 5. Luxury Ambience & About Us Section */}
      <LuxuryAmbience onOpenBooking={onOpenBooking} />

      {/* 6. Why Choose Us (6 Pillars) */}
      <WhyChooseUs />

      {/* 7. Customer Reviews Carousel */}
      <TestimonialsCarousel />

      {/* 8. Interactive Expandable FAQs */}
      <FaqAccordion />

      {/* 9. Quick Booking & Concierge CTA */}
      <QuickBookingBanner onOpenBooking={onOpenBooking} />
    </div>
  );
}

