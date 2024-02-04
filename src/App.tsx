import "./style.scss";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import HomePage from "./components/pages/HomePage";
// import Footer from "./components/Footer";
import { CgSmileMouthOpen } from "react-icons/cg";

function App() {
	return (
		<>
			{
				<Router basename="/">
					<Nav />
					<main>
						<Routes>
							<Route
								path="/*"
								element={
									<>
										<HomePage />
									</>
								}
							></Route>
							<Route
								path="/about/"
								element={
									<h1>
										Welcome to my site <CgSmileMouthOpen />
									</h1>
								}
							/>
						</Routes>
					</main>

					{/* <Footer/> */}
				</Router>
			}
		</>
	);
}

export default App;
