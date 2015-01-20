powerOfThree
============

Cubic 2048 clone based on power of three

#### Install and compile and use the project

```shell
#first download
npm install
#compile from source
gulp
#start local server on port 1337
gulp connect
```

### Actual Controls : moving the main cube

Use the arrow keys to perfom rotation on x and y axis.

### Actual Controls : moving the dice with a mouse

| Axis          | Mouse Wheel or Mouse Move| Description  |
| ------------- |:-------------:| -----:|
| X | mouse move left  | move the dices on the  left|
| X | mouse move right | move the dice on the  right|
| Y | mouse move up | move the dices up|
| Y | mouse move down | move the dices down|
| Z | mouse wheel down | move the dices on the front|
| Z | mouse wheel up| move the dices on the back|

### Actual Controls : moving the dice with touch events

| Axis          | Draw a line| Description  |
| ------------- |:-------------:| -----:|
| X | draw an horizontal line from right to left | move the dices on the  left|
| X | draw an horizontal line from left to right | move the dice on the  right|
| Y | draw a vertical line from bottom to up | move the dices up|
| Y | draw a vertical line from up to bottom | move the dices down|
| Z | draw an oblique line from up to bottom  | move the dices on the front|
| Z | draw an oblique line from bottom to up | move the dices on the back|

### Change log

| Version| Description  |
| ------------- |-----:|
|0.0.8 (pre-release)| add mouse weel listener for z axis dce moving|
|0.0.9 (pre-release)| merge dice value for dice occupying the same spot|
|0.1.0 (pre-release)| merge dice value for dice occupying the same spot and the same value go to the further spot on each direction|
|0.1.1 (pre-release)| add a new dice on each movement and release memory|
|0.1.2 (pre-release)| optimize rendering and dice randomization use recursion versus loop|
|0.1.3 (pre-release)| add a game over condition|
|0.1.4 (pre-release)| listen to DOMMouseScroll for mousewheel mangement on FF|
|0.1.5 (pre-release)| display the current score and use renderAnimationFrame|
|0.1.6 (pre-release)| use touch event if avalaible to move dices|


### Last version demo page

[Go to the demo page](http://evifere.lescigales.org/powerofThree/)

