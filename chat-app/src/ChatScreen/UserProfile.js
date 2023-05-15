import { IconButton } from "../UIElements/Button";
import { Modal } from "../UIElements/Modal";
import { useState } from "react";

import "./UserProfile.css";
import "./Contact.css";
import personAdd from "../imgs/personAdd.svg";

export function UserProfile(props) {
	const [ show, setShow ] = useState(false);
	const [ database, setDatabase ] = props.databaseHook;
	
	function addContactToList() {
		setShow(true);
	}
	
	return (
		<div id="userProfile">
			<img className="profileImg" alt="Profile" src={props.image} />
			<h5 className="username">{props.username}</h5>
			<IconButton
				image={personAdd}
				alt="Add Person"
				onClick={addContactToList} />
			<Modal onClose={() => setShow(false)} show={show} />
		</div>
	);
}
