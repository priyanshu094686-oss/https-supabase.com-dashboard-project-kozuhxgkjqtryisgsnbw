# Lotus Luxe Spa & Wellness — Commercial White-Label Spa Platform

A complete, production-ready, white-label commercial web platform engineered for luxury spas, wellness clubs, Russian banyas, and massage centers. Built with **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Lucide Icons**, and optional **Supabase (PostgreSQL + Auth + Storage)**.

---

## 🌟 Key Product Capabilities

### 1. White-Label Centralized Configuration
- **Completely dynamic branding:** Business name, logo, favicon, address, primary phone, WhatsApp concierge line, opening hours, currencies (₹, $, €, £, AED), and social links.
- **Zero hardcoded business details:** All public pages, modals, footers, headers, and contact forms dynamically render from the centralized configuration.
- **Admin Website Settings panel:** Live editing of branding, contact details, operating schedules, social media, promotional announcements, and payment gateway keys.

### 2. Complete Administration Dashboard (`/admin`)
- **Authentication:** Protected admin routes with secure session guards and demo fallback.
  - **Demo Credentials:** `admin@lotusluxespa.com` / `admin123` (or `admin@spa.com` / `owner@spa.com`).
- **Dashboard Overview:** Real-time KPI summary (Total bookings, pending, confirmed, completed, active customers, services, monthly trends).
- **Bookings Management:** Full searchable and filterable booking records, customer details, conflict warnings, status workflow (`pending` ➔ `confirmed` ➔ `completed` / `cancelled`), and one-click WhatsApp client contact.
- **Service Catalog:** Add, edit, delete, set prices, set duration, assign tags and badges, and toggle active status.
- **Therapist Directory:** Manage specialists, categories (Russian / Indian / European), ratings, bios, certifications, languages, starting rates, and availability.
- **Visual Gallery:** Manage images, categories, titles, captions, and lightbox orders.
- **Customer CRM:** Comprehensive customer database automatically compiled from bookings with appointment histories.
- **5-Tab Business Settings:** White-label brand identity, contact & addresses, schedules & currencies, social links, and payment keys.

### 3. Production Booking System & Double-Booking Prevention
- **7-Step High-Conversion Customer Workflow:**
  1. Service selection with price/duration breakdown.
  2. Specialist selection (or "Any Available Specialist").
  3. Interactive calendar date picker.
  4. Dynamic time slot matrix with real-time slot availability inspection.
  5. Guest contact information (with honeypot anti-spam protection).
  6. Optional deposit / pay-at-spa selection.
  7. Instant booking confirmation with reference ID, WhatsApp direct submission, and Google Calendar link.
- **Conflict Prevention:**
  - Client-side availability matrix prevents double-booking in real-time.
  - Server-side PostgreSQL trigger `check_booking_conflict()` blocks concurrent duplicates at the database layer.

### 4. Real Database Integration & Zero-Config Demo Mode
- **Dual-Engine Architecture:**
  - **Live Cloud Mode:** Powered by Supabase (PostgreSQL database, Row Level Security policies, storage, and server triggers).
  - **Zero-Config Demo Mode:** Automatically boots using persistent local storage when Supabase environment variables are omitted. Perfect for sales demos, testing, and client evaluations.
- Complete SQL migration script provided in `supabase/schema.sql`.

### 5. Multi-Client Readiness (Tenant-Isolated)
- Database schema and architecture built with `tenant_id` on every table.
- Ready for multi-tenant SaaS scaling or single-client dedicated instances.

### 6. Legal & Compliance
Full legal suite with luxury styling and transparent compliance notices:
- Privacy Policy (`/privacy-policy`)
- Terms of Service (`/terms`)
- Cookie Policy (`/cookie-policy`)
- Cancellation Policy (`/cancellation-policy`)
- Refund Policy (`/refund-policy`)

---

## 🚀 Quick Start

### Installation & Run:
```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Run production build
bun run build
```

The app will be available at `http://localhost:5173`.
Access the Admin Dashboard at `http://localhost:5173/admin`.

---

## 🔑 Demo Access

- **URL:** `/admin/login`
- **Email:** `admin@lotusluxespa.com`
- **Password:** `admin123`

---

## 🛠️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Optional: Connect Supabase for live PostgreSQL database & Auth
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_TENANT_ID=00000000-0000-0000-0000-000000000001
VITE_APP_ENV=production
```

If these are omitted, the application runs automatically in demo mode without any setup required.

---

## 📖 Client Handover & Setup Documentation

For detailed client setup instructions, database migration, and custom domain deployment, refer to:
👉 **[CLIENT_SETUP_GUIDE.md](file:///D:/massage/CLIENT_SETUP_GUIDE.md)**

---

## 📄 License
Commercial License. Ready for resale and white-label client distribution.
