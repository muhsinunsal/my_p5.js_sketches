import { Sketch } from "@p5-wrapper/react";

import snow from "../sketches/snow";
import starfield from "../sketches/starfield";
import wiggly from "../sketches/wiggly";

type canvasEl = { name: string; func: Sketch };
const canvasArr: canvasEl[] = [
	{ name: "snow", func: snow },
    { name: "starfield", func: starfield},
    { name: "wiggly", func: wiggly }
];
export default canvasArr;
