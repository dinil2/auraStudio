import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Category } from '../../types';
import { ProductCard } from './ProductCard';
import { Button } from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { CATEGORIES, APP_CONFIG } from '../../config';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/animation';

interface CatalogProps {
  products: Product[];
  loading: boolean;
  onSelectProduct: (product: Product) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  loading,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('unisex');
  const [displayCount, setDisplayCount] = useState<number>(APP_CONFIG.itemsPerPage);
  const catalogSectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((item) =>
      item.is_active !== false && item.categories.includes(selectedCategory)
    );
  }, [products, selectedCategory]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  const hasMore = displayCount < filteredProducts.length;

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setDisplayCount(APP_CONFIG.itemsPerPage);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + APP_CONFIG.itemsPerPage);
  };

  useEffect(() => {
    if (prefersReducedMotion() || loading) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.product-card', {
        interval: 0.1,
        batchMax: 4,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.06,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            }
          );
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [visibleProducts, loading]);

  return (
    <section
      id="catalog"
      ref={catalogSectionRef}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      {/* Editorial Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-accent">
          SEASONAL ARCHIVE
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-brand-text tracking-tight mt-2">
          Casual Everyday Luxury
        </h2>
        <p className="text-sm sm:text-base text-brand-muted mt-2.5 leading-relaxed">
          Designed with soft, heavyweight combed cotton. Easy relaxed silhouettes for effortless everyday styling.
        </p>
      </div>

      {/* 
        Sticky Oval Pill Segmented Control
        FIX: Text label is placed inside <span className="relative z-10"> to guarantee 
        it is ALWAYS visible on top of the terracotta sliding pill.
      */}
      <div className="sticky top-20 z-30 flex justify-center mb-10 sm:mb-12">
        <div className="relative inline-flex items-center p-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-brand-border shadow-sm">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`relative px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer select-none ${
                  isSelected ? 'text-white' : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                {/* Terracotta Background Sliding Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="activeFilterPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-brand-accent rounded-full shadow-sm"
                  />
                )}
                {/* Text is explicitly z-10 on top of the pill */}
                <span className="relative z-10 font-bold uppercase tracking-wider">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle Counter */}
      <div className="flex items-center justify-between text-xs text-brand-muted mb-6 pb-2 border-b border-brand-border/60">
        <span className="font-medium">SHOWING {visibleProducts.length} OF {filteredProducts.length} STYLES</span>
        <span className="uppercase font-semibold text-brand-accent">{selectedCategory} COLLECTION</span>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-white border border-brand-border">
          <p className="text-lg font-serif text-brand-text">No products in this collection yet.</p>
          <p className="text-xs text-brand-muted mt-1">Please explore our other categories or check back soon.</p>
        </div>
      ) : (
        /* Product Grid */
        <div ref={gridRef}>
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="mt-12 sm:mt-16 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="px-8 py-3.5 text-xs uppercase tracking-widest font-bold bg-white text-brand-text border-brand-border hover:border-brand-accent hover:text-brand-accent shadow-sm"
          >
            Load More Styles ({filteredProducts.length - visibleProducts.length} Remaining)
          </Button>
        </div>
      )}
    </section>
  );
};
