import Ship from "./ship.js";

export default class GameBoard {
	#board;
	#size;
	#missedAttacks;
	#ships;
	#gameOver;
	constructor(size) {
		this.#board = [];
		this.#size = size;
		this.#ships = [];
		this.#missedAttacks = 0;
		this.#gameOver = false;
		this.initializeBoard();
	}

	initializeBoard() {
		for (let i = 0; i < this.#size; i++) {
			const row = [];
			for (let j = 0; j < this.#size; j++) {
				row.push(null);
			}
			this.#board.push(row);
		}
	}

	placeShip(shipSize, orientation, x, y) {
		let canPlace = false;
		const ship = new Ship(shipSize);
		if (orientation === "vertical") {
			canPlace = this.#arrangeShipVertical(ship, x, y);
		} else if (orientation === "horizontal") {
			canPlace = this.#arrangeShipHorizontal(ship, x, y);
		}
		if (canPlace) {
			this.#ships.push(ship);
		}
		return canPlace;
	}

	#arrangeShipVertical(ship, x, y) {
		if (this.#checkVerticalSpace(x, y, ship.length)) {
			for (let i = 0; i < ship.length; i++) {
				this.#board[y + i][x] = ship;
			}
			return true;
		} else {
			return false;
		}
	}

	#arrangeShipHorizontal(ship, x, y) {
		if (this.#checkHorizontalSpace(x, y, ship.length)) {
			for (let i = 0; i < ship.length; i++) {
				this.#board[y][x + i] = ship;
			}
			return true;
		} else {
			return false;
		}
	}

	#isEmptySquare(x, y) {
		return this.#board[y][x] === null;
	}

	#isWithinBoard(x, y) {
		return x < this.#size && x >= 0 && y < this.#size && y >= 0;
	}

	#checkValidSquare(x, y) {
		return this.#isWithinBoard(x, y) && this.#isEmptySquare(x, y);
	}

	#checkVerticalSpace(x, y, length) {
		for (let i = 0; i < length; i++) {
			if (!this.#checkValidSquare(x, y + i)) {
				return false;
			}
		}
		return true;
	}

	#checkHorizontalSpace(x, y, length) {
		for (let i = 0; i < length; i++) {
			if (!this.#checkValidSquare(x + i, y)) {
				return false;
			}
		}
		return true;
	}

	receiveAttack(x, y) {
		let ship = null;
		if (!this.#isEmptySquare(x, y)) {
			ship = this.#board[y][x];
			ship.hit();
			this.#checkSunkShips();
		} else {
			this.#missedAttacks++;
		}
		return { x, y, ship };
	}

	#checkSunkShips() {
		const sunkShips = this.sunkShips;
		if (sunkShips.length === this.#ships.length) {
			this.#gameOver = true;
		}
	}

	clearBoard() {
		this.#board = [];
		this.#ships = [];
		this.initializeBoard();
	}

	randomizeShips(num) {
		while (this.#ships.length < num) {
			const shipSize = Math.floor(Math.random() * 4 + 1);
			const orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
			const x = Math.floor(Math.random() * 10);
			const y = Math.floor(Math.random() * 10);
			this.placeShip(shipSize, orientation, x, y);
		}
		return true;
	}

	get size() {
		return this.#size;
	}

	get board() {
		return this.#board;
	}

	get missedAttacks() {
		return this.#missedAttacks;
	}

	get ships() {
		return this.#ships;
	}

	get sunkShips() {
		return this.#ships.filter((ship) => ship.isSunk);
	}

	get isGameOver() {
		return this.#gameOver;
	}
}
