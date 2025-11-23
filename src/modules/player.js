import GameBoard from "./gameboard.js";

export class Player {
	constructor(name) {
		this.name = name;
		this.gameBoard = new GameBoard(10);
	}
	makeAttack(player, x, y) {
		const playerBoard = player.gameBoard;
		return playerBoard.receiveAttack(x, y);
	}
}

export class ComputerPlayer extends Player {
	constructor() {
		super();
		this.name = "computer";
	}
}
