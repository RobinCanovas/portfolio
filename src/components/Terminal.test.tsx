import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Terminal } from './Terminal';

const run = async (cmd: string) => {
  await userEvent.type(screen.getByLabelText('Terminal command'), `${cmd}{Enter}`);
};

describe('<Terminal />', () => {
  it('boots with whoami output', () => {
    render(<Terminal />);
    expect(screen.getByText(/Robin Canovas — Software Engineer/)).toBeInTheDocument();
  });

  it('runs a known command', async () => {
    render(<Terminal />);
    await run('stack');
    expect(screen.getByText(/PHP · Symfony · API Platform/)).toBeInTheDocument();
  });

  it('reports unknown commands, including prototype keys', async () => {
    render(<Terminal />);
    await run('constructor');
    expect(screen.getByText(/command not found: constructor/)).toBeInTheDocument();
  });

  it('clears the screen', async () => {
    render(<Terminal />);
    await run('clear');
    expect(screen.queryByText(/Robin Canovas — Software Engineer/)).not.toBeInTheDocument();
  });

  it('recalls history with the up arrow', async () => {
    render(<Terminal />);
    await run('now');
    const input = screen.getByLabelText<HTMLInputElement>('Terminal command');
    await userEvent.type(input, '{ArrowUp}');
    expect(input.value).toBe('now');
  });
});
