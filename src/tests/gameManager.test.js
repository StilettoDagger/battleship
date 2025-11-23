import GameManager from "../modules/gameManager.js";
import { ComputerPlayer, Player } from "../modules/player.js";
import Ship from "../modules/ship.js";

describe("Game manager tests", () => {
	let gameManager;
	beforeAll(() => {
		gameManager = new GameManager(10, 5, 7);
	});
	test("GameManger class should exist", () => {
		expect(GameManager).toBeDefined();
		expect(GameManager).toBeInstanceOf(Object);
	});
	test("GameManager should include properties for player one and player two", () => {
		expect(gameManager).toHaveProperty("player");
		expect(gameManager).toHaveProperty("compPlayer");
	});
	test("GameManager should include a method for initializing players", () => {
		expect(gameManager.initializePlayers).toBeDefined();
		expect(gameManager.initializePlayers).toBeInstanceOf(Function);
	});
	test("initializePlayers method should correctly initialize players", () => {
		gameManager.initializePlayers("stiletto");
		expect(gameManager.player).toEqual(expect.any(Player));
		expect(gameManager.player.name).toBe("stiletto");
		expect(gameManager.compPlayer).toEqual(expect.any(ComputerPlayer));
		expect(gameManager.compPlayer.name).toBe("computer");
		// expect(gameManager.compPlayer.gameBoard.ships).toHaveLength(5);
	});
	test("GameManager should include a method to place a player's ship", () => {
		expect(gameManager.placePlayerShip).toBeDefined();
		expect(gameManager.placePlayerShip).toBeInstanceOf(Function);
	});

	test("placePlayerShip should correctly place a ship on the player's board", () => {
		const res = gameManager.placePlayerShip(3, "horizontal", 3, 3);
		expect(res).toBe(true);
	});

	test("GameManager should include a method to make a player move", () => {
		expect(gameManager.makePlayerMove).toBeDefined();
		expect(gameManager.makePlayerMove).toBeInstanceOf(Function);
	});

	test("makeAttackMove should return an object if the attack was successful or null if it was invalid", () => {
		gameManager.compPlayer.gameBoard.placeShip(3, "horizontal", 3, 3);
		const att = gameManager.makePlayerMove(3, 3);
		expect(att.ship).toEqual(expect.any(Ship));

		const att2 = gameManager.makePlayerMove(3, 3);
		expect(att2).toBeNull();

		const att3 = gameManager.makePlayerMove(0, 0);
		expect(att3.ship).toBeNull();
	});
	test("missedAttacks should be accurate for each player", () => {
		expect(gameManager.compPlayer.missedAttacks).toBe(0);
		expect(gameManager.player.missedAttacks).toBe(1);
	});
	test("GameManager should include a method for making a computer move", () => {
		expect(gameManager.makeComputerMove).toBeDefined();
		expect(gameManager.makeComputerMove).toBeInstanceOf(Function);
		for (let i = 0; i < 10; i++) {
			const res = gameManager.makeComputerMove();
			expect(res).not.toBe(null);
		}
	});
	test("GameManger should have a method for initializing computer ships", () => {
		expect(gameManager.initializeComputerShips).toBeDefined();
		expect(gameManager.initializeComputerShips).toBeInstanceOf(Function);
		gameManager.initializeComputerShips();
		expect(gameManager.compPlayer.gameBoard.ships).toHaveLength(5);
	});
});
