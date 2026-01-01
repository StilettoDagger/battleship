import GameManager from "../modules/gameManager.js";
import { Player, ComputerPlayer } from "../modules/player.js";
import Ship from "../modules/ship.js";

describe("Game manager two player tests", () => {
	let gameManager;
	beforeAll(() => {
		gameManager = new GameManager(10, 5, 7, false);
	});
	test("GameManger class should exist", () => {
		expect(GameManager).toBeDefined();
		expect(GameManager).toBeInstanceOf(Object);
	});
	test("GameManager should include properties for player one and player two", () => {
		expect(gameManager).toHaveProperty("player");
		expect(gameManager).toHaveProperty("secondPlayer");
	});
	test("GameManager should include a method for initializing players", () => {
		expect(gameManager.initializePlayers).toBeDefined();
		expect(gameManager.initializePlayers).toBeInstanceOf(Function);
	});
	test("initializePlayers method should correctly initialize players", () => {
		gameManager.initializePlayers("stiletto", "player2");
		expect(gameManager.player).toBeInstanceOf(Player);
		expect(gameManager.player.name).toBe("stiletto");
		expect(gameManager.secondPlayer).toBeInstanceOf(Player);
		expect(gameManager.secondPlayer.name).toBe("player2");
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
		gameManager.secondPlayer.gameBoard.placeShip(3, "horizontal", 3, 3);
		const att = gameManager.makePlayerMove(3, 3);
		expect(att.ship).toEqual(expect.any(Ship));

		const att2 = gameManager.makePlayerMove(3, 3);
		expect(att2).toBeNull();

		const att3 = gameManager.makePlayerMove(0, 0);
		expect(att3.ship).toBeNull();
	});
	test("missedAttacks should be accurate for each player", () => {
		expect(gameManager.secondPlayer.missedAttacks).toBe(0);
		expect(gameManager.player.missedAttacks).toBe(1);
	});
	test("GameManager should include a method for making a computer move", () => {
		expect(gameManager.makeComputerMove).toBeDefined();
		expect(gameManager.makeComputerMove).toBeInstanceOf(Function);
	});
	test("GameManager should have a method to reset player's board and remove all ships", () => {
		expect(gameManager.resetPlayerBoard).toBeDefined();
		expect(gameManager.resetPlayerBoard).toBeInstanceOf(Function);
		gameManager.resetPlayerBoard();
		expect(gameManager.playerShipsNum).toBe(0);
	});
	test("GameManger should have a method to randomly place a given number of ships on the player's board", () => {
		expect(gameManager.randomizePlayerShips).toBeDefined();
		expect(gameManager.randomizePlayerShips).toBeInstanceOf(Function);
		gameManager.randomizePlayerShips(5);
		expect(gameManager.playerShipsNum).toBe(5);
	});
	test("GameManager should have stat properties for both players for missed attacks and downed ships", () => {
		gameManager.resetPlayerBoard();
		gameManager.resetSecondPlayerBoard();

		gameManager.placePlayerShip(3, "horizontal", 0, 0);
		gameManager.secondPlayer.gameBoard.placeShip(2, "vertical", 2, 2);

		gameManager.makePlayerMove(0, 0);
		gameManager.makePlayerMove(2, 2);
		gameManager.makePlayerMove(2, 3);

		gameManager.secondPlayer.attack(gameManager.player, 2, 2);
		gameManager.secondPlayer.attack(gameManager.player, 2, 3);
		gameManager.secondPlayer.attack(gameManager.player, 0, 0);

		expect(gameManager.playerMissedAttacks).toBe(1);
		expect(gameManager.playerDestroyedShips).toBe(1);

		expect(gameManager.secondPlayerMissedAttacks).toBe(2);
		expect(gameManager.secondPlayerDestroyedShips).toBe(0);
	});
	test("GameManger should have a boolean property for the player's turn", () => {
		expect(gameManager.isPlayerTurn).toBe(false);
	});
	test("GameManager should have a game over flag property", () => {
		expect(gameManager.isGameOver).toBeDefined;
	});
	test("GameManager should have a method to determine the winner of the game", () => {
		expect(gameManager.isGameOver).toBe(true);
		expect(gameManager.determineWinner()).toBe(gameManager.player);
	});
	test("GameManager should be able to retrieve player and enemy score", () => {
		gameManager.resetPlayerBoard();
		gameManager.resetSecondPlayerBoard();

		gameManager.placePlayerShip(3, "horizontal", 0, 0);
		gameManager.secondPlayer.gameBoard.placeShip(2, "vertical", 2, 2);

		gameManager.secondPlayer.attack(gameManager.player, 0, 0);
		gameManager.secondPlayer.attack(gameManager.player, 0, 1);
		gameManager.secondPlayer.attack(gameManager.player, 1, 0);

		gameManager.makePlayerMove(2, 2);
		gameManager.makePlayerMove(2, 3);

		expect(gameManager.playerScore).toBe(7);
		expect(gameManager.secondPlayerScore).toBe(2);
	});
	test("GameManager should have methods to get the players' square", () => {
		const playerSquare = gameManager.getPlayerSquare(0, 0);
		expect(playerSquare).toBeInstanceOf(Ship);
		expect(playerSquare.numHits).toBe(2);

		const secondPlayerSquare = gameManager.getSecondPlayerSquare(2, 2);
		expect(secondPlayerSquare).toBeInstanceOf(Ship);
		expect(secondPlayerSquare.numHits).toBe(2);
		expect(secondPlayerSquare.isSunk).toBe(true);
	});
	test("GameManger should have methods to get the players' square state", () => {
		const hitPlayerSquare = gameManager.getPlayerSquareState(0, 0);
		expect(hitPlayerSquare).toBe("hit");

		const missedPlayerSquare = gameManager.getPlayerSquareState(0, 1);
		expect(missedPlayerSquare).toBe("miss");

		const hitSecondPlayerSquare = gameManager.getSecondPlayerSquareState(2, 2);
		expect(hitSecondPlayerSquare).toBe("hit");
	});
});

describe("Game manager computer game tests", () => {
	let gameManager;
	beforeAll(() => {
		gameManager = new GameManager(10, 5, 7, true);
		gameManager.initializePlayers("player");
	});
	test("Second player should be a computer player.", () => {
		expect(gameManager.secondPlayer).toBeInstanceOf(ComputerPlayer);
		expect(gameManager.secondPlayerName).toBe("Computer");
	});
	test("GameManger should have a method for initializing the correct number of computer ships", () => {
		expect(gameManager.initializeComputerShips).toBeDefined();
		expect(gameManager.initializeComputerShips).toBeInstanceOf(Function);
		expect(gameManager.secondPlayer.gameBoard.ships).toHaveLength(5);
	});
	test("GameManager should have a method to make a computer move.", () => {
		const res = gameManager.makeComputerMove();

		expect(res).toMatchObject({ x: expect.any(Number), y: expect.any(Number) });
		expect(res.ship === null || res.ship instanceof Ship).toBe(true);
	});
});
