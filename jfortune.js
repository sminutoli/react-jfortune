import React, { Component, PropTypes } from 'react';
import Bezier from 'bezier';

import randomBetween from './randomBetween';

/* global requestAnimationFrame */
/* global cancelAnimationFrame */

const mustBeDefined = (prop) => {
  throw Error(`${prop} must be defined!`);
};

function matrix3dRotateZ(angle) {
  const matrix = [
    [Math.cos(angle), Math.sin(angle), 0, 0],
    [Math.sin(-angle), Math.cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  const createMatrix = (acc, val, i) => acc + (i > 0 ? ',' : '') + val.join(',');
  return matrix.reduce(createMatrix, '');
}

function createTransformFromMatrix3d(matrix3d) {
  const matrix3dRule = `matrix3d(${matrix3d})`;
  return {
    transform: matrix3dRule,
    WebkitTransform: matrix3dRule
  };
}

const JFortuneDirection = Object.freeze({
  __proto__: null,
  CLOCKWISE: 1,
  COUNTER_CLOCKWISE: -1
});

class JFortune extends Component {

  constructor(props) {
    super(props);
    const options = Object.assign({}, JFortune.defaultOptions, props.options);
    const { prices = mustBeDefined('options.prices') } = options;
    const total = Array.isArray(prices) ? prices.length : prices;
    const gap = 360 / total;
    this.direction = options.direction;
    this.spin = this.spin.bind(this);
    this.doSpin = this.doSpin.bind(this);
    this.state = {
      options,
      total,
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
      this.stop = this.directionMultiplier(fixedDirection) * (spinsCalc + position);
    } else {
      this.price = fixedPrice;
      this.stop = this.directionMultiplier(fixedDirection) * fixedStop;
    }
    this.prev_angle = this.start_time = 0;

    this.spin_frame = requestAnimationFrame(this.doSpin);

    return this.deferred;
  }

  directionMultiplier() {
    return this.direction === JFortuneDirection.COUNTER_CLOCKWISE ? -1 : 1;
  }

  doSpin(timestamp) {
    this.start_time = this.start_time || timestamp;
    const delta = timestamp - this.start_time;
    const { options: { bezier }, options: opts } = this.state;
    if (delta < opts.duration) {
      const x = delta / opts.duration;
      const y = Bezier.cubicBezier(bezier.p1x, bezier.p1y, bezier.p2x, bezier.p2y, x);
      this.angle = y * this.stop;
      this.rotate(this.angle, this.direction);
    } else {
      this.forceEnd();
    }

    if (Math.abs(this.angle) < Math.abs(this.stop)) {
      this.spin_frame = requestAnimationFrame(this.doSpin);
    } else {
      this.fulfilled(Array.isArray(opts.prices) ? opts.prices[this.price] : this.price);
    }
  }

  rotate(fixedAngle, fixedDirection) {
    this.direction = fixedDirection;
    const directionMultiplier = this.directionMultiplier();
    this.angle = fixedAngle;

    this.doRotate(fixedAngle);

    const needsBounce = this.needsBounce();
    if (needsBounce) {
      if (needsBounce === 1 || !this.state.isBouncing) {
        this.state.options.onSpinBounce(this);
      }
      this.doSpinnerBounce(directionMultiplier);
    } else {
      this.stopSpinnerBounce();
    }

    this.prev_angle = this.angle;
  }

  forceEnd() {
    const { options: opts } = this.state;
    if (this.spinFrame) {
      cancelAnimationFrame(this.spinFrame);
    }

    this.rotate(this.stop, this.direction);
    this.stopSpinnerBounce();

    if (this.deferred) {
      this.fulfilled(Array.isArray(opts.prices) ? opts.prices[this.price] : this.price);
    }
  }

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
    const { spinnerText } = this.props;
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
          {spinnerText}
        </div>
      </div>
    );
  }
}

JFortune.propTypes = {
  options: PropTypes.object.isRequired,
  spinnerText: PropTypes.string.isRequired
};
JFortune.defaultOptions = {
  duration: 1000,
  separation: 5,
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
  matrix3dRotateZ,
  createTransformFromMatrix3d,
  JFortuneDirection
};
