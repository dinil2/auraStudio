import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { HeroSlide, SiteSettings } from '../../types';
import { Button } from '../../components/ui/Button';

interface HeroProps {
  slides: HeroSlide[];
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ slides, settings }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Auto crossfade slides smoothly every 6 seconds
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides]);

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeSlide = slides[currentSlideIndex] || {
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80',
    headline: settings.hero_headline || 'Effortless Everyday Luxury.',
    subtext: settings.hero_subtext || 'Thoughtfully crafted casual tees & silhouettes for women and men.',
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[620px] flex items-center justify-center overflow-hidden bg-brand-bg pt-16"
    >
      {/* Editorial Background Imagery with subtle Ken Burns zoom */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image_url}
                alt={slide.headline}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Soft, warm editorial fashion vignette (replaces dark tech mask) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/25 z-2" />
      </div>

      {/* Hero Content: Elegant Fashion Typography */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Editorial Subtitle Pill */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-widest text-white/95 bg-white/20 backdrop-blur-md border border-white/30 font-medium shadow-sm">
            NEW SEASON &bull; COLOMBO ATELIER
          </span>
        </div>

        {/* Fashion Serif Headline */}
        <h1 className="font-serif font-normal tracking-tight text-white text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.08] drop-shadow-md">
          {activeSlide.headline || settings.hero_headline || 'Effortless Everyday Luxury.'}
        </h1>

        {/* Subtext */}
        <p className="mt-5 text-sm sm:text-lg md:text-xl text-white/90 max-w-xl mx-auto font-sans font-light leading-relaxed drop-shadow">
          {activeSlide.subtext || settings.hero_subtext}
        </p>

        {/* Shopping CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <Button
            size="lg"
            onClick={scrollToCatalog}
            className="w-full sm:w-auto text-xs uppercase tracking-widest px-8 py-4 font-bold bg-white text-brand-text hover:bg-brand-bg hover:text-brand-accent border-0 shadow-lg"
          >
            Explore Collection
          </Button>
          <a
            href="#about"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold text-white hover:text-white bg-black/30 hover:bg-black/50 border border-white/30 backdrop-blur-sm transition-all"
          >
            Fabric &amp; Cut
          </a>
        </div>
      </div>

      {/* Minimalist Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-12 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlideIndex
                  ? 'w-7 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToCatalog}
        className="absolute bottom-5 sm:bottom-6 z-20 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-sans font-semibold cursor-pointer"
        aria-label="Scroll to catalog"
      >
        <span>SCROLL TO SHOP</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </button>
    </section>
  );
};
