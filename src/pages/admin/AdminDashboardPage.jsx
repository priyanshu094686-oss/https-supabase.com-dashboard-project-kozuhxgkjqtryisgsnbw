import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Sparkles,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Phone,
  Plus
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminDashboardPage() {
  const { bookings, services, therapists, customers, updateBookingStatus } = useBooking();
  const { settings, formatPrice } = useSettings();

  // Metrics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.booking_status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.booking_status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.booking_status === 'completed');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
  const totalCustomers = customers.length;
  const totalServices = services.filter((s) => s.is_active).length;

  const kpis = [
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/30'
    },
    {
      label: 'Pending Approvals',
      value: pendingBookings.length,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      highlight: pendingBookings.length > 0
    },
    {
      label: 'Confirmed Bookings',
      value: confirmedBookings.length,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    },
    {
      label: 'Completed Bookings',
      value: completedBookings.length,
      icon: CheckCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    },
    {
      label: 'Total Customers (CRM)',
      value: totalCustomers,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    },
    {
      label: 'Active Services',
      value: totalServices,
      icon: Sparkles,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30'
    },
    {
      label: 'Completed Revenue',
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      isCurrency: true
    }
  ];

  // Simulated monthly chart data
  const monthlyStats = [
    { month: 'Jun', count: 18, height: '40%' },
    { month: 'Jul', count: 24, height: '55%' },
    { month: 'Aug', count: 32, height: '70%' },
    { month: 'Sep', count: 38, height: '80%' },
    { month: 'Oct', count: 45, height: '95%' },
    { month: 'Nov', count: 48, height: '100%' }
  ];

  return (
    <AdminLayout
      title="Commercial Executive Dashboard"
      subtitle="Real-time bookings, therapist workloads, revenue analytics, and client management."
    >
      <div className="space-y-8">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-[#0e121c] border transition-all duration-300 ${
                  kpi.highlight ? 'border-amber-500/60 shadow-lg shadow-amber-500/10' : kpi.border
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold truncate">
                    {kpi.label}
                  </span>
                  <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                  {kpi.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts & Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Monthly Trend Chart */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold-400" />
                  <span>Monthly Appointment Growth</span>
                </h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Consistent surge in Russian Banya and VIP couples retreat packages.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                +28.4% This Month
              </span>
            </div>

            {/* Custom Responsive SVG / Bar Visualization */}
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2">
              {monthlyStats.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-gold-400">
                    {item.count}
                  </div>
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-gold-600/30 via-gold-500/80 to-gold-400 group-hover:brightness-125 transition-all shadow-gold-sm"
                  />
                  <span className="text-xs text-stone-400 font-medium mt-1">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-xl space-y-5">
            <h3 className="text-lg font-serif font-bold text-stone-100">
              Quick Operations
            </h3>

            <div className="space-y-3">
              <Link
                to="/admin/services"
                className="w-full p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-gold-500/40 text-stone-200 text-sm font-medium flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Add / Edit Spa Services</span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-gold-400 transition-colors" />
              </Link>

              <Link
                to="/admin/therapists"
                className="w-full p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-gold-500/40 text-stone-200 text-sm font-medium flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gold-400" />
                  <span>Manage Therapist Roster</span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-gold-400 transition-colors" />
              </Link>

              <Link
                to="/admin/settings"
                className="w-full p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-gold-500/40 text-stone-200 text-sm font-medium flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  <span>Configure Business & Branding</span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-gold-400 transition-colors" />
              </Link>

              <Link
                to="/admin/bookings"
                className="w-full p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-sm font-semibold flex items-center justify-between hover:bg-gold-500/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gold-400" />
                  <span>View All Bookings ({totalBookings})</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Bookings Activity Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121c] border border-stone-800 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Recent Appointment Inquiries
              </h3>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                Review and approve appointments before suite preparation.
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
            >
              <span>See Full Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-900/60 text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Specialist</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Instant Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-850">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-gold-400">
                      {booking.booking_reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-200">{booking.customer_name}</div>
                      <div className="text-xs text-stone-500">{booking.customer_phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-300">
                      {booking.service_name}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-400">
                      {booking.therapist_name}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-300 whitespace-nowrap">
                      {booking.booking_date} • {booking.booking_time}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-200 font-serif">
                      {formatPrice(booking.total_price)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.booking_status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : booking.booking_status === 'completed'
                            ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                            : booking.booking_status === 'cancelled'
                            ? 'bg-red-950 text-red-400 border border-red-500/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      {booking.booking_status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.booking_status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      <Link
                        to="/admin/bookings"
                        className="px-2.5 py-1 rounded-lg text-xs text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

