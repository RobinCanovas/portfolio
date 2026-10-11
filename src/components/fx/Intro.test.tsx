import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DRIFT_MS, GATHER_MS, Intro, shouldPlayIntro } from './Intro';

function TitleAndIntro({ onReveal }: { onReveal: () => void }) {
  return (
    <>
      <h1>
        <span data-hero-name style={{ fontSize: '72px' }}>
          Robin Canovas
        </span>
      </h1>
      <Intro onReveal={onReveal} />
    </>
  );
}

describe('<Intro />', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.location.hash = '';
  });

  it('plays once per visit, and only on the home page', () => {
    expect(shouldPlayIntro()).toBe(true);
    window.location.hash = '#/projects/cwad';
    expect(shouldPlayIntro()).toBe(false);
    window.location.hash = '';
    render(<Intro onReveal={() => undefined} />);
    expect(window.sessionStorage.getItem('portfolio-intro')).toBe('1');
    expect(shouldPlayIntro()).toBe(false);
  });

  it('opens the page straight away when there is nothing to draw', async () => {
    const onReveal = vi.fn();
    render(<Intro onReveal={onReveal} />);
    expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('hidden');
    await waitFor(() => expect(onReveal).toHaveBeenCalledTimes(1), { timeout: 1500 });
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 2000 });
    expect(document.documentElement.style.overflow).toBe('');
  });

  describe('drawing the name', () => {
    // jsdom has neither a canvas nor a layout: a stub 2D context and glyph boxes stand in for them.
    const getContext = HTMLCanvasElement.prototype.getContext;
    beforeEach(() => {
      const ctx = new Proxy({} as Record<string | symbol, unknown>, {
        get: (target, key) => {
          if (key in target) return target[key];
          if (key === 'measureText') return () => ({ fontBoundingBoxAscent: 58, fontBoundingBoxDescent: 14 });
          // Sparse ink: a few hundred points are plenty for a test.
          if (key === 'getImageData') return (_x: number, _y: number, w: number, h: number) => ({ data: Uint8ClampedArray.from({ length: w * h * 4 }, (_, i) => (i % 4 === 3 && i % 92 === 3 ? 255 : 0)) });
          if (key === 'createLinearGradient') return () => ({ addColorStop: () => undefined });
          return () => undefined;
        },
      });
      HTMLCanvasElement.prototype.getContext = vi.fn(() => ctx) as unknown as typeof getContext;
      Range.prototype.getBoundingClientRect = function (this: Range) {
        const left = 100 + this.startOffset * 30;
        return { left, right: left + 28, top: 200, bottom: 272, width: 28, height: 72, x: left, y: 200, toJSON: () => ({}) } as DOMRect;
      };
    });
    afterEach(() => {
      HTMLCanvasElement.prototype.getContext = getContext;
      delete (Range.prototype as Partial<Range>).getBoundingClientRect;
    });

    it('hides the real title until the points hand it over, then gets out of the way', async () => {
      const onReveal = vi.fn();
      render(<TitleAndIntro onReveal={onReveal} />);
      const title = document.querySelector<HTMLElement>('[data-hero-name]')!;
      expect(title.style.opacity).toBe('0');
      // The points take their time: no handover during the gathering.
      await new Promise((r) => setTimeout(r, DRIFT_MS + GATHER_MS / 2));
      expect(onReveal).not.toHaveBeenCalled();
      await waitFor(() => expect(onReveal).toHaveBeenCalledTimes(1), { timeout: 3000 });
      expect(title.style.opacity).toBe('');
      await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 3000 });
    });

    it('fast-forwards on Escape', async () => {
      const onReveal = vi.fn();
      render(<TitleAndIntro onReveal={onReveal} />);
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(onReveal).toHaveBeenCalledTimes(1), { timeout: DRIFT_MS + GATHER_MS / 2 });
    });

    it('fast-forwards from the Skip button', async () => {
      const onReveal = vi.fn();
      render(<TitleAndIntro onReveal={onReveal} />);
      await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
      await waitFor(() => expect(onReveal).toHaveBeenCalledTimes(1), { timeout: DRIFT_MS + GATHER_MS / 2 });
    });
  });
});
