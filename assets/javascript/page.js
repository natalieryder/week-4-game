$(document).ready(function(){
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

function updateStats(characters) {
	// console.log(array)
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
	id = parseInt(id);
	$("#" + id).addClass("me");
	var enemies = game.enemies;
	// for each enemy, add class
	$.each(enemies, function(key,value) {
		$("#" + value.id).addClass("enemy");
	});
}

function stageOpponent() {
	// finds the div for the current enemy and styles it
	$("#" + game.enemyFighting.id).addClass("fighting");
	$("#message").empty();
}
function showMessage(message) {
	$("#message").html(message);
}
function showWinGame() {
	$("#message").append("<br> You defeated everyone!!");
	$("#reset").addClass("show");
	$("#attack").addClass("hide");
}
function showWinBattle(opponent) {
	$("#message").append("<br>You defeated " + opponent + ". Pick your next opponent!");
}
function resetDisplay() {
	$("#" + game.enemyFighting.id).show();
	$(".character").removeClass("enemy defeated fighting me");
	$("#reset").removeClass("show");
	$("#attack").removeClass("hide");
	$("#message").empty();
}

function handleCharacterClick() {
	var id = $(this).attr("id");
	id = parseInt(id);
	if (game.gameStage === 1) {
		// make sure is not selected character
		if ( game.playerCharacter.id === id ) {
			console.log("you can't fight yourself");
			return false;
		}

		// sets the opponent
		game.selectOpponent(id);
		stageOpponent();
		game.gameStage = 2;
	}

	if (game.gameStage === 0) {
		game.selectCharacter(id);
		moveCharacters(id);
		game.gameStage = 1;
	}
}
function handleAttack() {
	game.attack();
}
function handleReset() {
	game.reset();
	updateStats(game.charactersArray);
}
// events	

initializeGame();


$(".character").click( handleCharacterClick );
$("#attack").click( handleAttack );
$("#reset").click( handleReset );
});
