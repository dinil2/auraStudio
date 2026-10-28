import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import { APP_CONFIG } from '../../config';
import { formatWhatsAppNumber } from '../../lib/whatsapp';

interface NavbarProps {
  logoUrl?: string;
  whatsappNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  logoUrl,
  whatsappNumber = APP_CONFIG.defaultWhatsAppNumber,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToCatalog = () => {
    setIsMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formattedPhone = formatWhatsAppNumber(whatsappNumber);
  const directWhatsAppUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    'Hello AURA! I would like to inquire about your casual apparel collection.'
  )}`;

  return (
    <>
      {/* 
        Floating Oval Transparent White Glassmorphic Navbar (User Requirement)
        - Removed upper black announcement strip
        - Oval pill shape floating over the hero
        - Perfectly centered navigation links (Collection, Women, Men)
      */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-3 sm:pt-4 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-28'
        }`}
      >
        <div className="max-w-5xl mx-auto bg-white/75 backdrop-blur-xl border border-white/60 shadow-soft rounded-full px-5 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <a
            href="/"
            className="flex items-center gap-1.5 shrink-0 focus:outline-none"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={APP_CONFIG.brandName}
                className="h-7 object-contain"
              />
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-brand-text">
                  {APP_CONFIG.brandName}
                </span>
                <span className="text-[9px] uppercase font-sans tracking-widest text-brand-muted font-semibold">
                  STUDIO
                </span>
              </div>
            )}
          </a>

          {/* Center: Perfectly Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={scrollToCatalog}
              className="text-xs uppercase tracking-widest text-brand-text/80 hover:text-brand-accent transition-colors cursor-pointer font-semibold"
            >
              Collection
            </button>
            <button
              onClick={scrollToCatalog}
              className="text-xs uppercase tracking-widest text-brand-text/80 hover:text-brand-accent transition-colors cursor-pointer font-semibold"
            >
              Women
            </button>
            <button
              onClick={scrollToCatalog}
              className="text-xs uppercase tracking-widest text-brand-text/80 hover:text-brand-accent transition-colors cursor-pointer font-semibold"
            >
              Men
            </button>
            <a
              href="#about"
              className="text-xs uppercase tracking-widest text-brand-text/80 hover:text-brand-accent transition-colors font-semibold"
            >
              Our Quality
            </a>
          </nav>

          {/* Right: WhatsApp CTA Button */}
          <div className="hidden md:flex items-center">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold bg-brand-accent hover:bg-brand-accent-hover text-white transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Order</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-brand-text hover:text-brand-accent transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-[#FAF7F2] flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              <button
                onClick={scrollToCatalog}
                className="text-3xl font-serif font-bold text-brand-text hover:text-brand-accent transition-colors"
              >
                The Collection
              </button>
              <button
                onClick={scrollToCatalog}
                className="text-2xl font-serif text-brand-text hover:text-brand-accent transition-colors"
              >
                Women's Casual
              </button>
              <button
                onClick={scrollToCatalog}
                className="text-2xl font-serif text-brand-text hover:text-brand-accent transition-colors"
              >
                Men's Casual
              </button>
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-brand-text hover:text-brand-accent transition-colors"
              >
                Fabric &amp; Cut
              </a>
              <div className="pt-6">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto py-3.5 rounded-full bg-brand-accent text-white font-bold text-xs tracking-wider uppercase shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat &amp; Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
