import p5, { Vector } from "p5";

const canvasSize = { x: window.innerWidth, y: window.innerHeight };

const starfield = (p: p5) => {
	class Star {
		pos: Vector;
		r: number;
		constructor() {
			this.pos = new Vector(
				p.random(-canvasSize.x, canvasSize.x),
				p.random(-canvasSize.y, canvasSize.y),
				p.random(canvasSize.x)
			);

			this.r = p.map(this.pos.z, 0, canvasSize.x, 16, 0);
		}
		update() {
			this.pos.z -= 5;
			if (this.pos.z < 1) {
				this.pos.z = canvasSize.x;
				this.pos.x = p.random(-canvasSize.x, canvasSize.x);
				this.pos.y = p.random(-canvasSize.y, canvasSize.y);
			}
		}
		show() {
			p.fill(255);

			const sx = p.map(this.pos.x / this.pos.z, 0, 1, 0, canvasSize.x);
			const sy = p.map(this.pos.y / this.pos.z, 0, 1, 0, canvasSize.y);
			this.r = p.map(this.pos.z, 0, canvasSize.x, 16, 0);

			p.stroke(p.map(this.r, 16, 0, 255, 190), 255, 255);
			p.circle(sx, sy, this.r);
		}
	}
	const stars: {
		array: Star[];
		count: number;
	} = { array: [], count: 1000 };
	p.setup = () => {
		p.createCanvas(canvasSize.x, canvasSize.y);
		p.background(55);
		for (let i = 0; i < stars.count; i++) {
			stars.array.push(new Star());
		}
	};
	p.draw = () => {
		p.background(55);
		p.translate(canvasSize.x / 2, canvasSize.y / 2);
		for (let i = 0; i < stars.count; i++) {
			stars.array[i].show();
			stars.array[i].update();
		}
	};
};
export default starfield;
