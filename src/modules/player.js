import GameBoard from "./gameboard.js";
import Queue from "./queue.js";

export class Player {
	#boardSize;
	#missedAttacks;
	#shipsDestroyed;
	#hits;
	constructor(name, boardSize) {
		this.name = name;
		this.#boardSize = boardSize;
		this.attacks = [];
		this.#missedAttacks = 0;
		this.#shipsDestroyed = 0;
		this.#hits = 0;
		this.gameBoard = new GameBoard(this.#boardSize);
		this.#initializeAttacks();
	}
	attack(player, x, y) {
		if (!this.checkValidAttackSquare(x, y)) {
			return null;
		}
		const playerBoard = player.gameBoard;
		const res = playerBoard.receiveAttack(x, y);
		this.attacks[y][x] = res.ship ? "hit" : "noHit";
		if (res.ship === null) {
			this.#missedAttacks++;
		} else {
			this.#hits++;
		}
		if (res.ship && res.ship.isSunk) {
			this.#shipsDestroyed++;
		}
		return res;
	}

	checkValidAttackSquare(x, y) {
		return (
			x >= 0 &&
			x < this.#boardSize &&
			y >= 0 &&
			y < this.#boardSize &&
			this.attacks[y][x] === "unknown"
		);
	}

	#initializeAttacks() {
		for (let i = 0; i < this.#boardSize; i++) {
			const row = [];
			for (let j = 0; j < this.#boardSize; j++) {
				row.push("unknown");
			}
			this.attacks.push(row);
		}
	}

	resetBoard() {
		this.gameBoard.resetBoard();
		this.#missedAttacks = 0;
		this.#shipsDestroyed = 0;
		this.#hits = 0;
		this.attacks = [];
		this.#initializeAttacks();
	}

	get score() {
		return this.#hits + this.#shipsDestroyed * 5;
	}

	get missedAttacks() {
		return this.#missedAttacks;
	}

	get shipsDestroyed() {
		return this.#shipsDestroyed;
	}
}

export class ComputerPlayer extends Player {
	#boardSize;
	constructor(boardSize) {
		super("Computer", boardSize);
		this.attacksQueue = new Queue();
		this.#boardSize = boardSize;
	}

	attack(player) {
		let move;

		// If there are no attacks in queue select a random square to attack.
		if (this.attacksQueue.isEmpty()) {
			const validMoves = [];
			for (let x = 0; x < this.#boardSize; x++) {
				for (let y = 0; y < this.#boardSize; y++) {
					if (this.checkValidAttackSquare(x, y)) {
						validMoves.push({ x, y });
					}
				}
			}
			move =
				validMoves.length > 0
					? validMoves[Math.floor(Math.random() * validMoves.length)]
					: null;
		} else {
			// Else dequeue the next move from the queue.
			move = this.attacksQueue.dequeue();
		}

		// Return null if no random move can be made.
		if (move === null) return null;

		const res = super.attack(player, move.x, move.y);

		// If a ship is hit, get the adjacent squares of the hit square and add them to the queue.
		if (res.ship !== null) {
			const adjSquares = this.#getAdjacentSquares(res.x, res.y);

			for (const square of adjSquares) {
				this.attacksQueue.enqueue(square);
			}
		}

		// If a ship is hit and sunk, then clear the queue.
		if (res.ship && res.ship.isSunk) {
			this.attacksQueue.clear();
		}

		return res;
	}

	/**
	 * Get the adjacent squares of a particular square in cardinal directions.
	 * @param {number} x
	 * @param {number} y
	 * @returns
	 */
	#getAdjacentSquares(x, y) {
		const squares = [];

		if (this.checkValidAttackSquare(x - 1, y)) squares.push({ x: x - 1, y });

		if (this.checkValidAttackSquare(x, y - 1)) squares.push({ x, y: y - 1 });

		if (this.checkValidAttackSquare(x + 1, y)) squares.push({ x: x + 1, y });

		if (this.checkValidAttackSquare(x, y + 1)) squares.push({ x, y: y + 1 });

		return squares;
	}
}
