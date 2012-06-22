var Keys = function(game) {
	var self = this;

  this.chr = 0;
  this.pressed = 0;
  this.keysdown = new Array(255);
  this.game = game;
  
  document.onkeydown = function(e) {
    //e.preventDefault()
    
    self.checkkeydown(e);
    
    return true;
  };
  
  document.onkeyup = function(e) {
    //e.preventDefault()
    
    self.checkkeyup(e);
    
    return true;
  };
};

Keys.prototype = {
	checkkeydown: function(e) {
		if (typeof e.which === 'undefined' || typeof e.charCode === 'undefined') this.chr = e.keyCode;    // IE, Opera
		else if (typeof e.which !== 'undefined' && typeof e.charCode !== 'undefined') this.chr = e.which;	  // All others

		if(this.chr < 255) {
			this.keysdown[this.chr] = true;
		}
	},

	checkkeyup: function(e) {
    	if (typeof e.which === 'undefined' || typeof e.charCode === 'undefined') this.chr = e.keyCode;   // IE, Opera
    	else if (typeof e.which !== 'undefined' && typeof e.charCode !== 'undefined') this.chr = e.which;	  // All others

		if(this.chr <= 255) {
			this.keysdown[this.chr] = false;
		}
	},

	KeyEnum: { "VK_BACKSPACE": 8,
		"VK_TAB": 9,
		'VK_ENTER': 13,
		"VK_SHIFT": 16,
		"VK_CTRL": 17,
		"VK_ALTOPT": 18,
		"VK_PAUSEBREAK": 19,
		"VK_CAPSLOCK": 20,
		"VK_ESCAPE": 27,
		"VK_PAGE_UP": 33,
		"VK_SPACE": 32,
		"VK_PAGE_DOWN": 34,
		"VK_END": 35,
		"VK_HOME": 36,
		"VK_LEFT": 37,
		"VK_UP": 38,
		"VK_RIGHT": 39,
		"VK_DOWN": 40,
		"VK_INSERT": 45,
		"VK_DELETE": 46,
		"VK_0": 48,
		"VK_1": 49,
		"VK_2": 50,
		"VK_3": 51,
		"VK_4": 52,
		"VK_5": 53,
		"VK_6": 54,
		"VK_7": 55,
		"VK_8": 56,
		"VK_9": 57,
		"VK_A": 65,
		"VK_B": 66,
		"VK_C": 67,
		"VK_D": 68,
		"VK_E": 69,
		"VK_F": 70,
		"VK_G": 71,
		"VK_H": 72,
		"VK_I": 73,
		"VK_J": 74,
		"VK_K": 75,
		"VK_L": 76,
		"VK_M": 77,
		"VK_N": 78,
		"VK_O": 79,
		"VK_P": 80,
		"VK_Q": 81,
		"VK_R": 82,
		"VK_S": 83,
		"VK_T": 84,
		"VK_U": 85,
		"VK_V": 86,
		"VK_W": 87,
		"VK_X": 88,
		"VK_Y": 89,
		"VK_Z": 90,
		"VK_LEFT_META": 91,
		"VK_RIGHT_META": 92,
		"VK_SELECT_KEY": 93,
		"VK_NUMPAD_0": 96,
		"VK_NUMPAD_1": 97,
		"VK_NUMPAD_2": 98,
		"VK_NUMPAD_3": 99,
		"VK_NUMPAD_4": 100,
		"VK_NUMPAD_5": 101,
		"VK_NUMPAD_6": 102,
		"VK_NUMPAD_7": 103,
		"VK_NUMPAD_8": 104,
		"VK_NUMPAD_9": 105,
		"VK_MULTIPLY": 106,
		"VK_ADD": 107,
		"VK_SUBTRACT": 109,
		"VK_DECIMAL_POINT": 110,
		"VK_DIVIDE": 111,
		"VK_F1": 112,
		"VK_F2": 113,
		"VK_F3": 114,
		"VK_F4": 115,
		"VK_F5": 116,
		"VK_F6": 117,
		"VK_F7": 118,
		"VK_F8": 119,
		"VK_F9": 120,
		"VK_F10": 121,
		"VK_F11": 122,
		"VK_F12": 123,
		"VK_NUM_LOCK": 144,
		"VK_SCROLL_LOCK":  145,
		"VK_SEMICOLON": 186,
		"VK_EQUAL_SIGN": 187,
		"VK_COMMA": 188,
		"VK_DASH": 189,
		"VK_PERIOD": 190,
		"VK_FORWARD_SLASH": 191,
		"VK_GRAVE_ACCENT": 192,
		"VK_OPEN_BRACKET": 219,
		"VK_BACK_SLASH":  220,
		"VK_CLOSE_BRAKET": 221,
		"VK_SINGLE_QUOTE": 222
	}
};

//if(module != 0 && module != undefined) {
//	module.exports = Keys
//}
