import "./Button.css";
import type { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
	bgColor?: string;
	textColor?: string;
	borderWidth?: string;
	borderRadius?: string;
	className?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children?: ReactNode;
}

export function Button({
	bgColor = "white",
	textColor = "black",
	borderWidth = "2px",
	borderRadius = "7px",
	className = "",
	onClick,
	children,
}: ButtonProps) {
	const extraStyle = {
		backgroundColor: bgColor,
		color: textColor,
		borderWidth,
		borderRadius,
	};
	return (
		<button className={`btn ${className}`} style={extraStyle} onClick={onClick}>
			{children}
		</button>
	);
}

interface IconButtonProps {
	image: string;
	alt?: string;
	width?: string;
	height?: string;
	className?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function IconButton({
	image,
	alt = "",
	width = "100%",
	height = "100%",
	className = "",
	onClick,
}: IconButtonProps) {
	return (
		<button className={`iconBtn ${className}`} onClick={onClick}>
			<img src={image} alt={alt} width={width} height={height} />
		</button>
	);
}
