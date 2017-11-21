$(document).ready(function(){
	var game = {
		characters: {
			ginny: {
				name: "Ginny Weasley",
				hp: 120,
				attack: 8,
				counterAttack: 10,
				image: "./assets/images/ginny.jpg",
				id: 0
			},
			neville: {
				name: "Neville Longbottom",
				hp: 150,
				attack: 20,
				counterAttack: 20,
				image: "./assets/images/neville.jpg",
				id: 1
			},
			luna: {
				name: "Luna Lovegood",
				hp: 180,
				attack: 25,
				counterAttack: 25,
				image: "./assets/images/luna.jpg",
				id: 2
			},
			colin: {
				name: "Colin Creevy",
				hp: 100,
				attack: 5,
				counterAttack: 5,
				image: "./assets/images/colin.jpg",
				id: 3
			}
		},
		charactersArray: [
			{
				name: "Ginny Weasley",
				hp: 120,
				attack: 8,
				counterAttack: 10,
				image: "./assets/images/ginny.jpg",
				id: 0
			},
			{
				name: "Neville Longbottom",
				hp: 150,
				attack: 20,
				counterAttack: 20,
				image: "./assets/images/neville.jpg",
				id: 1
			},
			{
				name: "Luna Lovegood",
				hp: 180,
				attack: 25,
				counterAttack: 25,
				image: "./assets/images/luna.jpg",
				id: 2
			},
			{
				name: "Colin Creevy",
				hp: 100,
				attack: 5,
				counterAttack: 5,
				image: "./assets/images/colin.jpg",
				id: 3
			}
		],
		gameStage: 0,
		playerCharacter:'',
		enemies: [],
		enemyFighting:'',
		

		selectCharacterNotArray: function(id) {
			// checks each character against the id of the one clicked and sorts them
			var thisGame = this;
			$.each(this.characters, function(key,value){
				if (key === id) {
					thisGame.playerCharacter = thisGame.characters[key];
				} else {
					thisGame.enemies.push(thisGame.characters[key]);
				}
			});
			console.log("my char is " + this.playerCharacter.name);
			console.log("my enemies are " + this.enemies[0].name + this.enemies[1].name + this.enemies[2].name);
		},

		selectCharacter: function(id) { //if characters is an array
			// checks each character against the id of the one clicked and sorts them
			console.log(id);
			var thisGame = this;
			$.each(this.charactersArray, function(index,value){
				// for the charcter whose ID matches the clicked one, set to player character
				console.log(index);

				if (index == id) {
					console.log("yes");
					thisGame.playerCharacter = thisGame.charactersArray[index];
				} else { //set the rest as enemies
					thisGame.enemies.push(thisGame.charactersArray[index]);
				}
			});
			console.log("my char is " + this.playerCharacter.name);
			console.log("my enemies are " + this.enemies[0].name + this.enemies[1].name + this.enemies[2].name);
		},

		selectOpponent: function(id) {
			this.enemyFighting = this.charactersArray[id];
			console.log("i'm fighting " + this.enemyFighting.name);
		}
	};

	// page functions

	function initializeGame() {
		//for each character, create their block
		$.each(game.charactersArray, function(key,value){
			var characterBlock = $("<div>").attr("id",key).addClass("col col-3 character");
			$("<img>").attr("src",value.image).addClass("img-fluid").appendTo(characterBlock);
			var stats = $("<ul>").addClass("stats");
			var hp = $("<li>").addClass("hp");
			var attack = $("<li>").addClass("attack");
			var counter = $("<li>").addClass("counter-attack");
			$(stats).append(hp).append(attack).append(counter).appendTo(characterBlock);
			$(characterBlock).appendTo("#characters");
		});

		updateStats(game.charactersArray);
	}

	function updateStats(array) {
		$.each(array, function(index,value){
			var charId = "#" + index;
			$(charId).find(".hp").html(value.hp);
			$(charId).find(".attack").html(value.attack);
			$(charId).find(".counter-attack").html(value.counterAttack);
		});
	}

	function moveCharacters(id) {
		id = parseInt(id);
		// for each enemy, add class
		$("#" + id).addClass("me");

		var enemies = game.enemies;


		// enemies index is different so it breaks here
		// $.each(game.charactersArray, function(key, value) {
		// 	if (key !== id) {
		// 		$("#" + key).addClass("enemy");
		// 	}
		// });

		$.each(enemies, function(key,value) {
			console.log(value["id"]);
			$("#" + value["id"]).addClass("enemy");
		})
	}

	function stageOpponent(id) {
		console.log("the id is" + game.charactersArray[id].id);
		$("#" + game.charactersArray[id].id).addClass("fighting");
	}

	function handleCharacterClick() {
		var id = $(this).attr("id");
		console.log(id + "clicked");
		if (game.gameStage === 1) {
			// make sure is not selected character
			game.selectOpponent(id);
			stageOpponent(id);
			game.gameStage = 2;
		}

		if (game.gameStage === 0) {
			game.selectCharacter(id);
			moveCharacters(id);
			game.gameStage = 1;
		};
	}

	// events	

	initializeGame();

	$(".character").click( handleCharacterClick );

});

//stages: 
// 0 - select player - once done these functions turn "off"
// 1 - select opponent - once done must do battle to turn these back on
// 2 - in battle - can only attack


