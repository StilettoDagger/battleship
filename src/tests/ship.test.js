import Ship from "../modules/ship.js";

describe("ship module tests.", () => {
	let ship;
	beforeAll(() => {
		ship = new Ship(5);
	});
	test("Ship class should exist and be defined", () => {
		expect(Ship).toBeDefined();
		expect(Ship).toBeInstanceOf(Object);
	});
	test("ship module should include length property with correct value", () => {
		expect(ship.length).toBeDefined();
		expect(ship.length).toBe(5);
	});
	test("ship module should include a a property that shows the number of times it has been hit that starts with 0", () => {
		expect(ship.numHits).toBeDefined();
		expect(ship.numHits).toBe(0);
	});
	test("ship module should include a flag property that indicates whether the ship is sunk or not and starts with false", () => {
		expect(ship.isSunk).toBe(false);
	});
	test("ship module should include a method to hit the ship", () => {
		expect(ship.hit).toBeDefined();
		expect(ship.hit).toBeInstanceOf(Function);
	});
	test("hit method should increment the numHits property by 1", () => {
		ship.hit();
		expect(ship.numHits).toBe(1);
	});
	test("hit should sink the ship if it the number of times hit is greater than or equal to the length of the ship", () => {
		// Hit the ship four times so that the ship gets hit 5 times in total
		for (let i = 0; i < 4; i++) {
			ship.hit();
		}

		expect(ship.numHits).toBe(5);
		expect(ship.isSunk).toBe(true);
	});
});
