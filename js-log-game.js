/**
 * @overview
 * This is a game application of ECMAScript getters and Object.defineProperty.
 * To use, copy this entire file and paste it into any page's JS console (Chrome
 * is preferred).
 *
 * @author Tim S. Long<tim@timlongcreative.com>
 * @copyright 2018 Tim S. Long
 * @license Available for use under the MIT License
 */
;(function() {
	const playConsoleHangman = function() {
	'use strict';

	const CONSOLE_DRAWING_FONT = "monospace";

	// Store an alphabet for reference
	const alphabet = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z"
	];

	// ... and a lowercase version in case users refuse to put their CAPS lock on...
	const lcAlphabet = alphabet.map(letter => letter.toLowerCase());

	// These are default answers. Add your own!
	let answers = ["HELLO WORLD","WHEEL OF FORTUNE","COMING TO AMERICA","JAVASCRIPT",
	"I HAVE A DREAM","GOOD LUCK","WELCOME TO MY HOUSE","GIVE IT A SHOT","CLASSICAL MUSIC",
	"TRICK OR TREAT","WE ALL FALL DOWN","BIG BAD WOLF","GRAND CANYON","CODING IS FUN",
	"COMMENT YOUR CODE","CALL OF DUTY","OH SAY CAN YOU SEE","NEVER GIVE UP",
	"THIS IS NOT A GAME","THIS IS ONLY A TEST","AS GOOD AS IT GETS","I PUT A SPELL ON YOU",
	"WE ARE FAMILY","UP AND RUNNING","WORLD WIDE WEB","HYPERLINK","IT HAS BEEN A LONG DAY",
	"HANG IN THERE","THERE IS ALWAYS A WAY","YOU CAN DO THIS","WHAT IN THE WORLD",
	"THIS IS AMAZING"]

	let hangmanAnswer = answers[ Math.floor(Math.random() * answers.length) ]; // Pick a random answer

	let hangmanGameStarted = false;
	let hangmanGameLost = false;
	let hangmanGameWon = false;

	/*
	// Use AJAX to pick a random answer from a list stored in our "answers" text file
	const xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if(this.readyState === 4 && this.status === 200) {	
			answers = JSON.parse( this.responseText ); // Converts the text to an array
			hangmanAnswer = answers[ Math.floor(Math.random() * answers.length) ]; // Pick a random answer

			// Now that we have our answer, we can begin.
			playHangmanGame();
		} else if(this.readyState === 4 && this.status === 404) { // Text file not found
		playHangmanGame(); // Play with default answers.
	}
	};

	xhr.onerror = function() {
		playHangmanGame(); // Play with default answers.
	};

	try {
		// Update this URL as appropriate
		xhr.open("GET", "console-hangman-answers.txt", true);
		xhr.send();
	} catch(e) {
		playHangmanGame(); // Play with default answers.
	}
	*/

	/**
	 * To add answers to the console-hangman-answers.txt and use on your
	 * own site, comment the line below, and uncomment the Ajax code above.
	*/
	playHangmanGame(); // Play with default answers.

	/**
	 * @description Begins the Hangman game, once an answer has been imported and chosen.
	 */
	function playHangmanGame() {
		if(hangmanGameStarted) {
			return;
		}

		hangmanGameStarted = true;
		let missedGuesses = 0;

		// Define getters and setters for all of the alphabet objects
		let letterDefs = [];
		let remainingLetters = JSON.parse( JSON.stringify(alphabet) );
		
		for(let i = 0; i < alphabet.length; i++) {
		
			// `let` creates a block level scope, so this closure isn't really necessary... OR IS IT?!??
			(function(index) {
				letterDefs.push({
					get() {
						if(hangmanGameLost || hangmanGameWon) {
							return;
						}

						// Clean up previous output
						console.clear();

						let thisLetter = alphabet[index]; // Set the appropriate variable 

						// Check for letter in used alphabet
						if(remainingLetters.indexOf(thisLetter) === -1) {
							console.log("You already guessed that. Go again.");
							drawHangman(missedGuesses);
							drawAnswerSpaces();
							return;
						}

						// Handle wrong letter guess
						if(hangmanAnswer.indexOf(thisLetter) === -1) {
							missedGuesses++;
							console.log("There is no letter " + thisLetter + "\n");

							if(missedGuesses === 6) {
								hangmanGameLost = true;
							}
						}

						// Remove letter from unused alphabet
						if(remainingLetters.indexOf(thisLetter) !== -1) {
							remainingLetters.splice( remainingLetters.indexOf( thisLetter ), 1);
						}

						drawHangman(missedGuesses);
						drawAnswerSpaces();
					},

					set(newVal) {
						// Nothing should happen here, we aren't setting any letters
						console.log("You cannot change the value of a letter. You just broke the game."); // Might need to fix the data now, like splice the arrays..
					}
				});
			}(i));
		}

		// Create the global letter variables and add the getter and setter methods.
		for(let i = 0; i < alphabet.length; i++) {
			(function(index) {
				Object.defineProperty(window, alphabet[index], letterDefs[index]);
				Object.defineProperty(window, lcAlphabet[index], letterDefs[index]);
			}(i));
		}

		/**
		 * Create functionality for when the user enters the correct answer
		 * (with spaces replaced by underscores (_)).
		 */
		Object.defineProperty(window, hangmanAnswer.trim().replace(/\s/g, "_"), {
			get() {
				console.clear();
				drawAnswerSpaces();
				console.log("That is correct! You win!");
				console.log("Refresh the page to play again.");
				hangmanGameWon = true;
			}
		});

		// At any point the user can type SOLVE to see the answer.
		Object.defineProperty(window, "SOLVE", {
			get() {
				console.clear();
				console.log("The correct answer was: ", hangmanAnswer.trim().replace(/\s/g, "_"));
				console.log("Game over. You lose.");
				console.log("Refresh the page to play again.");
				hangmanGameLost = true;
			}
		});

		/**
		 * @description Draws the hangman in his current form.
		 * @param {number} num - The number of missed guesses so far.
		 */
		function drawHangman(num) {
			switch(num) {
				case 0:
					console.log(`%c
 /-\\ 
|  		
|		 
|				
|		 
==== `, CONSOLE_DRAWING_FONT);
					break;
				case 1:
					console.log(`%c
 /-\\ 
|  o		
|		 
|				
|		 
==== \n\n`, CONSOLE_DRAWING_FONT);
					break;
				case 2:
					console.log(`%c
 /-\\ 
|  o	
|   /
|				
|		 
==== `, CONSOLE_DRAWING_FONT);
					break;
				case 3:
					console.log(`%c
 /-\\ 
|  o	
| _ / 
|				
|		 
==== `, CONSOLE_DRAWING_FONT);
					break;
				case 4:
					console.log(`%c
 /-\\ 
|  o	
| _ / 
|  |	
|		 
==== `, CONSOLE_DRAWING_FONT);
					break;
				case 5:
					console.log(`%c
 /-\\ 
|  o	
| _ / 
|  |	
| /	 
==== `, CONSOLE_DRAWING_FONT);
					break;
				case 6:
					console.log(`%c
 /-\\ 
|  o	
| _ / 
|  |	
| / \\	
==== `, CONSOLE_DRAWING_FONT);
					break;
			}
		}

		/**
		 * Draws the blank spaces representing letters to be guessed,
		 * as well as any correct letters already guessed.
		 */
		function drawAnswerSpaces() {
			if(hangmanGameLost) {
				console.log("Game Over. The correct answer was\n");
				console.log( hangmanAnswer.replace(/_/g, " ") );
				console.log("Refresh the webpage to play again.");
			} else {

				/**
				 * Build the current answer by checking the final answer for all
				 * alphabet letters you have not guessed yet.
				 */
				let currentAnswer = hangmanAnswer.replace(
					new RegExp( remainingLetters.join("|"), "g" ),
					"_");

				// No spaces left. You guessed all the letters!
				if(currentAnswer.indexOf("_") === -1) {
					console.log( currentAnswer );
					console.log("You win!");
					console.log("Refresh the webpage to play again.");
					hangmanGameWon = true;
				} else {
					console.log( currentAnswer );
				}
			}
		}

		// Clears all this code, if it was copied and pasted into the console
		console.clear();

		/**
		 * Writes out intro and explanation. We encourage all caps to 
		 * avoid mixed case solution attempts, like Hi_There.
		 */
		console.log(`\/** Console Hangman **\/

Guess one letter at a time. USE ALL CAPS.
If you guess the answer, replace spaces with
underscores, like HI_THERE`);

		// To get the user acclimated, we draw the initial gallows and letter spaces.
		drawHangman(0);
		drawAnswerSpaces();
	}
};

/**
 * A small text-based adventure game, fully playable in a browser's JavaScript console.
 */
const playConsoleTextAdventure = function() {
	let gameDetails = {
		x: 0,
		y: 2,
		inventory: [],

		// These are the commands you can enter into the console from the beginning of the game
		commands: ["GO", "EAST", "SOUTH", "WEST", "NORTH", "TAKE", "USE", "SPEAK", "LOOK", "INVENTORY"],

		latestCommand: "", // Used for multi-word commands (such as "GO WEST")

		// These determine what point in the (fairly linear) story the player has reached
		rockMoved: false,
		chestOpened: false,
		lionTamed: false,
		gameOver: false
	};

	/**
	 * This is what allows us to read commands from the console, without requiring the user
	 * to store them in strings with quotes, etc. We define the available commands as
	 * global variables and customize their `get` behavior to respond when the player
	 * types them.
	 */
	Object.defineProperties(window, {
		"GO": {
			get() {
				gameDetails.latestCommand = "GO";
				console.log("Go where?");
			}
		},

		"EAST": {
			get() {
				if(gameDetails.latestCommand === "GO") {

					if(gameDetails.x === 2 && gameDetails.y === 1 && !gameDetails.lionTamed) {
						console.log(
							"You cannot go in the house.\n" +
							"There is a hungry lion\n" +
							"blocking the doorway."
						);

						return;
					}

					if(gameDetails.x === 2 && gameDetails.y === 1 && !gameDetails.lionTamed) {
						console.log(
							"Wow... you just walked right off a cliff.\n" +
							"Maybe try looking next time.\n" +
							"Game Over."
						);

						return;
					}
				
					if(canGoEast(gameDetails.x, gameDetails.y)) {
						gameDetails.x++;
						console.log( getAreaText(gameDetails.x, gameDetails.y) );
					} else {
						console.log("You cannot go EAST from here.")
					}
				}
				else
					console.log("EAST is not a command.\nYou must enter GO first.");
				
				gameDetails.latestCommand = "EAST";
			}
		},
		
		"WEST": {
			get() {
				if(gameDetails.latestCommand === "GO") {
				
					if(canGoWest(gameDetails.x, gameDetails.y)) {
						gameDetails.x--;
						console.log( getAreaText(gameDetails.x, gameDetails.y) );
					} else {
						console.log("You cannot go WEST from here.")
					}
				}
				else
					console.log("WEST is not a command.\nYou must enter GO first.");

				gameDetails.latestCommand = "WEST";
			}
		},
		
		"NORTH": {
			get() {
				if(gameDetails.latestCommand === "GO") {
				
					if(canGoNorth(gameDetails.x, gameDetails.y)) {
						gameDetails.y--;
						console.log( getAreaText(gameDetails.x, gameDetails.y) );
					} else {
						console.log("You cannot go NORTH from here.")
					}
				}
				else
					console.log("NORTH is not a command.\nYou must enter GO first.");

				gameDetails.latestCommand = "NORTH";
			}
		},
		
		"SOUTH": {
			get() {
				if(gameDetails.latestCommand === "GO") {
					if(canGoSouth(gameDetails.x, gameDetails.y)) {
						gameDetails.y++;
						console.log( getAreaText(gameDetails.x, gameDetails.y) );
					} else {
						console.log("You cannot go SOUTH from here.")
					}
				}
				else
					console.log("SOUTH is not a command.\nYou must enter GO first.");

				gameDetails.latestCommand = "SOUTH";
			}
		},

		"TAKE": {
			get() {
				let item = itemAt(gameDetails.x, gameDetails.y);

				if(item) {
					console.log("You took the " + item);
					gameDetails.inventory.push(item);
					
					if(item === "CATNIP") {
						console.log("The catnip box was covering a mysterious\n" +
							"chest. But the chest is locked.");
					}
				} else {
					console.log("There is nothing here to take.");
				}

				gameDetails.latestCommand = "TAKE";
			}
		},

		"USE": {
			get() {
				if(gameDetails.inventory.length === 0) {
					console.log("You have nothing to use.\n" +
						"Type INVENTORY to view your inventory.");
				} else {
					console.log("Use what?");
				}

				gameDetails.latestCommand = "USE";
			}
		},

		"SPEAK": {
			get() {
				if(gameDetails.x === 0 && gameDetails.y === 0) {
					console.log("You say hi. The girl says:\n" + 
									"The house at the end of the road is\n" +
									"dangerous. My mom says to stay\n" +
									"away from there.");
				}
				else if(gameDetails.x === 1 && gameDetails.y === 2) {
					console.log("You ask if this kind of place\n" +
									"is deadly for frogs. He croaks.");
				}
				else if(gameDetails.x === 1 && gameDetails.y === 1) {
					console.log("You daydream about music for a\n" +
									"second and ask who the chicken's favorite\n" +
									"composer is. He says... 'bok'.");
				}
				else if(gameDetails.x === 0 && gameDetails.y === 2) {
					console.log("You call for Fluffy, but you don't\n" +
									"see him anywhere. He's missing!");
				}
				else {
					console.log("There is no one here, so... you are\n" +
									"talking to yourself. Are you feeling okay?");
				}

				gameDetails.latestCommand = "SPEAK";
			}
		},

		"LOOK": {
			get() {
				console.log(getLookText(gameDetails.x, gameDetails.y));
				gameDetails.latestCommand = "LOOK";
			}
		},

		"COMMANDS": {
			get() {
				console.log("\n", gameDetails.commands.join(",") + (gameDetails.inventory.length > 0 ? "," : "") + gameDetails.inventory.join(","), "\n\n");
				gameDetails.latestCommand = "COMMANDS";
			}
		},

		"INVENTORY": {
			get() {
				if(gameDetails.inventory.length === 0) {
					console.log("You do not have any inventory.");
				} else {
					console.log( gameDetails.inventory.join(","), "\n\n" );
				}

				gameDetails.latestCommand = "INVENTORY";
			}
		},

		"SHOVEL": {
			get() {
				if(gameDetails.latestCommand !== "USE") {
					return console.log("What do you want to do with that...?");
				}

				if(gameDetails.inventory.indexOf("SHOVEL") === -1) {
					gameDetails.latestCommand = "SHOVEL";
					return console.log("You do not have that item.");
				}

				if(gameDetails.x === 0 && gameDetails.y === 0) {
					console.log("You hit the girl over the head with\n" +
						"the shovel. Then you use it to dig her grave.\n" +
						"That wasn't very nice of you.");
				} else if(gameDetails.x === 2 && gameDetails.y === 2 && !gameDetails.rockMoved) {
					console.log("You used the shovel as a lever to\n" +
						"move the rock. The rock rolled into the river.");

					gameDetails.rockMoved = true;
				} else if(gameDetails.x === 3 && gameDetails.y === 1 && !gameDetails.floorOpened) {
					console.log("You push the shovel into the floorboard.\n" +
						"The floorboard breaks, and you fall through.\n");
					
					gameDetails.x === 4;
				} else {
					console.log("You cannot use that here.");
				}
				
				gameDetails.latestCommand = "SHOVEL";
			}
		},

		"KEY": {
			get() {
				if(gameDetails.latestCommand !== "USE") {
					return console.log("What do you want to do with that...?")
				}

				if(gameDetails.inventory.indexOf("KEY") === -1) {
					gameDetails.latestCommand = "KEY";
					return console.log("You do not have that item.");
				}

				if(gameDetails.x === 1 && gameDetails.y === 0) {
					console.log("You put the key into the chest\n" +
						"and it opens immediately. The key\n" +
						"melts as you stare in amazement. \n" +
						"You see a shiny sword in the chest.");

					gameDetails.chestOpened = true; 
					
					// Remove the key
					gameDetails.inventory.splice(gameDetails.inventory.indexOf("KEY"), 1);

					// console.log("Thank you for playing - this is still a work in progress.");
					// console.log("TO BE CONTINUED...");
				} else {
					console.log("You cannot use that here.");
				}
				
				gameDetails.latestCommand = "KEY";
			}
		},

		"SWORD": {
			get() {
				if(gameDetails.latestCommand !== "USE") {
					return console.log("What do you want to do with that...?")
				}

				if(gameDetails.inventory.indexOf("SWORD") === -1) {
					gameDetails.latestCommand = "SWORD";
					return console.log("You do not have that item.");
				}

				if(gameDetails.x === 2 && gameDetails.y === 1) {
					console.log("You swung the sword. It just\n" +
						"made the lion angry. He swallows\n" +
						"you whole. Game over.");

					endGame();
				} else if(gameDetails.x === 0 && gameDetails.y === 0) {
					console.log("You swung the sword. The\n" +
						"girl says: Don't use that near\n" +
						"living things. It might make them\n" +
						"mad...");
				} else if(gameDetails.x === 4 && gameDetails.y === 1) {
					console.log("You swung the sword. It's a\n" +
						"magic, ghost-killing sword!\n" +
						"The ghosts all disappear. Snuffy has\n" +
						"been saved! You win!\n" +
						"Game Over.");

					endGame();
				} else {
					console.log("You swung the sword. Well don't\n" +
					"you feel like a badass...");
				}

				gameDetails.latestCommand = "SWORD";
			}
		},

		"CATNIP": {
			get() {
				if(gameDetails.latestCommand !== "USE") {
					return console.log("What do you want to do with that...?")
				}

				if(gameDetails.x === 2 && gameDetails.y === 1 && !gameDetails.lionTamed) {
					console.log("You throw the catnip on the ground.\n" +
					"The lion gets excited and eats it.\n" +
					"He falls asleep near the door.");

					gameDetails.lionTamed = true;
				} else {
					console.log("You throw the catnip on the ground.\n" +
					"Nothing happens. You pick it up.");
				}
			}
		}
	});

	/**
	 * @description Checks if the player can go north at this point in the game map.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean}
	 */
	function canGoNorth(x, y) {
		if(y === 0) {
			return false;
		}

		if(x > 2) {
			return false;
		}

		return true;
	}

	/**
	 * @description Checks if the player can go south at this point in the game map.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean}
	 */
	function canGoSouth(x, y) {
		if(y === 2) {
			return false;
		}

		if(x > 2) {
			return false;
		}

		return true;
	}

	/**
	 * @description Checks if the player can go west at this point in the game map.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean}
	 */
	function canGoWest(x, y) {
		if(x === 0) {
			return false;
		}

		if(x === 3 && y !== 1) {
			return false;
		}

		return true;
	}

	/**
	 * @description Checks if the player can go east at this point in the game map.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean}
	 */
	function canGoEast(x, y) {
		if(x === 2 && y !== 1)
			return false;

		if(x === 3 && y !== 1) {
			return false;
		}

		if(x === 4) {
			return false;
		}

		return true;
	}

	/**
	 * @description Determines what item (if any) is currently available with the TAKE command.
	 * @param {number} x - The current x-coordinate.
	 * @param {number} y - The current y-coordinate.
	 * @returns {string|null}
	 */
	function itemAt(x, y) {
		if(x === 2 && y === 2) {
			if(gameDetails.inventory.indexOf("SHOVEL") === -1) {
				return "SHOVEL"; 
			} else if(gameDetails.rockMoved && gameDetails.inventory.indexOf("KEY") === -1)
				return "KEY";
		}
		
		if(x === 1 && y === 0) {
			if(gameDetails.inventory.indexOf("CATNIP") === -1)
				return "CATNIP";
		}

		if(x === 1 && y === 0) {
			if(gameDetails.chestOpened && gameDetails.inventory.indexOf("SWORD") === -1)
				return "SWORD";
		}

		return null;
	}

	/**
	 * @description Returns the introductory text shown when entering an area.
	 * @param {number} x - The area's x-coordinate.
	 * @param {number} y - The area's y-coordinate.
	 * @returns {string}
	 */
	function getAreaText(x, y) {
		switch("" + x + y) {
			case "00":
				return "You are by a pond, which is blocking\n" +
					"your path to the north. There is a girl feeding\n" +
					"bread to the ducks";
			case "01":
				return "You are by a road leading EAST. It ends\n" +
					"at a large wall to the WEST, blocking the path.";
			case "02":
				return "You are in a field. There is a wall to\n" +
							"the WEST and a river to the SOUTH.\n" +
							"There is a road a little NORTH.";
			case "10":
				if(gameDetails.inventory.indexOf("CATNIP") === -1)
					return "You are at what looks like an\n" +
						"abandoned drug store. There is\n" +
						"a box of catnip on the floor.";
				else
					return "You are at what looks like an\n" +
						"abandoned drug store. There is\n" +
						"nothing left but a locked chest.";
			case "11":
					return "You are by a road going both EAST\n" +
						"and WEST. There is a chicken crossing it\n" +
						"but you do not have time to ask him why.";
			case "12":
					return "You are by a river, which is blocking\n" +
						"the path to the SOUTH. It feels cold and\n" +
						"lonely here. All you see is a toad.";
			case "20":
					return "You are by a large oak tree. It has a\n" +
						"piece of paper posted on it.";
			case "21":
				if(gameDetails.lionTamed) {
					return "You are at the end of a road. It turns\n" +
						"into a driveway for a house to the EAST.\n" +
						"There is a lion sleeping on the porch.";
				} else {
					return "You are at the end of a road. It turns\n" +
						"into a driveway for a house to the EAST.\n" +
						"There is a lion growling on the porch!";
				}
			case "22":
				if(gameDetails.inventory.indexOf("SHOVEL") === -1)
					return "You are by a large rock. Someone left\n" +
						"a SHOVEL here. There is a cliff blocking the\n" +
						"path to the EAST, and a river to the SOUTH.";
				else
				if(!gameDetails.rockMoved)
					return "You are by a river. A cliff is blocking the\n" +
						"path to the EAST. There is a large rock here.";
				else
				if(gameDetails.rockMoved && gameDetails.inventory.indexOf("KEY") === -1)
					return "You are by a river. A cliff is blocking the\n" +
						"path to the EAST. There was a rock here once.";
				else
					return "You are by a river. A cliff is blocking the\n" +
						"path to the EAST.";
			case "31":
				return "You are in the creepy house. The only door\n" +
					"you see is the exit. You hear spooky noises.";
			case "41":
				return "There is very little light. You\n" +
					"see Fluffy in the corner, but he\n" +
					"is surrounded by ghosts!";
			default: return "Hm. Nothing remarkable here.";
		}
	}

	/**
	 * @description
	 *	 Returns the introductory text shown when entering an area.
	 *	 Similar to getAreaText, but occasionally contains extra clues.
	 *
	 * @param {number} x - The area's x-coordinate.
	 * @param {number} y - The area's y-coordinate.
	 * @returns {string}
	 */
	function getLookText(x, y) {
		switch("" + x + y) {
			case "00":
				return "You are by a pond, which is blocking\n" +
					"your path to the north. You see a girl feeding\n" +
					"bread to the ducks";
			case "01":
				return "You are by a road leading EAST. It ends\n" +
					"at a large wall to the WEST, blocking the path.\n";
			case "02":
				return "You are in a field. You see a wall to\n" +
							"the WEST and a river to the SOUTH.\n" +
							"There is a road a little NORTH.";
			case "10":
				if(gameDetails.chestOpened) {
					if(gameDetails.inventory.indexOf("SWORD") === -1) {
						return "You see a shiny sword.";
					} else {
						return "You see empty shelves and\n" +
							"an empty chest.";
					}
				} else {
					if(gameDetails.inventory.indexOf("CATNIP") === -1) {
						return "You see empty shelves and\n" +
							"a box of catnip on the floor.";
					} else {
						return "You see empty shelves and\n" +
							"a locked chest.";
					}
				}
				break;
			case "11":
					return "You see a chicken and a road.\n" +
						"The chicken looks back at you with\n" +
						"his piercing black eyes.";
				break;
			case "12":
					return "All you see is a toad. If you lick\n" +
						"him, you'll probably never find Snuffy.";
				break;
			case "20":
					return "The paper on the oak tree reads:\n" +
						"Found puppy. Come to the house at the\n" +
						"end of the road. IF YOU DARE.";
				break;
			case "21":
				if(gameDetails.lionTamed)
					return "You see a house to the EAST.\n" +
						"There is a lion sleeping by the door, but\n" +
						"you can sneak by him easily.";
				else
					return "You see a house to the EAST.\n" +
						"The doorway is being blocked by a lion!\n";
				break;
			case "22":
				if(gameDetails.inventory.indexOf("SHOVEL") === -1)
					return "You see a shovel lying against a large rock.";
				else if(!gameDetails.rockMoved)
					return "You see a large rock.";
				else if(gameDetails.rockMoved && gameDetails.inventory.indexOf("KEY") === -1)
					return "You see a key in the dirt below where the rock was.";
				else
					return "You see nothing remarkable."
				break;
			case "31":
				return "You are in the creepy house. The only door\n" +
					"you see is the exit.";
				break;
			case "41":
				return "You see Fluffy in the corner, but he\n" +
					"is surrounded by ghosts!";
				break;
			default: return "You see nothing remarkable.";
		}
	}

	/**
	 * Puts a break to game processes once game is over
	 */
	function endGame() {
		gameDetails.gameOver = true;
		console.log("Refresh page to play again.");
	}

	// Gets rid of all this code in case it was copied/pasted into the console
	console.clear();

	// Display the game intro text in the console
	console.log(
		"\/** Console Text Adventure **\/\n\n" +
		"You wake up from a long nap. \n" +
		"You are in a field where you and \n" +
		"Snuffy the Fluffy Puppy fell asleep. \n" +
		"Yawning, you want to look around.\n\n" +
		"- Type commands in ALL CAPS.\n" +
		"- Don't enter more than one word at a time.\n" +
		"- Type COMMANDS at any point to see\n" +
		"	 all available commands.\n\n"
	);
};

/**
 * A small, space shooter, pulling key input from the focused screen.
 */
const playConsoleDefender = function() {

	/**
	 * Logs to the console in a monospace font, to attempt keeping
	 * accurate spacing despite characters used.
	 * @param {string} str - The string to be logged.
	 * @param {string} styles - CSS styles applied to the sting.
	 */
	function logMono(str, styles) {
		console.log("%c" + str,
			"font-family: monospace;" + (styles || ""));
	}

	// Player class
	class Player {
		constructor(startingX, startingY) {
			this.x = startingX;
			this.y = startingY;
			this.vX = 0;
			this.vY = 0;
			this.images = ["<", ">"];
			this.bullets = [];

			// We're assuming symmetry when facing left or right
			this.width = this.images[0].length;
			this.height = this.images[0].split(/\n|\r/g).length;

			this.score = 0;
			this.died = false;
		}

		/** Handle state updates for a single animation cycle */
		update() {

			/**
			 * Check for collision with enemies - we need to check before and
			 * after x,y shifts to account for simultaneous movement, i.e.,
			 * objects "jumping over" one another in one animation cycle.
			 */
			for(let enemy of enemies) {
				if(objectsColliding(this, enemy)) {
				
					// Replace enemy and bullet with an explosion
					enemy.die();
					this.score += 100;

					explosions.push(new Explosion(this.x, this.y));

					this.die();
					return;
				}
			}
		
			// Keep player 1 within bounds
			/*
			if(this.x + this.vX >= 0 && this.x + this.vX < CONSOLE_SCREEN_WIDTH) {
				this.x += this.vX;
			}

			if(this.y + this.vY >= 0 && this.y + this.vY < CONSOLE_SCREEN_HEIGHT) {
				this.y += this.vY;
			}
			*/

			/**
			 * Update with wrap-around
			 */

			this.x += this.vX;
			this.y += this.vY;

			// Horizontal wrap-aroun
			if(this.x < 0) {
				this.x = CONSOLE_SCREEN_WIDTH - this.width;
			}
			else if(this.x >= CONSOLE_SCREEN_WIDTH) {
				this.x = 0;
			}

			// Vertical wrap-around
			if(this.y < 0) {
				this.y = CONSOLE_SCREEN_HEIGHT - this.height;
			}
			else if(this.y >= CONSOLE_SCREEN_HEIGHT) {
				this.y = 0;
			}
			
			/**
			 * Check for collision with enemies - we need to check before and
			 * after x,y shifts to account for simultaneous movement, i.e.,
			 * objects "jumping over" one another in one animation cycle.
			 */
			for(let enemy of enemies) {
				if(objectsColliding(this, enemy)) {
				
					// Replace enemy and bullet with an explosion
					enemy.die();
					this.score += 100;

					explosions.push(new Explosion(this.x, this.y));

					this.die();
					return;
				}
			}
		}

		/** Create a new bullet when player shoots. */
		shootBullet() {
			if(gameOver || paused) {
				return;

			}

			if(this.vX < 0) {
				this.bullets.push(new PlayerBullet(this.x - this.width * 2, this.y, this.vX, this.vY))
			} else {
				this.bullets.push(new PlayerBullet(this.x + this.width * 2, this.y, this.vX, this.vY))
			}

			// Call Game's drawing method
			draw(); // Ensures that we draw the currently created bullet
		}

		die() {
			this.died = true;
			endGame();
		}
	};

	/** Player bullet class */
	class PlayerBullet {
		
		/**
		 * Create PlayerBullet instance.
		 * @param {number} passedX - The x-coordinate where the bullet starts.
		 * @param {number} passedX - The y-coordinate where the bullet starts.
		 * @param {number} passedX - The x velocity for the bullet.
		 * @param {number} passedX - The y velocity for the bullet.
		 */
		constructor(passedX, passedY, passedVX, passedVY) {
			this.x = passedX;
			this.y = passedY;
			this.vX = passedVX;

			if(this.vX === 0) { // Don't want the bullet to sit still
				if(player1.vX >= 0) {
					this.vX = 1;
				} else {
					this.vX = -1;
				}
			}

			// this.vY = passedVY; // Makes bullet follow player
			this.vY = 0; // Makes bullet keep moving horizontally
			this.image = "-";
			this.width = this.image.length;
			this.height = this.image.split(/\n|\r/g).length;
		}

		/** Updates the bullet's position state variables. */
		update() {
			// Check for collision with enemies
			for(let enemy of enemies) {
				if(objectsColliding(this, enemy)) {
				
					// Replace enemy and bullet with an explosion
					enemy.die();
					player1.score += 100;

					explosions.push(new Explosion(this.x, this.y));

					this.die();
					return;
				}
			}

			this.x += this.vX;
			this.y += this.vY;

			/**
			 * Check for collision with enemies - we need to check before and
			 * after x,y shifts to account for simultaneous movement, i.e.,
			 * objects "jumping over" one another in one animation cycle.
			 */
			for(let enemy of enemies) {
				if(objectsColliding(this, enemy)) {
				
					// Replace enemy and bullet with an explosion
					enemy.die();
					player1.score += 100;

					explosions.push(new Explosion(this.x, this.y));

					this.die();
					return;
				}
			}

			// Bullet leaves the screen
			if(this.x < 0 || this.y < 0 || this.x >= CONSOLE_SCREEN_WIDTH || this.y >= CONSOLE_SCREEN_HEIGHT) {
				this.die();
			}
		}

		draw() {
			// return this.image;
		}

		/** Kills the bullet (removes from the game). */
		die() {
			player1.bullets.splice(player1.bullets.indexOf(this), 1);
		}
	}

	/** Enemy class */
	class Enemy {

		/**
		 * Create Enemy instance.
		 * @param {number} passedX - The x-coordinate where the enemy starts.
		 * @param {number} passedX - The y-coordinate where the enemy starts.
		 * @param {number} passedX - The x velocity for the enemy.
		 * @param {number} passedX - The y velocity for the enemy.
		 */
		constructor(startingX, startingY, startingVX, startingVY) {
			this.x = startingX;
			this.y = startingY;
			this.vX = startingVX;
			this.vY = startingVY;
			this.images = ["{", "}"];

			// We're assuming symmetry when facing left or right
			this.width = this.images[0].length;
			this.height = this.images[0].split(/\n|\r/g).length;
		}

		update() {
			/**
			 * Update with wrap-around
			 */

			this.x += this.vX;
			this.y += this.vY;

			// Horizontal wrap-aroun
			if(this.x < 0) {
				this.x = CONSOLE_SCREEN_WIDTH - 1 - this.width;
			}
			else if(this.x >= CONSOLE_SCREEN_WIDTH) {
				this.x = 0;
			}

			// Vertical wrap-around
			if(this.y < 0) {
				this.y = CONSOLE_SCREEN_HEIGHT - 1 - this.height;
			}
			else if(this.y >= CONSOLE_SCREEN_HEIGHT) {
				this.y = 0;
			}
		}
		
		draw() {
			// return this.image;
		}

		/** Kills the bullet (removes from the game). */
		die() {
			enemies.splice(enemies.indexOf(this), 1);

			if(enemies.length === 0) {
				endGame();
			}
		}
	}

	/** Class that manages explosion animation after enemy death */
	class Explosion {
		
		/**
		 * Creates an Explosion instance beginning at coordinates (x, y).
		 */
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.time = 0;
			this.MAX_TIME = 3;
			this.explosionSparks = [
				new ExplosionSpark(x, y, 0, -1),
				new ExplosionSpark(x, y, 0, 1)
			];
		}

		update() {
			this.time++;

			for(let spark of this.explosionSparks) {
				spark.update();
			}

			if(this.time >= this.MAX_TIME) {
				this.die();
			}
		}

		/** Kills the explosion instance (removes from the game). */
		die() {
			explosions.splice(explosions.indexOf(this), 1);
		}
	}

	/** Single spark of an overall Explosion */
	class ExplosionSpark {
		
		/**
		 * Create ExplosionSpark instance.
		 * @param {number} passedX - The x-coordinate where the spark starts.
		 * @param {number} passedX - The y-coordinate where the spark starts.
		 * @param {number} passedX - The x velocity for the spark.
		 * @param {number} passedX - The y velocity for the spark.
		 */
		constructor(x, y, vX, vY) {
			this.x = x;
			this.y = y;
			this.vX = vX;
			this.vY = vY;

			this.image = "*";
			this.width = this.image.length;
			this.height = this.image.split(/\n|\r/g).length;
		}

		update() {
			this.x += this.vX;
			this.y += this.vY;
		}
	}

	/**
	 * Set "screen" dimensions to be used in console output.
	 * 
	 * Note: code can be updated so that these are created dynamically, by testing
	 * window.outerHeight - window.innerHeight and window.outerWidth - window.innerWidth
	 */
	const CONSOLE_SCREEN_WIDTH = 100;
	const CONSOLE_SCREEN_HEIGHT = 15;
	const CONSOLE_SCREEN_AREA = CONSOLE_SCREEN_WIDTH * CONSOLE_SCREEN_HEIGHT;

	let gameStarted = false;
	let gameOver = false;
	let gameOverTime = 0;
	const GAME_OVER_TIME_MAX = 3;

	let paused = false;
	let player1 = new Player(0, 0);

	let enemies = [];
	let numEnemies = CONSOLE_SCREEN_HEIGHT * 2;

	for(let i = 1; i < CONSOLE_SCREEN_HEIGHT; i++) {
		let firstRand = Math.floor(Math.random() * CONSOLE_SCREEN_WIDTH),
			secondRand = 0;

		enemies.push(new Enemy(
				firstRand,
				i,
				(Math.random() < 0.5 ? -1 : 1),
				0
			));

		do {
			secondRand = Math.floor(Math.random() * CONSOLE_SCREEN_WIDTH);
		} while(secondRand === firstRand) // Get unique x-coordinate for other enemy on this row

		enemies.push(new Enemy(
				secondRand,
				i,
				(Math.random() < 0.5 ? -1 : 1),
				0
			));
	}

	let explosions = [];

	/**
	 * Create a clear landscape and store as a constant for building scenes
	 */

	let canvasConstruction = "";
	let singleLineOfCanvas = new Array(CONSOLE_SCREEN_WIDTH).fill(" ").join("");

	for(var i = 1; i < CONSOLE_SCREEN_HEIGHT; i++) {
		canvasConstruction += singleLineOfCanvas + "\n";
	}

	const CANVAS = canvasConstruction;

	// End the current game, which will stop most updates
	const endGame = function() {
		if(!gameOver) {
			gameOver = true;
		}
	};

	// Handle variable state updates
	const update = function() {

		for(let bullet of player1.bullets) {
			bullet.update();
		}

		for(let enemy of enemies) {
			enemy.update();
		}

		for(let explosion of explosions) {
			explosion.update();
		}

		player1.update();
	};

	// Handle "painting" to the console
	const draw = function() {
		console.clear(); // Clear previous animation to maintain same position in console

		var scene = CANVAS;

		if(!player1.died) {
			scene = drawObjectIntoScene(scene, player1, (player1.vX < 0 ? 0: 1));
		}

		for(let bullet of player1.bullets) {
			scene = drawObjectIntoScene(scene, bullet);
		}

		for(let enemy of enemies) {
			scene = drawObjectIntoScene(scene, enemy, (enemy.vX < 0 ? 0: 1));
		}

		for(let explosion of explosions) {
			for(let spark of explosion.explosionSparks) {
				scene = drawObjectIntoScene(scene, spark);
			}
		}

		scene += "\n" + player1.score + "	";

		if(!gameStarted) {
			scene += "* CONSOLE DEFENDER * Click webpage to gain keyboard focus. Then press any key.";
		}
		else if(gameOver) {
			scene += "* GAME OVER *";
		}
		else if(paused) {
			scene += "* PAUSED *";
		}

		// Draw to the "screen"
		logMono(scene);
	};

	/**
	 * Adds a given object into a predefined canvas string. Note, we're
	 * assuming that each object is of height 1, for simplicity.
	 * @param {string} canvasStr - The "canvas" we are drawing into.
	 * @param {Object} obj - An object whose image string is to be drawn.
	 * @param {number} [imageIdx] - If present, indicates that obj
	 *	 contains an images array, and image at index imageIdx should be drawn.
	 */
	const drawObjectIntoScene = function(canvasStr, obj, imageIdx) {
		let startingBuffer = obj.y * (CONSOLE_SCREEN_WIDTH + 1) // top buffer - note the +1 for \n characters
				+ obj.x; // left buffer

		// Don't try to draw objects that are not fully onscreen
		if(obj.x < 0 || obj.x + obj.width >= CONSOLE_SCREEN_WIDTH || obj.y < 0 || obj.y + obj.height >= CONSOLE_SCREEN_HEIGHT) {
			return canvasStr;
		}

		if(typeof imageIdx !== "undefined") { // Object uses multiple images, like a player ship
			canvasStr = canvasStr.substring(0, startingBuffer) +
				obj.images[imageIdx] + canvasStr.substring(startingBuffer +
				obj.width);
		} else { // Object uses a single image, like a bullet
			canvasStr = canvasStr.substring(0, startingBuffer) +
				obj.image + canvasStr.substring(startingBuffer +
				obj.width);
		}

		return canvasStr;
	};

	// Handle single update cycle
	const updateAndDraw = function() {
		if(!paused && !gameOver) {
			update();
			draw();
			setTimeout(updateAndDraw, 100);
		}

		// If player has died, we only continue the explosion animations
		if(gameOver && gameOverTime < GAME_OVER_TIME_MAX) {
			gameOverTime++;
			
			for(let explosion of explosions) {
				explosion.update();
			}

			draw();
		}
	};

	// Toggle game's paused/unpaused state
	const togglePause = function() {
		paused = !paused;

		if(!paused) {
			updateAndDraw();
		} else {
			draw(); // Basically to write "* PAUSED *"
		}
	};

	// Detects basic collision between two game objects
	const objectsColliding = function(obj1, obj2) {

		// Note: this is assuming every object is of size 1x1
		// @todo Generalize for all rectangles
		if(obj1.x === obj2.x && obj1.y === obj2.y) {
			return true;
		}

		return false;
	};

	// Set up user input
	const bindHandlers = function() {
		window.addEventListener("keydown", function(e) {
		
			// We set controls similar to Defender, where you are essentially always moving horizontally
			switch(e.keyCode) {
				case 37: // Left
					player1.vX = -1;
					break;
				case 39: // Right
					player1.vX = 1;
					break;
				case 38: // Up
					if(player1.vY === 0) {
						player1.vY = -1;
					} else {
						player1.vY = 0;
					}
					break;
				case 40: // Down
					if(player1.vY === 0) {
						player1.vY = 1;
					} else {
						player1.vY = 0;
					}
					break;
				case 32: // Space
					togglePause();
					break;
				case 13: // Enter
					player1.shootBullet();
					break;
			}
			
			if(!gameStarted) {
				startGame();
			}
		}, false);
	};

	// Prepare game utilities
	const initializeGame = function() {
		bindHandlers();
		console.clear();
		draw();
	};

	// Begin actual game processes
	const startGame = function() {
		gameStarted = true;
		updateAndDraw();
	};

	// Set things up without starting the game
	initializeGame();
};

// Define ways to trigger game start from the console
Object.defineProperty(window, "HANGMAN", {
	get() {
		playConsoleHangman();
	}
});

Object.defineProperty(window, "ADVENTURE", {
	get() {
		playConsoleTextAdventure();
	}
});

Object.defineProperty(window, "DEFENDER", {
	get() {
		playConsoleDefender();
	}
});

console.clear();
console.log("Type the name of the game you want to play (in ALL CAPS), directly into the console, and press Enter. Game choices are:" +
"\nHANGMAN\nADVENTURE\nDEFENDER");

} ());