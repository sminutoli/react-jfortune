/*
http://stackoverflow.com/questions/32920213/mocha-jsdom-react-typeerror-cannot-read-property-addeventlistener-of-unde

Es sólo para testing CLI
*/
const jsdom = require('jsdom');

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = { userAgent: 'node.js' };
global.self = global;

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

(function raf(_context) {
  const window = _context;
  let lastTime = 0;
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function cb(callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = id => clearTimeout(id);
  }
}(global));
