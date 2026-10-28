-- ==============================================================================
-- AURA STREETWEAR - SUPABASE SCHEMA & SECURITY CONFIGURATION
-- Admin Email: dinilbhashana596@gmail.com
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    categories TEXT[] NOT NULL DEFAULT ARRAY['unisex']::TEXT[],
    sizes TEXT[] NOT NULL DEFAULT ARRAY['S', 'M', 'L', 'XL', 'XXL']::TEXT[],
    images TEXT[] NOT NULL CHECK (array_length(images, 1) = 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SITE SETTINGS TABLE (Single row)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_url TEXT,
    whatsapp_number TEXT NOT NULL DEFAULT '0713834079',
    hero_headline TEXT NOT NULL DEFAULT 'RAW COMFORT. TIMELESS DRIP.',
    hero_subtext TEXT NOT NULL DEFAULT 'Engineered heavyweight oversized tees designed in Colombo. Zero compromise on cut, wash, and drape.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. HERO SLIDES TABLE
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    headline TEXT NOT NULL,
    subtext TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_products_categories ON public.products USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON public.hero_slides(sort_order ASC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Anyone can read (SELECT), but ONLY the authenticated admin can write (INSERT, UPDATE, DELETE)
-- Admin email: dinilbhashana596@gmail.com
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" 
ON public.products 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
CREATE POLICY "Admin can insert products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com');

DROP POLICY IF EXISTS "Admin can update products" ON public.products;
CREATE POLICY "Admin can update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com');

DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
CREATE POLICY "Admin can delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com');

-- SITE SETTINGS POLICIES
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;
CREATE POLICY "Admin can update site settings" 
ON public.site_settings 
FOR UPDATE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com');

DROP POLICY IF EXISTS "Admin can insert site settings" ON public.site_settings;
CREATE POLICY "Admin can insert site settings" 
ON public.site_settings 
FOR INSERT 
TO authenticated 
WITH CHECK ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com');

-- HERO SLIDES POLICIES
DROP POLICY IF EXISTS "Public can view hero slides" ON public.hero_slides;
CREATE POLICY "Public can view hero slides" 
ON public.hero_slides 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admin can insert hero slides" ON public.hero_slides;
CREATE POLICY "Admin can insert hero slides" 
ON public.hero_slides 
FOR INSERT 
TO authenticated 
WITH CHECK ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com');

DROP POLICY IF EXISTS "Admin can update hero slides" ON public.hero_slides;
CREATE POLICY "Admin can update hero slides" 
ON public.hero_slides 
FOR UPDATE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com');

DROP POLICY IF EXISTS "Admin can delete hero slides" ON public.hero_slides;
CREATE POLICY "Admin can delete hero slides" 
ON public.hero_slides 
FOR DELETE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com');

-- ==============================================================================
-- STORAGE BUCKETS SETUP & SECURITY
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Read Policy: Public Read
DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
CREATE POLICY "Public Access Product Images"
ON storage.objects FOR SELECT
USING (bucket_id IN ('product-images', 'site-assets'));

-- Storage Write Policy: Admin Only
DROP POLICY IF EXISTS "Admin Upload Objects" ON storage.objects;
CREATE POLICY "Admin Upload Objects"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id IN ('product-images', 'site-assets') 
    AND (auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com'
);

DROP POLICY IF EXISTS "Admin Update Objects" ON storage.objects;
CREATE POLICY "Admin Update Objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id IN ('product-images', 'site-assets') 
    AND (auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com'
);

DROP POLICY IF EXISTS "Admin Delete Objects" ON storage.objects;
CREATE POLICY "Admin Delete Objects"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id IN ('product-images', 'site-assets') 
    AND (auth.jwt() ->> 'email') = 'dinilbhashana596@gmail.com'
);

