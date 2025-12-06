import GameManager from "./gameManager";
import interact from "interactjs";

let gameManager = null;
const gameStateMessage = document.getElementById("game-state-message");

function renderPlayerBoard(boardSize) {
	const playerBoard = document.getElementById("player-board");

	playerBoard.style.gridTemplateColumns = `repeat(${boardSize + 1}, auto)`;

	// Empty top left corner
	const corner = document.createElement("div");
	playerBoard.appendChild(corner);

	// Draw column labels
	for (let i = 0; i < boardSize; i++) {
		const firstChar = "A";
		const charLabel = String.fromCharCode(firstChar.charCodeAt(0) + i);

		const col = document.createElement("div");
		col.className =
			"text-center text-sm sm:text-base text-gray-200 mb-2 select-none";
		col.textContent = charLabel;
		playerBoard.appendChild(col);
	}

	for (let i = 0; i < boardSize; i++) {
		// Draw row labels
		const row = document.createElement("div");
		row.className =
			"text-gray-200 text-sm sm:text-base content-center mr-2 select-none";
		row.textContent = i + 1;
		playerBoard.appendChild(row);
		for (let j = 0; j < boardSize; j++) {
			const playerSquare = document.createElement("div");
			playerSquare.setAttribute("data-x", j);
			playerSquare.setAttribute("data-y", i);
			playerSquare.setAttribute("data-ship", "false");
			playerSquare.classList.add("player-square");
			playerBoard.appendChild(playerSquare);
		}
	}

	const playerName = document.getElementById("player-current-name");

	playerName.textContent = gameManager.playerName;
}

function renderEnemyBoard(boardSize) {
	const enemyDiv = document.createElement("div");
	const playersDiv = document.getElementById("players");
	enemyDiv.id = "enemy";
	enemyDiv.className = "flex flex-col gap-3 py-2 xl:py-0";
	enemyDiv.innerHTML = `
        <div class="flex justify-around items-center" id="enemy-stats">
            <h3 class="text-center text-sm text-gray-300 select-none">
                Missed Attacks: <span id="enemy-missed-attacks">0</span>
            </h3>
            <h3 id="enemy-name" class="text-center text-2xl xl:text-3xl font-bold text-gray-200 underline"
                >Opponent</h3
            >
            <h3 class="text-center text-sm text-gray-300 select-none">
                Downed Ships: <span id="enemy-downed-ships">0</span>
            </h3>
        </div>
        <div
			class="grid place-content-center gap-px"
			id="enemy-board">
        </div>
        <div class="flex flex-col gap-1 select-none" id="enemy-score">
		</div>
    `;

	playersDiv.appendChild(enemyDiv);

	const enemyBoard = document.getElementById("enemy-board");
	enemyBoard.style.gridTemplateColumns = `repeat(${boardSize + 1}, auto)`;

	// Empty top left corner
	const corner = document.createElement("div");
	enemyBoard.appendChild(corner);

	// Draw column labels
	for (let i = 0; i < boardSize; i++) {
		const firstChar = "A";
		const charLabel = String.fromCharCode(firstChar.charCodeAt(0) + i);

		const col = document.createElement("div");
		col.className =
			"text-center text-sm sm:text-base text-gray-200 mb-2 select-none";
		col.textContent = charLabel;
		enemyBoard.appendChild(col);
	}

	for (let i = 0; i < boardSize; i++) {
		// Draw row labels
		const row = document.createElement("div");
		row.className =
			"text-gray-200 text-sm sm:text-base content-center mr-2 select-none";
		row.textContent = i + 1;
		enemyBoard.appendChild(row);
		for (let j = 0; j < boardSize; j++) {
			const enemySquare = document.createElement("div");
			enemySquare.setAttribute("data-x", j);
			enemySquare.setAttribute("data-y", i);
			enemySquare.setAttribute("data-ship", "false");
			enemySquare.classList.add("enemy-square");
			enemyBoard.appendChild(enemySquare);
		}
	}
}

// Get user info and game settings, then start the game
const gameSettingsForm = document.getElementById("game-settings");

