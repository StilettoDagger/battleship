import GameBoard from "./gameboard.js";

export class Player {
	#boardSize;
	constructor(name, boardSize) {
		this.name = name;
		this.#boardSize = boardSize;
		this.attacks = [];
		this.gameBoard = new GameBoard(this.#boardSize);
		this.#initializeAttacks();
	}
	attack(player, x, y) {
		if (this.attacks[y][x] !== "unknown") {
			return null;
		}
		const playerBoard = player.gameBoard;
		const res = playerBoard.receiveAttack(x, y);
		this.attacks[y][x] = res.ship ? "hit" : "noHit";
		return playerBoard.receiveAttack(x, y);
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
}

export class ComputerPlayer extends Player {
	constructor(boardSize) {
		super("computer", boardSize);
	}
}
