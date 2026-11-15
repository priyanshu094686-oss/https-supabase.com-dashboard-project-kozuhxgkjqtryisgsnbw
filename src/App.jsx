import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { BookingProvider } from './context/BookingContext';

// Common Public Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingActions from './components/common/FloatingActions';
import BookingModal from './components/common/BookingModal';
import TherapistModal from './components/common/TherapistModal';

// Public Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import TherapistsPage from './pages/TherapistsPage';
import PricingPage from './pages/PricingPage';
import LocationsPage from './pages/LocationsPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';

// Legal Pages
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import CookiePolicyPage from './pages/legal/CookiePolicyPage';
import CancellationPolicyPage from './pages/legal/CancellationPolicyPage';
import RefundPolicyPage from './pages/legal/RefundPolicyPage';

// Admin Panel
import AdminRoute from './components/admin/AdminRoute';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminTherapistsPage from './pages/admin/AdminTherapistsPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState('');
  const [bookingTherapistId, setBookingTherapistId] = useState('');

  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [isTherapistModalOpen, setIsTherapistModalOpen] = useState(false);

  const handleOpenBooking = (serviceId = '', therapistId = '') => {
    setBookingServiceId(serviceId || '');
    setBookingTherapistId(therapistId || '');
    setIsBookingOpen(true);
  };

  const handleSelectTherapist = (therapist) => {
    setSelectedTherapist(therapist);
    setIsTherapistModalOpen(true);
  };

  const handleBookFromTherapistModal = (therapistId) => {
    setIsTherapistModalOpen(false);
    handleOpenBooking('', therapistId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#07080a] text-stone-100 font-sans selection:bg-gold-500 selection:text-black">
      {/* Show Customer Navigation only on non-admin routes */}
      {!isAdminPath && <Navbar onOpenBooking={() => handleOpenBooking()} />}

      {/* Main Routes */}
      <main className="flex-grow">
        <Routes>
          {/* Public Customer Routes */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenBooking={handleOpenBooking}
                onSelectTherapist={handleSelectTherapist}
              />
            }
          />
          <Route
            path="/services"
            element={<ServicesPage onOpenBooking={handleOpenBooking} />}
          />
          <Route
            path="/services/:id"
            element={
              <ServiceDetailsPage
                onOpenBooking={handleOpenBooking}
                onSelectTherapist={handleSelectTherapist}
              />
            }
          />
          <Route
            path="/therapists"
            element={
              <TherapistsPage
                onOpenBooking={handleOpenBooking}
                onSelectTherapist={handleSelectTherapist}
              />
            }
          />
          <Route
            path="/pricing"
            element={<PricingPage onOpenBooking={handleOpenBooking} />}
          />
          <Route path="/locations" element={<LocationsPage />} />
          <Route
            path="/about"
            element={<AboutPage onOpenBooking={handleOpenBooking} />}
          />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />

          {/* Legal Compliance Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />

          {/* Admin Authentication & Control Portal */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookingsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <AdminRoute>
                <AdminServicesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/therapists"
            element={
              <AdminRoute>
                <AdminTherapistsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <AdminRoute>
                <AdminGalleryPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminRoute>
                <AdminCustomersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettingsPage />
              </AdminRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Show Customer Footer & Floating Actions on non-admin routes */}
      {!isAdminPath && (
        <>
          <Footer onOpenBooking={() => handleOpenBooking()} />
          <FloatingActions />
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            initialServiceId={bookingServiceId}
            initialTherapistId={bookingTherapistId}
          />
          <TherapistModal
            isOpen={isTherapistModalOpen}
            onClose={() => setIsTherapistModalOpen(false)}
            therapist={selectedTherapist}
            onBookTherapist={handleBookFromTherapistModal}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SettingsProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </SettingsProvider>
    </Router>
  );
}
