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
			playerSquare.className = "size-10 bg-slate-200 player-square";
			const enemySquare = document.createElement("div");
			enemySquare.setAttribute("data-x", j);
			enemySquare.setAttribute("data-y", i);
			enemySquare.setAttribute("data-ship", "false");
			enemySquare.className = "size-10 bg-slate-200 enemy-square";
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
	dragAndDropShips();
	updateAddShipsCounter();
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

function dragAndDropShips() {
	const ships = document.querySelectorAll(".ship");

	ships.forEach((ship) => {
		ship.addEventListener("dragstart", (e) => {
			console.log(e.target.getAttribute("data-length"));

			e.dataTransfer.setData("length", e.target.getAttribute("data-length"));
			e.dataTransfer.setData("orient", e.target.getAttribute("data-orient"));
		});
		const rotateButton = ship.previousElementSibling;
		rotateButton.addEventListener("click", () => {
			ship.classList.toggle("rotate-90");
			if (ship.getAttribute("data-orient") === "horizontal") {
				ship.setAttribute("data-orient", "vertical");
			} else {
				ship.setAttribute("data-orient", "vertical");
			}
			ship.setAttribute("data-orient", "vertical");
		});
	});

	const playerSquares = document.querySelectorAll(".player-square");

	playerSquares.forEach((square) => {
		square.addEventListener("dragover", (e) => {
			e.preventDefault();
		});
		square.addEventListener("drop", (e) => {
			e.preventDefault();

			const length = e.dataTransfer.getData("length");
			const orient = e.dataTransfer.getData("orient");

			const x = Number(square.getAttribute("data-x"));
			const y = Number(square.getAttribute("data-y"));

			gameManager.placePlayerShip(length, orient, x, y);
			updatePlayerSquares();
			updateAddShipsCounter();
		});
	});
}

function updatePlayerSquares() {
	const playerSquares = document.querySelectorAll(".player-square");

	playerSquares.forEach((square) => {
		const x = Number(square.getAttribute("data-x"));
		const y = Number(square.getAttribute("data-y"));

		if (gameManager.getPlayerSquare(x, y) !== null) {
			square.classList.remove("bg-slate-200");
			square.classList.add("bg-green-900");
			square.setAttribute("data-ship", "true");
		} else {
			square.classList.remove("bg-green-900");
			square.classList.add("bg-slate-200");
			square.setAttribute("data-ship", "false");
		}
	});
}

function updateAddShipsCounter() {
	const counter = document.getElementById("add-ships-left");
	const shipsLeft = gameManager.numShips - gameManager.playerShipsNum;
	counter.innerText = shipsLeft;
}
