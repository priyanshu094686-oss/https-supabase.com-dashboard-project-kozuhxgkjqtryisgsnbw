import React from 'react';
import LegalPageLayout from '../../components/common/LegalPageLayout';
import { useSettings } from '../../context/SettingsContext';

export default function RefundPolicyPage() {
  const { settings } = useSettings();
  const brandName = settings?.business_name || 'Lotus Luxe Spa';

  return (
    <LegalPageLayout
      title="Refund & Billing Policy"
      subtitle="Transparent conditions regarding online deposits, package refunds, and gift cards."
      lastUpdated="November 2026"
    >
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">1. Pay at Spa (Cash / Card Upon Arrival)</h3>
        <p>
          For guests opting for our standard "Pay at Spa" option, zero upfront charges apply. You pay directly after your service is completed via cash, UPI, or credit/debit card at our reception desk.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">2. Online Deposit & Prepaid Packages</h3>
        <p>
          Where online booking deposits or prepaid VIP packages are transacted:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-stone-300">
          <li><strong>Timely Cancellations (3+ Hours):</strong> 100% full refund credited back to the original source method within 5 to 7 business days.</li>
          <li><strong>Spa Credit Alternative:</strong> Guests may immediately convert deposits into transferable spa gift credits valid for 12 months with no deductions.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">3. Dissatisfaction Resolution</h3>
        <p>
          We pride ourselves on 5-star royal hospitality. If any aspect of your therapy, water temperature, or suite acoustics does not meet expectations, notify your specialist or the duty manager during the initial 15 minutes of the treatment so adjustments can be made immediately.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-stone-100">4. Processing Timelines</h3>
        <p>
          Refund requests approved by management are processed via our electronic payment gateway and typically reflect on bank statements within 5 to 10 banking days depending on the financial institution.
        </p>
      </section>
    </LegalPageLayout>
  );
}

