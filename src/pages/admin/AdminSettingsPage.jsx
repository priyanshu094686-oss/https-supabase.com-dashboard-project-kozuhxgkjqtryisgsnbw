import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  DollarSign,
  Palette,
  CreditCard,
  Share2,
  Tag,
  Mail,
  Send,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSettings } from '../../context/SettingsContext';
import { dbService } from '../../lib/supabase';
import { notificationService } from '../../services/notificationService';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('branding');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await dbService.uploadStorageAsset('business-logos', file);
        setFormData((prev) => ({ ...prev, logo_url: publicUrl }));
      } catch (err) {
        alert('Logo upload failed: ' + err.message);
      }
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    business_name: '',
    short_name: '',
    tagline: '',
    description: '',
    logo_url: '',
    favicon_url: '',
    primary_phone: '',
    phone_tel: '',
    whatsapp_number: '',
    secondary_phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    google_maps_url: '',
    map_embed_url: '',
    opening_hours: '',
    is_24_hours: true,
    currency_symbol: '₹',
    currency_code: 'INR',
    primary_gold_color: '#D4AF37',
    accent_color: '#C5A059',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    promo_badge: '',
    promo_headline: '',
    promo_code: '',
    promo_subtext: '',
    is_promo_enabled: true,
    payment_provider: 'none',
    payment_deposit_percent: 0,
    publishable_key: '',
    is_email_notifications_enabled: true,
    admin_alert_email: 'concierge@lotusluxespa.com',
    email_sender_name: 'Lotus Luxe Spa & Wellness',
    email_sender_address: 'onboarding@resend.dev'
  });

  // Test Email State
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState(null);

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient.trim()) {
      alert('Please enter a recipient email address.');
      return;
    }
    setSendingTestEmail(true);
    setTestEmailStatus(null);
    try {
      const res = await notificationService.sendTestEmail(testEmailRecipient.trim(), formData);
      setTestEmailStatus({
        success: res.success !== false,
        message: res.message || 'Test email dispatched successfully!'
      });
    } catch (err) {
      setTestEmailStatus({
        success: false,
        message: err.message || 'Failed to dispatch test email.'
      });
    } finally {
      setSendingTestEmail(false);
    }
  };

  useEffect(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || '',
        short_name: settings.short_name || '',
        tagline: settings.tagline || '',
        description: settings.description || '',
        logo_url: settings.logo_url || '',
        favicon_url: settings.favicon_url || '/favicon.svg',
        primary_phone: settings.primary_phone || '',
        phone_tel: settings.phone_tel || '',
        whatsapp_number: settings.whatsapp_number || '',
        secondary_phone: settings.secondary_phone || '',
        email: settings.email || '',
        address_line1: settings.address_line1 || '',
        address_line2: settings.address_line2 || '',
        city: settings.city || '',
        state: settings.state || '',
        pincode: settings.pincode || '',
        country: settings.country || '',
        google_maps_url: settings.google_maps_url || '',
        map_embed_url: settings.map_embed_url || '',
        opening_hours: settings.opening_hours || '',
        is_24_hours: settings.is_24_hours !== false,
        currency_symbol: settings.currency_symbol || '₹',
        currency_code: settings.currency_code || 'INR',
        primary_gold_color: settings.primary_gold_color || '#D4AF37',
        accent_color: settings.accent_color || '#C5A059',
        instagram_url: settings.instagram_url || '',
        facebook_url: settings.facebook_url || '',
        youtube_url: settings.youtube_url || '',
        promo_badge: settings.promo_badge || '',
        promo_headline: settings.promo_headline || '',
        promo_code: settings.promo_code || '',
        promo_subtext: settings.promo_subtext || '',
        is_promo_enabled: settings.is_promo_enabled !== false,
        payment_provider: settings.payment_provider || 'none',
        payment_deposit_percent: settings.payment_deposit_percent || 0,
        publishable_key: settings.publishable_key || '',
        is_email_notifications_enabled: settings.is_email_notifications_enabled !== false,
        admin_alert_email: settings.admin_alert_email || settings.email || 'concierge@lotusluxespa.com',
        email_sender_name: settings.email_sender_name || settings.business_name || 'Lotus Luxe Spa & Wellness',
        email_sender_address: settings.email_sender_address || 'onboarding@resend.dev'
      });
      if (settings.admin_alert_email || settings.email) {
        setTestEmailRecipient(settings.admin_alert_email || settings.email);
      }
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'branding', label: 'Branding & Identity', icon: Sparkles },
    { id: 'contact', label: 'Contact & Addresses', icon: Phone },
    { id: 'hours', label: 'Hours & Currency', icon: Clock },
    { id: 'socials', label: 'Social & Promotions', icon: Share2 },
    { id: 'payment', label: 'Payment Integration', icon: CreditCard },
    { id: 'email', label: 'Email Notifications', icon: Mail }
  ];

  return (
    <AdminLayout
      title="White-Label Business Configuration"
      subtitle="Customize branding, logo, telephone lines, WhatsApp number, maps, currency, and payment gateway."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#0e121c] border border-stone-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Settings Saved Successfully!</strong> All customer-facing pages and WhatsApp links are now updated with your new business information.
            </span>
          </div>
        )}

        {/* Tab 1: Branding & Identity */}
        {activeTab === 'branding' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 space-y-5">
            <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span>Brand Identity & Design</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Full Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Short Name (Navbar Logo) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.short_name}
                  onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                Spa Description (SEO & About)
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#131722] border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Logo (Upload Photo or Image URL)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-xs text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
                  />
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="Leave empty to use stylized vector logo"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
                {formData.logo_url && (
                  <div className="mt-2 h-14 w-auto max-w-[200px] p-2 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center">
                    <img src={formData.logo_url} alt="Logo Preview" className="h-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Primary Theme Gold Accent
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primary_gold_color}
                    onChange={(e) => setFormData({ ...formData, primary_gold_color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.primary_gold_color}
                    onChange={(e) => setFormData({ ...formData, primary_gold_color: e.target.value })}
                    className="flex-1 bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 uppercase focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contact & Addresses */}
        {activeTab === 'contact' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 space-y-5">
            <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <Phone className="w-5 h-5 text-gold-400" />
              <span>Contact Lines & Maps Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Primary Phone Number (Display) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.primary_phone}
                  onChange={(e) => setFormData({ ...formData, primary_phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  WhatsApp Number (with Country Code, no +) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="919876543210"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Secondary Phone (Optional)
                </label>
                <input
                  type="text"
                  value={formData.secondary_phone}
                  onChange={(e) => setFormData({ ...formData, secondary_phone: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  placeholder="L-Block, Mahipalpur Extension"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Address Line 2 / Landmark
                </label>
                <input
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                  placeholder="Near IGI Airport Terminal 3 & Aerocity"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                Google Maps Directions URL
              </label>
              <input
                type="url"
                value={formData.google_maps_url}
                onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Hours & Currency */}
        {activeTab === 'hours' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 space-y-5">
            <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-400" />
              <span>Operations & Currency</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Opening Hours Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.opening_hours}
                  onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                  placeholder="24 Hours / 7 Days a Week"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="is_24_hours"
                  checked={formData.is_24_hours}
                  onChange={(e) => setFormData({ ...formData, is_24_hours: e.target.checked })}
                  className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-stone-900 border-stone-700"
                />
                <label htmlFor="is_24_hours" className="text-xs text-stone-300 font-semibold">
                  Enable 24/7 Airport Layover Badge
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Currency Symbol *
                </label>
                <input
                  type="text"
                  required
                  value={formData.currency_symbol}
                  onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                  placeholder="₹, $, €, £, AED..."
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Currency Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.currency_code}
                  onChange={(e) => setFormData({ ...formData, currency_code: e.target.value })}
                  placeholder="INR, USD, EUR, GBP, AED..."
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Socials & Promotions */}
        {activeTab === 'socials' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 space-y-5">
            <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gold-400" />
              <span>Social Links & Seasonal Promotion Banner</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 space-y-4">
              <h4 className="text-sm font-serif font-semibold text-gold-400">
                Seasonal Promotion Banner
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Promotion Badge
                  </label>
                  <input
                    type="text"
                    value={formData.promo_badge}
                    onChange={(e) => setFormData({ ...formData, promo_badge: e.target.value })}
                    placeholder="Special Seasonal Privilege"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={formData.promo_code}
                    onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                    placeholder="LUXE20"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Headline Text
                </label>
                <input
                  type="text"
                  value={formData.promo_headline}
                  onChange={(e) => setFormData({ ...formData, promo_headline: e.target.value })}
                  placeholder="Flat 20% Off on All Russian Banya & Signature Couple Suites"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Payment Gateway */}
        {activeTab === 'payment' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 space-y-5">
            <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gold-400" />
              <span>Optional Payment Gateway Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Active Payment Provider
                </label>
                <select
                  value={formData.payment_provider}
                  onChange={(e) => setFormData({ ...formData, payment_provider: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                >
                  <option value="none">None (Pay at Spa Upon Arrival - Recommended)</option>
                  <option value="stripe">Stripe Checkout (Global / US / UK / EU)</option>
                  <option value="razorpay">Razorpay (India / UPI / Cards)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Required Upfront Deposit (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.payment_deposit_percent}
                  onChange={(e) => setFormData({ ...formData, payment_deposit_percent: Number(e.target.value) })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Set to 0 for Pay at Spa; 20 for 20% advance; 100 for full upfront payment.
                </span>
              </div>
            </div>

            {formData.payment_provider !== 'none' && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Publishable Key ({formData.payment_provider.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={formData.publishable_key}
                  onChange={(e) => setFormData({ ...formData, publishable_key: e.target.value })}
                  placeholder={
                    formData.payment_provider === 'stripe'
                      ? 'pk_live_...'
                      : 'rzp_live_...'
                  }
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 font-mono focus:outline-none focus:border-gold-400"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Keep secret API keys strictly in environment variables (.env), never in client settings.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Email Notifications */}
        {activeTab === 'email' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gold-400" />
                  <span>Automated Email Notification Settings</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Powered by Resend with Supabase Edge Functions. Configurable recipient alerts and customer updates.
                </p>
              </div>

              {/* Master Enable/Disable Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-xs font-semibold text-stone-300">
                  {formData.is_email_notifications_enabled ? 'Notifications Enabled' : 'Notifications Paused'}
                </span>
                <input
                  type="checkbox"
                  checked={formData.is_email_notifications_enabled}
                  onChange={(e) => setFormData({ ...formData, is_email_notifications_enabled: e.target.checked })}
                  className="w-5 h-5 rounded text-gold-500 focus:ring-gold-400 accent-gold-500 cursor-pointer"
                />
              </label>
            </div>

            {/* Email Addresses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Spa Owner / Concierge Alert Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.admin_alert_email}
                  onChange={(e) => setFormData({ ...formData, admin_alert_email: e.target.value })}
                  placeholder="owner@lotusluxespa.com"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  New reservations, cancellations, and rescheduling alerts are sent to this address.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Sender Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.email_sender_name}
                  onChange={(e) => setFormData({ ...formData, email_sender_name: e.target.value })}
                  placeholder="Lotus Luxe Spa Concierge"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  The brand or concierge name guests will see in their email inbox.
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Sender From Email Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.email_sender_address}
                  onChange={(e) => setFormData({ ...formData, email_sender_address: e.target.value })}
                  placeholder="concierge@lotusluxespa.com or onboarding@resend.dev"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-100 font-mono focus:outline-none focus:border-gold-400"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  During development or testing, use <code className="text-gold-400">onboarding@resend.dev</code>. In production, use your verified custom domain address.
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-gold-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="text-stone-200">Server-Side Secret Key Protection</strong>
                <p className="text-stone-400 leading-relaxed">
                  Your Resend API Key is stored securely as an encrypted Supabase Secret (<code className="text-gold-300 font-mono">RESEND_API_KEY</code>) inside the Supabase Edge Function environment. Secret keys are never exposed in public forms or frontend bundles.
                </p>
              </div>
            </div>

            {/* Diagnostic Send Test Email Section */}
            <div className="p-5 rounded-2xl bg-[#141924] border border-stone-800 space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-gold-400 font-bold flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>Test Email Connectivity</span>
              </h4>
              <p className="text-xs text-stone-400">
                Dispatch an immediate test message through your server Edge Function to verify live Resend delivery.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="Enter email to receive test message..."
                  className="w-full sm:flex-1 bg-[#10131c] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingTestEmail}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-gold-400 border border-gold-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingTestEmail ? 'Dispatching...' : 'Send Test Verification'}</span>
                </button>
              </div>

              {testEmailStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                    testEmailStatus.success
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/60 border border-red-500/40 text-red-300'
                  }`}
                >
                  {testEmailStatus.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{testEmailStatus.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sticky Save Bar */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Changes will take effect instantly across all public pages and WhatsApp links.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold text-sm shadow-gold hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

