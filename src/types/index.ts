export type Category = 'men' | 'women' | 'unisex';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: Category[];
  sizes: Size[];
  images: [string, string]; // Exactly 2 images
  is_active: boolean;
  created_at?: string;
}

export interface SiteSettings {
  id?: string;
  logo_url: string;
  whatsapp_number: string;
  hero_headline: string;
  hero_subtext: string;
  updated_at?: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  headline: string;
  subtext: string;
  sort_order: number;
  created_at?: string;
}

export interface OrderDetails {
  product: Product;
  size: Size;
  whatsappNumber: string;
}

