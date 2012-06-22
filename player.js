var Entity = function() {
	//Put stuff global to Entities here
};

Entity.prototype.Player = function() {
	//Stuff global to Player here
	var image, spriteSheet, walk, jump, frameTimer;
};

Entity.prototype.Player.prototype.create = function() {
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




