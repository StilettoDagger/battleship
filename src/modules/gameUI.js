import GameManager from "./gameManager";

let gameManager = null;

function renderPlayerBoard(boardSize) {
	const playerBoard = document.getElementById("player-board");

	// TODO: Draw board axes

	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			const playerSquare = document.createElement("div");
			playerSquare.setAttribute("data-x", j);
			playerSquare.setAttribute("data-y", i);
			playerSquare.setAttribute("data-ship", "false");
			playerSquare.className = "size-10 bg-slate-200 player-square";
			playerBoard.appendChild(playerSquare);
		}
	}

	const playerName = document.querySelector("#player>h3");

	playerName.innerText = gameManager.playerName;
}

function renderEnemyBoard(boardSize) {
	const enemyDiv = document.createElement("div");
	const playersDiv = document.getElementById("players");
	enemyDiv.id = "enemy";
	enemyDiv.innerHTML = `
    <h3 class="my-4 text-center text-3xl text-gray-200 underline"
        >Opponent
    </h3>
    <div
        class="my-8 grid grid-cols-[repeat(10,auto)] place-content-center gap-px"
        id="enemy-board">
    </div>
    `;

	playersDiv.appendChild(enemyDiv);

	const enemyBoard = document.getElementById("enemy-board");

	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			const enemySquare = document.createElement("div");
			enemySquare.setAttribute("data-x", j);
			enemySquare.setAttribute("data-y", i);
			enemySquare.setAttribute("data-ship", "false");
			enemySquare.className = "size-10 bg-slate-200 enemy-square";
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
	const ships = document.querySelectorAll(".ship");

	ships.forEach((ship) => {
		ship.addEventListener("dragstart", (e) => {
			e.dataTransfer.setData("length", e.target.getAttribute("data-length"));
			e.dataTransfer.setData("orient", e.target.getAttribute("data-orient"));
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
			square.classList.add("bg-green-700");
			square.setAttribute("data-ship", "true");
		} else {
			square.classList.remove("bg-green-700");
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

function renderAddShips() {
	const addShipsDiv = document.createElement("div");
	addShipsDiv.id = "ships-selection";
	addShipsDiv.className =
		"mx-auto p-4 mb-4 flex flex-col gap-8 rounded-2xl text-gray-200";
	addShipsDiv.innerHTML = `
					<h3 class="text-center text-3xl font-bold underline"
						>Add Ships (<span id="add-ships-left"></span> ships left)</h3
					>
					<div
						class="bg-zinc-200 h-full p-4 grid grid-cols-2 items-center justify-center rounded-2xl shadow-2xl"
						id="ships-menu">
						<div class="flex gap-2" id="ship-1-opt">
							<button
								class="rotate-button cursor-pointer text-3xl text-gray-600 hover:text-gray-800"
								><span class="icon-[mdi--rotate-counter-clockwise]"></span
							></button>
							<div
								data-orient="horizontal"
								data-length="1"
								draggable="true"
								class="ship flex cursor-grab"
								id="ship-1">
								<div class="pointer-events-none size-10 bg-green-700"></div>
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
								draggable="true"
								class="ship flex cursor-grab"
								id="ship-2">
								<div class="pointer-events-none size-10 bg-green-700"></div>
								<div class="pointer-events-none size-10 bg-green-700"></div>
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
								draggable="true"
								class="ship flex cursor-grab"
								id="ship-3">
								<div class="pointer-events-none size-10 bg-green-700"></div>
								<div class="pointer-events-none size-10 bg-green-700"></div>
								<div class="pointer-events-none size-10 bg-green-700"></div>
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
								draggable="true"
								class="ship flex cursor-grab"
								id="ship-4">
								<div class="pointer-events-none size-10 bg-green-700"></div>
								<div class="pointer-events-none size-10 bg-green-700"></div>
								<div class="pointer-events-none size-10 bg-green-700"></div>
								<div class="pointer-events-none size-10 bg-green-700"></div>
							</div>
						</div>
					</div>
                    <div id="ship-menu-buttons" class="flex justify-center gap-4">
                        <button id="ship-menu-start" class="bg-green-800 rounded-full px-4 py-2 hover:bg-green-700 border cursor-pointer" id="start-match">Start Game</button>
                        <button id="ship-menu-randomize" class="bg-indigo-800 rounded-full px-4 py-2 hover:bg-indigo-700 border cursor-pointer" id="randomize-ships">Randomize Ships</button>
                        <button id="ship-menu-reset" class="bg-red-800 rounded-full px-4 py-2 hover:bg-red-700 border cursor-pointer" id="reset-board">Reset Board</button>
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
}

function renderAddShipsWarnMessage(missingShips) {
	const gameStateMessage = document.getElementById("game-state-message");
	gameStateMessage.innerText = `Insufficient number of ships\nPlease add ${missingShips} more ships`;
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
	const gameStateMessage = document.getElementById("game-state-message");
	gameStateMessage.innerText = "Add your ships";
}
