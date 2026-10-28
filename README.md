# 🌟 AURA Studio — Luxury Casual Fashion & Streetwear E-Commerce Store

> ### 🔗 **Live Storefront URL:** [https://aura-fashion-lk.netlify.app](https://aura-fashion-lk.netlify.app)
> ### 🛡️ **Manager Control Portal:** [https://aura-fashion-lk.netlify.app/admin/login](https://aura-fashion-lk.netlify.app/admin/login)

---

## 📖 About AURA Studio

**AURA Studio** is a contemporary, mobile-first casual fashion and streetwear e-commerce platform crafted specifically for the Sri Lankan market. 

Unlike traditional cluttered e-commerce stores that depend on complicated payment gateways and forced user registrations, AURA is built around an **instant WhatsApp Order Handoff workflow** with **Islandwide Cash on Delivery (COD)**. Customers effortlessly browse curated collections for **Women**, **Men**, and **Unisex**, select their size, and place their order directly into WhatsApp with one tap.

The design embodies a **warm luxury editorial aesthetic** (warm ecru, rich charcoal, soft stone, and terracotta rose accents) paired with timeless serif typography (`Playfair Display`) and clean modern ergonomics (`Plus Jakarta Sans`).

---

## ✨ What This Site Can Do & Key Features

### 🛍️ 1. Customer Shopping Experience
- **Cinematic Full-Bleed Hero Showcase:** Auto-crossfading campaign imagery (every 6s) with subtle Ken Burns zoom, responsive fluid typography, and instant scroll-to-shop action.
- **Floating Oval Glassmorphic Navbar:** Pill-shaped floating navbar with backdrop blur (`backdrop-blur-xl`) and centered navigation links (**Collection**, **Women**, **Men**, **Our Quality**).
- **Interactive Pill Category Filter:** Sticky segmented control with smooth sliding terracotta background animation (Framer Motion `layoutId`). Defaults to **Unisex**, allowing seamless switching to **Men** and **Women**.
- **Instant Product Image Hover (Desktop):** Hovering over any product card reveals the second angle / detail shot **instantly with zero delay**. Leaving the image switches back immediately.
- **Direct Tap-to-Open (Mobile & Tablet):** Tapping the product image, title, or "View" button on phones instantly opens the product modal.
- **Product Details & Sizing Modal:**
  - Interactive dual-angle photo gallery with angle switch buttons.
  - Sizing selector (`S`, `M`, `L`, `XL`, `XXL`) with expandable measurements chart.
  - Transparent pricing policy: identical price across all sizes.
  - Real-time stock status badge.
- **Instant WhatsApp Checkout:**
  - The `"Order on WhatsApp"` button unlocks as soon as a size is selected.
  - Generates a pre-filled, URL-encoded order message sent directly to the store's dispatch WhatsApp number (`0713834079` / `+94713834079`).
  - No credit card details or checkout friction required.
- **Performance Optimized for Mobile:** Buttery smooth 60fps scrolling on smartphones, fast asset loading, WebP images, and lightweight bundle size.

---

### 🎛️ 2. Discreet Store Manager Portal (`/admin`)
Designed for non-technical shop owners and managers to manage their store without touching code:

- **Unobtrusive Entrance:** Discreet shield icon in the footer’s bottom-right corner linking to `/admin/login`. Protected by `noindex` so search engines ignore it.
- **Secure Authentication:** Single-admin authentication (`dinilbhashana596@gmail.com`) via Supabase Auth with persistent session state.
- **Product Management:**
  - Searchable product directory with live count indicators.
  - Add & Edit products with `react-hook-form` + `zod` validation.
  - Multi-select category checkboxes (Men, Women, Unisex).
  - Size availability selector checkboxes (`S` to `XXL`).
  - Automatic in-browser WebP image compressor (down to 1600px, 80% quality) to ensure fast uploads.
  - Toggle product visibility (Active/Hidden) on the live storefront.
  - Delete items with a friendly confirmation dialog.
- **Storefront & WhatsApp Settings:**
  - Change the store logo (updates navbar and footer in real-time).
  - Update the WhatsApp dispatch phone number.
  - Customize the hero headline and subtext.
