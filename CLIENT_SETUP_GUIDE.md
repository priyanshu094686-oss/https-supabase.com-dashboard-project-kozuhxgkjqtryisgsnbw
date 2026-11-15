# Commercial Spa & Wellness Platform — Client Setup & Handover Guide

Welcome to the **Commercial Spa Platform** — an enterprise-grade, client-ready web solution designed for luxury spas, wellness sanctuaries, and massage studios. This guide walks you through setup, white-label personalization, database configuration, payment activation, and production deployment.

---

## 1. Fast Start (Demo Mode)

The system works **out-of-the-box with zero configuration**. If Supabase environment variables are omitted, the application automatically boots into a feature-complete **Local Persistence Mode** with seeded services, therapists, gallery photos, and sample bookings.

### Quick Start with Bun:
```bash
# 1. Install dependencies
bun install

# 2. Run local development server
bun run dev

# 3. Build for production
bun run build
```

---

## 2. Admin Dashboard & Credentials

Access the administration dashboard at:
👉 **`http://localhost:5173/admin`** (or `https://yourdomain.com/admin`)

### Default Demo Credentials:
- **Email:** `admin@lotusluxespa.com` (or `admin@spa.com` / `owner@spa.com`)
- **Password:** `admin123`

> [!IMPORTANT]
> Change the password or connect Supabase Auth prior to handing over the production environment to clients.

### Available Admin Modules:
1. **Executive Dashboard (`/admin`):** Real-time booking KPIs, monthly revenue / appointment charts, and rapid booking actions.
2. **Booking Management (`/admin/bookings`):** Search, date/service filtering, status transitions (`pending` → `confirmed` → `completed` / `cancelled`), conflict inspection, and direct WhatsApp customer messaging.
3. **Service Catalog (`/admin/services`):** Full CRUD for treatments, pricing, duration, categories, badges, and instant visibility toggling.
4. **Therapist Profiles (`/admin/therapists`):** Add/edit practitioners, bio, certifications, languages, starting rates, and category assignment (Russian / Indian / European).
5. **Atmospheric Gallery (`/admin/gallery`):** Manage image URLs, descriptions, categories, and lightbox order.
6. **Customer CRM (`/admin/customers`):** Automatic customer directory with lifetime booking counts and appointment history.
7. **Business Settings (`/admin/settings`):** 5-tab white-label panel for Branding, Contact, Hours & Currency, Socials, and Payment Gateways.

---

## 3. Production Database Setup (Supabase)

For real multi-client production deployments, connect a free or hosted **Supabase** instance.

### Step 1: Create Supabase Project
1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings > API**, copy:
   - **Project URL**
   - **anon / public key**

### Step 2: Run Database Schema
1. In Supabase, navigate to the **SQL Editor**.
2. Open and paste the contents of `supabase/schema.sql`.
3. Click **Run**. This automatically creates:
   - `tenants` (multi-tenant foundation)
   - `business_settings` (white-label data store)
   - `services` (service catalog)
   - `therapists` (practitioner directory)
   - `customers` (CRM records)
   - `bookings` (appointments with strict RLS and double-booking triggers)
   - `gallery_images` (visual media)
   - `notifications_log` (audit trail)
   - Real-time double booking prevention trigger `check_booking_conflict()`

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
VITE_TENANT_ID=00000000-0000-0000-0000-000000000001
VITE_APP_ENV=production
```

Restart your Vite build/dev server. The application will detect Supabase and switch to live cloud database synchronization seamlessly.

---

## 4. White-Label Branding & Customization

Every single aspect of the client's business is configurable through **Admin > Website Settings** without touching code:

- **Business Identity:** Spa name, tagline, description, logo URL, favicon URL.
- **Contact Details:** Primary phone, WhatsApp number (for instant chat bookings), support email, physical address, and Google Maps embed URL.
- **Schedule & Currency:** Opening hours, operating schedule, currency code (INR, USD, EUR, AED, GBP, etc.), and currency symbol (₹, $, €, etc.).
- **Socials & Badges:** Instagram, Facebook, YouTube, TripAdvisor links, plus promotional announcements.
- **Payment Gateways:** Toggle online prepayments, set deposit percentages (e.g., 20% or 100%), and enter Stripe / Razorpay public API keys.

---

## 5. Double-Booking Prevention Architecture

The system enforces anti-conflict rules on two layers:
1. **Client-side Matrix:** `BookingContext.isSlotBooked()` and the 7-step `BookingModal` check booked slots in real-time, disabling conflicting times for the selected therapist and date.
2. **Server-side PostgreSQL Trigger:** The `check_booking_conflict()` trigger in `supabase/schema.sql` halts any overlapping concurrent booking at the database level:
   ```sql
   IF EXISTS (
     SELECT 1 FROM bookings
     WHERE therapist_id = NEW.therapist_id
       AND booking_date = NEW.booking_date
       AND booking_time = NEW.booking_time
       AND status IN ('confirmed', 'pending')
   ) THEN
     RAISE EXCEPTION 'This therapist already has an appointment booked for this date and time.';
   END IF;
   ```

---

## 6. Payment & Webhook Verification

Online payments are **optional**; guests can always book with "Pay at Spa upon Arrival".

To activate online card / UPI / wallet deposits:
1. Set `VITE_STRIPE_PUBLISHABLE_KEY` or `VITE_RAZORPAY_KEY_ID`.
2. Deploy the Edge Function in `supabase/functions/verify-payment.js` to verify Stripe / Razorpay webhooks securely server-side.
3. Configure your webhook endpoint in the payment provider dashboard pointing to `https://<project-ref>.supabase.co/functions/v1/verify-payment`.

---

## 7. Production Deployment (Vercel / Netlify / Hostinger)

### Deploying to Vercel:
1. Push the repository to GitHub / GitLab.
2. Import project into [Vercel](https://vercel.com).
3. Set Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Vercel automatically detects Vite. Build command: `bun run build` or `vite build`. Output directory: `dist`.
5. The included `vercel.json` ensures full client-side routing on all deep URLs.

### Deploying to Netlify:
The `dist` directory can be uploaded directly or linked via Git with build command `npm run build` or `bun run build`.

---

## 8. Multi-Tenant Scalability

The database schema is pre-architected with `tenant_id` foreign keys on every table. To convert this single-tenant deployment into a multi-tenant SaaS:
1. Issue distinct `tenant_id` UUIDs for each spa customer.
2. Enforce Supabase Row-Level Security (RLS) policies based on `auth.jwt() -> app_metadata -> tenant_id`.
3. Route incoming domains / subdomains to the respective `tenant_id`.

---

## 9. Handover Checklist for New Spa Client

- [ ] Connect custom domain (e.g., `spa-luxury.com`)
- [ ] Configure Business Settings in `/admin/settings` (Phone, WhatsApp, Address, Logo)
- [ ] Review & update services menu & pricing in `/admin/services`
- [ ] Upload therapist photos & profiles in `/admin/therapists`
- [ ] Upload real spa suite images in `/admin/gallery`
- [ ] Perform end-to-end test booking on homepage
- [ ] Confirm booking appears in `/admin/bookings`
- [ ] Update legal policies in legal pages if required by local jurisdiction
- [ ] Change default admin password

