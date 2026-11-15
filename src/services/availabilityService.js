/**
 * Luxury Spa Availability & Scheduling Engine
 * Handles:
 * 1. Service duration + turnover buffer calculation
 * 2. Real-time slot conflict detection & overlapping interval checks
 * 3. Past-date and past-time blocking
 * 4. "Any Available Therapist" dynamic resolution & load balancing
 * 5. Operating hours alignment
 */

export const availabilityService = {
  // Default operational time slots
  STANDARD_SLOTS: [
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
    '08:30 PM',
    '10:00 PM',
    '11:30 PM',
    '01:00 AM (24/7)',
    '03:00 AM (24/7)'
  ],

  DEFAULT_BUFFER_MINUTES: 15,

  /**
   * Parse duration string to numeric minutes
   * e.g. "60 Mins" -> 60, "90 Mins" -> 90, "2 Hours" -> 120
   */
  parseDurationMinutes(durationStr) {
    if (!durationStr) return 60;
    if (typeof durationStr === 'number') return durationStr;
    const clean = String(durationStr).toLowerCase();
    const matchHours = clean.match(/(\d+)\s*(hour|hr)/);
    if (matchHours) return parseInt(matchHours[1], 10) * 60;
    const matchMins = clean.match(/(\d+)\s*(min|m)/);
    if (matchMins) return parseInt(matchMins[1], 10);
    const num = parseInt(clean, 10);
    return isNaN(num) ? 60 : num;
  },

  /**
   * Parse "10:00 AM" or "02:30 PM" to minutes from midnight (0 - 1439)
   */
  parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const clean = timeStr.replace(/\(.*?\)/g, '').trim(); // Remove (24/7) tags
    const parts = clean.split(/[:\s]/);
    if (parts.length < 2) return 0;

    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10) || 0;
    const modifier = (parts[2] || '').toUpperCase();

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  },

  /**
   * Format minutes from midnight to "HH:MM AM/PM"
   */
  formatMinutesToTime(totalMinutes) {
    let normalized = totalMinutes % 1440;
    if (normalized < 0) normalized += 1440;
    let hours = Math.floor(normalized / 60);
    const mins = normalized % 60;
    const modifier = hours >= 12 ? 'PM' : 'AM';
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    const paddedMins = String(mins).padStart(2, '0');
    const paddedHours = String(hours).padStart(2, '0');
    return `${paddedHours}:${paddedMins} ${modifier}`;
  },

  /**
   * Checks if an appointment date & time is in the past
   * Includes 30-minute lead buffer for same-day bookings
   */
  isTimeInPast(dateStr, timeStr) {
    if (!dateStr || !timeStr) return false;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // If date is before today
    if (dateStr < todayStr) return true;

    // If date is today, check if time has already passed
    if (dateStr === todayStr) {
      const currentMinutes = today.getHours() * 60 + today.getMinutes();
      const slotMinutes = this.parseTimeToMinutes(timeStr);
      // Give at least 30 minutes lead time to book
      if (slotMinutes <= currentMinutes + 30) {
        return true;
      }
    }

    return false;
  },

  /**
   * Check whether two time intervals overlap, taking service duration and turnaround buffer into account
   */
  doIntervalsOverlap(startA, durationA, startB, durationB, bufferMinutes = 15) {
    const endA = startA + durationA + bufferMinutes;
    const endB = startB + durationB + bufferMinutes;
    // Overlap: interval A starts before B ends, and B starts before A ends
    return startA < endB && startB < endA;
  },

  /**
   * Check if a specific therapist is booked/occupied during a requested window
   */
  isTherapistOccupied(therapistId, dateStr, requestedTime, requestedDuration, existingBookings, bufferMinutes = 15) {
    if (!therapistId || therapistId === 'any') return false;

    const requestedStart = this.parseTimeToMinutes(requestedTime);
    const requestedDur = this.parseDurationMinutes(requestedDuration);

    return existingBookings.some((b) => {
      if (b.booking_status === 'cancelled') return false;
      if (b.therapist_id !== therapistId) return false;
      if (b.booking_date !== dateStr) return false;

      const bookingStart = this.parseTimeToMinutes(b.booking_time);
      const bookingDur = this.parseDurationMinutes(b.duration || 60);

      return this.doIntervalsOverlap(
        requestedStart,
        requestedDur,
        bookingStart,
        bookingDur,
        bufferMinutes
      );
    });
  },

  /**
   * Calculate available time slots for a given therapist, date, and service
   * If therapist is 'any', a slot is available if at least ONE active therapist is free!
   */
  calculateSlotAvailability({
    therapistId = 'any',
    dateStr,
    serviceDuration = '60 Mins',
    bufferMinutes = 15,
    therapists = [],
    existingBookings = [],
    customSlots = null
  }) {
    const slots = customSlots || this.STANDARD_SLOTS;
    const activeTherapists = therapists.filter((t) => t.is_active !== false);
    const isAnyTherapist = !therapistId || therapistId === 'any' || therapistId.toLowerCase().includes('any');

    return slots.map((slot) => {
      // 1. Check if past
      const isPast = this.isTimeInPast(dateStr, slot);
      if (isPast) {
        return {
          slot,
          available: false,
          reason: 'Past Time',
          availableTherapists: []
        };
      }

      // 2. Check conflict
      if (isAnyTherapist) {
        // Find which therapists are available for this slot
        const availableTherapists = activeTherapists.filter((th) => {
          return !this.isTherapistOccupied(
            th.id,
            dateStr,
            slot,
            serviceDuration,
            existingBookings,
            bufferMinutes
          );
        });

        const isAvailable = availableTherapists.length > 0;
        return {
          slot,
          available: isAvailable,
          reason: isAvailable ? null : 'All Specialists Booked',
          availableTherapists
        };
      } else {
        // Specific therapist selected
        const isOccupied = this.isTherapistOccupied(
          therapistId,
          dateStr,
          slot,
          serviceDuration,
          existingBookings,
          bufferMinutes
        );

        return {
          slot,
          available: !isOccupied,
          reason: isOccupied ? 'Specialist Reserved' : null,
          availableTherapists: isOccupied ? [] : [therapists.find((t) => t.id === therapistId)].filter(Boolean)
        };
      }
    });
  },

  /**
   * Auto-assign an available therapist when "any" is selected
   */
  resolveTherapist({
    therapistId,
    dateStr,
    timeStr,
    serviceDuration = '60 Mins',
    therapists = [],
    existingBookings = [],
    bufferMinutes = 15
  }) {
    if (therapistId && therapistId !== 'any' && !therapistId.toLowerCase().includes('any')) {
      const selected = therapists.find((t) => t.id === therapistId);
      return selected ? { id: selected.id, name: selected.name } : { id: therapistId, name: therapistId };
    }

    const activeTherapists = therapists.filter((t) => t.is_active !== false);
    const available = activeTherapists.filter((th) => {
      return !this.isTherapistOccupied(
        th.id,
        dateStr,
        timeStr,
        serviceDuration,
        existingBookings,
        bufferMinutes
      );
    });

    if (available.length === 0) {
      throw new Error(`No specialists are available on ${dateStr} at ${timeStr}. Please select another time.`);
    }

    // Load-balance: pick the therapist who has the fewest bookings on this day
    const dayBookings = existingBookings.filter((b) => b.booking_date === dateStr && b.booking_status !== 'cancelled');
    const sorted = [...available].sort((a, b) => {
      const countA = dayBookings.filter((bk) => bk.therapist_id === a.id).length;
      const countB = dayBookings.filter((bk) => bk.therapist_id === b.id).length;
      return countA - countB;
    });

    return {
      id: sorted[0].id,
      name: `${sorted[0].name} (Assigned Specialist)`
    };
  }
};

