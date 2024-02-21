import p5, { Vector } from "p5";

const mineSweeper = (p: p5) => {
	const canvasSize = new Vector(window.innerWidth, window.innerHeight);
	const center = { x: canvasSize.x / 2, y: canvasSize.y / 2 + 30 };
	const isMobile = window.innerHeight > window.innerWidth;
	const colors = {
		board: { borderColor: "#adb5bd", fillColor: "#adb5bd" },
		block_hidden: { borderColor: "#343a40", fillColor: "#6c757d" },
		block_revealed: { borderColor: "#353839", fillColor: "#ced4da" },
		block_mine: { borderColor: "#adb5bd", fillColor: "#212529" },
		block_clear: { borderColor: "#353839", fillColor: "#1A1A1A" },
		mode_btn_deactive: { borderColor: "#353839", fillColor: "#1A1A1A" },
		mode_btn_active: { borderColor: "#1A1A1A", fillColor: "#353839" },
	};

	const gameStatus = {
		totalMine: 0,
		mineLeft: 0,
		gameOver: false,
		gameTime: "",
	};

	class ModeBtn {
		public mode: "SET_FLAG" | "REVEAL";
		public pos: Vector;
		public dim: Vector;
		constructor(pos: Vector, dim: Vector) {
			this.mode = "REVEAL";
			this.pos = pos;
			this.dim = dim;
		}
		setMode(mode?: "SET_FLAG" | "REVEAL") {
			if (mode) {
				return (this.mode = mode);
			}
			return (this.mode = this.mode === "SET_FLAG" ? "REVEAL" : "SET_FLAG");
		}
		render() {
			if (this.mode == "REVEAL") {
				p.strokeWeight(4);
				p.fill(colors.mode_btn_deactive.borderColor);
				p.stroke(colors.mode_btn_deactive.fillColor);
			} else if (this.mode == "SET_FLAG") {
				p.strokeWeight(4);
				p.fill(colors.mode_btn_active.borderColor);
				p.stroke(colors.mode_btn_active.fillColor);
			}
			p.rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);

			p.strokeWeight(1);
			p.textSize(20)
			if (this.mode == "REVEAL") {
				p.stroke(colors.mode_btn_active.borderColor);
				p.fill("#fff");
				p.textAlign(p.CENTER, p.CENTER);
				p.text("Reveal", this.pos.x + this.dim.x / 2, this.pos.y + this.dim.x / 2);
			} else if (this.mode == "SET_FLAG") {
				p.stroke(colors.mode_btn_active.borderColor);
				p.fill("#fff");
				p.textAlign(p.CENTER, p.CENTER);
				p.text("Set Flag", this.pos.x + this.dim.x / 2, this.pos.y + this.dim.x / 2);
			}
			p.textSize(12)

		}
		checkAction() {
			if (
				p.mouseX > this.pos.x &&
				p.mouseX < this.pos.x + this.dim.x &&
				p.mouseY > this.pos.y &&
				p.mouseY < this.pos.y + this.dim.y
			) {
				this.setMode();
			}
		}
	}

	class Block {
		// Position in Board.matrix
		public arrayPos: Vector;
		// Blocks dimention in pixels
		public blockDim: Vector;
		// Blocks team
		public isMine: boolean;
		// Blocks display
		public revealed: boolean;
		// Is Block FLAGED ?
		public flaged: boolean;
		//Top left postion of Block
		public pos: Vector;
		constructor(boardPos: Vector, arrayPos: Vector, blockDim: Vector, isMine: boolean) {
			this.arrayPos = arrayPos;
			this.blockDim = blockDim;
			this.pos = new Vector(boardPos.x + this.arrayPos.x * blockDim.x, boardPos.y + this.arrayPos.y * blockDim.y);
			this.isMine = isMine;
			this.revealed = false;
			this.flaged = false;
		}
		countNeighbors = () => {
			let total = 0;
			if (this.isMine) {
				return -1;
			}
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (BOARD.matrix[this.arrayPos.x + i] && BOARD.matrix[this.arrayPos.x + i][this.arrayPos.y + j]) {
						if (BOARD.matrix[this.arrayPos.x + i][this.arrayPos.y + j].isMine) {
							total++;
						}
					}
				}
			}
			return total;
		};
		render = () => {
			p.strokeWeight(0.1);
			const flaged = !this.revealed && this.flaged;
			const mine = this.revealed && this.isMine;
			const empty = this.revealed && !this.isMine;

			// Set default coloring , if status are not default it will change
			p.fill(colors.block_hidden.fillColor);
			p.stroke(colors.block_hidden.borderColor);
			if (flaged) {
				p.fill(colors.block_revealed.fillColor);
			}
			if (mine) {
				p.fill(colors.block_revealed.fillColor);
			}
			if (empty) {
				p.fill(colors.block_revealed.fillColor);
			}
			// Draw Block
			p.rect(this.pos.x, this.pos.y, this.blockDim.x, this.blockDim.y);
			// Draw Extras
			if (flaged) {
				p.fill("#FFBF00");
				p.stroke(colors.block_mine.fillColor);
				p.ellipse(this.pos.x + this.blockDim.x / 2, this.pos.y + this.blockDim.y / 2, this.blockDim.x * 0.5);
				p.noFill();
			}
			if (mine) {
				p.fill("#f00");
				// p.strokeWeight(5);
				p.stroke(colors.block_mine.fillColor);
				p.ellipse(this.pos.x + this.blockDim.x / 2, this.pos.y + this.blockDim.y / 2, this.blockDim.x * 0.5);
				p.noFill();
			}
			if (empty) {
				p.fill("#000");
				p.strokeWeight(2)
				p.textAlign(p.CENTER, p.CENTER);
				if (this.countNeighbors() != 0) {
					p.text(this.countNeighbors(), this.pos.x + this.blockDim.x / 2, this.pos.y + this.blockDim.y / 2);
				}
			}
		};
	}

	class Board {
		//Top Left Postion
		public pos: Vector;
		//Center Position
		public center: Vector;
		// Block Matrix
		public matrix: Block[][];
		// Dimentions of Board in pixel
		private boardDim: Vector;
		// Dimentions of one Block in pixel
		private blockDim: Vector;
		// Active Ball Array
		constructor(pos: Vector, size: Vector, boardDim: Vector) {
			this.pos = pos;
			this.boardDim = boardDim;
			this.center = p.createVector(this.pos.x + boardDim.x / 2, this.pos.y + boardDim.y / 2);
			this.blockDim = p.createVector(boardDim.x / size.x, boardDim.y / size.y);
			this.matrix = this.initMatrix(size);
		}
		initMatrix = (size: Vector) => {
			const matrix: Block[][] = [];
			gameStatus.totalMine = 0;
			gameStatus.mineLeft = 0;
			for (let i = 0; i < size.x; i++) {
				matrix[i] = [];
			}

			for (let i = 0; i < size.y; i++) {
				for (let j = 0; j < size.x; j++) {
					if (p.random(1) < 0.2) {
						matrix[i][j] = new Block(this.pos, new Vector(i, j), this.blockDim, true);
						gameStatus.totalMine++;
					} else {
						matrix[i][j] = new Block(this.pos, new Vector(i, j), this.blockDim, false);
					}
				}
			}
			return matrix;
		};
		render() {
			// Board Border
			p.stroke(colors.board.borderColor);
			p.strokeWeight(5);
			p.square(this.pos.x, this.pos.y, this.boardDim.x);

			this.matrix.forEach((row) => row.forEach((colmn) => colmn?.render()));
		}
		pop(selectedBlock: Block) {
			if (selectedBlock.revealed) {
				return false;
			}
			selectedBlock.revealed = true;

			if (selectedBlock.isMine) {
				gameStatus.gameOver = true;
				return true;
			} else {
				if (selectedBlock.countNeighbors() === 0) {
					for (let i = -1; i <= 1; i++) {
						for (let j = -1; j <= 1; j++) {
							const ix = selectedBlock.arrayPos.x + i;
							const jy = selectedBlock.arrayPos.y + j;
							if (ix > -1 && ix < this.matrix.length && jy > -1 && jy < this.matrix[0].length) {
								const neighbor = this.matrix[ix][jy];
								if (!neighbor.isMine && !neighbor.revealed) {
									this.pop(neighbor);
								}
							}
						}
					}
					/* FLood fill */
				}
				return false;
			}
		}
		checkAction(mode: "SET_FLAG" | "REVEAL") {
			BOARD.matrix.forEach((row) =>
				row.forEach((block: Block) => {
					if (
						p.mouseX > block.pos.x &&
						p.mouseX < block.pos.x + block.blockDim.x &&
						p.mouseY > block.pos.y &&
						p.mouseY < block.pos.y + block.blockDim.y
					) {
						if (mode === "REVEAL") {
							if (!block.flaged) {
								BOARD.pop(block);
							}
						} else if (mode === "SET_FLAG") {
							if (!block.revealed) {
								block.flaged = !block.flaged;
							}
						}
					}
				})
			);
		}
	}

	p.mouseClicked = () => {
		if (!gameStatus.gameOver) {
			MODEBTN.checkAction();
			BOARD.checkAction(MODEBTN.mode);
		}
	};

	p.doubleClicked = () => {
		if (gameStatus.gameOver) {
			gameStatus.gameOver = false;
			gameStatus.totalMine = 0;
			gameStatus.mineLeft = 0;
			BOARD.matrix = BOARD.initMatrix(new Vector(BOARD.matrix.length, BOARD.matrix[0].length));
		}
	};

	let BOARD: Board;
	let MODEBTN: ModeBtn;

	p.setup = () => {
		p.createCanvas(canvasSize.x, canvasSize.y);
		const matrixDim = isMobile
			? p.createVector(canvasSize.x * 0.9, canvasSize.x * 0.9)
			: p.createVector(canvasSize.y * 0.9, canvasSize.y * 0.9);
		const matrixSize = isMobile ? p.createVector(10, 10) : p.createVector(20, 20);
		const matrixPos = p.createVector(center.x - matrixDim.x / 2, center.y - matrixDim.y / 2);
		BOARD = new Board(matrixPos, matrixSize, matrixDim);

		const modeBtnDim = p.createVector(matrixDim.x * 0.2, matrixDim.y * 0.2);
		let modeBtnPos = p.createVector(center.x - matrixDim.x / 2 - modeBtnDim.x - 100, center.y - modeBtnDim.y / 2);
		if (isMobile) {
			modeBtnPos = p.createVector(center.x - modeBtnDim.x / 2, center.y - matrixDim.y / 2 - modeBtnDim.y - 20);
		}
		MODEBTN = new ModeBtn(modeBtnPos, modeBtnDim);
	};

	p.draw = () => {
		p.background("#242424");
		p.noFill();

		BOARD.render();
		MODEBTN.render();

		if (gameStatus.gameOver) {
			BOARD.matrix.forEach((row) =>
				row.forEach((colmn) => {
					if (colmn.isMine) {
						colmn.revealed = true;
						colmn?.render();
					}
				})
			);

			p.fill("#000");
			p.textSize(isMobile ? 50 : 100);
			p.stroke("#000");
			p.textAlign(p.CENTER, p.CENTER);
			p.text("Game Over", center.x, center.y);

			p.textSize(isMobile ? 17.5 : 25);
			p.text("Double Click to Restart", center.x, center.y + (isMobile ? 50 : 100));
			p.textSize(12);
		}
	};
};

export default mineSweeper;
