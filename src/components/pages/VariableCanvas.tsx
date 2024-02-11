import React, { useEffect, useRef } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import canvasArr from "./Canvases";
import SideBtns from "../SideBtns";
import { useLocation } from "react-router-dom";
const VariableCanvas: React.FC<{ sketchName: string }> = ({ sketchName }) => {
	const sketch = canvasArr.find((e) => e.name === sketchName);
	const loc = useLocation();
	const canvasRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (loc.pathname !== "/") {
			if (canvasRef.current) {
				canvasRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}
	}, [loc.pathname]);

	if (sketchName === "Ground") {
		return <div className="content section" ref={canvasRef} style={{ display: "none", height: "0px" } }></div>;
	}
	if (sketchName !== "Ground" && sketch) {
		return (
			<div className="content section" ref={canvasRef}>
				<SideBtns />
				<ReactP5Wrapper sketch={sketch.func} />
			</div>
		);
	}
};

export default VariableCanvas;
