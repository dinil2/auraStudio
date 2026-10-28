import React, { useState } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { APP_CONFIG } from '../../config';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: APP_CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="product-card group flex flex-col bg-brand-surface rounded-2xl border border-brand-border/70 hover:border-brand-accent/40 transition-all duration-300 overflow-hidden shadow-soft hover:shadow-hover cursor-pointer"
    >
      {/* 
        Product Image Area:
        - On desktop: Mouse hover instantly reveals the second angle.
        - On mobile and desktop: Clicking/tapping the image opens the product modal pop-up!
      */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-subtle select-none">
        {/* Base Image: Front Shot (Always loaded in DOM) */}
        <img
          src={product.images[0]}
          alt={`${product.title} - angle 1`}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Second Image: Back / Detail Shot (Reveals instantly on desktop hover) */}
        <img
          src={product.images[1] || product.images[0]}
          alt={`${product.title} - angle 2`}
          className={`absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-150 ease-out ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Visual angle indicator dots */}
        <div className="absolute top-3 right-3 z-10 flex gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              !isHovered ? 'bg-brand-accent w-3.5' : 'bg-black/30'
            }`}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              isHovered ? 'bg-brand-accent w-3.5' : 'bg-black/30'
            }`}
          />
        </div>

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10 flex gap-1">
          {product.categories.slice(0, 1).map((cat) => (
            <span
              key={cat}
              className="text-[10px] uppercase font-bold tracking-wider bg-white/90 backdrop-blur-md text-brand-text px-2.5 py-1 rounded-full shadow-sm border border-brand-border/40"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Hover Quick Order Pill Bar */}
        <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex">
          <div className="w-full py-2 px-3 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-brand-border/60 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-text group-hover:text-brand-accent transition-colors">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order on WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-white">
        <div>
          <h3 className="font-display font-medium text-sm sm:text-base text-brand-text group-hover:text-brand-accent transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">
            {product.description}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-brand-borderLight flex items-center justify-between">
          <span className="font-sans font-bold text-sm sm:text-base text-brand-text">
            {formattedPrice}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-muted group-hover:text-brand-accent transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </span>
        </div>
      </div>
    </div>
  );
};
