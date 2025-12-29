export default class Queue {
	constructor() {
		this.items = [];
		this.head = 0;
	}

	enqueue(v) {
		this.items.push(v);
	}

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

	peek() {
		return this.items[this.head];
	}

	isEmpty() {
		return this.head >= this.items.length;
	}

	size() {
		return this.items.length - this.head;
	}
}
