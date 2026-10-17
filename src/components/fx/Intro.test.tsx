import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BUILD_MS, Intro, shouldPlayIntro } from './Intro';

function TitleAndIntro({ onReveal }: { onReveal: () => void }) {
  return (
    <>
      <h1>
        <span data-hero-name style={{ fontSize: '96px' }}>
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

  it('plays whenever the site opens on the home page, never on a detail page', () => {
    expect(shouldPlayIntro()).toBe(true);
    window.location.hash = '#/projects/cwad';
    expect(shouldPlayIntro()).toBe(false);
    window.location.hash = '#home';
    expect(shouldPlayIntro()).toBe(true);
  });

  it('opens the page straight away when there is nothing to draw', async () => {
    const onReveal = vi.fn();
    render(<Intro onReveal={onReveal} />);
    expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('hidden');
    await waitFor(() => expect(onReveal).toHaveBeenCalledTimes(1), { timeout: 1000 });
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 1500 });
    expect(document.documentElement.style.overflow).toBe('');
  });

  describe('the figure', () => {
    // jsdom has no layout: the home title gets a box of its own.
    const rect = Element.prototype.getBoundingClientRect;
    beforeEach(() => {
      Element.prototype.getBoundingClientRect = function (this: Element) {
        const box = this.hasAttribute('data-hero-name') ? { left: 80, top: 260, width: 620, height: 88 } : { left: 600, top: 380, width: 270, height: 38 };
        return { ...box, right: box.left + box.width, bottom: box.top + box.height, x: box.left, y: box.top, toJSON: () => ({}) } as DOMRect;
      };
    });
    afterEach(() => {
      Element.prototype.getBoundingClientRect = rect;
    });

    it('draws a network whose inputs are the facets and whose output writes the name', async () => {
      const onReveal = vi.fn();
      render(<TitleAndIntro onReveal={onReveal} />);
      const title = document.querySelector<HTMLElement>('[data-hero-name]')!;
      expect(title.style.opacity).toBe('0');
      for (const facet of ['Mathematics', 'Code', 'Scouting', 'Volleyball', 'Piano']) expect(screen.getByText(facet)).toBeInTheDocument();
      // The figure takes its time: no handover while it draws.
      await new Promise((r) => setTimeout(r, BUILD_MS / 2));
      expect(onReveal).not.toHaveBeenCalled();
      await waitFor(() => expect(onReveal).toHaveBeenCalledTimes(1), { timeout: BUILD_MS });
      await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 2000 });
      expect(title.style.opacity).toBe('');
    });

    it('fast-forwards on Escape', async () => {
      const onReveal = vi.fn();
      render(<TitleAndIntro onReveal={onReveal} />);
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(onReveal).toHaveBeenCalledTimes(1), { timeout: 500 });
    });

    it('fast-forwards from the Skip button', async () => {
      const onReveal = vi.fn();
      render(<TitleAndIntro onReveal={onReveal} />);
      await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
      await waitFor(() => expect(onReveal).toHaveBeenCalledTimes(1), { timeout: 500 });
    });
  });
});
