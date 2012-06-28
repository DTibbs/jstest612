//Globals
var framecount = 0;
var curtick = 0;
var starttick = 0;
var renderTime = 0;

var gWorld = null;

init = function() {
	if(gWorld === undefined || gWorld === null)
	{
		gWorld = new World();
	}
	gWorld.init();
	starttick = gWorld.timer._lastTick;

	setInterval(mainloop, 1);
};

var kFPS = 60;

var mainloop = function() {
	//
	//MAIN()
	//
	gWorld.timer.tick();

	curtick = gWorld.timer._currentTick;
	framecount++;
	//Set framerate in console
	var time = curtick - starttick;
	var fps = framecount / (time / 1000);
	//JQuery
	//$('#console').text(fps);
	var console = document.getElementById('console');
	console.innerText = fps;
	if(time > 3000) {
		starttick = curtick;
		framecount = 0;
	}
	
	renderTime += gWorld.timer._currentTick - gWorld.timer._lastTick;
	if(renderTime > (1000 / kFPS)) {
		renderTime = 0;
		gWorld.processKeys();
		gWorld.render();
	}
};

var MouseMove = function(mouse) {
	gWorld.curMousePos.x = mouse.pageX;// - gridOffset.x;
	gWorld.curMousePos.y = mouse.pageY;// - gridOffset.y;
	//$('#console').text("X: " + mouse.pageX + "\nY: " + mouse.pageY);

	if(gWorld.mousedown) {
		var row = DIV(gWorld.curMousePos.y - gWorld.gridOffset.y, TILE_H);
		var col = DIV(gWorld.curMousePos.x - gWorld.gridOffset.x, TILE_W);
		if(row < gWorld.maph && col < gWorld.mapw) {
			gWorld.addTile(row, col, gWorld.curMouseTileID);
		}
	}
}; //end MouseMove(mouse)

var MouseDown = function(mouse) {
	gWorld.curMousePos.x = mouse.pageX;// - gridOffset.x;
	gWorld.curMousePos.y = mouse.pageY;// - gridOffset.y;
	var row = DIV(gWorld.curMousePos.y - gWorld.gridOffset.y, TILE_H);
	var col = DIV(gWorld.curMousePos.x - gWorld.gridOffset.x, TILE_W);
	if(row < gWorld.maph && col < gWorld.mapw) {
		gWorld.addTile(row, col, gWorld.curMouseTileID);
	}
	gWorld.mousedown = true;
}; //end MouseDown

var MouseUp = function(mouse) {
	gWorld.mousedown = false;
};

var MouseWheel = function(event) {
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta) {
		delta = event.wheelDelta/120; 
		if (window.opera) delta = -delta;
	} else if (event.detail) {
		delta = -event.detail/3;
	}
	if (delta) {
		if(delta < 0) {
			if(++gWorld.curMouseTileID > 2) {
				gWorld.curMouseTileID = 0;
			}
		} else {//> 0
			if(--gWorld.curMouseTileID < 0) {
				gWorld.curMouseTileID = 2;
			}
		}
	}
	if (event.preventDefault)
		event.preventDefault();
	event.returnValue = false;
};


window.onload = init;
window.onmousemove = MouseMove;
window.onmousedown = MouseDown;
window.onmouseup = MouseUp;
window.onmousewheel = MouseWheel; 
