import GameBoard from "./gameboard.js";

export class Player {
	constructor(name, boardSize) {
		this.name = name;
		this.gameBoard = new GameBoard(boardSize);
	}
	makeAttack(player, x, y) {
		const playerBoard = player.gameBoard;
		return playerBoard.receiveAttack(x, y);
	}
}

export class ComputerPlayer extends Player {
	constructor(boardSize) {
		super("computer", boardSize);
	}
}
