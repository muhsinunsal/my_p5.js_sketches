import p5, { Vector } from "p5";

const canvasSize = { x: window.innerWidth, y: window.innerHeight };
const c = { x: canvasSize.x / 2, y: canvasSize.y / 2 };

const wiggly = (p: p5) => {
	const astroid = {
		pos: p.createVector(c.x, c.y),
		radius: 300,
		color: "#55",
	};

	class BorderSegment {
		pos: Vector;
		radius: number;
		n: number;
		color: [number, number, number];

		constructor(x: number, y: number, radius: number, color: [number, number, number]) {
			this.pos = new Vector(x, y);
			this.radius = radius;
			this.n = 0;
			this.color = color;
		}

		draw() {
			p.noStroke();
			p.fill(...this.color);
			p.circle(this.pos.x, this.pos.y, this.radius);
		}
		update() {
			this.n++;
			const noiseLevel = 100;
			const noiseScale = 0.001;
			// Scale input coordinate.
			const nt = noiseScale * p.frameCount;
			// Compute noise value.
			const noise = noiseLevel * p.noise(nt);
			this.radius = noise;
			this.color = [p.map(noise, 0, 100, 0, 255), 35, 35];
		}
	}
	const segmentStep = 2;

	const borderArr: BorderSegment[] = [];

	p.setup = () => {
		p.angleMode(p.DEGREES);
		p.createCanvas(canvasSize.x, canvasSize.y);
		p.background(55);

		for (let segment = 0; segment < 360 / segmentStep; segment++) {
			const newSegment = new BorderSegment(
				c.x + (astroid.radius / 2) * p.cos(segment * segmentStep),
				c.y + (astroid.radius / 2) * -p.sin(segment * segmentStep),
				astroid.radius,
				[10, 10, 10]
			);
			borderArr.push(newSegment);
		}
		for (const borderSegmentNoise of borderArr) {
			borderSegmentNoise.update();
		}
	};

	let n = 0;
	p.draw = () => {
		p.background(55);
		p.fill(20, 10, 10);
		p.circle(astroid.pos.x, astroid.pos.y, astroid.radius + 100);

		// ReDraw
		for (const borderSegmentNoise of borderArr) {
			borderSegmentNoise.draw();
		}

		borderArr[n % borderArr.length].update();
		n++;

		p.fill(100, 35, 35);

		p.circle(astroid.pos.x, astroid.pos.y, astroid.radius);
	};
};
export default wiggly;
