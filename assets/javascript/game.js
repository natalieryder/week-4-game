$(document).ready(function(){
	var game = {
		charactersArray: [
			{
				name: "Ginny Weasley",
				hp: 120,
				attack: 8,
				baseAttack: 8,
				counterAttack: 10,
				image: "./assets/images/ginny.jpg",
				id: 0
			},
			{
				name: "Neville Longbottom",
				hp: 150,
				attack: 20,
				baseAttack: 20,
				counterAttack: 20,
				image: "./assets/images/neville.jpg",
				id: 1
			},
			{
				name: "Luna Lovegood",
				hp: 180,
				attack: 25,
				baseAttack: 25,
				counterAttack: 25,
				image: "./assets/images/luna.jpg",
				id: 2
			},
			{
				name: "Colin Creevy",
				hp: 100,
				attack: 5,
				baseAttack: 5,
				counterAttack: 5,
				image: "./assets/images/colin.jpg",
				id: 3
			}
		],
		gameStage: 0,
		playerCharacter:'',
		enemies: [],
		enemyFighting:'',
		

		selectCharacter: function(id) { //if characters is an array
			// checks each character against the id of the one clicked and sorts them
			id = parseInt(id);
			var thisGame = this;

			playerCharacterNew = $.map(thisGame.charactersArray, function( value, index ) {
				if (index === id) {
					
					console.log("test");
					console.log(thisGame.charactersArray[index]);
					return thisGame.charactersArray[index];
				}
			});
			enemies = $.map(thisGame.charactersArray, function( value, index ) {
				if (index !== id) {
					
					console.log("test");
					console.log(thisGame.charactersArray[index]);
					return thisGame.charactersArray[index];
				}
			});
			thisGame.playerCharacter = playerCharacterNew;
			thisGame.enemies = enemies;



			// console.log("my char is " + this.playerCharacter.name);
			console.log("my enemies are " + enemies[0].name + enemies[1].name + enemies[2].name);
		},

		selectOpponent: function(id) {
			this.enemyFighting = this.charactersArray[id];
			console.log("i'm fighting " + this.enemyFighting.name);
		},
		attack: function() {
			var thisGame = this; //not sure why this doesn't work here
			if (game.gameStage === 2) {
				var youHit = game.playerCharacter.attack;
				var theyHit = game.enemyFighting.counterAttack;
				game.enemyFighting.hp -= youHit;
				game.playerCharacter.hp -= theyHit;
				//increase the attack power
				game.playerCharacter.attack += game.playerCharacter.baseAttack;
				// game.enemies[game.enemyFighting.id] = game.enemyFighting;
				if (game.enemyFighting.hp <= 0) {
					console.log("you won");
					$("#" + game.enemyFighting.id).hide();
					game.gameStage = 1;
				};
				if (game.playerCharacter.hp <= 0) {
					console.log("you lose");
					game.reset();
				}
				updateStats(game.charactersArray);

			}
		},
		reset: function() {
			game.charactersArray=[
				{
					name: "Ginny Weasley",
					hp: 120,
					attack: 8,
					baseAttack: 8,
					counterAttack: 10,
					image: "./assets/images/ginny.jpg",
					id: 0
				},
				{
					name: "Neville Longbottom",
					hp: 150,
					attack: 20,
					baseAttack: 20,
					counterAttack: 20,
					image: "./assets/images/neville.jpg",
					id: 1
				},
				{
					name: "Luna Lovegood",
					hp: 180,
					attack: 25,
					baseAttack: 25,
					counterAttack: 25,
					image: "./assets/images/luna.jpg",
					id: 2
				},
				{
					name: "Colin Creevy",
					hp: 100,
					attack: 5,
					baseAttack: 5,
					counterAttack: 5,
					image: "./assets/images/colin.jpg",
					id: 3
				}
			];
			game.gameStage = 0;
			game.playerCharacter = '';
			game.enemies = [];
			game.enemyFighting = '';
			$(".character").removeClass("enemy fighting me");

		}

	};

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
		console.log(array)
		$.each(array, function(index, value){
			
			var charId = "#" + value.id;
			$(charId).find(".hp").html(value.hp);
			$(charId).find(".attack").html(value.attack);
			$(charId).find(".counter-attack").html(value.counterAttack);
		});
	}

	function moveCharacters(id) {
		id = parseInt(id);

		$("#" + id).addClass("me");

		var enemies = game.enemies;
		// for each enemy, add class
		$.each(enemies, function(key,value) {
			$("#" + value.id).addClass("enemy");
		});
	}

	function stageOpponent(id) {
		//add class to current opponent
		$("#" + game.charactersArray[id].id).addClass("fighting");
	}

	function handleCharacterClick() {
		var id = $(this).attr("id");

		if (game.gameStage === 1) {
			// to do : make sure is not selected character
			game.selectOpponent(id);
			stageOpponent(id);
			game.gameStage = 2;
		}

		if (game.gameStage === 0) {
			game.selectCharacter(id);
			moveCharacters(id);
			game.gameStage = 1;
		}
	}

	// events	

	initializeGame();

	$(".character").click( handleCharacterClick );
	$("#attack").click ( game.attack );

});

//stages: 
// 0 - select player - once done these functions turn "off"
// 1 - select opponent - once done must do battle to turn these back on
// 2 - in battle - can only attack


