import { Sketch } from "@p5-wrapper/react";

import snow from "../sketches/snow";
import starfield from "../sketches/starfield";
import wiggly from "../sketches/wiggly";
import wallPingPong from "../sketches/wallPingPong"

type canvasEl = { name: string; func: Sketch };
const canvasArr: canvasEl[] = [
	{ name: "snow", func: snow },
    { name: "starfield", func: starfield},
    { name: "wiggly", func: wiggly },
    { name: "wall-ping-pong", func: wallPingPong},
];
export default canvasArr;
