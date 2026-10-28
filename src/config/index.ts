import { Category, Size } from '../types';

export const APP_CONFIG = {
  brandName: 'AURA',
  brandTagline: 'Engineered Luxury Streetwear',
  defaultWhatsAppNumber: '0713834079', // Sri Lanka local format, converted to 94713834079
  countryCode: '94',
  adminEmail: 'dinilbhashana596@gmail.com',
  currency: 'LKR',
  currencySymbol: 'Rs.',
  itemsPerPage: 12,
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'unisex', label: 'Unisex' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
];

export const AVAILABLE_SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const SIZE_GUIDE: Record<Size, string> = {
  S: 'Chest: 38" | Length: 28"',
  M: 'Chest: 41" | Length: 29"',
  L: 'Chest: 44" | Length: 30"',
  XL: 'Chest: 47" | Length: 31"',
  XXL: 'Chest: 50" | Length: 32"',
};

