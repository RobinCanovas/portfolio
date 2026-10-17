import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { projects } from '../data/profile';
import { hasProjectArt, ProjectArt } from './ProjectArt';

describe('<ProjectArt />', () => {
  afterEach(() => vi.restoreAllMocks());

  it('has a dedicated illustration for every project', () => {
    for (const p of projects) expect(hasProjectArt(p.id), p.id).toBe(true);
  });

  it('renders a decorative SVG', () => {
    const { container } = render(<ProjectArt id="subnet-calculator" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('tells its story on arrival, then again on replay once it is over', async () => {
    const now = vi.spyOn(performance, 'now').mockReturnValue(1000);
    const { container, rerender } = render(<ProjectArt id="debian" autoplay />);
    const art = container.querySelector('[data-art]')!;
    expect(art).not.toHaveAttribute('data-built');
    await waitFor(() => expect(art).toHaveAttribute('data-built'));

    // Hovering while the story is still being told changes nothing.
    rerender(<ProjectArt id="debian" autoplay replay={1} />);
    expect(art).toHaveAttribute('data-built');

    // Later, a hover rewinds it (a quick fade) and tells it again.
    now.mockReturnValue(5000);
    rerender(<ProjectArt id="debian" autoplay replay={2} />);
    expect(art).not.toHaveAttribute('data-built');
    await waitFor(() => expect(art).toHaveAttribute('data-built'));
  });

  it('shows the finished picture at once to visitors who prefer less motion', () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({ ...matchMedia(query), matches: query.includes('reduce') })) as typeof window.matchMedia;
    try {
      const { container } = render(<ProjectArt id="cwad" />);
      expect(container.querySelector('[data-art]')).toHaveAttribute('data-built');
    } finally {
      window.matchMedia = matchMedia;
    }
  });
});
