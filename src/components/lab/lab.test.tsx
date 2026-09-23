import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DeployPipeline } from './DeployPipeline';
import { gradientStep, mse, type Point } from './GradientDescent';
import { computeSubnet, SubnetCalculator } from './SubnetCalculator';

const ip = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');

describe('computeSubnet', () => {
  it('computes a /26', () => {
    const s = computeSubnet('192.168.10.37/26')!;
    expect(ip(s.network)).toBe('192.168.10.0');
    expect(ip(s.broadcast)).toBe('192.168.10.63');
    expect(ip(s.mask)).toBe('255.255.255.192');
    expect(ip(s.first)).toBe('192.168.10.1');
    expect(ip(s.last)).toBe('192.168.10.62');
    expect(s.hosts).toBe(62);
    expect(s.isPrivate).toBe(true);
  });

  it('handles /32 and public ranges', () => {
    const s = computeSubnet('8.8.8.8/32')!;
    expect(s.hosts).toBe(1);
    expect(s.isPrivate).toBe(false);
  });

  it('rejects invalid input', () => {
    expect(computeSubnet('300.1.1.1/24')).toBeNull();
    expect(computeSubnet('10.0.0.1/33')).toBeNull();
    expect(computeSubnet('hello')).toBeNull();
  });

  it('updates the result as you type', async () => {
    render(<SubnetCalculator />);
    const input = screen.getByDisplayValue('192.168.10.37/26');
    await userEvent.clear(input);
    await userEvent.type(input, '10.0.0.1/8');
    expect(screen.getByText('10.0.0.0/8')).toBeInTheDocument();
  });
});

describe('<DeployPipeline />', () => {
  it('runs the pipeline and rolls back on a failed migration', async () => {
    vi.useFakeTimers();
    render(<DeployPipeline />);
    fireEvent.click(screen.getByRole('button', { name: /Deploy/ }));
    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByText(/deployed in/)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/failed migration/));
    fireEvent.click(screen.getByRole('button', { name: /Deploy/ }));
    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByText(/rollback/)).toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe('gradient descent', () => {
  it('reduces the error until it fits a perfect line', () => {
    const points: Point[] = [0, 0.25, 0.5, 0.75, 1].map((x) => ({ x, y: 0.3 + 0.5 * x }));
    let m = { w: 0, b: 0 };
    const start = mse(points, m);
    for (let i = 0; i < 2000; i++) m = gradientStep(points, m, 0.5);
    expect(mse(points, m)).toBeLessThan(start / 1000);
    expect(m.w).toBeCloseTo(0.5, 2);
    expect(m.b).toBeCloseTo(0.3, 2);
  });
});
