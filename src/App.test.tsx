import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('<App />', () => {
  it('renders every section', () => {
    render(<App />);
    for (const id of ['home', 'experience', 'projects', 'skills', 'education', 'contact']) {
      expect(document.getElementById(id), id).not.toBeNull();
    }
  });

  it('opens the experience mega-menu and the matching detail dialog', async () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    await userEvent.click(within(nav).getByRole('button', { name: /^Experience/ }));
    const panel = await screen.findByRole('region', { name: 'Experience menu' });
    await userEvent.click(within(panel).getByRole('button', { name: /Acelys Services Numériques/ }));
    expect(await screen.findByRole('dialog', { name: 'Tech Analyst & Developer' })).toBeInTheDocument();
  });

  it('opens the command palette with Ctrl+K', async () => {
    render(<App />);
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(await screen.findByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
  });
});
