import "css.gg/icons/icons.scss";
import React from "react";

const Icon: React.FC<{ iconName: string }> = ({ iconName }) => {
	return <i className={`gg-${iconName}`} style={{ display: "inline-block" }}></i>;
};

export default Icon;
