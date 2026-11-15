import React from 'react';
import LegalPageLayout from '../../components/common/LegalPageLayout';
import { useSettings } from '../../context/SettingsContext';

export default function TermsPage() {
  const { settings } = useSettings();
  const brandName = settings?.business_name || 'Lotus Luxe Spa';

  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Standard operational conditions, guest etiquette, and booking guidelines."
      lastUpdated="November 2026"
    >
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">1. Acceptance of Terms</h3>
        <p>
          By booking an appointment or entering {brandName}, guests agree to abide by these operational conditions. Our facilities are dedicated exclusively to professional wellness, therapeutic balneology, and European massage bodywork.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">2. Arrival & Suite Preparation</h3>
        <p>
          To fully enjoy your treatment, please arrive 10 to 15 minutes prior to your designated start time. Late arrivals may result in shortened session durations to honor subsequent scheduled bookings without price reductions.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">3. Professional Etiquette & Code of Conduct</h3>
        <p>
          All therapists at {brandName} are certified healthcare and bodywork practitioners. We maintain a zero-tolerance policy against inappropriate behavior, harassment, or non-therapeutic requests. Any violation will result in immediate termination of the treatment without refund and permanent banning from all premises.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">4. Health Conditions & Contraindications</h3>
        <p>
          Guests experiencing severe cardiovascular disorders, acute infections, high fever, pregnancy, or open dermatological conditions must notify management prior to undergoing intense thermal steam or deep tissue therapy.
        </p>
      </section>
    </LegalPageLayout>
  );
}

