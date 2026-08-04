import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'framer-motion';
import { afterEach, beforeEach, vi } from 'vitest';

// Run animations instantly so exit transitions don't keep elements in the DOM.
MotionGlobalConfig.skipAnimations = true;

afterEach(() => cleanup());

// The opening intro plays once per visit: tests start as a returning visitor (the intro has its own test).
beforeEach(() => window.sessionStorage.setItem('portfolio-intro', '1'));

// jsdom does not implement these browser APIs used by the UI.
class IntersectionObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
  root = null;
  rootMargin = '';
  thresholds = [];
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);

vi.stubGlobal(
  'matchMedia',
  (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: () => false,
    }) as MediaQueryList,
);

Element.prototype.scrollTo = vi.fn();
// Canvas effects bail out when no 2D context is available.
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
Element.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn() as typeof window.scrollTo;
