export const PHI = (1 + Math.sqrt(5)) / 2;

export function fibonacci(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [1];

  const sequence = [1, 1];

  for (let i = 2; i < count; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }

  return sequence;
}

export function fibonacciRatio(sequence: number[]): number {
  if (sequence.length < 2) return 1;

  const current = sequence[sequence.length - 1];
  const previous = sequence[sequence.length - 2];

  return current / previous;
}

export function phiDelta(ratio: number): number {
  return Math.abs(PHI - ratio);
}