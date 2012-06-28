// TOUCH CONTROLS!!
var TouchPos = function() {
    return this;
};

TouchPos.prototype = {
    x:0,
    y:0
};

// array to store touches by touch ID
var gTouches = [];

var TouchStart = function(event){
  event.touches.forEach(function(touch, index) {
      if(gTouches[touch.identifier] === undefined) {
          gTouches[touch.identifier] = new TouchPos();
      }
      gTouches[touch.identifier].x = touch.pageX;
      gTouches[touch.identifier].y = touch.pageY;
  })
};

var TouchMove = function(event){ 
    event.preventDefault();
    event.touches.forEach(function(touch) {
        if(gTouches[touch.identifier] !== undefined) {
            gTouches[touch.identifier].x = touch.pageX;
            gTouches[touch.identifier].y = touch.pageY;
        }
    });
};

var TouchEnd = function(event){
    event.touches.forEach(function(touch) {
        delete gTouches[touch.identifier];
    });
};