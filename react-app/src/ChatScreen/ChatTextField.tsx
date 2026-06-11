import { useState } from "react";
import { Button } from "../UIElements/Button.js";

import "./ChatTextField.css";

interface ChatTextFieldProps {
	setInputText: (text: string) => void;
	onSend: () => void;
}

export function ChatTextField({ setInputText, onSend }: ChatTextFieldProps) {
	const [textContent, setTextContent] = useState("");

	function sendMessage() {
		const txt = textContent.trim();
		if (txt === "") {
			return;
		}
		setInputText(txt);
		onSend();
		setTextContent("");
	}

	return (
		<div id="chatField">
			<input
				id="chatFieldText"
				type="text"
				placeholder="Write your message here..."
				value={textContent}
				onChange={(e) => setTextContent(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						sendMessage();
					}
				}}
			/>
			<Button borderWidth="1px" borderRadius="0" onClick={sendMessage}>
				Send
			</Button>
		</div>
	);
}