function startGamePlan(e) {
	e.preventDefault();
	if (!gameSettingsForm.checkValidity()) {
		return;
	}

	const playerNameInput = document.getElementById("player-name");
	const playerName = playerNameInput.value;

	const boardSizeInput = document.getElementById("board-size");
	const boardSize = Number(boardSizeInput.value);

	const numShipsInput = document.getElementById("num-ships");
	const numShips = Number(numShipsInput.value);

	const maxMissesInput = document.getElementById("max-misses");
	const maxMisses = Number(maxMissesInput.value);

	gameManager = new GameManager(boardSize, numShips, maxMisses);
	gameManager.initializePlayers(playerName);
	gameManager.initializeComputerShips();
	toggleGameBoards();
	renderPlayerBoard(boardSize);
	renderAddShips();
	dragAndDropShips();
	addShipMenuHandlers();
	updateAddShipsCounter();
	renderAddShipsMessage();
}

export default function initializeApp() {
	const gameSettingsForm = document.getElementById("game-settings");
	gameSettingsForm.addEventListener("submit", startGamePlan);
}

function toggleGameBoards() {
	const gameDiv = document.getElementById("game");
	const mainMenuDiv = document.getElementById("main-menu");

	mainMenuDiv.classList.toggle("flex");
	mainMenuDiv.classList.toggle("hidden");
	gameDiv.classList.toggle("hidden");
	gameDiv.classList.toggle("flex");
}

function dragAndDropShips() {
	// const ships = document.querySelectorAll(".ship");

	// ships.forEach((ship) => {
	// 	ship.addEventListener("dragstart", (e) => {
	// 		e.dataTransfer.setData("length", e.target.getAttribute("data-length"));
	// 		e.dataTransfer.setData("orient", e.target.getAttribute("data-orient"));
	// 	});
	// });

	interact(".ship-select").draggable({
		autoScroll: true,
		listeners: {
			move(event) {
				const target = event.target;
				const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
				const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
				const orient = target.getAttribute("data-orient");

				if (orient === "horizontal") {
					target.style.transform = `translate(${x}px, ${y}px)`;
				} else {
					target.style.transform = `translate(${y}px, ${-x}px)`;
				}
				target.setAttribute("data-x", x);
				target.setAttribute("data-y", y);
			},
			end(event) {
				event.target.style.transform = "";
				event.target.removeAttribute("data-x");
				event.target.removeAttribute("data-y");
			},
		},
	});

	interact(".player-square").dropzone({
		accept: ".ship-select",
		overlap: "pointer",
		ondrop: (event) => {
			const ship = event.relatedTarget;
			const length = Number(ship.getAttribute("data-length"));
			const orient = ship.getAttribute("data-orient");
			const x = Number(event.target.getAttribute("data-x"));
			const y = Number(event.target.getAttribute("data-y"));

			gameManager.placePlayerShip(length, orient, x, y);
			updatePlayerSquares();
			updateAddShipsCounter();

			ship.style.transform = "";
			ship.removeAttribute("data-x");
			ship.removeAttribute("data-y");
		},
	});

	// const playerSquares = document.querySelectorAll(".player-square");

	// playerSquares.forEach((square) => {
	// 	square.addEventListener("dragover", (e) => {
	// 		e.preventDefault();
	// 	});
	// 	square.addEventListener("drop", (e) => {
	// 		e.preventDefault();

	// 		const length = e.dataTransfer.getData("length");
	// 		const orient = e.dataTransfer.getData("orient");

	// 		const x = Number(square.getAttribute("data-x"));
	// 		const y = Number(square.getAttribute("data-y"));

	// 		gameManager.placePlayerShip(length, orient, x, y);
	// 		updatePlayerSquares();
	// 		updateAddShipsCounter();
	// 	});
	// });
}

function updatePlayerSquares() {
	const playerSquares = document.querySelectorAll(".player-square");

	playerSquares.forEach((square) => {
		const x = Number(square.getAttribute("data-x"));
		const y = Number(square.getAttribute("data-y"));

		if (gameManager.getPlayerSquare(x, y) !== null) {
			square.classList.add("ship");
			square.setAttribute("data-ship", "true");
		} else {
			square.classList.remove("ship");
			square.setAttribute("data-ship", "false");
		}
	});
}

