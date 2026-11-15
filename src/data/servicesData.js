/**
 * Spa Services Data
 * 10 distinct luxury services with high-resolution imagery, pricing, duration, and benefits.
 */
export const servicesData = [
  {
    id: "russian-banya",
    name: "Russian Banya Ritual",
    category: "Signature European",
    featured: true,
    badge: "Signature Ritual",
    tagline: "Centuries-Old Slavic Thermal & Venik Birch Therapy",
    description: "An authentic Slavic steam bath ritual combining high heat, natural moisture, and invigorating venik (birch and oak bundle) massage. Purifies the respiratory system, detoxifies deep dermal layers, and enhances cardiovascular vitality.",
    fullDescription: "Step into our handcrafted Siberian cedarwood steam chamber. The treatment begins with gentle pre-heating, followed by the legendary Venik parenie technique—light rhythmic drumming with damp birch and oak twigs infused with eucalyptus essential oils. Contrast ice cold plunge hydrotherapy restores tone, while a honey and sea salt body polish leaves your skin radiant and silky.",
    price: 3499,
    originalPrice: 4299,
    duration: "90 Mins",
    durationOptions: ["60 Mins", "90 Mins", "120 Mins"],
    rating: 4.98,
    reviewsCount: 142,
    benefits: [
      "Deep Cellular Detoxification",
      "Immune System Rejuvenation",
      "Muscle & Joint Pain Alleviation",
      "Contrast Plunge Hydrotherapy Included"
    ],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    includes: ["Venik Leaf Therapy", "Herbal Tea Ceremony", "Private Cedar Suite", "Cold Plunge Access"]
  },
  {
    id: "swedish-massage",
    name: "Classic Swedish Massage",
    category: "European Classic",
    featured: true,
    badge: "Most Popular",
    tagline: "Gentle Flowing Strokes for Total Muscle Relaxation",
    description: "The gold standard of Western therapeutic massage. Utilizes five classic long gliding strokes (effleurage, petrissage, tapotement, friction, and vibration) to dissolve everyday tension and stimulate blood circulation.",
    fullDescription: "Experience absolute serenity with cold-pressed sweet almond oil warmed to body temperature. Our therapists customize rhythmic strokes to release knots, flush metabolic waste from deep muscle tissues, and restore restful sleep patterns. Recommended for stress reduction and first-time spa visitors.",
    price: 2799,
    originalPrice: 3499,
    duration: "60 Mins",
    durationOptions: ["60 Mins", "90 Mins"],
    rating: 4.95,
    reviewsCount: 230,
    benefits: [
      "Dissolves Muscular Stiffness",
      "Boosts Blood Circulation",
      "Lowers Cortisol & Mental Fatigue",
      "Enhances Overall Flexibility"
    ],
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
    includes: ["Warm Herbal Oil", "Head & Scalp Acupressure", "Foot Soak Ritual"]
  },
  {
    id: "deep-tissue-massage",
    name: "Deep Tissue Therapy",
    category: "Therapeutic & Recovery",
    featured: true,
    badge: "Intense Relief",
    tagline: "Targeted Pressure on Chronic Myofascial Tension",
    description: "Firm, focused pressure designed to reach the deepest layers of muscle fibers and fascia. Ideal for addressing chronic posture issues, lower back stiffness, stiff necks, and athletic tightness.",
    fullDescription: "Using knuckles, elbows, and focused forearms, our certified therapists work cross-grain across restricted muscle bands. Combined with warming arnica and wintergreen balms, this modality loosens adhesions, breaks scar tissue patterns, and restores natural postural alignment.",
    price: 3199,
    originalPrice: 3899,
    duration: "60 Mins",
    durationOptions: ["60 Mins", "90 Mins", "120 Mins"],
    rating: 4.97,
    reviewsCount: 188,
    benefits: [
      "Breaks Chronic Myofascial Adhesions",
      "Immediate Relief for Sciatica & Lower Back",
      "Restores Full Range of Motion",
      "Postural Realignment"
    ],
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
    includes: ["Therapeutic Herbal Balms", "Trigger Point Assessment", "Spinal Decompression Stretch"]
  },
  {
    id: "aromatherapy",
    name: "Luxury Aromatherapy Sanctuary",
    category: "Holistic Wellness",
    featured: true,
    badge: "Sensory Bliss",
    tagline: "Rare Botanical Essences & Nervous System Harmony",
    description: "A sensory voyage combining rhythmic lymphatic drainage strokes with certified organic essential oils sourced from Grasse, France. Harmonizes the mind, calms nervous anxiety, and deeply nourishes the skin.",
    fullDescription: "You will participate in a personalized scent ceremony prior to the session, choosing between French lavender for calming, sweet orange & neroli for uplifting, or Himalayan cedarwood for emotional grounding. The micro-molecules of essential oils penetrate dermal layers while therapeutic inhalation soothes the limbic system.",
    price: 2999,
    originalPrice: 3699,
    duration: "60 Mins",
    durationOptions: ["60 Mins", "90 Mins"],
    rating: 4.94,
    reviewsCount: 165,
    benefits: [
      "Deep Nervous System Reset",
      "Enhanced Dermal Hydration & Radiance",
      "Alleviates Insomnia & Anxiety",
      "Lymphatic Detoxification"
    ],
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    includes: ["Bespoke Essential Oil Blend", "Aroma Inhalation Cup", "Warm Foot Wrap"]
  },
  {
    id: "hot-stone-therapy",
    name: "Basalt Hot Stone Therapy",
    category: "Signature European",
    featured: true,
    badge: "Deep Thermal",
    tagline: "Heated Volcanic Stones & Deep Penetrative Warmth",
    description: "Smooth, mineral-rich volcanic basalt stones heated to the ideal therapeutic temperature of 55°C are placed along energy meridians and used as ergonomic extensions of the therapist’s hands.",
    fullDescription: "Thermal energy deeply relaxes dense muscle tissue without abrasive force, allowing the therapist to release deep-seated stress effortlessly. The rhythmic glide of warm basalt stones paired with cool marble stones creates vascular pumping that accelerates cellular healing and profound meditative peace.",
    price: 3699,
    originalPrice: 4499,
    duration: "90 Mins",
    durationOptions: ["90 Mins", "120 Mins"],
    rating: 4.96,
    reviewsCount: 174,
    benefits: [
      "Thermal Vasodilation & Circulation",
      "Rapid Dissolution of Deep Muscle Spasms",
      "Chakra Energy Meridian Balancing",
      "Intense Meditative Calm"
    ],
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    includes: ["Natural River Basalt Stones", "Organic Jojoba Oil", "Warm Towel Compression"]
  },
  {
    id: "couples-massage",
    name: "Royal Couples Sanctuary Ritual",
    category: "VIP Romance & Packages",
    featured: true,
    badge: "VIP Suite",
    tagline: "Romantic Side-by-Side Indulgence in Private Jacuzzi Suite",
    description: "Share blissful relaxation with someone special in our expansive VIP Couples Suite. Features synchronized massages by two dedicated therapists, followed by private jacuzzi hydrotherapy and artisan herbal refreshments.",
    fullDescription: "Designed for couples, honeymoons, and anniversary celebrations. Includes personalized aromatherapy foot soaks, candlelight massage tables, organic rose petal decor, private steam bath, and a private Jacuzzi session. Enjoy chilled sparkling grape nectar and handcrafted chocolates post-treatment.",
    price: 5999,
    originalPrice: 7499,
    duration: "90 Mins",
    durationOptions: ["90 Mins", "120 Mins", "150 Mins"],
    rating: 4.99,
    reviewsCount: 310,
    benefits: [
      "Private VIP Suite with En-Suite Jacuzzi & Steam",
      "Synchronized Massages by 2 Expert Therapists",
      "Rose Petal Hydrotherapy Experience",
      "Sparkling Beverage & Gourmet Treats"
    ],
    image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?auto=format&fit=crop&w=800&q=80",
    includes: ["Private Jacuzzi", "Steam Suite", "Rose Foot Soak", "Gourmet Fruit & Chocolate Platter"]
  },
  {
    id: "thai-massage",
    name: "Traditional Nuad Thai Bodywork",
    category: "Asian & Holistic",
    featured: false,
    badge: "Assisted Yoga",
    tagline: "Ancient Acupressure, Sen Line Therapy & Passive Stretching",
    description: "An energizing, oil-free modality performed on a plush floor mattress. Combines gentle compression, sen-line acupressure, and assisted yoga-like stretches to open blocked joints and revitalize vitality.",
    fullDescription: "Originating in Buddhist monasteries over 2,500 years ago, traditional Thai bodywork balances the flow of life energy (Prana / Chi). Comfortable loose linen attire is provided. The therapist uses palms, thumbs, forearms, and feet to guide your body into therapeutic stretches, relieving tightness across the hips, spine, and hamstrings.",
    price: 2899,
    originalPrice: 3599,
    duration: "60 Mins",
    durationOptions: ["60 Mins", "90 Mins"],
    rating: 4.92,
    reviewsCount: 118,
    benefits: [
      "Expands Hip & Spinal Flexibility",
      "Relieves Lumbar Stagnation & Sciatica",
      "Balances Energy Flow & Vitality",
      "Zero Grease / Oil-Free Session"
    ],
    image: "https://images.unsplash.com/photo-1512290900672-1f416d843ff2?auto=format&fit=crop&w=800&q=80",
    includes: ["Custom Organic Linen Attire", "Traditional Thai Herbal Tea", "Joint Mobilization"]
  },
  {
    id: "reflexology",
    name: "Reflexology & Foot Acupressure",
    category: "Holistic Wellness",
    featured: false,
    badge: "Targeted Relief",
    tagline: "Zone Therapy for Whole-Body Organ Rejuvenation",
    description: "A focused treatment based on the principle that specific reflex zones on the soles, palms, and ears correspond to internal organs and bodily systems. Alleviates stress and restores systemic equilibrium.",
    fullDescription: "Begins with a warm Himalayan pink salt foot bath infused with tea tree and peppermint oils. Precise micro-pressure thumb walking techniques stimulate peripheral nerve endings, triggering restorative nervous system impulses throughout all bodily organs.",
    price: 1999,
    originalPrice: 2499,
    duration: "45 Mins",
    durationOptions: ["45 Mins", "60 Mins"],
    rating: 4.89,
    reviewsCount: 95,
    benefits: [
      "Stimulates Internal Organ Function",
      "Relieves Plantar Fasciitis & Foot Fatigue",
      "Decreases Water Retention in Ankles",
      "Balances Central Nervous System"
    ],
    image: "https://images.unsplash.com/photo-1519824145371-296894a0dc91?auto=format&fit=crop&w=800&q=80",
    includes: ["Himalayan Pink Salt Bath", "Peppermint Cooling Balm", "Lower Leg Lymphatic Flush"]
  },
  {
    id: "ayurvedic-massage",
    name: "Abhyanga Ayurvedic Therapy",
    category: "Asian & Holistic",
    featured: false,
    badge: "Ancient Wisdom",
    tagline: "Dosha-Balancing Warm Medicated Herb Oils",
    description: "An authentic Vedic ritual using warm medicated herbal decoctions prescribed to balance your individual Dosha (Vata, Pitta, Kapha). Promotes longevity, lustrous skin, and mental clarity.",
    fullDescription: "Abhyanga is the classical full-body oil massage of India. Using generous amounts of warm sesame and herb-cured oils, rhythmic downward strokes stimulate marma points (vital energy centers). The warm oils lubricate bodily joints, enhance cellular regeneration, and nourish Ojas (core vitality).",
    price: 3299,
    originalPrice: 3999,
    duration: "75 Mins",
    durationOptions: ["60 Mins", "75 Mins", "90 Mins"],
    rating: 4.93,
    reviewsCount: 136,
    benefits: [
      "Harmonizes Tri-Doshas (Vata, Pitta, Kapha)",
      "Stimulates 108 Vital Marma Points",
      "Nutritive Dermal Conditioning",
      "Improves Sleep Quality & Mental Calm"
    ],
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    includes: ["Dosha Herbal Oil Diagnosis", "Herbal Steam (Swedana)", "Organic Ubtan Cleanse"]
  },
  {
    id: "sports-massage",
    name: "Athletic Sports Recovery Massage",
    category: "Therapeutic & Recovery",
    featured: false,
    badge: "Athletic Edge",
    tagline: "Pre/Post Training Muscle Restoration & Lactic Acid Flush",
    description: "Designed specifically for athletes, fitness enthusiasts, and active individuals. Combines vigorous cross-fiber friction, passive stretching, and trigger point therapy to accelerate recovery times.",
    fullDescription: "Prevents muscular injury, breaks down post-workout lactic acid buildup, and relieves tight IT bands, calves, and shoulder girdles. Cryotherapy cooling gels and heated towel compresses are alternated to accelerate micro-circulation and speed tissue regeneration.",
    price: 3299,
    originalPrice: 3999,
    duration: "60 Mins",
    durationOptions: ["60 Mins", "90 Mins"],
    rating: 4.96,
    reviewsCount: 152,
    benefits: [
      "Flushes Stored Lactic Acid & Metabolic Waste",
      "Accelerates Post-Exercise Muscle Repair",
      "Prevents Sports Strains & Tendonitis",
      "Enhances Athletic Performance"
    ],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    includes: ["Cryo Cooling Gels", "Active Resistance Stretching", "Fascial Release Tools"]
  }
];

export const serviceCategories = [
  "All Treatments",
  "Signature European",
  "Therapeutic & Recovery",
  "Holistic Wellness",
  "Asian & Holistic",
  "VIP Romance & Packages"
];

