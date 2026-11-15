import { siteConfig } from '../config/siteConfig';

/**
 * Format numeric value as currency
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number') return amount;
  return `${siteConfig.currency} ${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculate percentage discount
 */
export function getDiscountPercentage(original, current) {
  if (!original || !current || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Clean phone number for tel: links
 */
export function sanitizeTel(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Build WhatsApp click URL
 */
export function buildWhatsAppUrl(message = '') {
  const number = siteConfig.contact.whatsappNumber;
  if (!message) {
    message = `Hello ${siteConfig.name}, I would like to inquire about spa treatments and availability.`;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

