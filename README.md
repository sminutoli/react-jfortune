# react-jfortune
Based on the popular [jfortune jQuery plugin](https://github.com/agustinrodriguez/jfortune)

## exports
The module exports:

`JFortune (default) - a React.Component`

`JFortuneDirection - an Enum`

### JFortune

Props
```javascript
{
  options: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ])
}
```

Methods
```javascript
// [int] => Promise
jfortune.spin();
```

Options default:
```javascript
{
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
  onSpinBounce: Function.prototype //noop
}
```

Render output:
```html
<div>
  <div className={wheelClassname} />
  <div className={spinnerClassname}>
    {children || null}
  </div>
</div>
```

## example

```javascript
// SomeComponent.js
import JFortune, { JFortuneDirection } from './jfortune';

class SomeComponent extends React.Component {
  constructor(){
    super();
    this.registerByName = this.registerByName.bind(this);
    this.spinWheel = this.spinWheel.bind(this);
    this.showPrice = this.showPrice.bind(this);
    this.ui = {};
  }
  spinWheel(){
    this.ui.jfortune.spin().then(this.showPrice);
  }
  registerByName(ref){
    this.ui[ref.name] = ref;
  }
  showPrice(price){
    console.log('do something with', price);
  }
  render(){
    let opts = {
      prices: [{}, {}, {}],
      duration: 4000,
      direction: JFortuneDirection.COUNTER_CLOCKWISE
    };
    return (
      <JFortune
        className="jfortune"
        name="jfortune"
        ref={this.registerByName}
        options={opts}
      >
        <p onClick={this.spinWheel}><small>presione</small>ok</p>
      </JFortune>
    );
  }
}
```

```css
/* someStyle.css */
.jfortune {
  position: absolute;
  left: 20%;
}

.jfortune .wheel {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  width: 800px;
  height: 800px;
  background-image: url('assets/wheel.svg');
}

.jfortune .spinner {
  cursor: pointer;
  font-weight: bold;
  border: none;
  position: absolute;
  top: 270px;
  left: 270px;
  width: 250px;
  height: 250px;
  z-index: 1;
  background-image: url('assets/wheel-spin.svg');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
```
