import p5, { Vector } from "p5";

const wallPoingPongg = (p: p5) => {
	const canvasSize = new Vector(window.innerWidth, window.innerHeight);
	const center = { x: canvasSize.x / 2, y: canvasSize.y / 2 + 30 };
	const isMobile = window.innerHeight > window.innerWidth;

	const colors = {
		board: { borderColor: "#111111", fillColor: "#353839" },
		team_1: {
			ballColor: "#fffafa",
			ballBorderColor: "#2A3439",
			blockColor: "#2A3439",
			blockBorderColor: "#fffafa",
		},
		team_2: {
			ballColor: "#2A3439",
			ballBorderColor: "#fffafa",
			blockColor: "#fffafa",
			blockBorderColor: "#2A3439",
		},
	};

	class Ball {
		// Ball's center Position
		pos: Vector;
		// Ball's Radius
		radius: number;
		// Ball's Veclocity
		velocity: Vector;
		// Ball's Team
		team: boolean;
		constructor(startPos: Vector, radius: number, startVelocity: Vector, team: boolean) {
			this.pos = startPos;
			this.radius = radius;
			this.velocity = startVelocity;
			this.team = team;
		}
		render() {
			this.update();
			p.strokeWeight(2);
			p.fill(this.team ? colors.team_1.ballColor : colors.team_2.ballColor);
			p.stroke(this.team ? colors.team_1.ballBorderColor : colors.team_2.ballBorderColor);
			p.circle(this.pos.x, this.pos.y, this.radius);
		}
		update() {
			this.pos.add(this.velocity);
		}
		checkBoardBorderCollision(boardCenter: Vector, boardDim: Vector) {
			if (
				this.pos.x - this.radius / 2 <= boardCenter.x - boardDim.x / 2 ||
				this.pos.x + this.radius / 2 >= boardCenter.x + boardDim.x / 2
			) {
				this.velocity.x *= -1;
				this.velocity.y *= p.random(0.8,1.5)
			}
			if (
				this.pos.y - this.radius / 2 <= boardCenter.y - boardDim.y / 2 ||
				this.pos.y + this.radius / 2 >= boardCenter.y + boardDim.y / 2
			) {
				this.velocity.y *= -1;
			}
		}
		findAdjacentBlocks(boardMatrix: Block[][], sensitivity: number) {
			const highlightArr: Block[] = [];
			for (let i = 0; i < boardMatrix.length; i++) {
				for (let j = 0; j < boardMatrix[i].length; j++) {
					const newBlock = boardMatrix[i][j];
					const newDist = p5.Vector.dist(
						new Vector(newBlock.pos.x + newBlock.blockDim.x / 2, newBlock.pos.y + newBlock.blockDim.y / 2),
						this.pos
					);
					if (newDist < sensitivity) {
						highlightArr.push(newBlock);
					}
				}
			}
			p.fill(colors.board.fillColor);
			p.noStroke();

			// highlightArr.forEach((block) => {
			// 	p.rect(block.pos.x , block.pos.y , block.blockDim.x);
			// });

			return highlightArr;
		}

		checkEnemyTeamBorderCollision(boardMatrix: Block[][]) {
			const adjBlocks = this.findAdjacentBlocks(boardMatrix, boardMatrix[0][0].blockDim.x);

			adjBlocks.forEach((block) => {
				if (this.team !== block.team) {
					if (
						this.pos.x - this.radius / 2 >= block.pos.x - block.blockDim.x / 2 ||
						this.pos.x + this.radius / 2 <= block.pos.x + block.blockDim.x / 2
					) {
						block.team = this.team;
						this.velocity.x *= -1;
						this.velocity.y *= p.random(0.1, 2);
					}
					if (
						this.pos.y - this.radius / 2 >= block.pos.y - block.blockDim.y / 2 ||
						this.pos.y + this.radius / 2 <= block.pos.y + block.blockDim.y / 2
					) {
						block.team = this.team;
						this.velocity.y *= -1;
					}
				}
			});
		}
	}

	class Block {
		// Position in Board.matrix
		public arrayPos: Vector;
		// Blocks dimention in pixels
		public blockDim: Vector;
		// Blocks team
		public team: boolean;
		//Top left postion of Block
		public pos: Vector;
		constructor(boardPos: Vector, arrayPos: Vector, blockDim: Vector, team: boolean) {
			this.arrayPos = arrayPos;
			this.blockDim = blockDim;
			this.pos = new Vector(boardPos.x + this.arrayPos.x * blockDim.x, boardPos.y + this.arrayPos.y * blockDim.y);
			this.team = team;
		}
		render() {
			p.strokeWeight(0.1);
			// Team Colors
			p.fill(this.team ? colors.team_1.blockColor : colors.team_2.blockColor);
			p.stroke(this.team ? colors.team_1.blockBorderColor : colors.team_2.blockBorderColor);

			// Draw Block
			p.rect(this.pos.x, this.pos.y, this.blockDim.x, this.blockDim.y);
		}
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
		public balls: Ball[];
		constructor(pos: Vector, size: Vector, boardDim: Vector) {
			this.pos = pos;
			this.boardDim = boardDim;
			this.center = p.createVector(this.pos.x + boardDim.x / 2, this.pos.y + boardDim.y / 2);
			this.blockDim = p.createVector(boardDim.x / size.x, boardDim.y / size.y);
			this.matrix = this.initMatrix(size);
			this.balls = [
				new Ball(
					new Vector(pos.x + this.blockDim.x, pos.y + boardDim.y / 2),
					this.blockDim.x,
					new Vector(5, 1),
					true
				),
				new Ball(
					new Vector(pos.x + boardDim.x - this.blockDim.x, pos.y + boardDim.y / 2),
					this.blockDim.x,
					new Vector(5, 4),
					false
				),
			];
		}
		private initMatrix = (size: Vector) => {
			const matrix: Block[][] = [];
			for (let i = 0; i < size.x; i++) {
				matrix[i] = [];
			}

			for (let i = 0; i < size.y; i++) {
				for (let j = 0; j < size.x; j++) {
					if (i < size.x / 2) {
						matrix[i][j] = new Block(this.pos, new Vector(i, j), this.blockDim, true);
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
			p.strokeWeight(20);
			p.square(this.pos.x, this.pos.y, this.boardDim.x);

			this.matrix.forEach((row) => row.forEach((colmn) => colmn?.render()));
			this.balls.forEach((ball) => {
				ball.checkBoardBorderCollision(this.center, this.boardDim);
				ball.checkEnemyTeamBorderCollision(this.matrix);
				ball.render();
			});

			// Center Indicator
			p.stroke(colors.board.fillColor)
			p.point(this.center.x, this.center.y);
		}
	}
	let BOARD: Board;
	p.setup = () => {
		p.createCanvas(canvasSize.x, canvasSize.y);
		const matrixDim = isMobile
			? p.createVector(canvasSize.x * 0.9, canvasSize.x * 0.9)
			: p.createVector(canvasSize.y * 0.9, canvasSize.y * 0.9);
		const matrixSize = p.createVector(10, 10);
		const matrixPos = p.createVector(center.x - matrixDim.x / 2, center.y - matrixDim.y / 2);
		BOARD = new Board(matrixPos, matrixSize, matrixDim);
	};

	p.draw = () => {
		p.background("#242424");
		p.noFill();
		BOARD.render();
	};
};

export default wallPoingPongg;
