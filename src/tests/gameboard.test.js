import GameBoard from "../modules/gameboard.js";
import Ship from "../modules/ship.js";

describe("game board tests", () => {
	let gameBoard;
	beforeAll(() => {
		gameBoard = new GameBoard(10);
	});
	test("GameBoard class should exist and be defined", () => {
		expect(GameBoard).toBeDefined();
		expect(GameBoard).toBeInstanceOf(Object);
	});
	test("GameBoard should have a size property that defines the board's dimensions", () => {
		expect(gameBoard.size).toBe(10);
	});
	test("GameBoard class should include a board property that is initialized as an empty 10x10", () => {
		expect(gameBoard.board).toStrictEqual([
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
	});
	test("GameBoard should include a method to place ships at specific coordinates", () => {
		expect(gameBoard.placeShip).toBeDefined();
		expect(gameBoard.placeShip).toBeInstanceOf(Function);
	});
	test("placeShip method should correctly place the ship horizontally on the board", () => {
		const res = gameBoard.placeShip(4, "horizontal", 3, 3);
		expect(res).toBe(true);
		expect(gameBoard.board).toStrictEqual([
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[
				null,
				null,
				null,
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				null,
				null,
				null,
			],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
	});
	test("placeShip method should correctly place the ship vertically on the board", () => {
		const res = gameBoard.placeShip(3, "vertical", 1, 0);
		expect(res).toBe(true);
		expect(gameBoard.board).toStrictEqual([
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[
				null,
				null,
				null,
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				null,
				null,
				null,
			],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
	});
	test("placeShip method should not place ships that cross over other ships", () => {
		const res = gameBoard.placeShip(3, "horizontal", 0, 1);
		expect(res).toBe(false);
		expect(gameBoard.board).toStrictEqual([
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[
				null,
				null,
				null,
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				null,
				null,
				null,
			],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
		const res2 = gameBoard.placeShip(4, "vertical", 4, 1);
		expect(res2).toBe(false);
		expect(gameBoard.board).toStrictEqual([
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[
				null,
				null,
				null,
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				null,
				null,
				null,
			],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
	});
	test("placeShip method should not place ships that are out of bounds of the game board", () => {
		const res = gameBoard.placeShip(2, "vertical", 0, 9);
		expect(res).toBe(false);
		expect(gameBoard.board).toStrictEqual([
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[
				null,
				null,
				null,
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				null,
				null,
				null,
			],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
		const res1 = gameBoard.placeShip(2, "horizontal", 9, 0);
		expect(res1).toBe(false);
		expect(gameBoard.board).toStrictEqual([
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[
				null,
				null,
				null,
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				null,
				null,
				null,
			],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
		const res2 = gameBoard.placeShip(2, "horizontal", -1, 3);
		expect(res2).toBe(false);
		expect(gameBoard.board).toStrictEqual([
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[
				null,
				null,
				null,
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				null,
				null,
				null,
			],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
		const res3 = gameBoard.placeShip(3, "vertical", 0, -2);
		expect(res3).toBe(false);
		expect(gameBoard.board).toStrictEqual([
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[null, expect.any(Ship), null, null, null, null, null, null, null, null],
			[
				null,
				null,
				null,
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				expect.any(Ship),
				null,
				null,
				null,
			],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
	});
	test("GameBoard should have a receiveAttack method", () => {
		expect(gameBoard.receiveAttack).toBeDefined();
		expect(gameBoard.receiveAttack).toBeInstanceOf(Function);
	});
	test("receiveAttack method should hit a ship when given coordinates with a ship on it", () => {
		const res = gameBoard.receiveAttack(1, 0);
		const res1 = gameBoard.receiveAttack(1, 1);
		expect(res.ship).toEqual(expect.any(Ship));
		expect(res.ship).toEqual(res1.ship);
		expect(res.ship.numHits).toEqual(2);
	});
	test("receiveAttack method should return an object including coordinates if an empty square is hit", () => {
		const res = gameBoard.receiveAttack(0, 0);
		expect(res).toBeInstanceOf(Object);
		expect(res).toHaveProperty("x");
		expect(res).toHaveProperty("y");
		expect(res.ship).toBeNull();
	});
	test("GameBoard should have a counter for missed attacks", () => {
		expect(gameBoard).toHaveProperty("missedAttacks");
	});
	test("missedAttacks counter should increment by 1 when missing attacks", () => {
		gameBoard.receiveAttack(2, 0);
		expect(gameBoard.missedAttacks).toBe(2);
	});
	test("GameBoard should keep track of the current ships on board", () => {
		expect(gameBoard).toHaveProperty("ships");
		expect(gameBoard.ships).toHaveLength(2);
	});
	test("GameBoard should include a method to get the number of sunk ships", () => {
		expect(gameBoard).toHaveProperty("sunkShips");
		expect(gameBoard.sunkShips).toHaveLength(0);
	});
	test("GameBoard should include a game over flag property", () => {
		expect(gameBoard).toHaveProperty("isGameOver");
		expect(gameBoard.isGameOver).toBe(false);
	});
	test("game should be over when all ships are sunk", () => {
		const res = gameBoard.receiveAttack(1, 2);
		expect(res.ship.isSunk).toBe(true);
		gameBoard.receiveAttack(3, 3);
		gameBoard.receiveAttack(4, 3);
		gameBoard.receiveAttack(5, 3);
		const res2 = gameBoard.receiveAttack(6, 3);

		expect(res2.ship.isSunk).toBe(true);
		expect(gameBoard.isGameOver).toBe(true);
	});
	test("GameBoard should include a method to clear the ships", () => {
		expect(gameBoard.resetBoard).toBeDefined();
		gameBoard.resetBoard();
		expect(gameBoard.board).toStrictEqual([
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null],
		]);
		expect(gameBoard.ships).toHaveLength(0);
		expect(gameBoard.missedAttacks).toBe(0);
		expect(gameBoard.isGameOver).toBe(false);
	});
	test("GameBoard should have a method to randomly initialize the board with ships", () => {
		expect(gameBoard.randomizeShips).toBeDefined();
		expect(gameBoard.randomizeShips).toBeInstanceOf(Function);

		const res = gameBoard.randomizeShips(5);
		expect(res).toBe(true);
		expect(gameBoard.ships).toHaveLength(5);
	});
});
