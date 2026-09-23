import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LogoTile, Modal } from './ui';

describe('<LogoTile />', () => {
  it('tries each source then renders the fallback', () => {
    render(<LogoTile sources={['a.png', 'b.png']} name="Acme" fallback={<span>fallback</span>} />);
    const first = screen.getByAltText('Acme logo');
    expect(first).toHaveAttribute('src', 'a.png');
    fireEvent.error(first);
    const second = screen.getByAltText('Acme logo');
    expect(second).toHaveAttribute('src', 'b.png');
    fireEvent.error(second);
    expect(screen.getByText('fallback')).toBeInTheDocument();
  });
});

describe('<Modal />', () => {
  it('exposes an accessible dialog and closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Hello">
        <button type="button">inside</button>
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Hello' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
