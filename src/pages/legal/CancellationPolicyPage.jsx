import React from 'react';
import LegalPageLayout from '../../components/common/LegalPageLayout';
import { useSettings } from '../../context/SettingsContext';

export default function CancellationPolicyPage() {
  const { settings } = useSettings();
  const brandName = settings?.business_name || 'Lotus Luxe Spa';

  return (
    <LegalPageLayout
      title="Cancellation & Rescheduling Policy"
      subtitle="Clear guidelines for modifying, rescheduling, or canceling reserved spa suites."
      lastUpdated="November 2026"
    >
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">1. Advance Notice Guidelines</h3>
        <p>
          Because our certified therapists and private VIP suites are reserved exclusively for you, we request that any cancellations or rescheduling requests be communicated in advance:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-stone-300">
          <li><strong>More than 3 Hours Notice:</strong> Free cancellation or rescheduling with zero penalty.</li>
          <li><strong>Within 1 to 3 Hours:</strong> Eligible for free date/time rescheduling to any slot within the subsequent 14 days.</li>
          <li><strong>Less than 1 Hour / No-Show:</strong> When an online deposit has been submitted, a 50% suite preparation fee may be retained to compensate scheduled therapists.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">2. Airport Layover & Delayed Flights Exception</h3>
        <p>
          We understand that air travel is subject to unexpected flight delays and baggage holds. If your flight into IGI Airport or connecting hub is delayed or rescheduled, notify our 24/7 concierge with your flight number and we will hold or adjust your suite reservation without charge.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">3. How to Cancel or Reschedule</h3>
        <p>
          To modify an existing booking, simply message our concierge on WhatsApp at{' '}
          <a href={`https://wa.me/${settings?.whatsapp_number || ''}`} className="text-emerald-400 font-semibold underline">
            +{settings?.whatsapp_number}
          </a>{' '}
          or call{' '}
          <a href={`tel:${settings?.phone_tel || ''}`} className="text-gold-400 font-semibold underline">
            {settings?.primary_phone}
          </a>{' '}
          with your booking reference number.
        </p>
      </section>
    </LegalPageLayout>
  );
}

