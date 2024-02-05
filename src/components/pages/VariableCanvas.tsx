import React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import canvasArr from "./Canvases";
import SideBtns from "../SideBtns";
const VariableCanvas: React.FC<{ sketchName: string }> = ({ sketchName }) => {
	if (sketchName === "Ground") return <></>;

	const sketch = canvasArr.find((e) => e.name === sketchName);
	if (sketchName !== "Ground" && sketch) {
		return (
			<div className="content section">
				<SideBtns/>
				<ReactP5Wrapper sketch={sketch.func} />
			</div>
		);
	}
};

export default VariableCanvas;
