import GameManager from "./gameManager";
import interact from "interactjs";

let gameManager = null;
let timeoutID;
const gameStateMessage = document.getElementById("game-state-message");
const gameSettingsForm = document.getElementById("game-settings");
let isMoving = false;

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

	playerName.textContent =
		gameManager.isPlayerAddTurn || gameManager.isPlayerTurn
			? gameManager.playerName
			: gameManager.secondPlayerName;
}

function renderEnemyBoard(boardSize) {
	const enemyDiv = document.createElement("div");
	const playersDiv = document.getElementById("players");
	enemyDiv.id = "enemy";
	enemyDiv.className = "flex flex-col gap-3 py-2 xl:py-0";
	enemyDiv.innerHTML = `
        <div class="mx-12 flex justify-center gap-4 items-center" id="enemy-stats">
            <h3 class="align-middle text-left text-xs sm:text-sm text-gray-300 select-none">
                Missed Attacks: <span id="enemy-missed-attacks">0</span>
            </h3>
            <h3 id="enemy-name" class="align-middle flex-1 text-center text-2xl xl:text-3xl font-bold text-gray-200 underline"
                >Opponent</h3
            >
            <h3 class="align-middle text-right text-xs sm:text-sm text-gray-300 select-none">
                Downed Ships: <span id="enemy-downed-ships">0</span>
            </h3>
        </div>
        <div
            class="grid place-content-center gap-px"
            id="enemy-board">
        </div>
        <div class="flex flex-col gap-1 select-none" id="enemy-score">
            <h4 class="text-center text-lg xl:text-xl font-bold text-gray-300 underline">Score: <span id="enemy-score-num">0</span>
            </h4>
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

	const enemyName = document.getElementById("enemy-name");
	enemyName.textContent = gameManager.isPlayerTurn
		? gameManager.secondPlayerName
		: gameManager.playerName;
}

// Get user info and game settings, then start the game plan

function startGamePlan(e) {
	e.preventDefault();
	if (!gameSettingsForm.checkValidity()) {
		return;
	}

	const playerNameInput = document.getElementById("player-name");
	const playerName = playerNameInput.value || playerNameInput.placeholder;

	const isComputerGameInput = document.getElementById("comp-game");
	const isComputerGame = isComputerGameInput.checked;

	const secondPlayerNameInput = document.getElementById("second-player-name");
	const secondPlayerName =
		secondPlayerNameInput.value || secondPlayerNameInput.placeholder;

	const boardSizeInput = document.getElementById("board-size");
	const boardSize = Number(boardSizeInput.value);

	const numShipsInput = document.getElementById("num-ships");
	const numShips = Number(numShipsInput.value);

	const maxMissesInput = document.getElementById("max-misses");
	const maxMisses = Number(maxMissesInput.value);

	gameManager = new GameManager(boardSize, numShips, maxMisses, isComputerGame);
	gameManager.initializePlayers(playerName, secondPlayerName);
	showGameBoards();
	renderPlayerBoard(boardSize);
	renderAddShips();
	dragAndDropShips();
	addShipMenuHandlers();
	updateAddShipsCounter();
	renderAddShipsMessage(gameManager.playerName);
	showHeaderButtons();
	addMenuButtonHandler();
	addRestartButtonHandler();
}

export default function initializeApp() {
	// Add start game handler
	gameSettingsForm.addEventListener("submit", startGamePlan);

	// Add handler to show second player name input when toggling the option to play against the computer
	const toggleCompGame = document.getElementById("comp-game");
	toggleCompGame.checked = false;
	toggleCompGame.addEventListener("change", () => {
		const secondPlayerNameDiv = document.getElementById(
			"second-player-name-input"
		);
		secondPlayerNameDiv.classList.toggle("hidden");
		secondPlayerNameDiv.classList.toggle("flex");
	});
}

function hideHeaderButtons() {
	const menuButton = document.getElementById("menu-button");
	const restartButton = document.getElementById("restart-button");

	menuButton.classList.add("hidden");
	restartButton.classList.add("hidden");
}

function showHeaderButtons() {
	const menuButton = document.getElementById("menu-button");
	const restartButton = document.getElementById("restart-button");

	menuButton.classList.remove("hidden");
	restartButton.classList.remove("hidden");
}

function showGameBoards() {
	const gameDiv = document.getElementById("game");
	const mainMenuDiv = document.getElementById("main-menu");
	mainMenuDiv.classList.remove("flex");
	mainMenuDiv.classList.add("hidden");
	gameDiv.classList.remove("hidden");
	gameDiv.classList.add("flex");
}

function showMainMenu() {
	const gameDiv = document.getElementById("game");
	const mainMenuDiv = document.getElementById("main-menu");
	mainMenuDiv.classList.add("flex");
	mainMenuDiv.classList.remove("hidden");
	gameDiv.classList.add("hidden");
	gameDiv.classList.remove("flex");
}

function addMenuButtonHandler() {
	const menuButton = document.getElementById("menu-button");
	menuButton.addEventListener("click", () => {
		clearTimeout(timeoutID);
		removeAddShips();
		showMainMenu();
		gameManager.resetGame();
		removePlayerBoard();
		removeEnemyDiv();
		hideHeaderButtons();
		resetPlayerStats();
		isMoving = false;
		resetGameState();
	});
}

function addRestartButtonHandler() {
	const restartButton = document.getElementById("restart-button");
	restartButton.addEventListener("click", () => {
		clearTimeout(timeoutID);
		gameManager.resetGame();
		removeEnemyDiv();
		removePlayerBoard();
		removeAddShips();
		renderAddShips();
		renderPlayerBoard(gameManager.boardSize);
		renderAddShipsMessage(gameManager.playerName);
		addShipMenuHandlers();
		updateAddShipsCounter();
		resetPlayerStats();
		isMoving = false;
		resetGameState();
	});
}

function dragAndDropShips() {
	interact(".ship-select").draggable({
		autoScroll: true,
		listeners: {
			start(event) {
				event.target.classList.add("dragging");
			},
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
				event.target.classList.remove("dragging");
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

			if (!gameManager.isPlayerAddTurn) {
				gameManager.placeSecondPlayerShip(length, orient, x, y);
			} else {
				gameManager.placePlayerShip(length, orient, x, y);
			}
			updatePlayerSquares();
			updateAddShipsCounter();

			ship.style.transform = "";
			ship.removeAttribute("data-x");
			ship.removeAttribute("data-y");
		},
	});
}

function updatePlayerSquares() {
	const playerSquares = document.querySelectorAll(".player-square");

	playerSquares.forEach((square) => {
		const x = Number(square.getAttribute("data-x"));
		const y = Number(square.getAttribute("data-y"));

		const playerSquare =
			gameManager.isPlayerAddTurn || gameManager.isPlayerTurn
				? gameManager.getPlayerSquare(x, y)
				: gameManager.getSecondPlayerSquare(x, y);

		const playerSquareState = gameManager.isPlayerTurn
			? gameManager.getPlayerSquareState(x, y)
			: gameManager.getSecondPlayerSquareState(x, y);

		if (playerSquareState === "hit") {
			square.classList.add("hit");
		} else if (playerSquareState === "miss") {
			square.classList.add("miss");
		}

		if (playerSquare !== null) {
			square.classList.add("ship");
			square.setAttribute("data-ship", "true");
		} else {
			square.classList.remove("ship");
			square.setAttribute("data-ship", "false");
		}
	});
}

function updateSecondPlayerSquares() {
	const playerSquares = document.querySelectorAll(".enemy-square");

	playerSquares.forEach((square) => {
		const x = Number(square.getAttribute("data-x"));
		const y = Number(square.getAttribute("data-y"));

		const playerSquareState = gameManager.isPlayerTurn
			? gameManager.getSecondPlayerSquareState(x, y)
			: gameManager.getPlayerSquareState(x, y);

		if (playerSquareState === "hit") {
			square.classList.add("hit");
		} else if (playerSquareState === "miss") {
			square.classList.add("miss");
		}
	});
}

function updateAddShipsCounter() {
	const counter = document.getElementById("add-ships-left");
	const playerShipsNum = gameManager.isPlayerAddTurn
		? gameManager.playerShipsNum
		: gameManager.secondPlayerShipsNum;
	const shipsLeft = gameManager.numShips - playerShipsNum;
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
                                class="ship-select"
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
                                class="ship-select"
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
                                class="ship-select"
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
                                class="ship-select"
                                id="ship-4">
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                                <div class="ship-preview"></div>
                            </div>
                        </div>
                    </div>
                    <div id="ship-menu-buttons" class="flex justify-center gap-4">
                        <button id="ship-menu-start" class="bg-green-800 rounded-full px-4 py-2 hover:bg-green-700 border cursor-pointer text-sm xl:text-base" id="start-match">Confirm Ships</button>
                        <button id="ship-menu-randomize" class="bg-indigo-800 rounded-full px-4 py-2 hover:bg-indigo-700 border cursor-pointer text-sm xl:text-base" id="randomize-ships">Randomize Ships</button>
                        <button id="ship-menu-reset" class="bg-red-800 rounded-full px-4 py-2 hover:bg-red-700 border cursor-pointer text-sm xl:text-base" id="reset-board">Reset Board</button>
                    </div>
                    `;
	const playersDiv = document.getElementById("players");
	playersDiv.appendChild(addShipsDiv);
}

