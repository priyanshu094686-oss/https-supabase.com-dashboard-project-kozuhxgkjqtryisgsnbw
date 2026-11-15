import React, { useEffect } from 'react';
import { AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import SectionHeader from './SectionHeader';

export default function LegalPageLayout({ title, subtitle, lastUpdated, children }) {
  const { settings } = useSettings();
  const brandName = settings?.business_name || 'Lotus Luxe Spa & Wellness';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 bg-[#07090e] min-h-screen text-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Legal & Compliance"
          title={title}
          subtitle={subtitle}
        />

        {/* Legal Review Notice for Buyer/Owner */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-semibold">Legal Notice & Compliance Disclaimer for Business Owner:</strong>
            <p className="text-amber-300/90 font-light leading-relaxed">
              This document contains standard industry policy provisions customized for <strong>{brandName}</strong>. Local jurisdictions, consumer protection laws, and health regulations vary. The business owner must review and adapt these policies with local legal counsel prior to commercial operations.
            </p>
          </div>
        </div>

        {/* Policy Card Body */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-2xl space-y-8 text-sm text-stone-300 font-light leading-relaxed">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 text-xs text-stone-500">
            <span>Entity: <strong>{brandName}</strong></span>
            <span>Last Updated: {lastUpdated || 'November 2026'}</span>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            {children}
          </div>

          <div className="pt-6 border-t border-stone-800 text-xs text-stone-400">
            <p>
              For questions regarding this policy, contact our compliance officer at{' '}
              <a href={`mailto:${settings?.email || 'concierge@lotusluxespa.com'}`} className="text-gold-400 hover:underline">
                {settings?.email || 'concierge@lotusluxespa.com'}
              </a>{' '}
              or call{' '}
              <a href={`tel:${settings?.phone_tel || ''}`} className="text-gold-400 hover:underline">
                {settings?.primary_phone}
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

