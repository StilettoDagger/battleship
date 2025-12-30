export default class Queue {
	constructor() {
		this.items = [];
		this.head = 0;
	}

	/**
	 * Add an item to the queue.
	 * @param {*} v - The item to be added.
	 */
	enqueue(v) {
		this.items.push(v);
	}

	/**
	 * Remove an element from the head of the queue.
	 * @returns the dequeued element.
	 */
	dequeue() {
		if (this.isEmpty()) return undefined;

		const v = this.items[this.head];
		this.head++;

		if (this.head > 50 && this.head * 2 > this.items.length) {
			this.items = this.items.slice(this.head);
			this.head = 0;
		}
		return v;
	}

	/**
	 * Get the current head of the queue.
	 * @returns the head of the queue.
	 */
	peek() {
		return this.items[this.head];
	}

	/**
	 * Checks if the queue is empty.
	 * @returns true if it is empty and false otherwise.
	 */
	isEmpty() {
		return this.head >= this.items.length;
	}

	/**
	 * Gets the current size of the queue.
	 * @returns the size of the queue.
	 */
	size() {
		return this.items.length - this.head;
	}

	/**
	 * Clears the queue.
	 */
	clear() {
		this.items = [];
		this.head = 0;
	}
}
