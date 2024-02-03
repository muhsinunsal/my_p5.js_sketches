// import { rayTrace } from "../sketches/RayTrace"
import React from "react";
import { Link, useLocation } from "react-router-dom";
import rayTrace from "../sketches/RayTrace";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { MdWavingHand } from "react-icons/md";
import { BiCollapseHorizontal, BiExpandHorizontal, BiBell } from "react-icons/bi";
import { PiKeyhole } from "react-icons/pi";

const HomePage: React.FC = () => {
	const pages = ["Filler-1", "Filler-2", "Filler-3", "Filler-4", "Filler-5"];
	const loc = useLocation();
	console.log(loc);
	return (
		<>
			<header className="section">
				<ReactP5Wrapper sketch={rayTrace} />
			</header>
			<hr style={{ borderTop: "1px dash red" }} />

			<div className="main section">
				<div className="main-p">
					<div className="container">
						<p>
							Hello <MdWavingHand size={"2rem"} />
							<br />
							<br />
							This repostry is for my p5.js sketches that i did in my free time.
							<br />
							You may find references (video, blockposts) to related skethes in sections.
							<br />
							<br /> Feel free to explore.
						</p>
					</div>
				</div>
				<ul className="elevator">
					<div className="elevator-keyhole">
						<PiKeyhole size={"1.5rem"} />
					</div>
					{pages.reverse().map((name, index) => {
						return (
							<li key={pages.length - index}>
								<Link to={`${name}`} state={{ canvasElementName: name }}>
									<span className="elevator-btn">
										<span className="elevator-btn-label">{pages.length - index}</span>
										<span className="elevator-btn-btn"></span>
									</span>
									<span className="elevator-floor">{name}</span>
								</Link>
							</li>
						);
					})}
					<li>
						<Link to={`/`} state={{ canvasIndex: 0 }}>
							<span className="elevator-btn green">
								<span className="elevator-btn-label">{"G"}</span>
								<span className="elevator-btn-btn"></span>
							</span>
							<span className="elevator-floor">Ground</span>
						</Link>
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
				<h2 style={{textAlign:"center"}}>{loc.state.canvasElementName}</h2>
			</div>
			{/* <hr />
			<div className="canvasWrapper section">
				<h1>{loc.state.canvasIndex}</h1>
				<h2>{}</h2>
			</div> */}
		</>
	);
};

export default HomePage;
