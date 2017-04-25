import { beforeEach, describe, it } from 'mocha';
import expect from 'expect';

import React, { Component } from 'react';
import { shallow } from 'enzyme';

import JFortune, { JFortuneDirection } from './jfortune';

describe('JFortuneDirection', () => {
  it('should expose CLOCKWISE', () => {
    const actual = JFortuneDirection.CLOCKWISE;
    expect(actual).toExist();
  });
  it('should expose COUNTER_CLOCKWISE', () => {
    const actual = JFortuneDirection.COUNTER_CLOCKWISE;
    expect(actual).toExist();
  });
});

describe('Roulette', () => {
  it('should be a react component', () => {
    const actual = {}.isPrototypeOf.call(Component, JFortune);
    const expected = true;
    expect(actual).toBe(expected);
  });

  it('should throw with no options', () => {
    const tryMount = () => shallow(<JFortune />);
    expect(tryMount).toThrow();
  });

  it('should throw with no options.prices', () => {
    const tryMount = () => shallow(<JFortune options={{}} />);
    expect(tryMount).toThrow(/options.prices must be defined/);
  });

  it('should merge options with defaults', () => {
    const props = {
      options: {
        prices: 2,
        duration: 1200
      }
    };
    const wrapper = shallow(<JFortune {...props} />);
    const actual = wrapper.state().options;
    const expected = Object.assign({}, JFortune.defaultOptions, props.options);
    expect(actual).toEqual(expected);
  });
  describe('with int prices', () => {
    beforeEach(function setup() {
      this.props = {
        options: {
          prices: 2
        }
      };
      this.wrapper = shallow(<JFortune {...this.props} />);
    });
    it('should store total straight forward', function test() {
      const actual = this.wrapper.state().total;
      const expected = 2;
      expect(actual).toEqual(expected);
    });
    it('should store the right gap', function testGap() {
      const actual = this.wrapper.state().gap;
      const expected = 180;
      expect(actual).toEqual(expected);
    });
  });
  describe('with Array prices', () => {
    beforeEach(function setup() {
      this.props = {
        options: {
          prices: [{}, {}, {}]
        }
      };
      this.wrapper = shallow(<JFortune {...this.props} />);
    });
    it('should store total as prices length', function test() {
      const actual = this.wrapper.state().total;
      const expected = 3;
      expect(actual).toEqual(expected);
    });
    it('should store the right gap', function testGap() {
      const actual = this.wrapper.state().gap;
      const expected = 120;
      expect(actual).toEqual(expected);
    });
  });
  describe('spin', () => {
    beforeEach(function setup() {
      this.props = {
        options: {
          duration: 1000,
          prices: [
            { value: Math.random() },
            { value: Math.random() },
            { value: Math.random() }
          ],
          onSpinBounce: expect.createSpy()
        }
      };
      this.wrapper = shallow(<JFortune {...this.props} />);
    });
    it('should return a promise', function test() {
      const actual = this.wrapper.instance().spin();
      expect(actual).toBeA(Promise);
    });
    it('should resolve the promise with a random item', function test() {
      const actual = this.wrapper.instance().spin();
      const expected = (price) => {
        expect(this.props.options.prices).toContain(price);
      };
      return actual.then(expected);
    });
    it('should resolve the promise with the selected price', function test() {
      const actual = this.wrapper.instance().spin(1);
      const expected = (price) => {
        expect(price).toBe(this.props.options.prices[1]);
      };
      return actual.then(expected);
    });
    it('should call onSpinBounce', function test() {
      const actual = this.wrapper.instance().spin();
      const expected = () => {
        expect(this.props.options.onSpinBounce).toHaveBeenCalled();
      };
      return actual.then(expected);
    });
  });
});