function updateAddShipsCounter() {
	const counter = document.getElementById("add-ships-left");
	const shipsLeft = gameManager.numShips - gameManager.playerShipsNum;
	counter.textContent = shipsLeft;
}

function renderAddShips() {
	const addShipsDiv = document.createElement("div");
	addShipsDiv.id = "ships-selection";
	addShipsDiv.className =
		"mx-auto p-4 flex flex-col gap-8 rounded-2xl text-gray-200";
	addShipsDiv.innerHTML = `
                    <h3 class="text-center text-2xl xl:text-3xl font-bold underline"
                        >Add Ships (<span id="add-ships-left"></span> ships left)</h3
                    >
                    <div
                        class="bg-zinc-200 h-70 sm:h-88 xl:h-full p-4 grid grid-cols-2 items-center justify-center rounded-2xl shadow-2xl"
                        id="ships-menu">
                        <div class="flex gap-2" id="ship-1-opt">
                            <button
                                class="rotate-button cursor-pointer text-3xl text-gray-600 hover:text-gray-800"
                                ><span class="icon-[mdi--rotate-counter-clockwise]"></span
                            ></button>
                            <div
                                data-orient="horizontal"
                                data-length="1"
                                class="ship-select flex touch-none"
                                id="ship-1">
                                <div class="ship-preview"></div>
                            </div>
                        </div>
                        <div class="flex gap-2" id="ship-2-opt">
                            <button
                                class="rotate-button cursor-pointer text-3xl text-gray-600 hover:text-gray-800"
                                ><span class="icon-[mdi--rotate-counter-clockwise]"></span
                            ></button>
                            <div
                                data-orient="horizontal"
                                data-length="2"
                                class="ship-select flex touch-none"
                                id="ship-2">
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                            </div>
                        </div>
                        <div class="flex gap-2" id="ship-3-opt">
                            <button
                                class="rotate-button cursor-pointer text-3xl text-gray-600 hover:text-gray-800"
                                ><span class="icon-[mdi--rotate-counter-clockwise]"></span
                            ></button>
                            <div
                                data-orient="horizontal"
                                data-length="3"
                                class="ship-select flex touch-none"
                                id="ship-3">
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                            </div>
                        </div>
                        <div class="flex gap-2" id="ship-4-opt">
                            <button
                                class="rotate-button cursor-pointer text-3xl text-gray-600 hover:text-gray-800"
                                ><span class="icon-[mdi--rotate-counter-clockwise]"></span
                            ></button>
                            <div
                                data-orient="horizontal"
                                data-length="4"
                                class="ship-select flex touch-none"
                                id="ship-4">
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                            </div>
                        </div>
                    </div>
                    <div id="ship-menu-buttons" class="flex justify-center gap-4">
                        <button id="ship-menu-start" class="bg-green-800 rounded-full px-4 py-2 hover:bg-green-700 border cursor-pointer text-sm xl:text-base" id="start-match">Start Game</button>
                        <button id="ship-menu-randomize" class="bg-indigo-800 rounded-full px-4 py-2 hover:bg-indigo-700 border cursor-pointer text-sm xl:text-base" id="randomize-ships">Randomize Ships</button>
                        <button id="ship-menu-reset" class="bg-red-800 rounded-full px-4 py-2 hover:bg-red-700 border cursor-pointer text-sm xl:text-base" id="reset-board">Reset Board</button>
                    </div>
                    `;
	const playersDiv = document.getElementById("players");
	playersDiv.appendChild(addShipsDiv);
}

function removeAddShips() {
	const addShipsDiv = document.getElementById("ships-selection");
	addShipsDiv.remove();
}

function addRotateButtonsHandlers() {
	const rotateButtons = document.querySelectorAll(".rotate-button");

	rotateButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const ship = button.nextElementSibling;
			ship.classList.toggle("rotate-90");
			if (ship.getAttribute("data-orient") === "horizontal") {
				ship.setAttribute("data-orient", "vertical");
			} else {
				ship.setAttribute("data-orient", "horizontal");
			}
		});
	});
}

