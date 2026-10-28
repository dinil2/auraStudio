import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Ruler, CheckCircle2 } from 'lucide-react';
import { Product, Size } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { AVAILABLE_SIZES, SIZE_GUIDE, APP_CONFIG } from '../../config';
import { buildWhatsAppOrderUrl } from '../../lib/whatsapp';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  whatsappNumber = APP_CONFIG.defaultWhatsAppNumber,
}) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<0 | 1>(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedSize(null);
      setCurrentImageIndex(0);
      setShowSizeGuide(false);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: APP_CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleOrderClick = () => {
    if (!selectedSize) return;
    const url = buildWhatsAppOrderUrl(product, selectedSize, whatsappNumber);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleImageAngle = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl p-0 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Left Column: Image Gallery with Angle Switch Arrow */}
        <div className="relative aspect-[3/4] sm:aspect-auto sm:h-full min-h-[340px] rounded-2xl overflow-hidden bg-brand-subtle">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentImageIndex}
              src={product.images[currentImageIndex] || product.images[0]}
              alt={`${product.title} angle ${currentImageIndex + 1}`}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Navigation Arrows for Angles */}
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
            <button
              onClick={toggleImageAngle}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md text-brand-text flex items-center justify-center transition-colors pointer-events-auto cursor-pointer border border-brand-border/60"
              aria-label="Previous angle"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={toggleImageAngle}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md text-brand-text flex items-center justify-center transition-colors pointer-events-auto cursor-pointer border border-brand-border/60"
              aria-label="Next angle"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail indicators */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
            {[0, 1].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx as 0 | 1)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentImageIndex === idx ? 'w-6 bg-brand-accent' : 'w-2 bg-black/20'
                }`}
                aria-label={`View angle ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Product Info, Size Selector & WhatsApp Order */}
        <div className="flex flex-col justify-between py-2 sm:py-4 pr-0 sm:pr-4">
          <div>
            {/* Category tag */}
            <div className="flex items-center gap-2 mb-2">
              {product.categories.map((c) => (
                <span
                  key={c}
                  className="text-[10px] uppercase tracking-wider text-brand-accent bg-brand-accent-light px-2.5 py-0.5 rounded-full font-bold"
                >
                  {c}
                </span>
              ))}
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                In Stock &bull; Colombo
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-text leading-tight">
              {product.title}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-sans font-bold text-brand-text">
                {formattedPrice}
              </span>
              <span className="text-xs text-brand-muted">
                (Same price for all sizes)
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-brand-muted leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-6 pt-6 border-t border-brand-borderLight">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-text">
                  Choose Your Size:
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="inline-flex items-center gap-1 text-xs text-brand-accent hover:underline cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              {/* Sizes Pill Selector */}
              <div className="grid grid-cols-5 gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const isAvailable = product.sizes.includes(size);
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-accent text-white shadow-md scale-105'
                          : isAvailable
                          ? 'bg-brand-bg hover:bg-brand-border/40 text-brand-text border border-brand-border'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Collapsible Size Guide */}
              {showSizeGuide && (
                <div className="mt-4 p-3.5 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-muted space-y-1.5 animate-fadeIn">
                  <span className="font-bold text-brand-text uppercase block mb-1">
                    Measurement Chart:
                  </span>
                  {AVAILABLE_SIZES.map((sz) => (
                    <div key={sz} className="flex justify-between">
                      <span className="text-brand-text font-bold">{sz}</span>
                      <span>{SIZE_GUIDE[sz]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedSize && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Size {selectedSize} chosen &bull; Ready to order via WhatsApp</span>
              </div>
            )}
          </div>

          {/* Action CTA: Order on WhatsApp */}
          <div className="mt-8 pt-4 border-t border-brand-borderLight space-y-2">
            <Button
              size="lg"
              disabled={!selectedSize}
              onClick={handleOrderClick}
              className="w-full py-4 text-xs uppercase tracking-wider font-bold bg-[#25D366] hover:bg-[#20BA5A] border-0 shadow-md text-white flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>
                {selectedSize
                  ? `Order Size ${selectedSize} via WhatsApp`
                  : 'Please Select a Size First'}
              </span>
            </Button>

            <p className="text-[11px] text-center text-brand-muted">
              Fast WhatsApp confirmation &bull; Islandwide Cash on Delivery
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
