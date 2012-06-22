var DIV = GUtils.Math.div;

var keys_helper = new Keys();

var TILE_W = GUtils.Tile.prototype._width;
var TILE_H = GUtils.Tile.prototype._height;

var World = function() {
	var self = this;

	this.curMouseTileID = 1;
	this.curMousePos = { x:0, y:0 };
	this.timer = null;

	//Number of tiles, not pixels
	// Breakdown:	0(top) 	- 255 "sky"
	// 				256		- 511 "ground, top earth"
	// 				512		- 767 "bedrock"
	// 				768		-1023 "hellish"
	
	//1024x1024 tile size world will eat ~1GB of mem... ?
	//this.mapw = 1024;
	//this.maph = 1024;
	
	// Let's start small:
	this.mapw = 256;
	this.maph = 256;
	//this.mapw = 1024;
	//this.maph = 1024;

	this.maingrid = [[]];
	this.tiles = [];

	this.gridOffset = { x:0, y:0 };

	this.tilesetXML = null;
	this.tileset = null;
	
	this.mouselight = null;

	//Number of tiles, not resolution:
	this.bgImage = null;
	this.tilecanvasbuf = null;
	this.tilectxbuf = null;
	this.tilecanvas = null;
	this.tilectx = null;
	this.entitycanvas = null;
	this.entityctx = null;
	this.hudcanvas = null;
	this.hudctx = null;
	this.lighting = null;
	this.lightingctx = null;
	//more canvas/ctx here
};

