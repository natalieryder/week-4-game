$(document).ready(function(){
	var game = {
		charactersArray: [
			{
				name: "Ginny Weasley",
				hp: 120,
				attack: 12,
				counterAttack: 15,
				image: "./assets/images/ginny.jpg",
				id: 0
			},
			{
				name: "Neville Longbottom",
				hp: 130,
				attack: 14,
				counterAttack: 12,
				image: "./assets/images/neville.jpg",
				id: 1
			},
			{
				name: "Luna Lovegood",
				hp: 150,
				attack: 10,
				counterAttack: 15,
				image: "./assets/images/luna.jpg",
				id: 2
			},
			{
				name: "Colin Creevy",
				hp: 115,
				attack: 10,
				counterAttack: 10,
				image: "./assets/images/colin.jpg",
				id: 3
			},
		],
		gameStage: 0,
		playerCharacter:{},
		enemies: [],
		enemyFighting:'',
		
		selectCharacter: function(id) { 
			// checks each character against the id of the one clicked and sorts them into enemies and player character
			var thisGame = this;
			var enemies = [];
			var playerCharacter;
			$.each(this.charactersArray, function(key,value){
				if (key === id) {
					playerCharacter = $.extend(true,{},thisGame.charactersArray[key]);
				} else {
					enemies.push($.extend(true,{},thisGame.charactersArray[key]));
				}
			});

			this.playerCharacter = playerCharacter;
			this.enemies = enemies;
			//move to get oppononent stage
			thisGame.gameStage = 1;
		},

		selectOpponent: function(id) {
			// id = parseInt(id);
			var thisGame = this;
			
			$.each(thisGame.enemies, function(index,value){
				
				if ( id === value.id) {
					thisGame.enemyFighting = value;
				}
			});
			//move to attack stage
			thisGame.gameStage = 2;
		},
		attack: function() {
			var thisGame = this; 
			var result = {};
			if (thisGame.gameStage === 2) {
				var youHit = thisGame.playerCharacter.attack;
				var theyHit = thisGame.enemyFighting.counterAttack;
				thisGame.enemyFighting.hp -= youHit;
				thisGame.playerCharacter.hp -= theyHit;

				//increase the attack power
				thisGame.playerCharacter.attack += thisGame.charactersArray[thisGame.playerCharacter.id].attack;

				// if the enemy loses, this.win returns whether player has defeated everyone or just the current opponent
				if (thisGame.enemyFighting.hp <= 0) {
					if (this.win()) {
						result.won = 'war';
					} else {
						result.won = 'battle';
					}
				}
				if (thisGame.playerCharacter.hp <= 0) {
					result.won = "lost";
				}
				//return a message, the enemies array, and the current player
				result.message = "You hit " + thisGame.enemyFighting.name + " for -" + youHit + "<br>" + thisGame.enemyFighting.name + " hit you for -" + theyHit;
				// maybe return an array of all the things to update
				// result.charsToUpdate [thisGame.enemies, thisGame.playerCharacter];

			} else {
				result.message = ["Select a new opponent."];
			}
			result.enemies = thisGame.enemies;
			result.character = thisGame.playerCharacter;
			console.log("the result is")
			console.log(result);
			return result;
							
		},
		win: function() {
			var thisGame = this;
			$("#" + thisGame.enemyFighting.id).addClass("defeated").removeClass("fighting");

			var totalhp = 0;
			$.each(thisGame.enemies, function(key, value) {
				if (value.hp < 0) {
					//if hp is less than 0 set to 0
					value.hp = 0;
				}
				totalhp += value.hp;
			});

			thisGame.gameStage = 1;

			//if total of all enemies hp is 0, you've won
			if (totalhp <= 0) {
				return true
			} else {
				return false
			}
		},

		reset: function() {
			game.gameStage = 0;
			game.playerCharacter = '';
			game.enemies = [];
			game.enemyFighting = '';
			return(this.charactersArray);
		}
	};
	//end of game object


	function handleCharacterClick() {
		var id = $(this).attr("id");
		id = parseInt(id);
		if (game.gameStage === 0) {
			game.selectCharacter(id);
			//assigns classes based on the characters
			moveCharacters(id);
			return;
		}

		if (game.gameStage === 1) {
			// make sure is not selected character
			if ( game.playerCharacter.id === id ) {
				$("#message").html("you can't fight yourself");
				return false;
			}
			// sets the opponent
			game.selectOpponent(id);
			stageOpponent();
			return;
		}
	}
	function handleAttack() {
		$("#message").empty();
		var attack = game.attack();
		/* game.attack returns {
			won: (war,battle,lost)
			message: (the message to show)
			enemies: (the array of enemies)
			character: (the character object)
		}
		*/
		
		if (attack.won === "war") {
			endGame("You defeated everyone!");
		}
		if (attack.won === "battle") {
			console.log(game.enemyFighting);
			console.log(this.enemyFighting);
			showWinBattle(game.enemyFighting.name);
		}
		if (attack.won === "lost") {
			endGame("You Lost");
		}
		showMessage(attack.message);
		updateStats(attack.enemies);
		updateStats(attack.character);
		
	}
	function handleReset() {

		//pass the original array into updateStats 
		updateStats(game.reset());
		resetDisplay();
	}

	// Purely for display

	//set up the basic container for each box
	function initializeGame() {
		//for each character, create their block
		$.each(game.charactersArray, function(key,value){
			$("#instructions").html("Choose a character");
			var characterBlock = $("<div>").attr("id",key).addClass("character");
			var characterBlockContainer = $("<div>").addClass("inside").appendTo(characterBlock);
			$("<p class='strong mb-0'>").html(value.name).appendTo(characterBlockContainer);
			$("<img>").attr("src",value.image).addClass("img-fluid").appendTo(characterBlockContainer);
			var stats = $("<ul>").addClass("stats");
			var hp = $("<li>").append("<span>").addClass("hp").prepend("Health: ");
			// var attack = $("<li>").append("<span>").addClass("attack").prepend("Attack: ");
			// var counter = $("<li>").append("<span>").addClass("counter-attack").prepend("Counter Attack: ");
			// $(stats).append(hp).append(attack).append(counter).appendTo(characterBlock);
			$(stats).append(hp).appendTo(characterBlockContainer);
			$(characterBlock).appendTo("#characters");
		});
		updateStats(game.charactersArray);
	}
	//update the stats with the characterArray
	function updateStats(characters) {

		function printStats(char) {
			var charId = "#" + char.id;
			$(charId).find(".hp span").html(char.hp);
			$(charId).find(".attack span").html(char.attack);
			$(charId).find(".counter-attack span").html(char.counterAttack);
		}
		if (Array.isArray(characters)) {
			$.each(characters, function(index, value){
				printStats(value);
			});
		} else {
			printStats(characters);
		}
	}

	function moveCharacters(id) {
		$("#" + id).addClass("me");
		var enemies = game.enemies;
		// for each enemy, add class
		$.each(enemies, function(key,value) {
			$("#" + value.id).addClass("enemy");
		});
		$("#instructions").html("Choose opponent");
	}

	function stageOpponent() {
		// finds the div for the current enemy and styles it
		$("#" + game.enemyFighting.id).addClass("fighting");
		$("#message").empty();
		$("#instructions").html("Attack!");
	}

	function showMessage(message) {
		$("#message").prepend(message);
	}

	function endGame(message) {
		$("#message").append("<br> " + message);
		$("#instructions").html(message);
		$("#reset").addClass("show");
		$("#attack").addClass("hide");
	}

	function showWinBattle(opponent) {
		$("#message").append("<br>You defeated " + opponent + ". Pick your next opponent!");
		$("#instructions").html("Choose opponent");
	}

	function resetDisplay() {
		$("#instructions").html("Choose a character");
		$(".character").removeClass("enemy defeated fighting me");
		$("#reset").removeClass("show");
		$("#attack").removeClass("hide");
		$("#message").empty();
	}

	// events	

	initializeGame();
	console.log("hi");

	$(".character").click( handleCharacterClick );
	$("#attack").click( handleAttack );
	$("#reset").click( handleReset );

});

//stages: 
// 0 - select player - once done these functions turn "off"
// 1 - select opponent - once done must do battle to turn these back on
// 2 - in battle - can only attack


