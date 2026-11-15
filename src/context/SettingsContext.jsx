import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../lib/supabase';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load business settings on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await dbService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load business settings', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Update business settings and persist to database/store
  const updateSettings = async (updates) => {
    try {
      const updated = await dbService.updateSettings(updates);
      setSettings(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update business settings', err);
      throw err;
    }
  };

  // Dynamic helper: format currency
  const formatPrice = (amount) => {
    if (typeof amount !== 'number') return amount;
    const symbol = settings?.currency_symbol || '₹';
    return `${symbol} ${amount.toLocaleString('en-IN')}`;
  };

  // Dynamic helper: generate WhatsApp reservation link
  const generateWhatsAppLink = (details = {}) => {
    const number = settings?.whatsapp_number || '919876543210';
    const brandName = settings?.business_name || 'Lotus Luxe Spa';

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
      `Hello ${brandName} Concierge! 🌸✨\n\n` +
      `I would like to reserve a luxury appointment:\n` +
      `• Guest Name: ${name}\n` +
      (phone ? `• Contact: ${phone}\n` : '') +
      `• Service: ${service}\n` +
      `• Preferred Specialist: ${therapist}\n` +
      `• Date: ${date}\n` +
      `• Preferred Time: ${time}\n` +
      (notes ? `• Special Requests: ${notes}\n` : '') +
      `\nPlease confirm suite availability. Thank you!`
    );

    return `https://wa.me/${number}?text=${message}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        formatPrice,
        generateWhatsAppLink
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

