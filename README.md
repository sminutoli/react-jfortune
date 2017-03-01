# react-jfortune
Based on the popular [jfortune jQuery plugin](https://github.com/agustinrodriguez/jfortune)

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
        spinnerText={<p onClick={this.spinWheel}><small>presione</small>ok</p>}
      />
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
