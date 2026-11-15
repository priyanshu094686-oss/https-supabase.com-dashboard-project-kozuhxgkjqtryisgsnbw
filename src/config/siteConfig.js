/**
 * Luxury Spa Configuration File
 * All business information, contact points, pricing defaults, and branding
 * are fully editable here.
 */
export const siteConfig = {
  name: "Lotus Luxe Spa & Wellness",
  shortName: "Lotus Luxe",
  tagline: "The Pinnacle of Royal European Wellness & Russian Banya",
  establishedYear: 2014,
  experienceYears: "10+",
  
  // Contact & Social Details
  contact: {
    primaryPhone: "+91 98765 43210",
    phoneTel: "+919876543210",
    whatsappNumber: "919876543210", // international format without + or spaces
    secondaryPhone: "+91 98111 22334",
    secondaryPhoneTel: "+919811122334",
    email: "concierge@lotusluxespa.com",
    supportEmail: "reservations@lotusluxespa.com",
    
    // Primary Location
    primaryAddress: {
      title: "Aerocity & Airport Hub",
      addressLine1: "L-Block, Mahipalpur Extension",
      addressLine2: "Near IGI Airport Terminal 3 & Aerocity",
      city: "New Delhi",
      state: "Delhi NCR",
      pincode: "110037",
      country: "India",
      googleMapsUrl: "https://maps.google.com/?q=Mahipalpur+Aerocity+New+Delhi",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14018.665961605728!2d77.11585!3d28.54972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1c0722396bb3%3A0xb38df13f707fdfc1!2sMahipalpur%2C%20New%20Delhi%2C%20Delhi%20110037!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
    },
    
    // Operating Hours
    hours: "24 Hours / 7 Days a Week",
    conciergeAvailability: "24/7 Dedicated Concierge & Valet Service",
  },

  // Social Links
  socials: {
    instagram: "https://instagram.com/lotusluxespa",
    facebook: "https://facebook.com/lotusluxespa",
    youtube: "https://youtube.com/@lotusluxespa",
    whatsapp: "https://wa.me/919876543210"
  },

  // Highlight Stats
  stats: [
    { label: "Years of Luxury Excellence", value: "10+", suffix: "" },
    { label: "Certified European & Indian Therapists", value: "28+", suffix: "" },
    { label: "Satisfied Royal Guests", value: "35,000+", suffix: "" },
    { label: "5-Star Customer Rating", value: "4.9", suffix: "★" }
  ],

  // Promotional Banner / Offers
  promotion: {
    badge: "Special Seasonal Privilege",
    headline: "Flat 20% Off on All Russian Banya & Signature Couple Suites",
    code: "LUXE20",
    validTill: "Limited Slots Available Daily",
    subtext: "Complimentary Herbal Infusions & Essential Steam with Every 90-Min Session"
  },

  currency: "₹",

  // WhatsApp Message Generator
  generateWhatsAppLink: (details = {}) => {
    const {
      service = "General Spa Inquiry",
      therapist = "Any Certified Specialist",
      date = "Earliest Available",
      time = "Flexible",
      name = "Guest",
      phone = "",
      notes = ""
    } = details;

    const message = encodeURIComponent(
      `Hello Lotus Luxe Spa Concierge! 🌸✨\n\n` +
      `I would like to reserve a luxury appointment:\n` +
      `• Guest Name: ${name}\n` +
      `• Contact: ${phone}\n` +
      `• Service: ${service}\n` +
      `• Preferred Specialist: ${therapist}\n` +
      `• Date: ${date}\n` +
      `• Preferred Time: ${time}\n` +
      (notes ? `• Special Requests: ${notes}\n` : '') +
      `\nPlease confirm suite availability. Thank you!`
    );

    return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${message}`;
  }
};

