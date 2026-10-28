import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Instagram, Facebook, Shield } from 'lucide-react';
import { APP_CONFIG } from '../../config';
import { formatWhatsAppNumber } from '../../lib/whatsapp';

interface FooterProps {
  logoUrl?: string;
  whatsappNumber?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logoUrl,
  whatsappNumber = APP_CONFIG.defaultWhatsAppNumber,
}) => {
  const currentYear = new Date().getFullYear();
  const formattedPhone = formatWhatsAppNumber(whatsappNumber);

  return (
    <footer className="bg-brand-subtle border-t border-brand-border text-brand-muted pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-border">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={APP_CONFIG.brandName}
                  className="h-8 object-contain"
                />
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-2xl tracking-tight text-brand-text">
                    {APP_CONFIG.brandName}
                  </span>
                  <span className="text-[10px] uppercase font-sans tracking-widest text-brand-muted font-semibold">
                    Colombo
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm max-w-md text-brand-muted leading-relaxed">
              Curated everyday casual luxury for women and men. Crafted from 280+ GSM combed cotton with pre-washed drape and seamless WhatsApp ordering across Sri Lanka.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${formattedPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white hover:bg-brand-accent hover:text-white border border-brand-border flex items-center justify-center transition-colors text-brand-text shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white hover:bg-brand-accent hover:text-white border border-brand-border flex items-center justify-center transition-colors text-brand-text shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white hover:bg-brand-accent hover:text-white border border-brand-border flex items-center justify-center transition-colors text-brand-text shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-sans font-bold uppercase tracking-widest text-brand-text">
              Shop Collections
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#catalog"
                  className="hover:text-brand-accent transition-colors"
                >
                  Women's Relaxed &amp; Crop
                </a>
              </li>
              <li>
                <a
                  href="#catalog"
                  className="hover:text-brand-accent transition-colors"
                >
                  Men's Classic Boxy
                </a>
              </li>
              <li>
                <a
                  href="#catalog"
                  className="hover:text-brand-accent transition-colors"
                >
                  Unisex Heavyweight Tees
                </a>
              </li>
              <li>
                <a
                  href="#catalog"
                  className="hover:text-brand-accent transition-colors"
                >
                  Everyday Basics
                </a>
              </li>
            </ul>
          </div>

          {/* Colombo Studio & Service */}
          <div className="space-y-3">
            <h5 className="text-xs font-sans font-bold uppercase tracking-widest text-brand-text">
              Delivery &amp; Payments
            </h5>
            <p className="text-sm leading-relaxed">
              Order via WhatsApp Chat<br />
              Colombo 01 - 15: 24 - 48 Hours<br />
              Islandwide Delivery: 2 - 3 Days<br />
              Cash on Delivery Available
            </p>
          </div>
        </div>

        {/* Bottom bar with Discreet Hidden Admin Entrance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>
            &copy; {currentYear} {APP_CONFIG.brandName} Studio. All rights reserved. Designed in Sri Lanka.
          </p>

          <div className="flex items-center gap-4">
            <span>Islandwide Cash on Delivery</span>
            <span>&bull;</span>
            <span>Direct WhatsApp Orders</span>
            {/* Discreet Admin Link */}
            <Link
              to="/admin/login"
              aria-label="Staff Portal"
              title=""
              className="text-brand-muted/20 hover:text-brand-accent transition-colors p-1"
            >
              <Shield className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
