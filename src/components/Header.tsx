import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa6";

function Header() {
	return (
		<>
			<div className="nav">
				<div className="container">
					<Link to={"/"}>my_p5.js_sketches</Link>
					<span>
						<Link to={"https://github.com/muhsinunsal/my_p5.js_sketches"}>
							muhsinunsal
							<FaGithub />
						</Link>
					</span>
				</div>
			</div>
		</>
	);
}

export default Header;
