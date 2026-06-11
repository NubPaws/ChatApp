import "./ContactList.css";
import type { MouseEventHandler } from "react";

interface ContactProps {
	className?: string;
	onClick?: MouseEventHandler<HTMLDivElement>;
	image?: string;
	displayName: string;
	lastMessage: string;
}

export function Contact({ className = "", onClick, image, displayName, lastMessage }: ContactProps) {
	return (
		<div className={`contactCard ${className}`} onClick={onClick}>
			<img className="profileImg" alt="Profile" src={image} />
			<h5 className="displayName">{displayName}</h5>
			<span className="lastMessage">{lastMessage}</span>
		</div>
	);
}
