import React from 'react';
import LegalPageLayout from '../../components/common/LegalPageLayout';
import { useSettings } from '../../context/SettingsContext';

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();
  const brandName = settings?.business_name || 'Lotus Luxe Spa';

  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How we collect, safeguard, and process personal guest information."
      lastUpdated="November 2026"
    >
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">1. Information We Collect</h3>
        <p>
          At {brandName}, we prioritize total discretion. When scheduling appointments or visiting our luxury suites, we may collect:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-stone-300">
          <li>Contact Information: Full name, telephone number, and email address.</li>
          <li>Appointment Preferences: Modality choices, preferred therapists, session duration, and arrival times.</li>
          <li>Health & Wellness Disclosures: Voluntary declarations of allergies, injuries, or pressure preferences provided to ensure guest safety during treatment.</li>
          <li>Transaction Metadata: Payment method records and booking references. We do not store raw credit card numbers.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">2. How We Utilize Your Information</h3>
        <p>We process personal data strictly to:</p>
        <ul className="list-disc pl-5 space-y-1 text-stone-300">
          <li>Facilitate private suite reservations and prepare therapeutic chambers prior to arrival.</li>
          <li>Transmit appointment confirmations and reminder notices via email or WhatsApp.</li>
          <li>Prevent duplicate specialist scheduling and ensure staff availability.</li>
          <li>Maintain five-star hygiene and customer service standards across all visits.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">3. Non-Disclosure & Third Parties</h3>
        <p>
          {brandName} does not sell, rent, or monetize client data. We only share operational metadata with trusted infrastructure processors (such as Supabase for encrypted cloud storage, payment processors for transaction tokenization, and transactional email providers).
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">4. Data Retention & Deletion</h3>
        <p>
          Guest records are retained to maintain loyalty privileges and past treatment notes. You may request complete erasure of your contact record at any time by contacting our concierge desk.
        </p>
      </section>
    </LegalPageLayout>
  );
}

