import { createClient } from '@supabase/supabase-js';
import { availabilityService } from '../services/availabilityService';
import { servicesData as initialServices } from '../data/servicesData';
import { therapistsData as initialTherapists } from '../data/therapistsData';
import { galleryData as initialGallery } from '../data/galleryData';
import { siteConfig as initialSiteConfig } from '../config/siteConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const currentBusinessId = import.meta.env.VITE_BUSINESS_ID || '00000000-0000-0000-0000-000000000001';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 10
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =========================================================================
// LOCAL STORAGE BACKED PERSISTENT FALLBACK STORE (FOR ZERO-CONFIG DEMOS)
// Allows admin CRUD and booking workflows to work immediately out-of-the-box
// =========================================================================

const STORAGE_KEYS = {
  SETTINGS: 'spa_business_settings',
  SERVICES: 'spa_services_data',
  THERAPISTS: 'spa_therapists_data',
  BOOKINGS: 'spa_bookings_data',
  CUSTOMERS: 'spa_customers_data',
  GALLERY: 'spa_gallery_data',
  ADMIN_AUTH: 'spa_admin_session'
};

function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage set failed', e);
  }
}

// Initial sample bookings so admin dashboard displays rich analytics on day 1
const initialSampleBookings = [
  {
    id: "bk-1001",
    booking_reference: "LL-2026-9041",
    customer_name: "Alexander Romanov",
    customer_phone: "+91 98111 22334",
    customer_email: "alexander@example.com",
    service_id: "russian-banya",
    service_name: "Russian Banya Ritual",
    therapist_id: "ekaterina-ivanova",
    therapist_name: "Ekaterina Ivanova",
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: "02:30 PM",
    duration: "90 Mins",
    total_price: 3499,
    booking_status: "confirmed",
    payment_status: "paid",
    payment_method: "pay_at_spa",
    notes: "Layover transit passenger, requested oak venik",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "bk-1002",
    booking_reference: "LL-2026-9042",
    customer_name: "Pooja Malhotra",
    customer_phone: "+91 98765 11223",
    customer_email: "pooja.m@example.com",
    service_id: "couples-massage",
    service_name: "Royal Couples Sanctuary Ritual",
    therapist_id: "meera-patel",
    therapist_name: "Meera Patel",
    booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    booking_time: "05:30 PM",
    duration: "90 Mins",
    total_price: 5999,
    booking_status: "pending",
    payment_status: "unpaid",
    payment_method: "pay_at_spa",
    notes: "Anniversary celebration, requested rose petal bath",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "bk-1003",
    booking_reference: "LL-2026-9043",
    customer_name: "David Vance",
    customer_phone: "+44 7700 900077",
    customer_email: "david.v@example.com",
    service_id: "deep-tissue-massage",
    service_name: "Deep Tissue Therapy",
    therapist_id: "anastasia-smirnova",
    therapist_name: "Anastasia Smirnova",
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: "07:00 PM",
    duration: "60 Mins",
    total_price: 3199,
    booking_status: "confirmed",
    payment_status: "paid",
    payment_method: "stripe",
    notes: "Severe lower back stiffness from international flight",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "bk-1004",
    booking_reference: "LL-2026-9044",
    customer_name: "Vikramaditya Singhania",
    customer_phone: "+91 99999 88888",
    customer_email: "vikram@example.com",
    service_id: "hot-stone-therapy",
    service_name: "Basalt Hot Stone Therapy",
    therapist_id: "priya-sharma",
    therapist_name: "Priya Sharma",
    booking_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    booking_time: "04:00 PM",
    duration: "90 Mins",
    total_price: 3699,
    booking_status: "completed",
    payment_status: "paid",
    payment_method: "pay_at_spa",
    notes: "Executive club member",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// Initial customers
const initialSampleCustomers = [
  {
    id: "cust-1",
    name: "Alexander Romanov",
    phone: "+91 98111 22334",
    email: "alexander@example.com",
    notes: "VIP Guest, frequent European traveler",
    total_bookings: 3,
    total_spent: 10497,
    created_at: "2026-09-10T12:00:00Z"
  },
  {
    id: "cust-2",
    name: "Pooja Malhotra",
    phone: "+91 98765 11223",
    email: "pooja.m@example.com",
    notes: "Prefers evening couple suites with lavender aromatherapy",
    total_bookings: 2,
    total_spent: 11998,
    created_at: "2026-10-04T15:30:00Z"
  },
  {
    id: "cust-3",
    name: "David Vance",
    phone: "+44 7700 900077",
    email: "david.v@example.com",
    notes: "Airline pilot, Aerocity layover regular",
    total_bookings: 4,
    total_spent: 12796,
    created_at: "2026-08-15T09:00:00Z"
  },
  {
    id: "cust-4",
    name: "Vikramaditya Singhania",
    phone: "+91 99999 88888",
    email: "vikram@example.com",
    notes: "Platinum Imperial Club member",
    total_bookings: 8,
    total_spent: 32592,
    created_at: "2026-06-20T11:00:00Z"
  }
];

// =========================================================================
// UNIFIED DATA SERVICE (SUPABASE WITH TRANSPARENT LOCAL FALLBACK)
// =========================================================================

export const dbService = {
  // -----------------------------------------------------------------------
  // AUTHENTICATION
  // -----------------------------------------------------------------------
  async loginAdmin(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }

    // Demo Mode Authenticator
    // Default credentials for client evaluation: admin@lotusluxespa.com / admin123
    if (
      (email === 'admin@lotusluxespa.com' || email === 'admin@spa.com' || email === 'owner@spa.com') &&
      password === 'admin123'
    ) {
      const session = {
        user: {
          id: 'admin-local-uid',
          email,
          role: 'admin',
          user_metadata: { full_name: 'Spa Administrator' }
        },
        access_token: 'demo-token-' + Date.now(),
        expires_at: Date.now() + 86400000
      };
      setStored(STORAGE_KEYS.ADMIN_AUTH, session);
      return { session, user: session.user };
    }
    throw new Error('Invalid email or password. Default demo credentials are admin@lotusluxespa.com / admin123');
  },

  async logoutAdmin() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },

  async resetAdminPassword(email) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`
      });
      if (error) throw error;
      return data;
    }
    // Demo Mode fallback
    return { success: true, message: 'Password recovery email dispatched (Demo Mode)' };
  },

  async uploadStorageAsset(bucket, file, customFileName = '') {
    if (isSupabaseConfigured) {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = customFileName || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (error) throw error;

      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return publicData.publicUrl;
    }

    // Demo Mode fallback: Return base64 or temporary object URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  },

  async getAdminSession() {
    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
    return getStored(STORAGE_KEYS.ADMIN_AUTH, null);
  },

  // -----------------------------------------------------------------------
  // SETTINGS
  // -----------------------------------------------------------------------
  async getSettings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) return data;
    }
    return getStored(STORAGE_KEYS.SETTINGS, {
      business_name: initialSiteConfig.name,
      short_name: initialSiteConfig.shortName,
      tagline: initialSiteConfig.tagline,
      description: "Delhi NCR's premiere luxury spa featuring authentic Russian Banya and certified international specialists.",
      logo_url: "",
      favicon_url: "/favicon.svg",
      primary_phone: initialSiteConfig.contact.primaryPhone,
      phone_tel: initialSiteConfig.contact.phoneTel,
      whatsapp_number: initialSiteConfig.contact.whatsappNumber,
      secondary_phone: initialSiteConfig.contact.secondaryPhone,
      secondary_phone_tel: initialSiteConfig.contact.secondaryPhoneTel,
      email: initialSiteConfig.contact.email,
      support_email: initialSiteConfig.contact.supportEmail,
      address_line1: initialSiteConfig.contact.primaryAddress.addressLine1,
      address_line2: initialSiteConfig.contact.primaryAddress.addressLine2,
      city: initialSiteConfig.contact.primaryAddress.city,
      state: initialSiteConfig.contact.primaryAddress.state,
      pincode: initialSiteConfig.contact.primaryAddress.pincode,
      country: initialSiteConfig.contact.primaryAddress.country,
      google_maps_url: initialSiteConfig.contact.primaryAddress.googleMapsUrl,
      map_embed_url: initialSiteConfig.contact.primaryAddress.mapEmbedUrl,
      opening_hours: initialSiteConfig.contact.hours,
      is_24_hours: true,
      currency_symbol: initialSiteConfig.currency,
      currency_code: "INR",
      primary_gold_color: "#D4AF37",
      accent_color: "#C5A059",
      instagram_url: initialSiteConfig.socials.instagram,
      facebook_url: initialSiteConfig.socials.facebook,
      youtube_url: initialSiteConfig.socials.youtube,
      promo_badge: initialSiteConfig.promotion.badge,
      promo_headline: initialSiteConfig.promotion.headline,
      promo_code: initialSiteConfig.promotion.code,
      promo_subtext: initialSiteConfig.promotion.subtext,
      is_promo_enabled: true,
      payment_provider: 'none',
      payment_deposit_percent: 0,
      publishable_key: ''
    });
  },

  async updateSettings(newSettings) {
    if (isSupabaseConfigured) {
      const payload = {
        ...newSettings,
        business_id: newSettings.business_id || currentBusinessId,
        updated_at: new Date().toISOString()
      };
      const { data, error } = await supabase
        .from('business_settings')
        .upsert(payload);
      if (error) throw error;
      return data;
    }
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings, updated_at: new Date().toISOString() };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // -----------------------------------------------------------------------
  // SERVICES (CRUD)
  // -----------------------------------------------------------------------
  async getServices() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return getStored(STORAGE_KEYS.SERVICES, initialServices);
  },

  async createService(service) {
    const payload = {
      ...service,
      business_id: service.business_id || currentBusinessId
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('services').insert([payload]).select().single();
      if (error) throw error;
      return data;
    }
    const list = await this.getServices();
    const newService = { ...service, id: service.id || `svc-${Date.now()}`, is_active: true };
    const updated = [newService, ...list];
    setStored(STORAGE_KEYS.SERVICES, updated);
    return newService;
  },

  async updateService(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
    const list = await this.getServices();
    const updated = list.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setStored(STORAGE_KEYS.SERVICES, updated);
    return updated.find((s) => s.id === id);
  },

  async deleteService(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    const list = await this.getServices();
    const updated = list.filter((s) => s.id !== id);
    setStored(STORAGE_KEYS.SERVICES, updated);
    return true;
  },

  // -----------------------------------------------------------------------
  // THERAPISTS (CRUD)
  // -----------------------------------------------------------------------
  async getTherapists() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return getStored(STORAGE_KEYS.THERAPISTS, initialTherapists);
  },

  async createTherapist(therapist) {
    const payload = {
      ...therapist,
      business_id: therapist.business_id || currentBusinessId
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('therapists').insert([payload]).select().single();
      if (error) throw error;
      return data;
    }
    const list = await this.getTherapists();
    const newTherapist = { ...therapist, id: therapist.id || `th-${Date.now()}`, is_active: true };
    const updated = [newTherapist, ...list];
    setStored(STORAGE_KEYS.THERAPISTS, updated);
    return newTherapist;
  },

  async updateTherapist(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('therapists').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
    const list = await this.getTherapists();
    const updated = list.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setStored(STORAGE_KEYS.THERAPISTS, updated);
    return updated.find((t) => t.id === id);
  },

  async deleteTherapist(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('therapists').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    const list = await this.getTherapists();
    const updated = list.filter((t) => t.id !== id);
    setStored(STORAGE_KEYS.THERAPISTS, updated);
    return true;
  },

  // -----------------------------------------------------------------------
  // BOOKINGS (CRUD & DOUBLE BOOKING PREVENTION)
  // -----------------------------------------------------------------------
  async getBookings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getStored(STORAGE_KEYS.BOOKINGS, initialSampleBookings);
  },

  /**
   * Check if a therapist is already booked or occupied on a date and time slot
   */
  async checkDoubleBooking(therapistId, bookingDate, bookingTime, duration = '60 Mins', bufferMinutes = 15) {
    if (!therapistId || therapistId === 'any' || therapistId.toLowerCase().includes('any')) {
      return false; // Flexible pool
    }

    const bookings = await this.getBookings();
    return availabilityService.isTherapistOccupied(
      therapistId,
      bookingDate,
      bookingTime,
      duration,
      bookings,
      bufferMinutes
    );
  },

  async createBooking(bookingData) {
    const bufferMinutes = bookingData.buffer_minutes || 15;
    const duration = bookingData.duration || '60 Mins';

    // 1. Check if date/time is in the past
    if (availabilityService.isTimeInPast(bookingData.booking_date, bookingData.booking_time)) {
      throw new Error('Invalid reservation schedule: Cannot book appointment slots in the past.');
    }

    // 2. Conflict validation taking duration + buffer into account
    const isConflict = await this.checkDoubleBooking(
      bookingData.therapist_id,
      bookingData.booking_date,
      bookingData.booking_time,
      duration,
      bufferMinutes
    );

    if (isConflict) {
      throw new Error(
        `This specialist is already reserved on ${bookingData.booking_date} around ${bookingData.booking_time}. Please select another time or specialist.`
      );
    }

    // 3. Resolve specialist if "any" was selected
    let assignedTherapistId = bookingData.therapist_id;
    let assignedTherapistName = bookingData.therapist_name;

    if (!assignedTherapistId || assignedTherapistId === 'any' || assignedTherapistId.toLowerCase().includes('any')) {
      const therapists = await this.getTherapists();
      const existingBookings = await this.getBookings();
      const resolved = availabilityService.resolveTherapist({
        therapistId: 'any',
        dateStr: bookingData.booking_date,
        timeStr: bookingData.booking_time,
        serviceDuration: duration,
        therapists,
        existingBookings,
        bufferMinutes
      });
      assignedTherapistId = resolved.id;
      assignedTherapistName = resolved.name;
    }

    // 4. Try Supabase Atomic RPC first if connected
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('book_spa_appointment', {
          p_business_id: bookingData.business_id || currentBusinessId,
          p_service_id: bookingData.service_id,
          p_service_name: bookingData.service_name,
          p_therapist_id: assignedTherapistId,
          p_therapist_name: assignedTherapistName,
          p_booking_date: bookingData.booking_date,
          p_booking_time: bookingData.booking_time,
          p_duration: duration,
          p_total_price: Number(bookingData.total_price),
          p_customer_name: bookingData.customer_name,
          p_customer_phone: bookingData.customer_phone,
          p_customer_email: bookingData.customer_email,
          p_payment_method: bookingData.payment_method || 'pay_at_spa',
          p_notes: bookingData.notes || null,
          p_buffer_minutes: bufferMinutes
        });

        if (!error && data) {
          return data;
        }
        if (error && error.message && error.message.includes('Double-Booking Conflict')) {
          throw new Error(error.message);
        }
      } catch (rpcErr) {
        if (rpcErr.message && rpcErr.message.includes('Double-Booking Conflict')) {
          throw rpcErr;
        }
        // Fallback to direct table insertion if RPC is not yet created in remote DB
      }
    }

    // Generate unique booking reference LL-YYYY-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const booking_reference = `LL-${new Date().getFullYear()}-${randomSuffix}`;

    const completeRecord = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      business_id: bookingData.business_id || currentBusinessId,
      booking_reference,
      therapist_id: assignedTherapistId,
      therapist_name: assignedTherapistName,
      duration,
      buffer_minutes: bufferMinutes,
      booking_status: bookingData.booking_status || 'pending',
      payment_status: bookingData.payment_status || 'unpaid',
      payment_method: bookingData.payment_method || 'pay_at_spa',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bookings')
        .insert([completeRecord])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const list = await this.getBookings();
    const updated = [completeRecord, ...list];
    setStored(STORAGE_KEYS.BOOKINGS, updated);

    // Also register or update customer record in CRM
    await this.registerCustomerFromBooking(completeRecord);

    return completeRecord;
  },

  async updateBookingStatus(id, newStatus, cancellationReason = '') {
    const updates = {
      booking_status: newStatus,
      cancellation_reason: cancellationReason,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const list = await this.getBookings();
    const updated = list.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setStored(STORAGE_KEYS.BOOKINGS, updated);
    return updated.find((b) => b.id === id);
  },

  async rescheduleBooking(id, newDate, newTime, newTherapistId = null, newTherapistName = null) {
    // Prevent past date/time
    if (availabilityService.isTimeInPast(newDate, newTime)) {
      throw new Error('Cannot reschedule to a past date or time.');
    }

    // Try Supabase RPC first
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('reschedule_spa_appointment', {
          p_booking_id: id,
          p_new_date: newDate,
          p_new_time: newTime,
          p_new_therapist_id: newTherapistId,
          p_new_therapist_name: newTherapistName
        });
        if (!error && data) return data;
      } catch (err) {
        // Fall back to table update
      }
    }

    const bookings = await this.getBookings();
    const target = bookings.find((b) => b.id === id);
    if (!target) throw new Error('Booking not found.');

    const finalTherapistId = newTherapistId || target.therapist_id;
    const finalTherapistName = newTherapistName || target.therapist_name;

    // Check conflict (excluding current booking id)
    const isOccupied = bookings.some(
      (b) =>
        b.id !== id &&
        b.therapist_id === finalTherapistId &&
        b.booking_date === newDate &&
        b.booking_time === newTime &&
        b.booking_status !== 'cancelled'
    );

    if (isOccupied) {
      throw new Error(`Specialist ${finalTherapistName} is already occupied on ${newDate} at ${newTime}.`);
    }

    const updates = {
      booking_date: newDate,
      booking_time: newTime,
      therapist_id: finalTherapistId,
      therapist_name: finalTherapistName,
      booking_status: 'confirmed',
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const updated = bookings.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setStored(STORAGE_KEYS.BOOKINGS, updated);
    return updated.find((b) => b.id === id);
  },

  // -----------------------------------------------------------------------
  // CUSTOMERS CRM
  // -----------------------------------------------------------------------
  async getCustomers() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getStored(STORAGE_KEYS.CUSTOMERS, initialSampleCustomers);
  },

  async registerCustomerFromBooking(booking) {
    const customers = await this.getCustomers();
    const existingIndex = customers.findIndex(
      (c) => c.email.toLowerCase() === booking.customer_email.toLowerCase()
    );

    if (existingIndex >= 0) {
      customers[existingIndex].total_bookings = (customers[existingIndex].total_bookings || 1) + 1;
      customers[existingIndex].total_spent = (customers[existingIndex].total_spent || 0) + (booking.total_price || 0);
      customers[existingIndex].updated_at = new Date().toISOString();
    } else {
      customers.unshift({
        id: `cust-${Date.now()}`,
        name: booking.customer_name,
        phone: booking.customer_phone,
        email: booking.customer_email,
        notes: booking.notes || "New reservation",
        total_bookings: 1,
        total_spent: booking.total_price || 0,
        created_at: new Date().toISOString()
      });
    }

    setStored(STORAGE_KEYS.CUSTOMERS, customers);
  },

  // -----------------------------------------------------------------------
  // GALLERY (CRUD)
  // -----------------------------------------------------------------------
  async getGallery() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return getStored(STORAGE_KEYS.GALLERY, initialGallery);
  },

  async createGalleryImage(image) {
    const payload = {
      ...image,
      business_id: image.business_id || currentBusinessId
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('gallery_images').insert([payload]).select().single();
      if (error) throw error;
      return data;
    }
    const list = await this.getGallery();
    const newImage = { ...image, id: Date.now(), is_active: true };
    const updated = [newImage, ...list];
    setStored(STORAGE_KEYS.GALLERY, updated);
    return newImage;
  },

  async deleteGalleryImage(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    const list = await this.getGallery();
    const updated = list.filter((img) => img.id !== id);
    setStored(STORAGE_KEYS.GALLERY, updated);
    return true;
  }
};

