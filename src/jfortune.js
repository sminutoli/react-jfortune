import React, { Component, PropTypes } from 'react';
import Bezier from 'bezier';

import randomBetween from './randomBetween';
import { matrix3dRotateZ, createTransformFromMatrix3d } from './matrixCalcs';

/* global requestAnimationFrame */
/* global cancelAnimationFrame */

const mustBeDefined = (prop) => {
  throw Error(`${prop} must be defined!`);
};

const JFortuneDirection = Object.freeze({
  __proto__: null,
  CLOCKWISE: 1,
  COUNTER_CLOCKWISE: -1
});

/* private or no exposed methods */
const privates = {
  directionMultiplier() {
    return this.direction === JFortuneDirection.COUNTER_CLOCKWISE ? -1 : 1;
  },
  needsBounce() {
    const { gap, options: opts } = this.state;
    const gapCalc = gap * 0.5;
    const mod = Math.abs((gapCalc + this.angle) % gap);
    const diff = Math.abs(this.angle - this.prev_angle);
    const low = opts.separatorThickness * 0.5;
    const high = gap - low;

    if (diff >= gapCalc) {
      return 1;
    } else if (mod < low || mod > high) {
      return 2;
    }
    return 0;
  },
  rotate(fixedAngle, fixedDirection) {
    this.direction = fixedDirection;
    this.angle = fixedAngle;

    this.doRotate(fixedAngle);

    const itNeedsBounce = privates.needsBounce.call(this);
    if (itNeedsBounce) {
      if (itNeedsBounce === 1 || !this.state.isBouncing) {
        this.state.options.onSpinBounce(this);
      }
      this.doSpinnerBounce(privates.directionMultiplier.call(this));
    } else {
      this.stopSpinnerBounce();
    }

    this.prev_angle = this.angle;
  },
  forceEnd() {
    const { options: opts } = this.state;
    if (this.spin_frame) {
      cancelAnimationFrame(this.spin_frame);
    }

    privates.rotate.call(this, this.stop, this.direction);
    this.stopSpinnerBounce();

    if (this.deferred) {
      this.fulfilled(Array.isArray(opts.prices) ? opts.prices[this.price] : this.price);
    }
  }
};

class JFortune extends Component {

  constructor(props) {
    super(props);
    const options = Object.assign({}, JFortune.defaultOptions, props.options);
    const { prices = mustBeDefined('options.prices') } = options;
    const total = Array.isArray(prices) ? prices.length : prices;
    const gap = 360 / total;
    const fps2ms = 1000 / options.fps;
    this.direction = options.direction;
    this.spin = this.spin.bind(this);
    this.doSpin = this.doSpin.bind(this);
    this.state = {
      options,
      total,
      fps2ms,
      gap
    };
  }

  spin(fixedPrice, fixedDirection = this.state.options.direction, fixedStop) {
    const { options: opts, total, gap } = this.state;

    this.deferred = new Promise((fulfilled, rejected) => {
      this.fulfilled = fulfilled;
      this.rejected = rejected;
    });

    if (!fixedStop) {
      this.price = typeof fixedPrice === 'number' ? fixedPrice : Math.floor(Math.random() * total);
      const rand = randomBetween(opts.separation, gap - opts.separation);
      const priceCalc = this.direction === 'counterclockwise' ? total - this.price : this.price;
      const gapCalc = gap * (priceCalc - 0.5);
      const position = gapCalc + rand; // gap * price - gap / 2 + rand
      const spins = randomBetween(opts.minSpins, opts.maxSpins);
      const spinsCalc = 360 * spins;
      this.stop = privates.directionMultiplier.call(this, fixedDirection) * (spinsCalc + position);
    } else {
      this.price = fixedPrice;
      this.stop = privates.directionMultiplier.call(this, fixedDirection) * fixedStop;
    }
    this.prev_angle = this.start_time = 0;
    this.spin_frame = requestAnimationFrame(this.doSpin);

    return this.deferred;
  }

  doSpin(timestamp) {
    this.start_time = this.start_time || timestamp;
    this.last_frame_time = this.last_frame_time || timestamp;
    const delta = timestamp - this.start_time;
    const deltaFromLastFrame = timestamp - this.last_frame_time;
    const { options: { bezier }, options: opts, fps2ms } = this.state;
    if (deltaFromLastFrame < fps2ms) {
      this.spin_frame = requestAnimationFrame(this.doSpin);
      return;
    }
    this.last_frame_time = timestamp;
    if (delta < opts.duration) {
      const x = delta / opts.duration;
      const y = Bezier.cubicBezier(bezier.p1x, bezier.p1y, bezier.p2x, bezier.p2y, x);
      this.angle = y * this.stop;
      privates.rotate.call(this, this.angle, this.direction);
    } else {
      privates.forceEnd.call(this);
    }

    if (Math.abs(this.angle) < Math.abs(this.stop)) {
      this.spin_frame = requestAnimationFrame(this.doSpin);
    } else {
      this.fulfilled(Array.isArray(opts.prices) ? opts.prices[this.price] : this.price);
    }
  }

  doRotate(angle) {
    const wheelMatrix = matrix3dRotateZ((angle * Math.PI) / 180);
    this.setState({ wheelMatrix });
  }

  doSpinnerBounce(directionMultiplier) {
    const spinnerMatrix = matrix3dRotateZ((5 * directionMultiplier * Math.PI) / 180);
    this.setState({ spinnerMatrix, isBouncing: true });
  }

  stopSpinnerBounce() {
    const spinnerMatrix = matrix3dRotateZ(0);
    this.setState({ spinnerMatrix, isBouncing: false });
  }

  render() {
    const { children } = this.props;
    const {
      spinnerMatrix,
      wheelMatrix,
      options: {
        wheelClassname,
        spinnerClassname
      }
    } = this.state;
    return (
      <div>
        <div
          className={wheelClassname}
          style={createTransformFromMatrix3d(wheelMatrix)}
        />
        <div
          className={spinnerClassname}
          style={createTransformFromMatrix3d(spinnerMatrix)}
        >
          {children || null}
        </div>
      </div>
    );
  }
}

JFortune.propTypes = {
  options: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ])
};

JFortune.defaultOptions = {
  duration: 1000,
  separation: 5,
  fps: 20,
  minSpins: 10,
  maxSpins: 15,
  direction: JFortuneDirection.CLOCKWISE,
  wheelClassname: 'wheel',
  spinnerClassname: 'spinner',
  bezier: {
    p1x: 0.17,
    p1y: 0.67,
    p2x: 0.12,
    p2y: 0.99
  },
  separatorThickness: 7,
  onSpinBounce: Function.prototype
};

export {
  JFortune as default,
  JFortuneDirection
};