- **Hero Slides Manager:**
  - Add new background slides with custom headline and subline.
  - Reorder slides with up/down arrows.
  - Remove inactive slides from rotation.

---

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool & Bundler** | Vite 6 |
| **Styling & Design System** | Tailwind CSS (Warm Luxury Ecru & Terracotta theme) |
| **Typography** | Google Fonts (`Playfair Display` serif + `Plus Jakarta Sans`) |
| **Routing** | React Router v7 (`BrowserRouter`, protected admin routes) |
| **Animations** | Framer Motion (layoutId pills, modals) + GSAP & ScrollTrigger |
| **Smooth Scrolling** | Lenis (desktop-only, native touch scrolling on phones) |
| **Database & Auth** | Supabase (PostgreSQL, Supabase Auth, Supabase Storage, RLS) |
| **Icons** | Lucide React |
| **Deployment** | Netlify Static SPA (with custom redirect rules in `netlify.toml`) |

---

## 📂 Project Architecture

```
Fashion E-commerce Store/
├── public/                 # Static assets & icons
├── src/
│   ├── components/
│   │   ├── layout/         # Navbar (floating pill) & Footer (with discreet admin icon)
│   │   └── ui/             # Reusable Button, Modal, Badge, Skeleton, ErrorBoundary
│   ├── config/             # Brand constants, WhatsApp numbers, sizing guides
│   ├── data/               # 60 sample apparel products & default hero slides
│   ├── features/
│   │   ├── admin/          # Manager dashboard, Products, Settings, Hero slides
│   │   ├── auth/           # Admin login portal & ProtectedRoute guard
│   │   ├── catalog/        # Category filter segmented control & ProductCard
│   │   ├── home/           # Hero section, FeatureStrip, HomePage
│   │   └── product-modal/  # Product details popup & WhatsApp link generator
│   ├── hooks/              # Custom hooks: useProducts, useSiteSettings, useHeroSlides, useAuth
│   ├── lib/                # Supabase client, WhatsApp URL builder, Image compressor
│   ├── types/              # Strict TypeScript definitions (Product, Slide, Size, Category)
│   ├── App.tsx             # Application routes & code splitting
│   ├── index.css           # Tailwind directives & luxury styling
│   └── main.tsx            # App entry point with ErrorBoundary & AuthProvider
├── supabase/
│   ├── schema.sql          # Complete PostgreSQL schema, buckets, and RLS policies
│   └── seed.sql            # Seed script with 60 products (Men, Women, Unisex)
├── netlify.toml            # Netlify build configuration & SPA 200 redirect rules
├── package.json            # Project dependencies & scripts
└── README.md               # Documentation & setup guide
```

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/dinil2/auraStudio.git
cd auraStudio

# 2. Install dependencies
npm install

# 3. Create .env file (optional - runs in offline demo mode automatically)
cp .env.example .env

# 4. Start the local development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Supabase Integration & RLS Security

To connect your own live Supabase backend:

1. Create a project at [supabase.com](https://supabase.com).
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase **SQL Editor**:
   - Creates the `products`, `site_settings`, and `hero_slides` tables.
   - Sets up public storage buckets `product-images` and `site-assets`.
   - Enables **Row Level Security (RLS)**: Public read access for everyone, while INSERT, UPDATE, and DELETE are strictly restricted to `dinilbhashana596@gmail.com`.
3. Run [`supabase/seed.sql`](supabase/seed.sql) in the **SQL Editor** to populate 60 fashion products with two image angles each, site settings, and 4 hero slides.
4. In **Authentication > Users**, manually create the admin account `dinilbhashana596@gmail.com` with your preferred secure password.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment variables.

---

## 🌐 Netlify Deployment

The project is pre-configured with [`netlify.toml`](netlify.toml) for static deployment:

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Redirects:** `/* /index.html 200` (handles single-page application client routing)
4. Set environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify's **Site Configuration > Environment Variables**.

---

## 📄 License

Crafted for **AURA Studio** &bull; Colombo, Sri Lanka 🇱🇰  
All rights reserved.
