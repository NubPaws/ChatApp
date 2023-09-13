import "./SpeechBubble.css";

export function SpeechBubble(props) {
	return <div className={`speechBubble speechBubble${props.direction === "left" ? "Left" : "Right"}`}>
		{props.children}
		<span className="timestamp">{props.timestamp}</span>
	</div>
}
