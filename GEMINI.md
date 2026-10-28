# **Role:**

You are a World-Class Senior Full-Stack Engineer, Creative Technologist and Lead Frontend Architect. You build premium, award-level fashion e-commerce experiences that are buttery smooth on a cheap Android phone, pixel-perfect on a 14-inch laptop and beautiful on a 24-inch monitor. You write clean, scalable, maintainable, production-grade code that is built for the long run.

# **Objective:**

Build a complete, deployable fashion e-commerce store with a cinematic home page, a Men / Women / Unisex product catalogue, a product pop-up that hands the order off to WhatsApp, and a hidden admin panel that lets a non-technical manager manage the entire site. The database, auth and file storage run on Supabase, and the frontend deploys to Netlify with zero extra configuration.

# **Context:**

- The store sells T-shirts and casual fashion in Sri Lanka. There is NO online payment. Customers pick a product and size, then order by WhatsApp.
- Over 80% of visitors come from mobile phones, so this is mobile-first. It must also look excellent on a 14" laptop (about 1366x768 to 1536x864), a 24" monitor (1920x1080) and everything in between.
- The admin / manager is NOT a coder. The admin panel must be so simple that anyone can use it without help.
- Hosting is Netlify (static deploy), the backend is Supabase. Some languages and frameworks cannot be deployed on Netlify (PHP, MySQL, long-running Node servers), so the stack MUST be Netlify-compatible.
- Previous experience: animation-heavy sites lagged and stuttered on phones. That is unacceptable here. Performance beats flashiness on mobile.

# **Instructions:**

## **Instruction 1: Tech Stack (Netlify-safe)**