function startGame() {
	if (gameManager.playerShipsNum < gameManager.numShips) {
		const missingShips = gameManager.numShips - gameManager.playerShipsNum;
		renderAddShipsWarnMessage(missingShips);
		setTimeout(() => {
			renderAddShipsMessage();
		}, 3000);
		return;
	}
	removeAddShips();
	renderEnemyBoard(gameManager.boardSize);
	renderPlayerScore();
	renderEnemyScore();
	addEnemySquaresHandlers();
	renderPlayerTurnMessage();
}

function renderAddShipsWarnMessage(missingShips) {
	gameStateMessage.textContent = `Insufficient number of ships\nPlease add ${missingShips} more ships`;
}

function addStartGameHandler() {
	const startButton = document.getElementById("ship-menu-start");

	startButton.addEventListener("click", startGame);
}

function addRandomizeShipsHandler() {
	const randomizeButton = document.getElementById("ship-menu-randomize");

	randomizeButton.addEventListener("click", () => {
		gameManager.resetPlayerBoard();
		gameManager.randomizePlayerShips();
		updatePlayerSquares();
		updateAddShipsCounter();
	});
}

function addResetBoardHandler() {
	const resetButton = document.getElementById("ship-menu-reset");

	resetButton.addEventListener("click", () => {
		gameManager.resetPlayerBoard();
		updatePlayerSquares();
		updateAddShipsCounter();
	});
}

function addShipMenuHandlers() {
	addRotateButtonsHandlers();
	addStartGameHandler();
	addRandomizeShipsHandler();
	addResetBoardHandler();
}

function renderAddShipsMessage() {
	gameStateMessage.textContent = "Add your ships";
}

function renderPlayerScore() {
	const playerScore = document.getElementById("player-score");
	playerScore.innerHTML = `
    <h4 class="text-center text-lg xl:text-xl font-bold text-gray-300 underline">Score: <span id="player-score-num">0</span>
    </h4>
    `;
}

function renderEnemyScore() {
	const enemyScore = document.getElementById("enemy-score");
	enemyScore.innerHTML = `
    <h4 class="text-center text-lg xl:text-xl font-bold text-gray-300 underline">Score: <span id="enemy-score-num">0</span>
    </h4>
    `;
}

function addEnemySquaresHandlers() {
	const enemySquares = document.querySelectorAll(".enemy-square");

	enemySquares.forEach((square) => {
		square.addEventListener("click", () => {
			if (!gameManager.isPlayerTurn) return;

			const x = Number(square.getAttribute("data-x"));
			const y = Number(square.getAttribute("data-y"));

			const att = gameManager.makePlayerMove(x, y);

			if (att === null) {
				return;
			}

			gameManager.isPlayerTurn = false;

			if (att.ship) {
				markShipHitSquare(square);
				renderPlayerHitMessage(att);
			} else {
				markEmptySquare(square);
				renderPlayerMissMessage(att);
			}
			updateStats();
			setTimeout(() => {
				if (gameManager.isGameOver) {
					renderGameOver();
					return;
				}
				startComputerTurn();
			}, 3000);
		});
	});
}

async function startComputerTurn() {
	renderEnemyTurnMessage();
	let att;
	const attPromise = new Promise((resolve, reject) => {
		setTimeout(() => {
			const att = gameManager.makeComputerMove();
			if (att) {
				resolve(att);
			} else {
				reject("Unable to make a computer move.");
			}
		}, 2000);
	});

	try {
		att = await attPromise;
	} catch (error) {
		console.error(error);
	}

	const playerSquare = document.querySelector(
		`[data-x="${att.x}"][data-y="${att.y}"]`
	);
	if (att.ship) {
		markShipHitSquare(playerSquare);
		renderEnemyHitMessage(att);
	} else {
		markEmptySquare(playerSquare);
		renderEnemyMissMessage(att);
	}

	updateStats();

	setTimeout(() => {
		if (gameManager.isGameOver) {
			renderGameOver();
			return;
		}
		renderPlayerTurnMessage();
		gameManager.isPlayerTurn = true;
	}, 3000);
}

