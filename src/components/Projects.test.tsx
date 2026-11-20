import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { projects } from '../data/profile';
import type { Domain } from '../types';
import { Projects } from './Projects';

function Harness() {
  const [filter, setFilter] = useState<Domain | 'All'>('All');
  return <Projects filter={filter} onFilter={setFilter} />;
}

const cardTitles = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

describe('<Projects />', () => {
  it('shows every project by default', () => {
    render(<Harness />);
    expect(cardTitles()).toHaveLength(projects.length);
  });

  it('filters by field, keeping the grid in order', async () => {
    render(<Harness />);
    const dataButton = screen.getByRole('button', { name: /^Data, AI & maths\b/ });
    await userEvent.click(dataButton);
    const expected = projects.filter((p) => p.domain === 'data').map((p) => p.title);
    await waitFor(() => expect(cardTitles()).toEqual(expected));
    expect(dataButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('links every card to its case-study page', () => {
    render(<Harness />);
    const card = screen.getByRole('link', { name: /VogMerveille/ });
    expect(card).toHaveAttribute('href', '#/projects/cwad');
  });
});
