import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { MdElevator } from "react-icons/md";

const SideBtns = () => {
	const hangleEscapeBtn = () => {
        const main = document.querySelector(".main") as HTMLDivElement 
        console.log(main)
		main.scrollIntoView({behavior: "smooth"});
	};

	return (
		<div className="side-btns">
			<TiArrowSortedUp className="side-btns-btn sub-btn" size={"3rem"} />
			<MdElevator className="side-btns-btn main-btn" size={"5rem"} onClick={hangleEscapeBtn} />
			<TiArrowSortedDown className="side-btns-btn sub-btn" size={"3rem"} />
		</div>
	);
};

export default SideBtns;
