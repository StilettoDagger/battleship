import GameManager from "./gameManager";

let gameManager = null;

function renderBoards(boardSize) {
	const playerBoard = document.getElementById("player-board");
	const enemyBoard = document.getElementById("enemy-board");

	// TODO: Draw board axes

	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			const playerSquare = document.createElement("div");
			playerSquare.setAttribute("data-x", j);
			playerSquare.setAttribute("data-y", i);
			playerSquare.setAttribute("data-ship", "false");
			playerSquare.className =
				"size-10 border border-black box-border bg-slate-200";
			const enemySquare = document.createElement("div");
			enemySquare.setAttribute("data-x", j);
			enemySquare.setAttribute("data-y", i);
			enemySquare.setAttribute("data-ship", "false");
			enemySquare.className =
				"size-10 border border-black box-border bg-slate-200";
			playerBoard.appendChild(playerSquare);
			enemyBoard.appendChild(enemySquare);
		}
	}
}

// Get user info and game settings, then start the game
const gameSettingsForm = document.getElementById("game-settings");

function startGame(e) {
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
	renderBoards(boardSize);
}

export default function initializeApp() {
	const gameSettingsForm = document.getElementById("game-settings");
	gameSettingsForm.addEventListener("submit", startGame);
}

function toggleGameBoards() {
	const gameDiv = document.getElementById("game");
	const mainMenuDiv = document.getElementById("main-menu");

	mainMenuDiv.classList.toggle("flex");
	mainMenuDiv.classList.toggle("hidden");
	gameDiv.classList.toggle("hidden");
	gameDiv.classList.toggle("flex");
}

// TODO: Implement ship selection logic feature for player
