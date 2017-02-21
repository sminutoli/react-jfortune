import { describe, it } from 'mocha';
import expect from 'expect';

import randomBetween from './randomBetween';

describe('RandomBetween', () => {
  it('should return min on a random 0', () => {
    const spyRandom = expect.spyOn(Math, 'random').andReturn(0);
    const actual = randomBetween(5, 20);
    const expected = 5;
    spyRandom.restore();
    expect(actual).toBe(expected);
  });
  it('should return max on a random .99', () => {
    const spyRandom = expect.spyOn(Math, 'random').andReturn(0.99);
    const actual = randomBetween(5, 20);
    const expected = 20;
    spyRandom.restore();
    expect(actual).toBe(expected);
  });
  it('should return a intermediate integer on a random .5', () => {
    const spyRandom = expect.spyOn(Math, 'random').andReturn(0.5);
    const actual = randomBetween(5, 20);
    const expected = 13;
    spyRandom.restore();
    expect(actual).toBe(expected);
  });
});
