import { IconButton } from "../UIElements/Button.js";
import { Modal } from "../UIElements/Modal.js";
import { useState } from "react";

import "./UserProfile.css";
import "./Contact.css";
import personAdd from "../imgs/personAdd.svg";

interface UserProfileProps {
	displayName: string;
	image?: string;
	setContactToAdd: (username: string) => void;
	token: string;
}

export function UserProfile({ displayName, image, setContactToAdd }: UserProfileProps) {
	const [show, setShow] = useState(false);
	const [contactName, setContactName] = useState("");

	return (
		<div id="userProfile">
			<img className="profileImg" alt="Profile" src={image} />
			<h5 className="displayName">{displayName}</h5>
			<IconButton image={personAdd} alt="Add Person" onClick={() => setShow(true)} />
			<Modal
				onClose={() => setShow(false)}
				onAccept={() => {
					setContactToAdd(contactName);
					setContactName("");
				}}
				show={show}
				title="Add a new contact"
			>
				<div id="userAddTextFieldContainer">
					<input
						id="userAddTextField"
						type="text"
						placeholder="Enter contact name..."
						value={contactName}
						onChange={(e) => setContactName(e.target.value)}
					/>
				</div>
			</Modal>
		</div>
	);
}
