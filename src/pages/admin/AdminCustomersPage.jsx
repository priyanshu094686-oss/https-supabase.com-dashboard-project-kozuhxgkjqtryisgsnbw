import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminCustomersPage() {
  const { customers, bookings } = useBooking();
  const { formatPrice, settings } = useSettings();

  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  // Get booking history for selected customer
  const customerBookings = selectedCustomer
    ? bookings.filter(
        (b) =>
          b.customer_email?.toLowerCase() === selectedCustomer.email?.toLowerCase() ||
          b.customer_phone === selectedCustomer.phone
      )
    : [];

  return (
    <AdminLayout
      title="Customer CRM & Client Profiles"
      subtitle="Comprehensive guest directory, loyalty records, total spend analytics, and complete booking histories."
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="p-5 rounded-2xl bg-[#0e121c] border border-stone-800">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name, phone, or email..."
              className="w-full bg-[#131722] border border-stone-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="p-6 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-900/80 text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4 text-center">Total Visits</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-850">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-stone-100">{c.name}</div>
                      {c.notes && (
                        <div className="text-[11px] text-stone-400 font-light truncate max-w-xs">
                          {c.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <a
                        href={`tel:${c.phone}`}
                        className="text-stone-300 hover:text-gold-300 font-medium transition-colors"
                      >
                        {c.phone}
                      </a>
                    </td>

                    <td className="py-4 px-4 text-xs text-stone-400">
                      {c.email}
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-stone-200">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs bg-stone-900 border border-stone-700">
                        {c.total_bookings || 1}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-serif font-bold text-stone-100 gold-text-gradient">
                      {formatPrice(c.total_spent || 0)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-gold-400 border border-gold-500/30 hover:bg-gold-500 hover:text-stone-950 transition-colors"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Booking History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0e121c] border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-100">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-gold-400 font-light mt-0.5">
                  Guest History • {selectedCustomer.phone} • {selectedCustomer.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-900/80 border border-stone-800 text-center">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Total Appointments</span>
                <span className="text-xl font-serif font-bold text-stone-100">{customerBookings.length} Visits</span>
              </div>
              <div className="border-l border-stone-800">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Lifetime Value</span>
                <span className="text-xl font-serif font-bold text-gold-400">{formatPrice(selectedCustomer.total_spent || 0)}</span>
              </div>
            </div>

            {/* List of past & upcoming appointments */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
                Appointment Timeline
              </h4>

              {customerBookings.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-4 text-center">
                  No previous bookings recorded for this email.
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {customerBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl bg-[#141824] border border-stone-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-stone-200">
                          {b.service_name}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {b.booking_date} at {b.booking_time} • Specialist: <strong className="text-gold-400">{b.therapist_name}</strong>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif font-bold text-stone-100">
                          {formatPrice(b.total_price)}
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mt-1 ${
                            b.booking_status === 'confirmed'
                              ? 'bg-emerald-950 text-emerald-400'
                              : b.booking_status === 'completed'
                              ? 'bg-blue-950 text-blue-400'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {b.booking_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 border border-stone-700 text-stone-200 hover:text-white"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

