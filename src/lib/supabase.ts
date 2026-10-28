import { createClient } from '@supabase/supabase-js';
import { Product, SiteSettings, HeroSlide } from '../types';
import { INITIAL_PRODUCTS, INITIAL_HERO_SLIDES, INITIAL_SITE_SETTINGS } from '../data/mockProducts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Local storage key for offline/fallback caching & local demo edits (v2 for fresh image sync)
const LOCAL_STORAGE_PRODUCTS_KEY = 'aura_local_products_v2';
const LOCAL_STORAGE_SETTINGS_KEY = 'aura_local_settings_v2';
const LOCAL_STORAGE_SLIDES_KEY = 'aura_local_slides_v2';

function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read products from local storage:', e);
  }
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Could not save products to local storage:', e);
  }
}

function getLocalSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read settings from local storage:', e);
  }
  return INITIAL_SITE_SETTINGS;
}

function saveLocalSettings(settings: SiteSettings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Could not save settings to local storage:', e);
  }
}

function getLocalSlides(): HeroSlide[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SLIDES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read slides from local storage:', e);
  }
  return INITIAL_HERO_SLIDES;
}

function saveLocalSlides(slides: HeroSlide[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SLIDES_KEY, JSON.stringify(slides));
  } catch (e) {
    console.warn('Could not save slides to local storage:', e);
  }
}

// ============================================================================
// TYPED SERVICE LAYER
// ============================================================================

export const productService = {
  async getAll(): Promise<Product[]> {
    if (!supabase) {
      return getLocalProducts();
    }
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase products fetch failed, falling back to local state:', error.message);
        return getLocalProducts();
      }
      return (data as Product[]) || getLocalProducts();
    } catch (err) {
      console.warn('Exception during product fetch, falling back to local state:', err);
      return getLocalProducts();
    }
  },

  async create(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    if (!supabase) {
      const newProduct: Product = {
        ...product,
        id: 'prod-' + Date.now(),
        created_at: new Date().toISOString(),
      };
      const current = getLocalProducts();
      const updated = [newProduct, ...current];
      saveLocalProducts(updated);
      return newProduct;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Product;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    if (!supabase) {
      const current = getLocalProducts();
      const index = current.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Product not found');
      const updatedItem = { ...current[index], ...updates };
      current[index] = updatedItem;
      saveLocalProducts(current);
      return updatedItem;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Product;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      const current = getLocalProducts();
      const filtered = current.filter((p) => p.id !== id);
      saveLocalProducts(filtered);
      return;
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};

export const siteSettingsService = {
  async get(): Promise<SiteSettings> {
    if (!supabase) {
      return getLocalSettings();
    }
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return getLocalSettings();
      }
      return data as SiteSettings;
    } catch {
      return getLocalSettings();
    }
  },

  async update(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (!supabase) {
      const current = getLocalSettings();
      const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
      saveLocalSettings(updated);
      return updated;
    }

    // Try update first
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { data, error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as SiteSettings;
    } else {
      const { data, error } = await supabase
        .from('site_settings')
        .insert([settings])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as SiteSettings;
    }
  },
};

export const heroSlidesService = {
  async getAll(): Promise<HeroSlide[]> {
    if (!supabase) {
      return getLocalSlides();
    }
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return getLocalSlides();
      }
      return data as HeroSlide[];
    } catch {
      return getLocalSlides();
    }
  },

  async create(slide: Omit<HeroSlide, 'id' | 'created_at'>): Promise<HeroSlide> {
    if (!supabase) {
      const newSlide: HeroSlide = {
        ...slide,
        id: 'slide-' + Date.now(),
        created_at: new Date().toISOString(),
      };
      const current = getLocalSlides();
      const updated = [...current, newSlide];
      saveLocalSlides(updated);
      return newSlide;
    }

    const { data, error } = await supabase
      .from('hero_slides')
      .insert([slide])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as HeroSlide;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      const current = getLocalSlides();
      saveLocalSlides(current.filter((s) => s.id !== id));
      return;
    }

    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async updateOrder(slides: { id: string; sort_order: number }[]): Promise<void> {
    if (!supabase) {
      const current = getLocalSlides();
      const updated = current.map((slide) => {
        const found = slides.find((s) => s.id === slide.id);
        return found ? { ...slide, sort_order: found.sort_order } : slide;
      });
      updated.sort((a, b) => a.sort_order - b.sort_order);
      saveLocalSlides(updated);
      return;
    }

    for (const slide of slides) {
      await supabase
        .from('hero_slides')
        .update({ sort_order: slide.sort_order })
        .eq('id', slide.id);
    }
  },
};

export const storageService = {
  async uploadFile(
    bucket: 'product-images' | 'site-assets',
    file: File
  ): Promise<string> {
    if (!supabase) {
      // Offline/demo fallback: create a data URL or object URL
      return URL.createObjectURL(file);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },
};

