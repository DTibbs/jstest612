var util = require('util')
//	, help = require('lib/helpers')
	, Maga = require('maga')
	, GUtils = require('middleware/gutils')
	;

var Mineorrhea_Player = function() {
	Maga.Object.apply(this, arguments);

	var image, spriteSheet, walk, jump, frameTimer;

	this.register({
		// Values used to render player		
		render: {
			x: 100
			, y: 100
			, facing: 1
		}

		// Input values
		, input: {
			direction: 0
			, jumping: 0
		}

		// Values that change
		, dynamic: {
			keys: 0
			, created: false
		}

		, static: {
			speed: 4
			, width: 31
			, height: 80
			, jumpheight: 16
		}
	});
};

util.inherits(Mineorrhea_Player, Maga.Object);

Mineorrhea_Player.prototype.update = function() {
	//REQUIRED: advances the state by 1 frame
	if(this.created == true) {
		this.x += this.direction * this.speed;
		
		//DMT TODO: let server correct our bounds
		if(this.x < 0) this.x = 0;
		if(this.x > 1200) this.x = 1200;
		//var winW = document.body.offsetWidth;
		//if(this.x > winW.innerWidth - this.width) this.x = winW.innerWidth - this.width;
	}

	return this;
};

Mineorrhea_Player.prototype.create = function() {
	//Setting up the sprite sheet (from image) and animations
	this.image = new Image();
	this.image.src = './imgs/ninjacommando.gif';
	this.spriteSheet = new GUtils.SpriteSheet({
		width: this.width,
		height: this.height,
		sprites: [
			{ name: 'stand', x: 136, y: 13 },
			{ name: 'walk_1', x: 179, y: 13 },
			{ name: 'walk_2', x: 216, y: 13 },
			{ name: 'walk_3', x: 252, y: 13 },
			{ name: 'walk_4', x: 288, y: 13 },
			{ name: 'walk_5', x: 327, y: 13 },
			{ name: 'jump_1', x: 370, y: 13 },
			{ name: 'jump_2', x: 403, y: 13 },
			{ name: 'jump_3', x: 438, y: 13 },
			{ name: 'jump_4', x: 528, y: 13 },
			{ name: 'jump_kick', x: 370, y: 13 },
			//{ name: 'jump_6', x: 370, y: 13 },
			]
		});
	this.walk = new GUtils.Animation([
		{ sprite: 'walk_1', time: 0.16 },
		{ sprite: 'walk_2', time: 0.16 },
		{ sprite: 'walk_3', time: 0.16 },
		{ sprite: 'walk_4', time: 0.16 },
		{ sprite: 'walk_5', time: 0.16 },
	], this.spriteSheet);
	this.jump = new GUtils.Animation([
		{ sprite: 'jump_1', time: 0.16 },
		{ sprite: 'jump_2', time: 0.16 },
		{ sprite: 'jump_3', time: 0.16 },
		{ sprite: 'jump_4', time: 0.16 },
	], this.spriteSheet);

	this.frameTimer = new GUtils.FrameTimer();
	this.frameTimer.tick();

	this.created = true;

	return this;
};

Mineorrhea_Player.prototype.render = function(state) {
	// REQUIRED: called with an object (state) containing render properties
		
	if(this.frameTimer != 0)
 	{
		this.frameTimer.tick();
	}

	//No more canvas, no more moving the object...
	// This line moves the canvas object itself
	//this.object.css({ left: state.x, top: state.y });
	
	// Needs to be a better way to validate image has been loaded before trying to draw:
	if(this.image.width > 0)
	{
		var theCanvas = document.getElementById("entitycanvas");
		var context = theCanvas.getContext('2d');

		//context.clearRect(0, 0, 100,100);
		// sneaky clear context tick, this also resets the flip, though.
		theCanvas.width = theCanvas.width;

		//Gonna have to figure out a better way to flip this guy
 		//if(this.facing < 0) {
		//	context.translate(this.width+1, 0);
		//	context.scale(-1,1);
		//}

		var curSecs = this.frameTimer.getSeconds();
		this.walk.animate(curSecs);
		var frame = this.walk.getSprite();

		if(this.jumping == 1) {
			this.jump.animate(curSecs);
			frame = this.jump.getSprite();
			if(frame.name == 'jump_4') {
				this.jumping = 0;
				this.y += this.jumpheight;
			}
		}
		else {
			// Not moving, just draw the standing sprite
			if(this.direction == 0) {
				frame = this.spriteSheet.getSpriteByName('stand');
			}		
		}

		context.drawImage(this.image, 
				frame.x,				//source x 
				frame.y, 				//source y
				this.width,				//source w
				this.height,			//source h
				state.x,				//dest x
				state.y,				//dest y
				this.width,				//dest x
				this.height);			//dest y
	}
	return this;
};

Mineorrhea_Player.prototype.destroy = function() {
	//REQUIRED: used to remove the object (when a player disconnects)
	this.object.remove();
};

Mineorrhea_Player.prototype.processKeys = function(keys) {
	//UTIL: handles key presses
	this.keys = keys;
	if(keys.keysdown[keys.KeyEnum.VK_RIGHT]) this.direction = 1;
	if(keys.keysdown[keys.KeyEnum.VK_LEFT]) this.direction = -1;
	if(!keys.keysdown[keys.KeyEnum.VK_RIGHT] &&
		!keys.keysdown[keys.KeyEnum.VK_LEFT]) this.direction = 0;
	else this.facing = this.direction;

	if(keys.keysdown[keys.KeyEnum.VK_SPACE] && this.jumping != 1) {
 	   this.jumping = 1;
	   this.y -= this.jumpheight;
	}

	return this;
};

// Don't forget the player!
var Player = exports.Player = function() {
	Mineorrhea_Player.apply(this, arguments);
};
util.inherits(Player, Mineorrhea_Player);
