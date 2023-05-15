import { useEffect, useState } from "react";
import { ChatScreen } from "./ChatScreen/ChatScreen.js";
import './App.css';

import catImage from "./imgs/cat.png";
import raccoonImage from "./imgs/raccoon.png";

function App() {
	const [database, setDatabase] = useState({});
	
	useEffect(() => {
		setDatabase({
			"Sir Cat": {
				image: catImage,
				messages: {
					"Mr. Rocket": [
						{message: "Why do you like raccoons?", time: "Tue Dec 20 2022 16:19:00 GMT+0200 (Israel Standard Time)"},
						{message: "Weirdo!", time: "Tue Dec 20 2022 16:42:00 GMT+0200 (Israel Standard Time)"},
					],
				},
			},
			"Mr. Rocket": {
				image: raccoonImage,
				messages: {
					"Sir Cat": [
						{message: "Why don't you?", time: "Tue Dec 20 2022 16:41:00 GMT+0200 (Israel Standard Time)"},
					]
				},
			},
			"Mr. Raccoon": {
				image: raccoonImage,
				messages: {},
			}
		});
	}, []);
	
	return (
		<ChatScreen
			username="Sir Cat"
			databaseHook={[database, setDatabase]} />
	);
}

export default App;
