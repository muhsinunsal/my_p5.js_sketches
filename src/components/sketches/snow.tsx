import p5, { Vector } from "p5";

const snow = (p: p5) => {
	const canvasSize = new Vector(window.innerWidth,window.innerHeight);
	class RainDrop {
		constructor(public pos: Vector, public size: Vector, public ySpeed: number) {
			this.pos = new Vector(p.random(0, canvasSize.x), p.random(-1 * canvasSize.y, canvasSize.y), p.random(2));
			this.size = new Vector(this.pos.z * 2, 0);
			this.ySpeed = 1;
		}
		update() {
			this.ySpeed += p.map(this.pos.z, 0, 0.01, 0, 0.0001);
			this.pos.y += this.ySpeed;
			if (this.pos.y > canvasSize.y) {
				this.ySpeed = 1;
				this.pos.y = 0;
			}
		}
		render() {
			p.stroke(p.map(this.pos.z, 0, 2, 128, 255), 255, 255);
			p.strokeWeight(this.size.x);
			p.line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.size.y);
		}
	}
	const rain: {
		array: RainDrop[];
		count: number;
	} = { array: [], count: 1000 };

	p.setup = () => {
		p.createCanvas(canvasSize.x, canvasSize.y);
		for (let i = 0; i < rain.count; i++) {
			const position = new Vector(
				p.random(0, canvasSize.x),
				p.random(-1 * canvasSize.y, canvasSize.y),
				p.random(2)
			);
			const size = new Vector(position.z * 2, 0);
			const ySpeed = 1;
			rain.array.push(new RainDrop(position, size, ySpeed));
		}
	};
	p.draw = () => {
		p.background(55);
		rain.array.forEach((drop) => {
			drop.update();
			drop.render();
		});
	};
};
export default snow;
