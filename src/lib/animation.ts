import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Checks if the user is on a desktop device with fine pointer and hover capability
 */
export function isDesktopDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks device performance profile (CPU concurrency & RAM)
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 4;
  // @ts-expect-error deviceMemory is experimental
  const memory = navigator.deviceMemory || 4;
  return cores < 4 || memory < 4;
}

/**
 * Initializes Lenis smooth scrolling for desktop only, connected with GSAP ScrollTrigger
 */
export function initSmoothScroll(): { destroy: () => void } {
  // Mobile uses native scrolling to eliminate any touch input latency or fighting
  if (!isDesktopDevice() || prefersReducedMotion()) {
    return { destroy: () => {} };
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return {
    destroy: () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    },
  };
}

export { gsap, ScrollTrigger };