- Use Vite + React 19 + TypeScript + Tailwind CSS + React Router. Build as a static SPA (`npm run build` outputs `dist`). Do NOT use PHP, MySQL, server-side rendering that needs a running server, or anything Netlify cannot host.
- Backend: `@supabase/supabase-js` only (Postgres database, Supabase Auth, Supabase Storage). All data access goes through one typed service layer.
- Animation libraries: GSAP + ScrollTrigger (scroll animations, pinned sections, text reveals), Lenis (smooth scrolling), Framer Motion (React animations, hover effects, modal and filter transitions), Three.js / React Three Fiber (a lightweight 3D background in the hero, lazy-loaded, desktop only), custom mouse parallax (layers move at different speeds with the cursor, desktop only).
- Create `netlify.toml` with the build command, publish directory `dist`, and an SPA fallback redirect (`/* /index.html 200`). Add `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Write a short README with step-by-step Netlify deployment instructions (connect GitHub, set the two env vars, deploy).

## **Instruction 2: Project Architecture (clean, scalable, long-term)**

- Use a feature-based folder structure: `src/features/{home,catalog,product-modal,admin,auth}`, `src/components/ui`, `src/lib/{supabase,whatsapp,animation}`, `src/hooks`, `src/types`, `src/config`.
- Strict TypeScript, no `any`. Small single-responsibility components. Custom hooks for data (`useProducts`, `useSiteSettings`). No duplicated logic, no spaghetti code, no giant files. Centralise constants (WhatsApp number, category names, size list) in `src/config`.
- Add loading skeletons, error states and empty states everywhere. Add an error boundary.
- Add comments only where the logic is non-obvious. Name things clearly so the code is self-documenting.

## **Instruction 3: Supabase Database, Storage and Security**

Generate a `supabase/schema.sql` file I can paste into the Supabase SQL editor, containing:

- `products`: id (uuid), title, description, price (numeric), categories (text[] containing any of `men`, `women`, `unisex`, so one product can belong to several), sizes (text[]), images (text[], exactly 2 URLs), is_active (bool), created_at.
- `site_settings` (single row): logo_url, whatsapp_number, hero_headline, hero_subtext.
- `hero_slides`: id, image_url, headline, subtext, sort_order.
- Storage buckets: `product-images` and `site-assets`, both public read.
- Row Level Security on every table: anyone can SELECT, but INSERT / UPDATE / DELETE (tables and storage) are allowed ONLY for the authenticated admin user. Enforce this in the policies using the admin's email from `auth.jwt()`, not only in the frontend.
- A `seed.sql` with 60 sample products: 20 Men, 20 Women, 20 Unisex. Realistic T-shirt names, descriptions and prices in LKR. The price is the same for every size of a product. Each product has exactly 2 images.
- Sample images: generate the sample product and hero images with your image-generation capability (fashion T-shirt product photos, front view and a second angle or detail shot), upload them to Supabase Storage, and reference them in the seed. If generating all 120 is not feasible, generate as many as you can and fill the rest with curated Unsplash fashion URLs. Never leave broken or placeholder images.

## **Instruction 4: Home Page, Hero Section**

- A full-screen cinematic hero (use `100svh`, not `100vh`, so mobile browser bars do not break it). Background images from `hero_slides` crossfade automatically every 5-6 seconds with a slow Ken Burns zoom. Add small slide indicators.
- Big animated headline with a GSAP SplitText-style word/line reveal and a subtle subline and CTA button ("Shop Now") that smooth-scrolls to the catalogue.
- A glassmorphism navbar (logo on the left, minimal links, mobile hamburger with an animated full-screen menu). The navbar hides on scroll down and shows on scroll up.
- Desktop only: layered mouse parallax on the hero text and imagery, plus an optional lightweight React Three Fiber floating-particles or fabric-wave background, lazy-loaded and capped at low particle counts.
- It must look perfect on 14" laptops, 24" monitors, tablets and phones. Use fluid typography (`clamp()`), responsive spacing and test mentally at 360px, 768px, 1366px and 1920px widths.

## **Instruction 5: Catalogue, Men / Women / Unisex Filter**

- When the user scrolls below the hero, show a sticky, oval pill-shaped segmented control with three buttons: Men, Women, Unisex. Unisex is selected by default.
- A sliding oval indicator animates between the selected buttons (Framer Motion `layoutId`). Clicking a button filters the grid with a smooth stagger transition (Framer Motion `AnimatePresence`, animating only transform and opacity).
- Product grid: 2 columns on mobile, 3 on tablet, 4 on desktop. Cards have a clean editorial look: image, title, price, a small "View" button. Fetch products once, filter on the client by `categories.includes(selected)`, and paginate or "load more" in batches of 12 so the DOM stays light.
- Image swap: tapping or clicking the product IMAGE on a card swaps it to the product's second image with a cool animation (for example a GSAP clip-path wipe or a diagonal slice reveal with a slight scale). ONLY the image changes, nothing else on the card moves. Tapping again swaps back.
- Tapping the product TITLE, price or "View" button opens the product pop-up (Instruction 6).
- Scroll animations: GSAP + ScrollTrigger reveals for section headings and cards (fade and rise, batch them with `ScrollTrigger.batch`), a pinned or horizontally-scrolling feature strip on desktop only, and smooth scrolling with Lenis.

## **Instruction 6: Product Pop-up and WhatsApp Ordering**

- A modal (Framer Motion, scale and fade in, backdrop blur, closes on backdrop click, Esc key and a close button; locks body scroll; becomes a bottom-sheet on mobile) showing: product images with a small arrow button to switch to the second image (animated transition), title, price, description and a size selector (S, M, L, XL, XXL; selected size is highlighted).
- The price is identical for every size and never changes when the size changes.
- A "Order on WhatsApp" button, disabled until a size is chosen. It opens `https://wa.me/94713834079?text=...` (the number comes from `site_settings`, defaulting to 0713834079 converted to international format 94713834079) in a new tab. The pre-filled message is URL-encoded and includes: a greeting, product title, selected size, price, and a short description. Put the message builder in `src/lib/whatsapp.ts` as a pure, testable function.

## **Instruction 7: Mobile Performance Rules (critical, no lag)**

- Animate ONLY `transform` and `opacity`. Never animate width, height, top, left, margin or box-shadow. Use `will-change` sparingly and remove it after animations finish.
- Use `ScrollTrigger.matchMedia` / `gsap.matchMedia()` so heavy effects (pinning, parallax, Three.js, custom cursor) run only on desktop (`(hover: hover) and (pointer: fine)`). Mobile gets lighter, simpler animations.
- Lenis: use it on desktop; on touch devices keep native scrolling so it never fights the browser. Connect Lenis to ScrollTrigger correctly (`lenis.on('scroll', ScrollTrigger.update)` and drive it from `gsap.ticker`).
- Respect `prefers-reduced-motion` and also disable Three.js on low-end devices (check `navigator.hardwareConcurrency` and `deviceMemory`).
- Images: serve WebP, use `loading="lazy"`, `decoding="async"`, explicit width and height (no layout shift), responsive `srcset` where possible, and the hero's first image preloaded. Compress uploads in the browser before sending to Supabase (max 1600px wide, WebP, around 80% quality).
- Always clean up with `gsap.context()` and `ctx.revert()`, kill ScrollTriggers on unmount, and avoid memory leaks. Code-split the admin area and Three.js with `React.lazy`.
- Target: Lighthouse mobile performance 85+, no jank at 60fps on mid-range phones.

