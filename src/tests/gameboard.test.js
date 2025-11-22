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
});
