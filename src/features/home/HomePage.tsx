import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Hero } from './Hero';
import { FeatureStrip } from './FeatureStrip';
import { Catalog } from '../catalog/Catalog';
import { ProductModal } from '../product-modal/ProductModal';
import { useProducts } from '../../hooks/useProducts';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useHeroSlides } from '../../hooks/useHeroSlides';
import { initSmoothScroll } from '../../lib/animation';

export const HomePage: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { settings } = useSiteSettings();
  const { slides } = useHeroSlides();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize smooth scroll on desktop
  useEffect(() => {
    const { destroy } = initSmoothScroll();
    return () => destroy();
  }, []);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col selection:bg-brand-accent selection:text-white">
      {/* Dynamic Navbar */}
      <Navbar
        logoUrl={settings.logo_url}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* Hero Section */}
      <Hero slides={slides} settings={settings} />

      {/* Feature Strip */}
      <FeatureStrip />

      {/* Catalog & Filter Grid */}
      <Catalog
        products={products}
        loading={productsLoading}
        onSelectProduct={handleOpenProduct}
      />

      {/* Brand Craftsmanship / About Section */}
      <section id="about" className="py-20 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-brand-border shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                alt="Colombo Textile Atelier"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] font-sans uppercase tracking-widest text-white/90 block mb-1">
                  OUR CRAFT &bull; COLOMBO
                </span>
                <p className="text-white font-serif text-xl font-bold">
                  280+ GSM Combed Cotton &bull; Soft Washed &bull; Tailored Drape
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-accent">
                COMFORT FIRST
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-text leading-tight">
                Luxury Quality Tees Made for the Island Lifestyle.
              </h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                We believe everyday casual clothing should feel effortlessly soft, hold its shape through countless washes, and flatter both relaxed and elevated outfits. From breezy Colombo afternoons to evening hangouts, every piece is tailored with premium combed cotton that breathes easily.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-brand-border font-sans text-xs text-brand-text">
                <div>
                  <span className="block text-brand-accent font-bold text-lg font-serif">100%</span>
                  <span className="text-brand-muted">Islandwide Doorstep Delivery</span>
                </div>
                <div>
                  <span className="block text-brand-accent font-bold text-lg font-serif">0</span>
                  <span className="text-brand-muted">Card Hassles &bull; Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        logoUrl={settings.logo_url}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* Product Pop-up Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        whatsappNumber={settings.whatsapp_number}
      />
    </div>
  );
};
