import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { buildItems, CommandPalette, filterItems } from './CommandPalette';

const makeActions = () => ({ onOpenExperience: vi.fn(), onFocusProject: vi.fn(), onContact: vi.fn() });

describe('filterItems', () => {
  const items = buildItems(makeActions());

  it('returns everything for an empty query', () => {
    expect(filterItems(items, '  ')).toHaveLength(items.length);
  });

  it('matches every term, case-insensitively', () => {
    const labels = filterItems(items, 'ACELYS analyst').map((i) => i.label);
    expect(labels).toEqual(['Acelys Services Numériques']);
  });
});

describe('<CommandPalette />', () => {
  it('runs the highlighted item on Enter', async () => {
    const actions = makeActions();
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} {...actions} />);
    await userEvent.type(screen.getByRole('combobox'), 'solstice');
    await userEvent.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalled();
    await waitFor(() => expect(actions.onOpenExperience).toHaveBeenCalledWith('solstice'));
  });

  it('shows an empty state', async () => {
    render(<CommandPalette open onClose={vi.fn()} {...makeActions()} />);
    await userEvent.type(screen.getByRole('combobox'), 'zzzz');
    expect(screen.getByText(/No results/)).toBeInTheDocument();
  });
});
