import "./style.sass";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/pages/HomePage";
// import Footer from "./components/Footer";
import { CgSmileMouthOpen } from "react-icons/cg";

function App() {
	return (
		<>
			{
				<Router basename="/">
					<Header/>
					<main>
					<Routes>
						<Route path="/" element={<HomePage/>}></Route>
						<Route
							path="/about/"
							element={
									<h1>
										Welcome to my site <CgSmileMouthOpen/>
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
