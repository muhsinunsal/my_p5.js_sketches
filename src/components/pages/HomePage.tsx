// import { rayTrace } from "../sketches/RayTrace"
import React from "react";
import rayTrace from "../sketches/RayTrace";
import { ReactP5Wrapper } from "@p5-wrapper/react";

const HomePage: React.FC = () => {
	return (
		<>
			<ReactP5Wrapper sketch={rayTrace} />
			<p>
				Hello,
				<br />
				This repostry is for my p5.js sketches that i did in my free time. Feel free to explore.
				<br />
				You may find references (video, blockposts) to related skethes in sections.
			</p>
			<div> </div>
		</>
	);
};

export default HomePage;
