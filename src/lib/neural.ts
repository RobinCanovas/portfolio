/**
 * A small fully connected network with sigmoid activations, trained by batch gradient descent on the
 * log loss: the same maths as the Machine Learnia "Formation Deep Learning" notebooks
 * (artificial neuron, 2-layer network, deep network), written for the browser.
 *
 * Layer c computes Z = W·A(c−1) + b and A = σ(Z). Back-propagation starts from dZ = A − y at the output
 * and goes back with dZ(c−1) = W(c)ᵀ·dZ(c) ⊙ A(c−1)(1 − A(c−1)); each layer gets dW = (1/m)·dZ·A(c−1)ᵀ
 * and db = (1/m)·Σ dZ.
 */

export type Point = [number, number];
export interface Dataset {
  X: Point[];
  y: number[];
}
export interface Layer {
  W: number[][];
  b: number[];
}
export type Network = Layer[];

/** Small deterministic generator (mulberry32), so the demo always starts from the same data. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Standard normal sample (Box–Muller). */
const gauss = (rand: () => number) => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());

/** Two concentric circles, like sklearn's make_circles(noise=0.1, factor=0.3): not linearly separable. */
export function makeCircles(m: number, rand: () => number): Dataset {
  const X: Point[] = [];
  const y: number[] = [];
  for (let i = 0; i < m; i++) {
    const inner = i % 2;
    const a = rand() * Math.PI * 2;
    const r = inner ? 0.3 : 1;
    X.push([r * Math.cos(a) + gauss(rand) * 0.1, r * Math.sin(a) + gauss(rand) * 0.1]);
    y.push(inner);
  }
  return { X, y };
}

/** Two gaussian clouds, like make_blobs(centers=2): a straight line separates them. */
export function makeBlobs(m: number, rand: () => number): Dataset {
  const X: Point[] = [];
  const y: number[] = [];
  for (let i = 0; i < m; i++) {
    const c = i % 2;
    X.push([(c ? 0.55 : -0.55) + gauss(rand) * 0.3, (c ? -0.35 : 0.35) + gauss(rand) * 0.3]);
    y.push(c);
  }
  return { X, y };
}

export const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

/** Weights from N(0, 1), biases at zero, for layer sizes like [2, 8, 1]. */
export function createNetwork(dims: number[], rand: () => number): Network {
  const net: Network = [];
  for (let c = 1; c < dims.length; c++) {
    net.push({
      W: Array.from({ length: dims[c] }, () => Array.from({ length: dims[c - 1] }, () => gauss(rand))),
      b: new Array<number>(dims[c]).fill(0),
    });
  }
  return net;
}

/** Forward propagation for one example: the activations of every layer, input first. */
export function forward(net: Network, x: number[]): number[][] {
  const acts = [x];
  for (const { W, b } of net) {
    const prev = acts[acts.length - 1];
    acts.push(W.map((row, j) => sigmoid(row.reduce((s, w, k) => s + w * prev[k], b[j]))));
  }
  return acts;
}

/** Probability of class 1 for a point. */
export const predict = (net: Network, x: number[]) => forward(net, x)[net.length][0];

/** One step of batch gradient descent. Returns the log loss and accuracy measured before the update. */
export function trainStep(net: Network, data: Dataset, lr: number): { loss: number; accuracy: number } {
  const m = data.X.length;
  const gW = net.map((L) => L.W.map((row) => row.map(() => 0)));
  const gb = net.map((L) => L.b.map(() => 0));
  let loss = 0;
  let correct = 0;
  for (let i = 0; i < m; i++) {
    const acts = forward(net, data.X[i]);
    const a = acts[net.length][0];
    const y = data.y[i];
    loss += -(y * Math.log(a + 1e-15) + (1 - y) * Math.log(1 - a + 1e-15));
    if ((a >= 0.5 ? 1 : 0) === y) correct++;
    // Back-propagation, from the output layer to the first one.
    let dZ = [a - y];
    for (let c = net.length - 1; c >= 0; c--) {
      const prev = acts[c];
      for (let j = 0; j < dZ.length; j++) {
        gb[c][j] += dZ[j];
        for (let k = 0; k < prev.length; k++) gW[c][j][k] += dZ[j] * prev[k];
      }
      if (c > 0) {
        const W = net[c].W;
        dZ = prev.map((ak, k) => W.reduce((s, row, j) => s + row[k] * dZ[j], 0) * ak * (1 - ak));
      }
    }
  }
  // Update: θ ← θ − α·(1/m)·gradient.
  net.forEach((L, c) => {
    L.W.forEach((row, j) => row.forEach((_, k) => (row[k] -= (lr * gW[c][j][k]) / m)));
    L.b.forEach((_, j) => (L.b[j] -= (lr * gb[c][j]) / m));
  });
  return { loss: loss / m, accuracy: correct / m };
}
