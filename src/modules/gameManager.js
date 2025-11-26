import { Player, ComputerPlayer } from "./player.js";

export default class GameManager {
	#boardSize;
	#numShips;
	#maxMissed;
	constructor(boardSize, numShips, maxMissed) {
		this.#boardSize = boardSize;
		this.#numShips = numShips;
		this.player = null;
		this.compPlayer = null;
		this.#maxMissed = maxMissed;
		this.winner = null;
	}

	getPlayerSquare(x, y) {
		return this.player.gameBoard.getSquare(x, y);
	}

	getComputerSquare(x, y) {
		return this.compPlayer.gameBoard.getSquare(x, y);
	}

	initializePlayers(playerName) {
		this.player = new Player(playerName, this.#boardSize);
		this.compPlayer = new ComputerPlayer(this.#boardSize);
	}

	initializeComputerShips() {
		this.compPlayer.gameBoard.resetBoard();
		this.compPlayer.gameBoard.randomizeShips(this.#numShips);
	}

	placePlayerShip(shipSize, orientation, x, y) {
		return this.player.gameBoard.placeShip(shipSize, orientation, x, y);
	}

	makePlayerMove(x, y) {
		const att = this.player.attack(this.compPlayer, x, y);
		if (this.#checkGameOver(this.compPlayer)) this.winner = this.player;
		return att;
	}

	#checkGameOver(player) {
		return player.gameBoard.isGameOver;
	}

	makeComputerMove() {
		const validMoves = [];
		for (let x = 0; x < this.#boardSize; x++) {
			for (let y = 0; y < this.#boardSize; y++) {
				if (this.compPlayer.checkValidAttackSquare(x, y)) {
					validMoves.push({ x, y });
				}
			}
		}
		if (validMoves.length === 0) {
			return null;
		}
		const randomMove =
			validMoves[Math.floor(Math.random() * validMoves.length)];
		return this.compPlayer.attack(this.player, randomMove.x, randomMove.y);
	}

	get playerShipsNum() {
		return this.player.gameBoard.ships.length;
	}

	get numShips() {
		return this.#numShips;
	}

	get boardSize() {
		return this.#boardSize;
	}

	get maxMissed() {
		return this.#maxMissed;
	}
}
