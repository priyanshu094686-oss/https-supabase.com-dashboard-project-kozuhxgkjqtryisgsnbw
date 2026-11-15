import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MessageCircle,
  AlertTriangle,
  Mail,
  User,
  X,
  Eye,
  List,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  FileText
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminBookingsPage() {
  const { bookings, services, updateBookingStatus } = useBooking();
  const { formatPrice, settings } = useSettings();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [detailsBooking, setDetailsBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('Client requested cancellation');

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      b.customer_name?.toLowerCase().includes(q) ||
      b.customer_phone?.includes(q) ||
      b.customer_email?.toLowerCase().includes(q) ||
      b.booking_reference?.toLowerCase().includes(q) ||
      b.therapist_name?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    const matchesService = serviceFilter === 'all' || b.service_id === serviceFilter || b.service_name === serviceFilter;
    const matchesDate = !dateFilter || b.booking_date === dateFilter;

    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    await updateBookingStatus(cancelModalBooking.id, 'cancelled', cancellationReason);
    setCancelModalBooking(null);
    setCancellationReason('Client requested cancellation');
  };

  // Calendar Helpers
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  const getBookingsForDate = (day) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter((b) => b.booking_date === dStr);
  };

  return (
    <AdminLayout
      title="Appointment Reservations Manager"
      subtitle="Comprehensive control of all customer bookings, approvals, and double-booking conflict prevention."
    >
      <div className="space-y-6">
        {/* Top View Toggle & Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e121c] border border-stone-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold-sm'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List View ({bookings.length})</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 shadow-gold-sm'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar View</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Confirmed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Completed
            </span>
          </div>
        </div>

        {/* View Mode: CALENDAR */}
        {viewMode === 'calendar' ? (
          <div className="p-6 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-xl space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gold-400" />
                <span>{monthNames[month]} {year}</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-xs font-semibold text-gold-400 border border-stone-800 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-28 rounded-xl bg-stone-900/30 border border-stone-900/50" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayBookings = getBookingsForDate(day);
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year;

                return (
                  <div
                    key={day}
                    onClick={() => {
                      if (dayBookings.length > 0) {
                        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        setDateFilter(dStr);
                        setViewMode('list');
                      }
                    }}
                    className={`h-28 p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                      isToday
                        ? 'bg-gold-500/10 border-gold-500/50'
                        : dayBookings.length > 0
                        ? 'bg-[#121624] border-stone-800 hover:border-gold-500/40'
                        : 'bg-[#0b0e16] border-stone-850 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isToday ? 'text-gold-400 font-serif text-sm' : 'text-stone-300'}`}>
                        {day}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="w-5 h-5 rounded-full bg-gold-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                          {dayBookings.length}
                        </span>
                      )}
                    </div>

                    {/* Bookings pills */}
                    <div className="space-y-1 overflow-y-auto max-h-16">
                      {dayBookings.slice(0, 2).map((bk) => (
                        <div
                          key={bk.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailsBooking(bk);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium ${
                            bk.booking_status === 'confirmed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : bk.booking_status === 'completed'
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                              : bk.booking_status === 'cancelled'
                              ? 'bg-red-950 text-red-300 border border-red-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {bk.booking_time} {bk.customer_name?.split(' ')[0]}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-[9px] text-stone-400 text-center">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* View Mode: LIST */
          <>
            {/* Search & Filters Bar */}
            <div className="p-5 rounded-2xl bg-[#0e121c] border border-stone-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search Input */}
                <div className="md:col-span-5 relative">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by customer, phone, ref or therapist..."
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                {/* Service Filter */}
                <div className="md:col-span-4">
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-gold-400"
                  >
                    <option value="all">All Services ({services.length})</option>
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-gold-400"
                  />
                  {dateFilter && (
                    <button
                      onClick={() => setDateFilter('')}
                      className="p-2 text-stone-400 hover:text-stone-100 text-xs"
                      title="Clear Date"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      statusFilter === st
                        ? 'bg-gold-500 text-stone-950 shadow-gold-sm'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {st} (
                    {st === 'all'
                      ? bookings.length
                      : bookings.filter((b) => b.booking_status === st).length}
                    )
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings List Table */}
            <div className="p-6 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                  Showing {filteredBookings.length} of {bookings.length} Bookings
                </span>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 text-stone-500">
                  <CalendarIcon className="w-12 h-12 mx-auto text-stone-600 mb-3" />
                  <p className="text-base font-serif text-stone-300">No matching reservations found</p>
                  <p className="text-xs mt-1">Try adjusting your search query, status, or date filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-900/80 text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Ref & Time</th>
                        <th className="py-3 px-4">Guest Details</th>
                        <th className="py-3 px-4">Treatment</th>
                        <th className="py-3 px-4">Specialist</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-850">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-mono text-xs font-bold text-gold-400">
                              {b.booking_reference}
                            </div>
                            <div className="text-xs text-stone-300 font-semibold mt-0.5">
                              {b.booking_date}
                            </div>
                            <div className="text-[11px] text-stone-400">
                              {b.booking_time} ({b.duration || '60 M'})
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-semibold text-stone-100">{b.customer_name}</div>
                            <div className="text-xs text-stone-400 flex items-center gap-2 mt-0.5">
                              <a
                                href={`tel:${b.customer_phone}`}
                                className="hover:text-gold-300 transition-colors"
                              >
                                {b.customer_phone}
                              </a>
                            </div>
                            <div className="text-[11px] text-stone-500">{b.customer_email}</div>
                          </td>

                          <td className="py-4 px-4 font-medium text-stone-200">
                            {b.service_name}
                          </td>

                          <td className="py-4 px-4">
                            <span className="text-xs font-semibold text-gold-400 block">
                              {b.therapist_name}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-serif font-bold text-stone-100">
                            {formatPrice(b.total_price)}
                            <span className="text-[10px] text-stone-400 font-sans block uppercase">
                              {b.payment_status} ({b.payment_method})
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.booking_status === 'confirmed'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                  : b.booking_status === 'completed'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                                  : b.booking_status === 'cancelled'
                                  ? 'bg-red-950 text-red-400 border border-red-500/40'
                                  : 'bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse'
                              }`}
                            >
                              {b.booking_status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right whitespace-nowrap space-x-1.5">
                            {/* Inspect Details Button */}
                            <button
                              onClick={() => setDetailsBooking(b)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-800 text-stone-300 border border-stone-700 hover:text-white hover:border-gold-400 transition-colors"
                              title="Inspect Booking Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {b.booking_status === 'pending' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                                title="Approve Suite Reservation"
                              >
                                Approve
                              </button>
                            )}

                            {b.booking_status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'completed')}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30"
                                title="Mark Session Completed"
                              >
                                Complete
                              </button>
                            )}

                            {b.booking_status !== 'cancelled' && b.booking_status !== 'completed' && (
                              <button
                                onClick={() => setCancelModalBooking(b)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                                title="Cancel Reservation"
                              >
                                Cancel
                              </button>
                            )}

                            <a
                              href={`https://wa.me/${b.customer_phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                                `Hello ${b.customer_name}, regarding your reservation ${b.booking_reference} at ${settings?.business_name}...`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900"
                              title="WhatsApp Client"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      {detailsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e121c] border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                  Reservation Record
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-100 font-mono">
                  {detailsBooking.booking_reference}
                </h3>
              </div>
              <button
                onClick={() => setDetailsBooking(null)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Guest Name:</span>
                  <strong className="text-stone-100">{detailsBooking.customer_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Phone Number:</span>
                  <a href={`tel:${detailsBooking.customer_phone}`} className="text-gold-400 hover:underline">
                    {detailsBooking.customer_phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Email Address:</span>
                  <span className="text-stone-200">{detailsBooking.customer_email}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Service:</span>
                  <strong className="text-stone-100">{detailsBooking.service_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Specialist:</span>
                  <span className="text-gold-400 font-semibold">{detailsBooking.therapist_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Scheduled Date:</span>
                  <span className="text-stone-200">{detailsBooking.booking_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Time Slot:</span>
                  <span className="text-stone-200">{detailsBooking.booking_time} ({detailsBooking.duration})</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Investment:</span>
                  <strong className="text-gold-400 text-sm font-serif font-bold">
                    {formatPrice(detailsBooking.total_price)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Payment Status:</span>
                  <span className="uppercase font-semibold text-stone-200">
                    {detailsBooking.payment_status} ({detailsBooking.payment_method})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Reservation Status:</span>
                  <span className="uppercase font-semibold text-emerald-400">
                    {detailsBooking.booking_status}
                  </span>
                </div>
              </div>

              {detailsBooking.notes && (
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                    Special Guest Requests & Notes:
                  </span>
                  <p className="text-stone-200 italic font-light">"{detailsBooking.notes}"</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${detailsBooking.customer_phone}`}
                  className="px-3 py-2 rounded-xl text-xs bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-gold-400" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${detailsBooking.customer_phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                    `Hello ${detailsBooking.customer_name}, regarding your booking ${detailsBooking.booking_reference} at ${settings?.business_name}...`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                {detailsBooking.booking_status === 'pending' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(detailsBooking.id, 'confirmed');
                      setDetailsBooking(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    Confirm
                  </button>
                )}
                {detailsBooking.booking_status === 'confirmed' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(detailsBooking.id, 'completed');
                      setDetailsBooking(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Prompt Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e121c] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h4 className="text-lg font-serif font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Cancel Reservation {cancelModalBooking.booking_reference}?</span>
            </h4>
            <p className="text-xs text-stone-300">
              This will update the reservation status to Cancelled and free up specialist{' '}
              <strong className="text-gold-400">{cancelModalBooking.therapist_name}</strong> on{' '}
              <strong>{cancelModalBooking.booking_date} at {cancelModalBooking.booking_time}</strong>.
            </p>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                Reason for Cancellation
              </label>
              <textarea
                rows="2"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full bg-[#131722] border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-400 hover:text-stone-100"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
