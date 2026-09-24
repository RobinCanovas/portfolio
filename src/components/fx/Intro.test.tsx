import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { projects } from '../../data/profile';
import { hasProjectArt, ProjectArt } from '../ProjectArt';
import { Intro, shouldPlayIntro } from './Intro';

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

  it('greets the visitor and can be skipped', async () => {
    const onReveal = vi.fn();
    render(<Intro onReveal={onReveal} />);
    expect(screen.getByTestId('intro')).toHaveTextContent('Bonjour');
    expect(document.documentElement.style.overflow).toBe('hidden');
    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(onReveal).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull());
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('ends on Escape', async () => {
    const onReveal = vi.fn();
    render(<Intro onReveal={onReveal} />);
    await userEvent.keyboard('{Escape}');
    expect(onReveal).toHaveBeenCalledTimes(1);
  });
});

describe('<ProjectArt />', () => {
  it('has a dedicated illustration for every project', () => {
    for (const p of projects) expect(hasProjectArt(p.id), p.id).toBe(true);
  });

  it('renders a decorative SVG', () => {
    const { container } = render(<ProjectArt id="subnet-calculator" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
