import { Product, Size } from '../types';
import { APP_CONFIG } from '../config';

/**
 * Normalizes a phone number to standard international WhatsApp format without '+' or special symbols.
 * Example: '0713834079' -> '94713834079'
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '94713834079';
  
  // Strip all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0 (e.g. 0713834079 in Sri Lanka), remove 0 and prepend 94
  if (cleaned.startsWith('0')) {
    return `${APP_CONFIG.countryCode}${cleaned.substring(1)}`;
  }
  
  // If already prefixed with 94 or international code
  if (cleaned.startsWith(APP_CONFIG.countryCode)) {
    return cleaned;
  }
  
  return `${APP_CONFIG.countryCode}${cleaned}`;
}

/**
 * Pure function to build a pre-filled, URL-encoded WhatsApp order message and return the direct wa.me link.
 */
export function buildWhatsAppOrderUrl(
  product: Product,
  size: Size,
  whatsappNumber: string = APP_CONFIG.defaultWhatsAppNumber
): string {
  const formattedPhone = formatWhatsAppNumber(whatsappNumber);
  
  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const messageLines = [
    `👋 Hello ${APP_CONFIG.brandName}! I would like to place an order:`,
    '',
    `🏷️ *Product:* ${product.title}`,
    `📏 *Selected Size:* ${size}`,
    `💰 *Price:* ${formattedPrice}`,
    `📝 *Details:* ${product.description.slice(0, 100)}...`,
    '',
    `Please confirm stock availability and share delivery details. Thank you! 🙏`,
  ];

  const fullMessage = messageLines.join('\n');
  const encodedMessage = encodeURIComponent(fullMessage);

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

