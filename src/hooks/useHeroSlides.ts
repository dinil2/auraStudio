import { useState, useEffect, useCallback } from 'react';
import { HeroSlide } from '../types';
import { heroSlidesService } from '../lib/supabase';
import { INITIAL_HERO_SLIDES } from '../data/mockProducts';

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>(INITIAL_HERO_SLIDES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await heroSlidesService.getAll();
      setSlides(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch hero slides';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const addSlide = async (slide: Omit<HeroSlide, 'id' | 'created_at'>) => {
    const created = await heroSlidesService.create(slide);
    setSlides((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
    return created;
  };

  const deleteSlide = async (id: string) => {
    await heroSlidesService.delete(id);
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const reorderSlides = async (newOrder: { id: string; sort_order: number }[]) => {
    await heroSlidesService.updateOrder(newOrder);
    setSlides((prev) => {
      const copy = prev.map((s) => {
        const found = newOrder.find((item) => item.id === s.id);
        return found ? { ...s, sort_order: found.sort_order } : s;
      });
      return copy.sort((a, b) => a.sort_order - b.sort_order);
    });
  };

  return {
    slides,
    loading,
    error,
    refresh: fetchSlides,
    addSlide,
    deleteSlide,
    reorderSlides,
  };
}