## **Instruction 8: Footer and Hidden Admin Entrance**

- A tasteful footer with the logo, short brand text, WhatsApp contact link and social placeholders.
- In the very bottom-right corner of the footer, add a small, low-opacity, discreet logo-style icon button that links to `/admin/login`. It must be unobtrusive so normal customers do not notice it, but the admin knows it is there. No "Admin" text label, no link in the navbar or sitemap, and add `noindex` to all admin routes.

## **Instruction 9: Admin Authentication**

- Use Supabase Auth (email + password) with ONE admin account. Admin email: `dinilbhashana596@gmail.com`. Do NOT hardcode the password anywhere in the source code, the seed files or the README. I will create this user manually in the Supabase dashboard (Authentication > Users) and set the password there myself. Add clear instructions for this step in the README.
- Protect all `/admin/*` routes with a route guard. Only the admin email is allowed in, enforced both in the frontend and in the RLS policies. Add a login page (clean, minimal), a logout button, session persistence, and a friendly error message for wrong credentials. Disable public sign-ups.

## **Instruction 10: Admin Panel (made for a non-coder)**

A clean dashboard with big, clearly labelled buttons and a mobile-friendly layout, with these sections:

- **Products list:** searchable table or card grid with thumbnail, title, price, categories, plus Edit and Delete buttons (Delete asks for confirmation with a friendly dialog).
- **Add / Edit Product form:** title, description, price, sizes (checkboxes), categories (checkboxes: Men, Women, Unisex, where multiple can be ticked, e.g. Men and Unisex), upload exactly 2 images with previews and drag and drop, an active/hidden toggle. Show a progress indicator while uploading, validation messages, and a success toast. Use `react-hook-form` + `zod`.
- **Site settings:** upload or replace the logo (shown in the navbar and footer), edit the WhatsApp number, edit the hero headline and subtext.
- **Hero slides:** add, delete and reorder hero background images.
- Everything the admin changes must appear on the live site immediately (no code changes, no redeploy).

## **Instruction 11: Visual Design System**

- Style: modern, premium streetwear editorial. Use a refined neutral palette (off-white and near-black) with ONE bold accent colour, and pair a striking display font with a clean sans-serif body font (load via Google Fonts with `font-display: swap`). Consistent spacing scale, rounded corners, subtle grain texture (CSS only, not heavy), and consistent hover states on desktop and tap-feedback on mobile.
- Accessible: sufficient colour contrast, focus rings, keyboard navigation for the modal and filter, proper alt text, semantic HTML, and ARIA labels.
- Add SEO basics: title, meta description, Open Graph tags and a favicon.

## **Instruction 12: Quality Checklist Before Finishing**

- Run through the project and confirm: the build passes with no TypeScript or ESLint errors; `netlify.toml` and the SPA redirect work; RLS blocks non-admin writes; the WhatsApp link and message format are correct; the filter defaults to Unisex; each product has 2 images; the modal and image swap work on touch devices; no console errors; and no secrets are committed.

# **Notes:**

- Write production-grade, clean, well-structured, scalable and maintainable code with a clear architecture. Build for the long run and never produce unstructured or spaghetti code.
- Deployment must work on Netlify as a static site. If any library or approach would break Netlify hosting, choose an alternative.
- Mobile performance always wins over visual complexity. If an animation lags on mobile, simplify or disable it there.
- Never hardcode credentials or API keys. Use environment variables, and keep `.env` out of Git.
- Do not ask me questions. Make sensible decisions and build the whole project, then give me a short summary and a step-by-step list of what I must do in Supabase and Netlify.
- Build a digital storefront that feels like a luxury brand, not a template.



also use html css and js as well.and if you thing somethinmg should add to this site more add those things as well.