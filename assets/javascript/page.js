class Game{
	reset: function() {
		this.characters = {
			"5": {
				id: 0,
				name: "Ginny Weasley",
				hp: 120,
				attack: 8,
				counterAttack: 10,
			},
			"6": {
				id: 1,
				name: "Neville Longbottom",
				hp: 150,
				attack: 20,
				counterAttack: 20,
			},
			"7": {
				id: 2,
				name: "Luna Lovegood",
				hp: 180,
				attack: 25,
				counterAttack: 25,
			},
			"8": {
				id: 3,
				name: "Colin Creevy",
				hp: 100,
				attack: 5,
				counterAttack: 5,
			}
		};
	},
	attackCharacter: function(id) {
		// fetch character with id

		// decrement opponent health

		// decrement my health

		// check for win

		// check for lose

		// return game state
		return this.getState();

	},
	selectCharacter: function(id) {
		// set this.mycharacter = id

		this.myCharacterId = id;

		return this.getState();

	}
	getState: function() {

		var myCHaracter = this.characters[id];
		var arrayOfEnemies = [];

		for (var i = 0; i < this.characters.length; i++) {
			var aCharacter = this.characters[i];
			if (i == id) {
				// this is my character
			} else {
				// add it to an array of enemies
			}
		}
		return {
			me: myCharacter,
			enemies: arrayOfEnemies,
			win: false,
			lose: false
		};
	}
}

$(document).ready(function() {
	this.game = new Game();

});