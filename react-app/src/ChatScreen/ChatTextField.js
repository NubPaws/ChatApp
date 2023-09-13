import { useState } from "react";
import { Button } from "../UIElements/Button.js";

import "./ChatTextField.css";

export function ChatTextField(props) {
	const [textContent, setTextContent] = useState("");
	const {setInputText, onSend} = props;
	
	function sendMessage() {
		// First make sure that the text is valid. If not then don't send it
		// to the inputText and update the entire component.	
		const txt = textContent.trim();
		if (txt === "")
			return;
		// If the text is valid send it to the hook and update.
		setInputText(txt);
		onSend();
		setTextContent("");
	}
	
	return <div id="chatField">
		<input id="chatFieldText" type="text" placeholder="Write your message here..."
			value={textContent}
			onChange={() => {
				setTextContent(document.getElementById("chatFieldText").value);
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter")
					sendMessage();
			}
		} />
		<Button
			borderWidth="1px"
			borderRadius="0"
			onClick={sendMessage}
		>Send</Button>
	</div>
}