function removeAddShips() {
	const addShipsDiv = document.getElementById("ships-selection");
	if (addShipsDiv) {
		addShipsDiv.remove();
	}
}

function removeEnemyDiv() {
	const enemyDiv = document.getElementById("enemy");
	if (enemyDiv) {
		enemyDiv.remove();
	}
}

function removePlayerBoard() {
	const playerBoard = document.getElementById("player-board");
	playerBoard.innerHTML = "";
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
	const playerShipsNum = gameManager.isPlayerAddTurn
		? gameManager.playerShipsNum
		: gameManager.secondPlayerShipsNum;
	if (playerShipsNum < gameManager.numShips) {
		const missingShips = gameManager.numShips - playerShipsNum;
		renderAddShipsWarnMessage(missingShips);
		timeoutID = setTimeout(() => {
			if (gameManager.isPlayerAddTurn) {
				renderAddShipsMessage(gameManager.playerName);
			} else {
				renderAddShipsMessage(gameManager.secondPlayerName);
			}
		}, 3000);
		return;
	}
	removeAddShips();
	if (!gameManager.isComputerGame && gameManager.isPlayerAddTurn) {
		gameManager.isPlayerAddTurn = false;
		renderAddShips();
		dragAndDropShips();
		addShipMenuHandlers();
		updateAddShipsCounter();
		renderAddShipsMessage(gameManager.secondPlayerName);
		removePlayerBoard();
		renderPlayerBoard(gameManager.boardSize);
		return;
	}
	gameManager.isPlayerTurn = true;
	startPlayerTurn();
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

function renderAddShipsMessage(playerName) {
	gameStateMessage.textContent = `Add ${playerName}'s ships`;
}

function addEnemySquaresHandlers() {
	const enemySquares = document.querySelectorAll(".enemy-square");

	enemySquares.forEach((square) => {
		square.addEventListener("click", () => {
			if (isMoving) return;

			const x = Number(square.getAttribute("data-x"));
			const y = Number(square.getAttribute("data-y"));

			let att;

			if (gameManager.isPlayerTurn) {
				att = gameManager.makePlayerMove(x, y);
			} else {
				att = gameManager.makeSecondPlayerMove(x, y);
			}

			if (att === null) {
				return;
			}

			updateStats();

			gameManager.isPlayerTurn = !gameManager.isPlayerTurn;

			isMoving = true;

			if (att.ship) {
				markShipHitSquare(square);
				renderPlayerHitMessage(att);
			} else {
				markEmptySquare(square);
				renderPlayerMissMessage(att);
			}

			timeoutID = setTimeout(() => {
				if (gameManager.isGameOver) {
					renderGameOver();
					return;
				}
				if (gameManager.isComputerGame) {
					startComputerTurn();
				} else {
					startPlayerTurn();
					isMoving = false;
				}
			}, 3000);
		});
	});
}

async function startComputerTurn() {
	renderEnemyTurnMessage();
	let att;
	const attPromise = new Promise((resolve, reject) => {
		timeoutID = setTimeout(() => {
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

	timeoutID = setTimeout(() => {
		if (gameManager.isGameOver) {
			renderGameOver();
			return;
		}
		renderPlayerTurnMessage();
		gameManager.isPlayerTurn = true;
		isMoving = false;
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
	playerName.classList.add("current");
	opponentName.classList.remove("current");
	const name = playerName.textContent;
	gameStateMessage.textContent = `It's ${name}'s turn\nPlease make a move.`;
}

function renderEnemyTurnMessage() {
	const playerName = document.getElementById("player-current-name");
	const opponentName = document.getElementById("enemy-name");
	playerName.classList.remove("current");
	opponentName.classList.add("current");
	gameStateMessage.textContent =
		"It's the computer's turn\nWait for the computer to make a move.";
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
	let playerDestroyedShips;
	let playerMissedAttacks;
	let playerScore;
	let secondPlayerDestroyedShips;
	let secondPlayerMissedAttacks;
	let secondPlayerScore;

	if (gameManager.isPlayerTurn || gameManager.isComputerGame) {
		playerDestroyedShips = document.getElementById("player-downed-ships");
		playerMissedAttacks = document.getElementById("player-missed-attacks");
		playerScore = document.getElementById("player-score-num");
		secondPlayerDestroyedShips = document.getElementById("enemy-downed-ships");
		secondPlayerMissedAttacks = document.getElementById("enemy-missed-attacks");
		secondPlayerScore = document.getElementById("enemy-score-num");
	} else {
		playerDestroyedShips = document.getElementById("enemy-downed-ships");
		playerMissedAttacks = document.getElementById("enemy-missed-attacks");
		playerScore = document.getElementById("enemy-score-num");
		secondPlayerDestroyedShips = document.getElementById("player-downed-ships");
		secondPlayerMissedAttacks = document.getElementById(
			"player-missed-attacks"
		);
		secondPlayerScore = document.getElementById("player-score-num");
	}
	playerDestroyedShips.textContent = gameManager.playerDestroyedShips;

	playerMissedAttacks.textContent = gameManager.playerMissedAttacks;

	playerScore.textContent = gameManager.playerScore;

	secondPlayerDestroyedShips.textContent =
		gameManager.secondPlayerDestroyedShips;

	secondPlayerMissedAttacks.textContent = gameManager.secondPlayerMissedAttacks;

	secondPlayerScore.textContent = gameManager.secondPlayerScore;
}

function resetPlayerStats() {
	const playerDestroyedShips = document.getElementById("player-downed-ships");
	playerDestroyedShips.textContent = 0;

	const playerMissedAttacks = document.getElementById("player-missed-attacks");
	playerMissedAttacks.textContent = 0;

	const playerScore = document.getElementById("player-score-num");

	if (playerScore) {
		playerScore.textContent = 0;
	}

	const playerName = document.getElementById("player-current-name");
	playerName.classList.remove("current");
}

function renderGameOver() {
	const winner = gameManager.determineWinner();
	let gameOverMessage = "Game Over!";
	if (winner === gameManager.player) {
		gameStateMessage.classList.remove("text-slate-200");
		gameStateMessage.classList.add("text-green-500");
		const playerMessage = gameManager.isComputerGame
			? "You have won!"
			: `${gameManager.playerName} has won!`;
		gameStateMessage.textContent = `${gameOverMessage}\n${playerMessage}`;
	} else if (winner === gameManager.secondPlayer) {
		gameStateMessage.classList.remove("text-slate-200");
		gameStateMessage.classList.add("text-red-500");
		const playerMessage = gameManager.isComputerGame
			? "You have lost. Better luck next time!"
			: `${gameManager.secondPlayerName} has won!`;
		gameStateMessage.textContent = `${gameOverMessage}\n${playerMessage}`;
	} else {
		gameStateMessage.textContent = `${gameOverMessage}\nIt's a tie!`;
	}
}

function startPlayerTurn() {
	removePlayerBoard();
	renderPlayerBoard(gameManager.boardSize);
	updatePlayerSquares();
	removeEnemyDiv();
	renderEnemyBoard(gameManager.boardSize);
	updateSecondPlayerSquares();
	addEnemySquaresHandlers();
	renderPlayerTurnMessage();
	updateStats();
}

function resetGameState() {
	gameStateMessage.classList.remove("text-green-500", "text-red-500");
	gameStateMessage.classList.add("text-slate-200");
}
