import { IconButton } from "../UIElements/Button.js";
import { Modal } from "../UIElements/Modal.js";
import { useState } from "react";

import "./UserProfile.css";
import "./Contact.css";
import personAdd from "../imgs/personAdd.svg";

export function UserProfile(props) {
	const [ show, setShow ] = useState(false);
	const setContactToAdd = props.setContactToAdd;
	
	function updateContactNameToAdd() {
		// This solution is meant to force a rerender to occur.
		setContactToAdd(document.getElementById("userAddTextField").value);
		props.addToContactList(document.getElementById("userAddTextField").value);
	}
	
	return (
		<div id="userProfile">
			<img className="profileImg" alt="Profile" src={props.image} />
			<h5 className="username">{props.username}</h5>
			<IconButton
				image={personAdd}
				alt="Add Person"
				onClick={() => setShow(true)} />
			<Modal
				onClose={() => setShow(false)}
				onAccept={updateContactNameToAdd}
				show={show}
				title="Add a new contact">
				<div id="userAddTextFieldContainer">
					<input id="userAddTextField" type="text" placeholder="Enter contact name..." />
				</div>
			</Modal>
		</div>
	);
}
