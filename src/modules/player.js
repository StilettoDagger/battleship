import GameBoard from "./gameboard.js";

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
	constructor(boardSize) {
		super("Computer", boardSize);
	}
}
