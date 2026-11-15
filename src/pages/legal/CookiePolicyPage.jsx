import React from 'react';
import LegalPageLayout from '../../components/common/LegalPageLayout';
import { useSettings } from '../../context/SettingsContext';

export default function CookiePolicyPage() {
  const { settings } = useSettings();
  const brandName = settings?.business_name || 'Lotus Luxe Spa';

  return (
    <LegalPageLayout
      title="Cookie & Tracking Policy"
      subtitle="How essential and analytics cookies enhance your browsing experience."
      lastUpdated="November 2026"
    >
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">1. What Are Cookies?</h3>
        <p>
          Cookies are small encrypted text tokens stored on your browser to recall navigation state, booking progress, and preferred language or currency settings.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">2. Categories of Cookies Employed</h3>
        <ul className="list-disc pl-5 space-y-1 text-stone-300">
          <li><strong>Essential Session Cookies:</strong> Required to preserve appointment form inputs across screens and secure administrative session authentication.</li>
          <li><strong>Performance & Analytics Cookies:</strong> Help us measure which treatments and package pages are most popular to optimize server loading times.</li>
          <li><strong>User Preference Cookies:</strong> Remembers your chosen category filter and theme settings.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">3. Managing Cookie Preferences</h3>
        <p>
          You can disable non-essential cookies via your web browser settings. Disabling essential cookies may impair form submissions or the administrative dashboard.
        </p>
      </section>
    </LegalPageLayout>
  );
}

