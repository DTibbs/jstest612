var GUtils = {};

/********************************************************************************/
/* Globals																		*/
/********************************************************************************/

//var debug = 0;

/********************************************************************************/

/********************************************************************************/
/* Animation																	*/
/********************************************************************************/

GUtils.Animation = function(data, sprites) {
    this.load(data);
    this._sprites = sprites;
};

GUtils.Animation.prototype = {
    _frames: [],
    _frame: null,
    _frameDuration: 0,

    load: function(data) {
        this._frames = data;
        this._frameIndex = 0;
        this._frameDuration = data[0].time;
    },

    animate: function(deltaTime) {
        this._frameDuration -= deltaTime;

        //if(this._frameDuration <= 0) {
        while(this._frameDuration <= 0) {
            this._frameIndex++;
            if(this._frameIndex == this._frames.length) {
                this._frameIndex = 0;
            }

            this._frameDuration += this._frames[this._frameIndex].time;
            //this._frameDuration = this._frames[this._frameIndex].time;
        }
    },

    getSprite: function() {
        return this._sprites.getSpriteByName(this._frames[this._frameIndex].sprite);
    }
};

/********************************************************************************/

/********************************************************************************/
/* FrameTimer																	*/
/********************************************************************************/

GUtils.FrameTimer = function() {
    this._currentTick = this._lastTick = (new Date()).getTime();
};

GUtils.FrameTimer.prototype = {
    getSeconds: function() {
        var seconds = this._frameSpacing / 1000;
        if(isNaN(seconds)) {
            return 0;
        }

        return seconds;
    },

	getMilliSeconds: function() {
		var mseconds = this._frameSpacing;
		if(isNaN(mseconds)) {
			return 0;
		}
		return mseconds;
	},

    tick: function() {
        this._lastTick = this._currentTick;
        this._currentTick = (new Date()).getTime();
        this._frameSpacing = this._currentTick - this._lastTick;
    }
};

/********************************************************************************/

/********************************************************************************/
/* SpriteSheet																	*/
/********************************************************************************/

GUtils.SpriteSheet = function(data) {
    this.load(data);
};

GUtils.SpriteSheet.prototype = {
    _sprites: [],
    _width: 0,
    _height: 0,

    load: function(data) {
        this._height = data.height;
        this._width = data.width;
        this._sprites = data.sprites;
    },

    getSpriteByName: function(spriteName) {
        for(var i = 0, len = this._sprites.length; i < len; i++) {
            var sprite = this._sprites[i];

            if(sprite.name == spriteName) {
                return {
					name: sprite.name,
                    x: (sprite.x||i * this._width),
                    y: (sprite.y||0),
                    width: this._width,
                    height: this._height
                };
            }
        }
        
        return null;
    }
};

/*********************************************************************************/

/********************************************************************************/
/* Tile																			*/
/********************************************************************************/

GUtils.Tile = function(data) {
	this.load(data);
};

GUtils.Tile.prototype = {
	_id: 0,
	_image: null,
	_solid: true,
	_health: 1,
	_width: 16,
	_height: 16,

	load: function(data) {
		this._id = data._id;
		this._image = data._image;
		this._solid = data._solid;
		this._health = data._health;
		if(data.render != undefined){
			this.render = data.render;
		}
	},

	render: function(ctx, x, y) {
		
		if(this._image != null && this._image.src != "") {
			ctx.drawImage(this._image, 0, 0, this._width, this._height, x, y, this._width, this._height);
		}
	},

	clear: function(ctx, x, y) {
		ctx.clearRect(x, y, this._width, this._height);
	},
	
	getwidth: function() {
		return _width;
	},
	
	getheight: function() {
		return _height;
	},
};

/********************************************************************************/


/********************************************************************************/
/* MATH stuff																	*/
/********************************************************************************/
GUtils.Math = {
	//Put math consts here
};

GUtils.Math.div = function(ls, rs) {
	//For debugging uncomment this local variable assignment
	//var divres = (ls / rs - ls % rs / rs);
	//return divres;
	//Math.floor(ls / rs);
	return (ls / rs - ls % rs / rs);
};

/********************************************************************************/

//This exports all the GUtils members/prototypes for use by Node/Expose/Modules
//if(module != 0 && module != undefined) {
//	module.exports = exports = GUtils
//}
