import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { projects } from '../data/profile';
import type { Tech } from '../types';
import { Projects } from './Projects';

function Harness() {
  const [filter, setFilter] = useState<Tech | 'All'>('All');
  return <Projects filter={filter} onFilter={setFilter} />;
}

const cardTitles = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

describe('<Projects />', () => {
  it('shows every project by default', () => {
    render(<Harness />);
    expect(cardTitles()).toHaveLength(projects.length);
  });

  it('filters by technology', async () => {
    render(<Harness />);
    const javaButton = screen.getByRole('button', { name: /^Java\b/ });
    await userEvent.click(javaButton);
    const expected = projects.filter((p) => p.stack.includes('Java')).map((p) => p.title);
    await waitFor(() => expect(cardTitles()).toEqual(expected));
    expect(javaButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('links every card to its case-study page', () => {
    render(<Harness />);
    const card = screen.getByRole('link', { name: /VogMerveille/ });
    expect(card).toHaveAttribute('href', '#/projects/cwad');
  });
});
