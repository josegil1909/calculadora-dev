import { describe, it, expect } from 'vitest';
import { defaultMultipliers } from '../src/lib/calc.js';

describe('defaultMultipliers integrity', () => {
  it('experience is a function and returns numeric multiplier', () => {
    expect(typeof defaultMultipliers.experience).toBe('function');
    const sample = defaultMultipliers.experience(5);
    expect(typeof sample).toBe('number');
    expect(sample).toBeGreaterThan(0);
  });
});