function markShipHitSquare(square) {
	square.classList.add("hit");
}

function markEmptySquare(square) {
	square.classList.add("miss");
}

function renderPlayerTurnMessage() {
	const playerName = document.getElementById("player-current-name");
	const opponentName = document.getElementById("enemy-name");
	playerName.classList.remove("text-gray-200");
	playerName.classList.add(
		"text-green-500",
		"font-bold",
		"before:content-['>']"
	);
	opponentName.classList.add("text-gray-200");
	opponentName.classList.remove(
		"text-red-500",
		"font-bold",
		"before:content-['>']"
	);
	gameStateMessage.innerHTML =
		"It's your turn<br>Make a move on the opponent's board";
}

function renderEnemyTurnMessage() {
	const playerName = document.getElementById("player-current-name");
	const opponentName = document.getElementById("enemy-name");
	playerName.classList.remove(
		"text-green-500",
		"font-bold",
		"before:content-['>']"
	);
	playerName.classList.add("text-gray-200");
	opponentName.classList.add(
		"text-red-500",
		"font-bold",
		"before:content-['>']"
	);
	opponentName.classList.remove("text-gray-200");
	gameStateMessage.innerHTML =
		"It's your opponent's turn<br>Wait for your opponent to make a move";
}

function getBoardCoordinate(attack) {
	const x = attack.x;
	const letter = String.fromCharCode("A".charCodeAt(0) + x);
	return `${letter}${attack.y + 1}`;
}

function renderPlayerHitMessage(attack) {
	gameStateMessage.textContent = `You have hit a ship on ${getBoardCoordinate(attack)}`;
	if (attack.ship.isSunk) {
		gameStateMessage.innerHTML += "<br>You have sunk a ship!";
	}
}

function renderPlayerMissMessage(attack) {
	gameStateMessage.textContent = `Your attack on ${getBoardCoordinate(attack)} has missed!`;
}

function renderEnemyHitMessage(attack) {
	gameStateMessage.textContent = `The enemy has hit your ship on ${getBoardCoordinate(attack)}`;
	if (attack.ship.isSunk) {
		gameStateMessage.innerHTML += "<br>The enemy has sunk your ship!";
	}
}

function renderEnemyMissMessage(attack) {
	gameStateMessage.textContent = `The enemy's attack on ${getBoardCoordinate(attack)} has missed`;
}

function updateStats() {
	const playerDestroyedShips = document.getElementById("player-downed-ships");
	playerDestroyedShips.textContent = gameManager.playerDestroyedShips;

	const playerMissedAttacks = document.getElementById("player-missed-attacks");
	playerMissedAttacks.textContent = gameManager.playerMissedAttacks;

	const playerScore = document.getElementById("player-score-num");
	playerScore.textContent = gameManager.playerScore;

	const enemyDestroyedShips = document.getElementById("enemy-downed-ships");
	enemyDestroyedShips.textContent = gameManager.enemyDestroyedShips;

	const enemyMissedAttacks = document.getElementById("enemy-missed-attacks");
	enemyMissedAttacks.textContent = gameManager.enemyMissedAttacks;

	const enemyScore = document.getElementById("enemy-score-num");
	enemyScore.textContent = gameManager.enemyScore;
}

function renderGameOver() {
	const winner = gameManager.determineWinner();
	let gameOverMessage = "Game Over!";
	if (winner === gameManager.player) {
		gameStateMessage.classList.remove("text-slate-200");
		gameStateMessage.classList.add("text-green-500");
		gameStateMessage.innerHTML = gameOverMessage + "<br>You have won!";
	} else if (winner === gameManager.compPlayer) {
		gameStateMessage.classList.remove("text-slate-200");
		gameStateMessage.classList.add("text-red-500");
		gameStateMessage.innerHTML =
			gameOverMessage + "<br>You have lost. Better luck next time!";
	} else {
		gameStateMessage.innerHTML = gameOverMessage + "<br>It's a tie!";
	}
}
