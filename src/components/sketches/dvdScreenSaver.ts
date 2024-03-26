import p5, { Vector } from "p5";
import dvd from "./../../assets/dvd.svg";

const dvdScreenSaver = (p: p5) => {
	const canvasSize = new Vector(window.innerWidth, window.innerHeight);
	const center = p.createVector(canvasSize.x / 2, canvasSize.y / 2);

	let icon: p5.Image;
	const dimention = p.createVector(200, 200);
	let velocity = p.createVector(5, 1);
	velocity = velocity.normalize();
	velocity.mult(5);
	const position = center;
	const color = new Vector(255, 255, 255);
	
	p.preload = () => {
		icon = p.loadImage(dvd);
	};
	p.setup = () => {
		p.createCanvas(canvasSize.x, canvasSize.y);
		console.log(icon);
	};
	const didItCollide = () => {
		if (position.x <= 0 || position.x + dimention.x >= canvasSize.x) {
			velocity.x *= -1;
			return true;
		}
		if (position.y <= 0 || position.y + dimention.y >= canvasSize.y) {
			velocity.y *= -1;
			return true;
		}
		return false;
	};
	p.draw = () => {
		p.background("#242424");
		p.image(icon, position.x, position.y, dimention.x, dimention.y);
		p.tint(color.x, color.y, color.z);

		if (didItCollide()) {
			color.x = p.random(255);
			color.y = p.random(255);
			color.z = p.random(255);
		}
		position.add(velocity);
	};
};

export default dvdScreenSaver;
