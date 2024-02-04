import React from "react";
import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import rayTrace from "../sketches/RayTrace";
import rain from "../sketches/Rain";

const VariableCanvas: React.FC<{ sketchName: string }> = ({ sketchName }) => {
	if (sketchName === "Ground") return <></>;
	type canvasEl = { name: string; func: Sketch };
	const canvasArr: canvasEl[] = [
		{ name: "rayTrace", func: rayTrace },
		{ name: "rain", func: rain },
        
	];
	const sketch = canvasArr.find((e) => e.name === sketchName);
	if (sketchName !== "Ground" && sketch) {
		return (
			<div className="content section">
				<ReactP5Wrapper sketch={sketch.func} />
			</div>
		);
	}
};

export default VariableCanvas;
