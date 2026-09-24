import { describe, expect, it } from 'vitest';
import { createNetwork, makeBlobs, makeCircles, predict, seeded, sigmoid, trainStep } from './neural';

const train = (dims: number[], data: ReturnType<typeof makeCircles>, iterations: number, lr = 1) => {
  const net = createNetwork(dims, seeded(7));
  let last = { loss: Infinity, accuracy: 0 };
  for (let i = 0; i < iterations; i++) last = trainStep(net, data, lr);
  return { net, ...last };
};

describe('neural network maths', () => {
  it('uses the sigmoid', () => {
    expect(sigmoid(0)).toBe(0.5);
    expect(sigmoid(10)).toBeGreaterThan(0.99);
  });

  it('a single neuron separates two clouds, but not two circles', () => {
    expect(train([2, 1], makeBlobs(160, seeded(7)), 300).accuracy).toBeGreaterThan(0.95);
    // A neuron can only draw a straight line: no better than chance on concentric circles.
    expect(train([2, 1], makeCircles(160, seeded(7)), 300).accuracy).toBeLessThan(0.7);
  });

  it('a 2-layer network learns the circles, and the loss goes down', () => {
    const data = makeCircles(160, seeded(7));
    const first = train([2, 8, 1], data, 1).loss;
    const { net, loss, accuracy } = train([2, 8, 1], data, 800);
    expect(loss).toBeLessThan(first);
    expect(accuracy).toBeGreaterThan(0.95);
    // Centre of the circles is class 1 (inner circle), far away is class 0.
    expect(predict(net, [0, 0])).toBeGreaterThan(0.5);
    expect(predict(net, [1.3, 0])).toBeLessThan(0.5);
  });
});