World.prototype = {
	init: function() {
		this.curMousePos.x = 0;
		this.curMousePos.y = 0;

		//DMT TODO: Load tiles from .xml data
		//this.tilesetXML = new XMLHttpRequest();
		//this.tilesetXML.open("", "tiles.xml", false);
		//tilesetXML.overrideMimeType('text/xml');
		//this.tilesetXML.send(null);
		//this.tileset = this.tilesetXML.responseXML;

		//TODO: Build tiles based off tileset data

		//Initialize possible tiles
		this.tiles[0] = new GUtils.Tile({
			_id: 0,
			_image: new Image(),// null,
			_solid: false,
			_health: 1,
			render: function(ctx, x, y) {
				ctx.clearRect(x, y, this._width, this._height);
			}});
		
		//void clearRect(in float x, in float y, in float w, in float h);
		//this.tiles[0]._image.src = "imgs/tiles/d_air.gif";

		this.tiles[1] = new GUtils.Tile({
			_id: 1,
			_image: new Image(),
			_solid: true,
			_health: 5});
			this.tiles[1]._image.src = "imgs/tiles/dirt.gif";

		this.tiles[2] = new GUtils.Tile({
			_id: 2,
			_image: new Image(),
			_solid: false,
			_health: 1});
			this.tiles[2]._image.src = "imgs/tiles/water.gif";

		
		this.tilecanvas = document.createElement("canvas");
		this.tilecanvas.setAttribute("class", "tiles");
		this.tilecanvas.setAttribute("id", "tilecanvas");
		this.tilecanvas.width = window.innerWidth;
		this.tilecanvas.height = window.innerHeight;
		document.getElementsByTagName("body")[0].appendChild(this.tilecanvas);
		this.tilectx = this.tilecanvas.getContext('2d');

		//This is a buffer canvas that we actually render the tiles to, it's big.
		// Only a portion of this canvas is drawn to the main tilecanvas (like double buffering)
		// We don't add this one to the body element, since we want to keep it "offscreen"
		this.tilecanvasbuf = document.createElement("canvas");
		this.tilecanvasbuf.setAttribute("class", "tilesbuf");
		this.tilecanvasbuf.setAttribute("id", "tilecanvasbuf");
		this.tilecanvasbuf.width = this.mapw * TILE_W;
		this.tilecanvasbuf.height = this.maph * TILE_H;
		//this.tilecanvasbuf.style.display="none";
		this.tilectxbuf = this.tilecanvasbuf.getContext('2d');

		this.entitycanvas = $('<canvas class="entities" id="entitycanvas"></canvas>')[0];
//		this.entitycanvas = document.createElement("canvas");
//		this.entitycanvas.setAttribute("class", "entities");
//		this.entitycanvas.setAttribute("id", "entitycanvas");
		this.entitycanvas.width = window.innerWidth;
		this.entitycanvas.height = window.innerHeight;
//		document.getElementsByTagName("body")[0].appendChild(this.entitycanvas);
		$('body')[0].appendChild(this.entitycanvas);
		this.entityctx = this.entitycanvas.getContext('2d');

		// LIGHTING canvas top layer
		this.lighting = $('<canvas class="lighting"></canvas>');
		this.lighting.appendTo('body');
		this.lighting.css({left: 0, top: 0, position:'absolute'});
		this.lighting.width = window.innerWidth;
		this.lighting.height = window.innerHeight;
//		$('body')[0].appendChild(this.lighting[0]);
		this.lightingctx = this.lighting[0].getContext('2d');
		//light layer is all black with 80% alpha
		this.lightingctx.globalAlpha = 0.8;
		this.lightingctx.fillStyle = "#000";
		this.lightingctx.fillRect(0, 0);
		
		// light image drawn where the mouse is
		this.mouselight = new Image();
		this.mouselight.src = "imgs/light.gif";

		//
		//TODO If a new world, generate, otherwise load
		//

		//Initialize the maingrid to all AIR (this.tiles[0])
		for(var curRow = 0; curRow < this.maph; curRow++) {
			this.maingrid[curRow] = [];
			for(var curCol = 0; curCol < this.mapw; curCol++) {
				this.maingrid[curRow][curCol] = this.tiles[0]._id;
				// Render current tile to tilecanvasbuf
				this.tiles[this.maingrid[curRow][curCol]].render(this.tilectxbuf,
					TILE_W * curCol,
					TILE_H * curRow);
			}
		}

		//Generates fun world.
		this.generateWorld();


		this.bgImage = new Image();
		this.bgImage.onload = function() {
			//Need notification after background image is loaded?
		};

		this.bgImage.src = "imgs/background.gif";

		//Initialize timer
		this.timer = new GUtils.FrameTimer();
		this.timer.tick();
	}, //end init()

	generateWorld: function() {
		// Breakdown:	0	 	- 255 "sky"
		// 				256		- 511 "topsoil"
		// 				512		- 767 "bedrock"
		// 				768		-1023 "hellish"

		var heights = [];
		for(var h = 0; h < this.maph; h++) {
			var randHeight = this.maph * 0.29 - Math.floor(Math.random()*48);
			heights[h] = randHeight;
		}
		//Now smooth the heights in 6%-tile chunks
		for(var chunk = 0; chunk < (this.maph * 0.31); chunk++) {
			var avgHt = this.maph * 0.31;
			for(var ht = 0; ht < this.maph * 0.06; ht++) {
				var tileIdx = (chunk * this.maph * 0.06) + ht;
				avgHt += heights[tileIdx];
			}
			avgHt /= this.maph * 0.06;
			for(var htIndex = 0; htIndex < this.maph * 0.06; htIndex++) {
				heights[(chunk * this.maph * 0.06) + htIndex] = avgHt;
			}
		}


		//generate topsoil layer quarter height from top to halfway down
		for(var curRow = this.maph * 0.25; curRow < this.maph * 0.5; curRow++) {
			this.maingrid[curRow] = [];
			for(var curCol = 0; curCol < this.mapw; curCol++) {
				if(curRow >= heights[curCol]) {
					this.maingrid[curRow][curCol] = this.tiles[1]._id;
					// Render current tile to tilecanvasbuf
					this.tiles[this.maingrid[curRow][curCol]].render(this.tilectxbuf,
						TILE_W * curCol,
						TILE_H * curRow);
				}
			}
		}
	}, //end generateWorld

	addTile: function(x, y, tile) {
		if(this.maingrid[x][y] != this.curMouseTileID) {
			//this.maingrid[x][y].clear(this.tilectxbuf, TILE_W * y, TILE_H * x);
			this.maingrid[x][y] = this.curMouseTileID;
			this.tiles[this.maingrid[x][y]].render(this.tilectxbuf, TILE_W * y, TILE_H * x);
		}
	}, //end addTile(x,y,tile)

	//
	//TODO This function is hosed, fix it. Not going the correct direction and/or snapping is wrong
	//

	processKeys: function() {
		if(keys_helper.keysdown[keys_helper.KeyEnum.VK_LEFT]) {
	   	   this.gridOffset.x += 4;
	   	   if(this.gridOffset.x > 0) this.gridOffset.x = 0;
		}
		if(keys_helper.keysdown[keys_helper.KeyEnum.VK_RIGHT]) {
			this.gridOffset.x -= 4;
			if(this.gridOffset.x < -1 * ((TILE_W * this.mapw) - this.tilecanvas.width)) this.gridOffset.x = -1 * ((TILE_W * this.mapw) - this.tilecanvas.width);
		}
		if(keys_helper.keysdown[keys_helper.KeyEnum.VK_UP]) {
			this.gridOffset.y += 4;
			if(this.gridOffset.y > 0) this.gridOffset.y = 0;
		}
		if(keys_helper.keysdown[keys_helper.KeyEnum.VK_DOWN]) {
			this.gridOffset.y -= 4;
			if(this.gridOffset.y < -1 * ((TILE_H * this.maph) - this.tilecanvas.height)) this.gridOffset.y = -1 * ((TILE_H * this.maph) - this.tilecanvas.height);
		}
	}, //end processKeys()

	render: function() {
			if(this.tilecanvas.width != window.innerWidth ||
			this.tilecanvas.height != window.innerHeight) {
			this.tilecanvas.width = window.innerWidth;
			this.tilecanvas.height = window.innerHeight;
		}


		//Trick to clear entire tilecanvas by just "changing" its width
		//this.tilecanvas.width = this.tilecanvas.width;
		//tilectx.clearRect(0,0,31,71);	
		this.tilectx.drawImage(this.bgImage, 0, 0, 1024, 768, 0, 0, 1024, 768);
		this.timer.tick();

		//GridOffset.x,y will always be positive values.
		//Start with 
		var startrow = DIV(this.gridOffset.y, TILE_W);
		var startcol = DIV(this.gridOffset.x, TILE_H);
		var endrow = startrow + 2 + DIV(this.tilecanvas.height, TILE_H);
		var endcol = startcol + 2 + DIV(this.tilecanvas.width, TILE_W);



		// Rendering now deferred to load/addTile so we only render once to a buffer
		//Rendering tiles to tilectxbuf
		//for(rows = startrow; rows < endrow; rows++) {
		//	for(cols = startcol; cols < endcol; cols++) {
		//		this.maingrid[rows][cols].render(this.tilectx,
		//			(TILE_W * cols) - this.gridOffset.x,
		//			(TILE_H * rows) - this.gridOffset.y);
		//	}
		//}
		//
		// We now just render from the buffer to tilectx
		this.tilectx.drawImage(this.tilecanvasbuf, this.gridOffset.x, this.gridOffset.y);

		this.tiles[this.curMouseTileID].render(this.tilectx,
			(TILE_W * DIV(this.curMousePos.x, TILE_W)) + this.gridOffset.x % TILE_W ,
			(TILE_H * DIV(this.curMousePos.y, TILE_H)) + this.gridOffset.y % TILE_H);

		//Now we just drawImage on the real tilectx with the tilecanvasbuf
		//tilectx.drawImage(this.tilecanvasbuf, 0, 0);

		//lightingctx.fillStyle = "rgba(0,0,0, 0.8)";
		//lightingctx.fillRect(0, 0, 1024, 768);
		//lightingctx.clearRect(curMousePos.x-64,
		//						curMousePos.y-64,
		//						128,
		//						128);
		//lightingctx.drawImage(mouselight,
		//					curMousePos.x-64,
		//					curMousePos.y-64);

	} //end render()
};
