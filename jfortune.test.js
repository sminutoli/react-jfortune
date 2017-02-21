import { describe, it } from 'mocha';
import expect from 'expect';

import { Component } from 'react';
import JFortune from './jfortune';

describe('Roulette', () => {
  it('should be a react component', () => {
    const actual = Component.isPrototypeOf(JFortune);
    const expected = true;
    expect(actual).toBe(expected);
  });

  describe('Roulette spining', () => {
    describe('with no fixed-price', () => {
      it('should be spin to a random price', () => {
        const actual = false;
        const expected = true;
        expect(actual).toBe(expected);
      });
    });
    describe('with fixed-price', () => {
      it('should be spin to a fixed price', () => {
        const actual = false;
        const expected = true;
        expect(actual).toBe(expected);
      });
    });

  });
});
