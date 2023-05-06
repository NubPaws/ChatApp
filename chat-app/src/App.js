import { useState } from "react";
import { ChatScreen } from "./ChatScreen/ChatScreen.js";
import './App.css';

import catImage from "./imgs/cat.png";
import raccoonImage from "./imgs/raccoon.png";

function App() {
	const [contacts, setContacts] = useState([{
		username: "Mr. Raccoon",
		image: raccoonImage,
		lastMessage: "14:20 20/12/2023",
	},{
		username: "Mr. Raccoon",
		image: raccoonImage,
		lastMessage: "14:20 20/12/2023",
	},]);
	
	setContacts(arr => [...arr, {
		username: "Mr. Raccoon",
		image: raccoonImage,
		lastMessage: "14:20 20/12/2023",
	}]);
	
	return (
		<ChatScreen
			profileImage={catImage}
			contacts={contacts} />
	);
}

export default App;
