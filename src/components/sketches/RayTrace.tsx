import { Sketch } from "@p5-wrapper/react";
import p5, { Font, Vector } from "p5";
import fontFile from "../../assets/Roboto-ThinItalic.ttf"

const rayTrace: Sketch = (p: p5) => {
	const canvasSize = new Vector(0, 500);
	const canvasCenter = p5.Vector.div(canvasSize, 2) as unknown as Vector;
	const isMobile = window.innerHeight > window.innerWidth;

	class Boundary {
		a: Vector;
		b: Vector;
		constructor(x1: number, y1: number, x2: number, y2: number) {
			this.a = p.createVector(x1, y1);
			this.b = p.createVector(x2, y2);
		}
		show() {
			p.noStroke();
			// p.stroke(255)
			p.line(this.a.x, this.a.y, this.b.x, this.b.y);
		}
	}

	class Ray {
		dir: Vector;
		constructor(public pos: Vector, public angle: number) {
			this.pos = pos;
			this.dir = p5.Vector.fromAngle(angle);
		}
		show() {
			p.stroke(255);
			p.push();
			p.translate(this.pos.x, this.pos.y);
			p.line(0, 0, this.dir.x * 10, this.dir.y * 10);
			p.pop();
		}
		lookAt(x: number, y: number) {
			this.dir.x = x - this.pos.x;
			this.dir.y = y - this.pos.y;

			this.dir.normalize();
		}
		cast(wall: Boundary) {
			const x1 = wall.a.x;
			const y1 = wall.a.y;
			const x2 = wall.b.x;
			const y2 = wall.b.y;

			const x3 = this.pos.x;
			const y3 = this.pos.y;
			const x4 = this.pos.x + this.dir.x;
			const y4 = this.pos.y + this.dir.y;

			const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

			if (denominator == 0) return false;
			const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
			const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denominator;
			// const u = -((x1-x2)* (y1 -y3) - (y1-y2) * (x1 -x3)) / denominator;

			if (t > 0 && t < 1 && u > 0) {
				const pt = p.createVector();
				pt.x = x1 + t * (x2 - x1);
				pt.y = y1 + t * (y2 - y1);

				return pt;
			} else {
				return false;
			}
		}
	}

	class Particle {
		pos: Vector;
		rays: Ray[];

		constructor(public density: number) {
			// this.pos = p.createVector(canvasSize.x / 2, canvasSize.y / 2);
			this.pos = p.createVector(100, 200);
			this.rays = [];
			for (let a = 0; a < 360; a += this.density) {
				this.rays.push(new Ray(this.pos, p.radians(a)));
			}
		}
		look(walls: Boundary[]) {
			for (const ray of this.rays) {
				let closest = null;
				let record = Infinity;
				for (const wall of walls) {
					const pt = ray.cast(wall);
					if (pt) {
						const dist = p5.Vector.dist(this.pos, pt);
						if (dist < record) {
							record = dist;
							closest = pt;
						}
					}
				}

				if (closest) {
					const dist = p5.Vector.dist(this.pos, closest);
					const color = p.map(dist, 0, 1000, 192, 55);
					const shadowColor = color * 0.5;
					// Main Ray
					p.fill(color);
					p.stroke(color);
					p.line(this.pos.x, this.pos.y, closest.x, closest.y);

					// Shadow Ray
					const depth = canvasSize.x * (isMobile ? 0.03 : 0.01);

					p.fill(shadowColor);
					p.stroke(shadowColor);
					p.line(closest.x, closest.y, closest.x + depth, closest.y + depth);

					// Reset
					p.fill(color);
					p.noStroke();
					p.circle(closest.x, closest.y, isMobile ? 5 : 4);

					p.stroke(color);
				}
			}
		}
		update(x: number, y: number) {
			this.pos.set(x, y);
		}
		show() {
			p.fill(255);
			p.circle(this.pos.x, this.pos.y, 1);
			for (const ray of this.rays) {
				ray.show();
			}
		}
	}

	const connectDots = (pointArr: Vector[]) => {
		const returnArr = [];
		let flag: Vector | undefined;
		for (let i = 0; i < pointArr.length; i++) {
			const currentPoint = pointArr[i];
			const nextPoint = pointArr[pointArr.length] != currentPoint ? pointArr[i + 1] : null;

			// If new letter starts set flag
			if (currentPoint == pointArr[0]) {
				flag = currentPoint;
			}

			if (nextPoint) {
				// If next point is not far join with it
				if (p.dist(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y) < 15) {
					returnArr.push(new Boundary(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y));
					// p.line(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y)
				} else {
					// If next point is far join with first point of its letter and set new flag
					if (flag) {
						returnArr.push(new Boundary(currentPoint.x, currentPoint.y, flag.x, flag.y));
					}
					//  p.line(currentPoint.x, currentPoint.y, flag.x, flag.y)
					flag = nextPoint;
				}
			} else {
				// If last point join with previus point
				if (flag) {
					returnArr.push(new Boundary(currentPoint.x, currentPoint.y, flag.x, flag.y));
				}
				// p.line(currentPoint.x, currentPoint.y, flag.x, flag.y)
			}
		}
		return returnArr;
	};
	let walls = [];
	let particle: Particle;
	let prevParticle: Particle;
	let prevStep = 0;
	let font: Font;

	function drawEllipsePoints(
		centerX: number,
		centerY: number,
		radiusX: number,
		radiusY: number,
		numPoints: number,
		mode: "top" | "bot"
	) {
		let startPoint;
		if (mode === "top") {
			startPoint = 4.712389;
		} else if (mode === "bot") {
			startPoint = 1.570796;
		}
		const angle = (prevStep / numPoints) * p.TWO_PI + startPoint!;
		prevStep += 1;
		const x = centerX + radiusX * p.cos(angle);
		const y = centerY + radiusY * p.sin(angle);
		return [x, y];
	}

	p.preload = () => {
		// Creates a p5.Font object.
		font = p.loadFont("../../"+fontFile);
	};
	let points: Vector[];
	p.setup = () => {
		const canvas = p.createCanvas(canvasSize.x, canvasSize.y);
		const canvasParent = canvas.parent() as unknown as HTMLDivElement;
		let w;
		let h;
		if (canvas.id() === "defaultCanvas0") {
			w = window.innerWidth - 15;
			h = window.innerHeight;
		} else {
			const canvasParentDim = canvasParent.getBoundingClientRect();
			w = canvasParentDim.width;
			h = canvasParentDim.height;
		}
		p.resizeCanvas(w, h);
		canvasSize.x = w;
		canvasSize.y = h;
		canvasCenter.x = canvasSize.x / 2;
		canvasCenter.y = canvasSize.y / 2;

		if (isMobile) {
			particle = new Particle(3);
			prevParticle = new Particle(3);
		} else {
			particle = new Particle(2);
			prevParticle = new Particle(2);
		}

		p.stroke(255);
		const textContent = "Welcome";
		const textSize = canvasSize.x * 0.2;
		type Box = { x: number; y: number; w: number; h: number };
		p.stroke(255);
		const textBounderies: Box = font.textBounds(textContent, canvasCenter.x, canvasCenter.y, textSize) as Box;

		points = font.textToPoints(
			textContent,
			canvasCenter.x - textBounderies.w / 2,
			canvasCenter.y + textBounderies.h / 2,
			textSize
		);
	};
	p.draw = () => {
		// p.noLoop();
		p.background(36);
		walls = connectDots(points);
		for (const wall of walls) {
			wall.show();
		}
		// points.forEach((point) => {
		// 	p.stroke(200,250,200);
		// 	p.circle(point.x, point.y, 1);
		// });

		const speed = isMobile ? 1000 : 2000;
		const [x1, y1] = drawEllipsePoints(
			canvasCenter.x,
			canvasCenter.y,
			(canvasSize.x / 2) * 0.95,
			(canvasSize.y / 2) * 0.7,
			speed,
			"top"
		)!;
		prevParticle.update(x1, y1);
		prevParticle.show();
		prevParticle.look(walls);
		/*
		const [x2, y2] = drawEllipsePoints(
			canvasCenter.x,
			canvasCenter.y,
			(canvasSize.x / 2) * 0.95,
			(canvasSize.y / 2) * 0.7,
			speed,
			"bot"
		)!;
		prevParticle.update(x2, y2);
		prevParticle.show();
		prevParticle.look(walls);
			*/
		if (p.mouseIsPressed) {
			if (p.mouseX < canvasSize.x && p.mouseY < canvasSize.y) {
				
				particle.update(p.mouseX, p.mouseY);
				particle.show();
				particle.look(walls);
			}
		}
	};
};
export default rayTrace;
