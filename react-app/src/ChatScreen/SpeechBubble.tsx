import "./SpeechBubble.css";
import type { ReactNode } from "react";

interface SpeechBubbleProps {
	direction: "left" | "right";
	timestamp: string;
	children?: ReactNode;
}

export function SpeechBubble({ direction, timestamp, children }: SpeechBubbleProps) {
	return (
		<div className={`speechBubble speechBubble${direction === "left" ? "Left" : "Right"}`}>
			{children}
			<span className="timestamp">{timestamp}</span>
		</div>
	);
}
