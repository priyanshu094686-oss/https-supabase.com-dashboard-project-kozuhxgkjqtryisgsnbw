import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../lib/supabase';
import { notificationService } from '../services/notificationService';
import { useSettings } from './SettingsContext';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { settings } = useSettings();
  const [services, setServices] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all initial data
  const refreshData = async () => {
    try {
      setLoading(true);
      const [sList, tList, bList, cList, gList] = await Promise.all([
        dbService.getServices(),
        dbService.getTherapists(),
        dbService.getBookings(),
        dbService.getCustomers(),
        dbService.getGallery()
      ]);
      setServices(sList);
      setTherapists(tList);
      setBookings(bList);
      setCustomers(cList);
      setGallery(gList);
    } catch (err) {
      console.error('Failed to load booking context data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  /**
   * Check if a specific time slot is already booked for a therapist on a date
   */
  const isSlotBooked = (therapistId, date, timeSlot) => {
    if (!therapistId || therapistId === 'any' || therapistId.includes('Any')) {
      return false;
    }
    return bookings.some(
      (b) =>
        b.therapist_id === therapistId &&
        b.booking_date === date &&
        b.booking_time === timeSlot &&
        b.booking_status !== 'cancelled'
    );
  };

  /**
   * Get list of all booked slots for a given therapist and date
   */
  const getBookedSlotsForDate = (therapistId, date) => {
    if (!therapistId || !date) return [];
    return bookings
      .filter(
        (b) =>
          b.therapist_id === therapistId &&
          b.booking_date === date &&
          b.booking_status !== 'cancelled'
      )
      .map((b) => b.booking_time);
  };

  /**
   * Create a new appointment booking with conflict checking
   */
  const createBooking = async (bookingData) => {
    // 1. Conflict validation
    const hasConflict = isSlotBooked(
      bookingData.therapist_id,
      bookingData.booking_date,
      bookingData.booking_time
    );

    if (hasConflict) {
      throw new Error(
        `Specialist conflict: ${bookingData.therapist_name} is already reserved for ${bookingData.booking_date} at ${bookingData.booking_time}. Please pick an open time slot.`
      );
    }

    // 2. Insert into database/store
    const newBooking = await dbService.createBooking(bookingData);

    // 3. Dispatch notifications
    await notificationService.sendNotification('customer_confirmation', newBooking, settings);
    await notificationService.sendNotification('admin_alert', newBooking, settings);

    // 4. Update local state
    setBookings((prev) => [newBooking, ...prev]);
    const updatedCustomers = await dbService.getCustomers();
    setCustomers(updatedCustomers);

    return newBooking;
  };

  /**
   * Update booking status (confirm, cancel, complete)
   */
  const updateBookingStatus = async (id, status, cancellationReason = '') => {
    const updated = await dbService.updateBookingStatus(id, status, cancellationReason);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));

    if (status === 'cancelled') {
      await notificationService.sendNotification('cancellation', updated, settings, { reason: cancellationReason });
    }

    return updated;
  };

  // CRUD helpers for Services
  const addService = async (serviceData) => {
    const created = await dbService.createService(serviceData);
    setServices((prev) => [created, ...prev]);
    return created;
  };

  const editService = async (id, updates) => {
    const updated = await dbService.updateService(id, updates);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const removeService = async (id) => {
    await dbService.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  // CRUD helpers for Therapists
  const addTherapist = async (therapistData) => {
    const created = await dbService.createTherapist(therapistData);
    setTherapists((prev) => [created, ...prev]);
    return created;
  };

  const editTherapist = async (id, updates) => {
    const updated = await dbService.updateTherapist(id, updates);
    setTherapists((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const removeTherapist = async (id) => {
    await dbService.deleteTherapist(id);
    setTherapists((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  // CRUD helpers for Gallery
  const addGalleryImage = async (imgData) => {
    const created = await dbService.createGalleryImage(imgData);
    setGallery((prev) => [created, ...prev]);
    return created;
  };

  const removeGalleryImage = async (id) => {
    await dbService.deleteGalleryImage(id);
    setGallery((prev) => prev.filter((img) => img.id !== id));
    return true;
  };

  return (
    <BookingContext.Provider
      value={{
        services,
        therapists,
        bookings,
        customers,
        gallery,
        loading,
        refreshData,
        isSlotBooked,
        getBookedSlotsForDate,
        createBooking,
        updateBookingStatus,
        addService,
        editService,
        removeService,
        addTherapist,
        editTherapist,
        removeTherapist,
        addGalleryImage,
        removeGalleryImage
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

