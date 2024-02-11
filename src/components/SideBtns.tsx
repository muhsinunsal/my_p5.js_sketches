import { MdElevator } from "react-icons/md";

const SideBtns = () => {
	const hangleEscapeBtn = () => {
        const main = document.querySelector(".main") as HTMLDivElement 
        console.log(main)
		main.scrollIntoView({behavior: "smooth"});
	};

	return (
		<div className="side-btns">
			<MdElevator className="side-btns-btn main-btn" size={"5rem"} onClick={hangleEscapeBtn} />
		</div>
	);
};

export default SideBtns;
