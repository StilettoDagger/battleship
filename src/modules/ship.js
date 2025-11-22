export default class Ship {
	#length;
	#numHits;
	#isSunk;
	constructor(length) {
		this.#length = length;
		this.#numHits = 0;
		this.#isSunk = false;
	}

	get length() {
		return this.#length;
	}

	get numHits() {
		return this.#numHits;
	}

	get isSunk() {
		return this.#isSunk;
	}

	#checkSunk() {
		return this.#numHits >= this.#length;
	}

	hit() {
		this.#numHits++;
		this.#isSunk = this.#checkSunk();
	}
}
