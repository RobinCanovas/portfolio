import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

const goTo = (hash: string) =>
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

afterEach(() => {
  window.location.hash = '';
  window.localStorage.clear();
  document.documentElement.lang = 'en';
});

describe('language switch', () => {
  it('defaults to English and switches the whole site to French', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: 'Where I’m heading' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Passer le site en français' }));
    expect(await screen.findByRole('heading', { level: 2, name: 'Où je vais' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Expériences' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('fr');
    expect(window.localStorage.getItem('portfolio-lang')).toBe('fr');
  });

  it('never links to GitHub', () => {
    render(<App />);
    expect(document.querySelector('a[href*="github.com"]')).toBeNull();
  });
});

describe('<App />', () => {
  it('renders every home section', () => {
    render(<App />);
    for (const id of ['home', 'experience', 'projects', 'skills', 'lab', 'education', 'goals', 'contact']) {
      expect(document.getElementById(id), id).not.toBeNull();
    }
  });

  it('opens a company page from the experience mega-menu', async () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    await userEvent.click(within(nav).getByRole('button', { name: /^Experience/ }));
    const panel = await screen.findByRole('region', { name: 'Experience menu' });
    await userEvent.click(within(panel).getByRole('button', { name: /Acelys Services Numériques/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Acelys Services Numériques' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Domofinance' })).toBeInTheDocument();
    expect(screen.getByText(/no code, screenshot or internal detail is published/)).toBeInTheDocument();
  });

  it('renders a project page with its build diagram', async () => {
    render(<App />);
    goTo('#/projects/edu-accommodation');
    expect(await screen.findByRole('heading', { level: 1, name: 'Student accommodation files app' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How it’s built' })).toBeInTheDocument();
  });

  it('goes back home from a detail page', async () => {
    render(<App />);
    goTo('#/experience/solstice');
    expect(await screen.findByRole('heading', { level: 1, name: 'Solutions Solstice' })).toBeInTheDocument();
    goTo('#projects');
    expect(document.getElementById('projects')).not.toBeNull();
  });

  it('opens the command palette with Ctrl+K', async () => {
    render(<App />);
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(await screen.findByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
  });
});
