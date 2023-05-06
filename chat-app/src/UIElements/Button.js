import "./Button.css";

export function Button(props) {
	const extraStyle = {
		backgroundColor: props.bgColor,
		color: props.textColor,
		borderWidth: props.borderWidth,
	};
	return (
		<button
			className={`btn ${props.className}`}
			style={extraStyle}
			onClick={props.onClick}
		>{props.text}</button>
	);
}

Button.defaultProps = {
	backgroundColor: "white",
	color: "black",
	text: "",
	className: "",
	borderWidth: "2px",
};

export function IconButton(props) {
	return (
		<button
			className={`iconBtn ${props.className}`}
			onClick={props.onClick}
		>
			<img src={props.image} alt={props.alt} width={props.width} height={props.height} />
		</button>
	);
}

IconButton.defaultProps = {
	className: "",
	alt: "",
	width: "100%",
	height: "100%",
}
