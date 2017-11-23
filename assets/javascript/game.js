$(document).ready(function(){
	var game = {
		charactersArray: [
			{
				name: "Ginny Weasley",
				hp: 120,
				attack: 15,
				counterAttack: 8,
				image: "./assets/images/ginny.jpg",
				id: 0
			},
			{
				name: "Neville Longbottom",
				hp: 140,
				attack: 20,
				counterAttack: 12,
				image: "./assets/images/neville.jpg",
				id: 1
			},
			{
				name: "Luna Lovegood",
				hp: 170,
				attack: 15,
				counterAttack: 15,
				image: "./assets/images/luna.jpg",
				id: 2
			},
			{
				name: "Colin Creevy",
				hp: 115,
				attack: 10,
				counterAttack: 5,
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
			game.gameStage = 1;
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
			game.gameStage = 2;
		},
		attack: function() {
			var thisGame = this; 
			if (thisGame.gameStage === 2) {
				var youHit = thisGame.playerCharacter.attack;
				var theyHit = thisGame.enemyFighting.counterAttack;
				thisGame.enemyFighting.hp -= youHit;
				thisGame.playerCharacter.hp -= theyHit;
				//increase the attack power
				thisGame.playerCharacter.attack += thisGame.charactersArray[thisGame.playerCharacter.id].attack;
				// thisGame.enemies[thisGame.enemyFighting.id] = thisGame.enemyFighting;
				// showMessage("Your hit " + thisGame.enemyFighting.name + " for -" + youHit + "<br>" + thisGame.enemyFighting.name + " hit you for -" + theyHit);
				if (thisGame.enemyFighting.hp <= 0) {
					this.win();
				}

				if (thisGame.playerCharacter.hp <= 0) {
					this.lose();
				}
				//return a message, the enemies array, and the current player
				return ["Your hit " + thisGame.enemyFighting.name + " for -" + youHit + "<br>" + thisGame.enemyFighting.name + " hit you for -" + theyHit,thisGame.enemies,thisGame.playerCharacter];
			} else {
				return ["select a new opponent"];
			}
		},
		win: function() {
			$("#" + game.enemyFighting.id).addClass("defeated").removeClass("fighting");
			//if the character has health 0
			var totalhp = 0;
			$.each(game.enemies, function(key, value) {
				if (value.hp < 0) {
					value.hp = 0;
				}
				totalhp += value.hp;
			});
			game.gameStage = 1;
			if (totalhp <= 0) {
				endGame("You defeated everyone!");
				return true
			} else {
				showWinBattle(this.enemyFighting.name);
				console.log(this.enemyFighting.name);
				return false
			}
			
		},
		lose: function() {
			endGame("You Lost");
		},
		reset: function() {
			game.gameStage = 0;
			game.playerCharacter = '';
			game.enemies = [];
			game.enemyFighting = '';
			resetDisplay();
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
		
		// console.log(attack);
		showMessage(attack[0]);
		if (attack.length > 1) {
			updateStats(attack[1]);
			updateStats(attack[2]);
		}
	}
	function handleReset() {
		game.reset();
		//pass the original array into updateStats 
		updateStats(game.charactersArray);
	}

	// Purely for display

	//set up the basic container for each box
	function initializeGame() {
		//for each character, create their block
		$.each(game.charactersArray, function(key,value){
			$("#instructions").html("Choose a character");
			var characterBlock = $("<div>").attr("id",key).addClass("character");
			$("<p class='strong mb-0'>").html(value.name).appendTo(characterBlock);
			$("<img>").attr("src",value.image).addClass("img-fluid").appendTo(characterBlock);
			var stats = $("<ul>").addClass("stats");
			var hp = $("<li>").append("<span>").addClass("hp").prepend("Health: ");
			var attack = $("<li>").append("<span>").addClass("attack").prepend("Attack: ");
			var counter = $("<li>").append("<span>").addClass("counter-attack").prepend("Counter Attack: ");
			// $(stats).append(hp).append(attack).append(counter).appendTo(characterBlock);
			$(stats).append(hp).appendTo(characterBlock);
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
		$("#message").append(message);
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


