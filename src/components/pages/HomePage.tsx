// import { rayTrace } from "../sketches/RayTrace"
import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import rayTrace from "../sketches/RayTrace";
import { MdWavingHand } from "react-icons/md";
import { BiCollapseHorizontal, BiExpandHorizontal, BiBell } from "react-icons/bi";
import { PiKeyhole } from "react-icons/pi";
import VariableCanvas from "./VariableCanvas";
import { ReactP5Wrapper } from "@p5-wrapper/react";

const HomePage: React.FC = () => {
	const canvases = ["rain", "rayTrace"];
	const [activeCanvas, setActiveCanvas] = useState<string>("Ground");
	const canvasRef = useRef(null);

	return (
		<>
			<header id="header" className="section">
				<ReactP5Wrapper sketch={rayTrace} />
			</header>
			<hr />

			<div className="main section">
				<div className="main-p">
					<div className="container">
						<p>
							Hello <MdWavingHand size={"2rem"} />
						</p>
						<p>
							This repostry is for my p5.js sketches that i did in my free time. <br />
							You may find references (video, blockposts) to related skethes in sections.{" "}
						</p>
						<p>Feel free to explore.</p>
					</div>
				</div>
				<ul className="elevator">
					<div className="elevator-keyhole">
						<PiKeyhole size={"1.5rem"} />
					</div>
					{canvases.reverse().map((name, index) => {
						return (
							<li key={canvases.length - index}>
								<NavLink to={`${name}`} onClick={() => setActiveCanvas(name)}>
									<span className="elevator-btn">
										<span className="elevator-btn-label">{canvases.length - index}</span>
										<span className="elevator-btn-btn"></span>
									</span>
									<span className="elevator-floor">{name}</span>
								</NavLink>
							</li>
						);
					})}
					<li>
						<NavLink to={`/`} onClick={() => setActiveCanvas("Ground")}>
							<span className="elevator-btn green">
								<span className="elevator-btn-label">{"G"}</span>
								<span className="elevator-btn-btn"></span>
							</span>
							<span className="elevator-floor">Ground</span>
						</NavLink>
					</li>
					<div className="elevator-bot-btns">
						<span className="elevator-btn-btn">
							<BiCollapseHorizontal />
						</span>
						<span className="elevator-btn-btn yellow">
							<BiBell />
						</span>

						<span className="elevator-btn-btn">
							<BiExpandHorizontal />
						</span>
					</div>
				</ul>
			</div>
			<div ref={canvasRef}>
				<VariableCanvas  sketchName={activeCanvas} />
			</div>
		</>
	);
};

export default HomePage;
