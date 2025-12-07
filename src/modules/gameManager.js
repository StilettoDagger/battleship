import { Player, ComputerPlayer } from "./player.js";

export default class GameManager {
	#boardSize;
	#numShips;
	#maxMissed;
	#isGameOver;
	constructor(boardSize, numShips, maxMissed) {
		this.#boardSize = boardSize;
		this.#numShips = numShips;
		this.player = null;
		this.compPlayer = null;
		this.#maxMissed = maxMissed;
		this.isPlayerTurn = true;
		this.#isGameOver = false;
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
		if (this.#numShips - this.playerShipsNum > 0) {
			return this.player.gameBoard.placeShip(shipSize, orientation, x, y);
		}
	}

	makePlayerMove(x, y) {
		const att = this.player.attack(this.compPlayer, x, y);
		if (
			this.#checkGameOver(this.compPlayer) ||
			this.playerMissedAttacks >= this.#maxMissed
		) {
			this.#isGameOver = true;
		}
		return att;
	}

	resetPlayerBoard() {
		this.player.resetBoard();
	}

	resetComputerBoard() {
		this.compPlayer.resetBoard();
	}

	resetGame() {
		this.resetPlayerBoard();
		this.resetComputerBoard();
		this.#isGameOver = false;
		this.isPlayerTurn = true;
	}

	randomizePlayerShips() {
		this.player.gameBoard.randomizeShips(this.#numShips);
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
		const att = this.compPlayer.attack(this.player, randomMove.x, randomMove.y);
		if (
			this.#checkGameOver(this.compPlayer) ||
			this.enemyMissedAttacks >= this.#maxMissed
		) {
			this.#isGameOver = true;
		}
		return att;
	}

	determineWinner() {
		if (this.playerScore > this.enemyScore) {
			return this.player;
		} else if (this.enemyScore > this.playerScore) {
			return this.compPlayer;
		} else {
			return null;
		}
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

	get playerName() {
		return this.player.name;
	}

	get playerMissedAttacks() {
		return this.player.missedAttacks;
	}

	get enemyMissedAttacks() {
		return this.compPlayer.missedAttacks;
	}

	get playerDestroyedShips() {
		return this.player.shipsDestroyed;
	}

	get enemyDestroyedShips() {
		return this.compPlayer.shipsDestroyed;
	}

	get playerScore() {
		return this.player.score;
	}

	get enemyScore() {
		return this.compPlayer.score;
	}

	get isGameOver() {
		return this.#isGameOver;
	}
}
