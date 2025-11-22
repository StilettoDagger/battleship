import Ship from "./ship.js";

export default class GameBoard {
	#board;
	#size;
	constructor(size) {
		this.#board = [];
		this.#size = size;
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
		const ship = new Ship(shipSize);
		if (orientation === "vertical") {
			return this.#arrangeShipVertical(ship, x, y);
		} else if (orientation === "horizontal") {
			return this.#arrangeShipHorizontal(ship, x, y);
		}
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

	get size() {
		return this.#size;
	}

	get board() {
		return this.#board;
	}
}
