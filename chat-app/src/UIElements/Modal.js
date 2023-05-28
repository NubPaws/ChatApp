import { Button } from "./Button.js";
import { useEffect } from "react";

import "./Modal.css";

export function Modal(props) {
	useEffect(() => {
		document.body.addEventListener("keydown", closeOnEscapeKeyDown);
		return function cleanup() {
			document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
		}
	});
	
	if (!props.show)
		return null;
	
	function closeOnEscapeKeyDown(e) {
		if (e.key === "Escape") {
			props.onClose();
		}
	}
	
	function acceptButton() {
		if (props.onAccept === undefined)
			return <></>;
		
		return <Button onClick={() => {props.onAccept(); props.onClose()}} bgColor="#28A745" text="Accept" />
	}
	
	return (
		<div className="modal" onClick={props.onClose}>
			<div className="modalContent" onClick={e => e.stopPropagation()}>
				<div className="modalHeader">
					<h3 className="modalTitle">{props.title}</h3>
				</div>
				<div className="modalBody">{props.children}</div>
				<div className="modalFooter">
					{acceptButton()}
					<Button onClick={props.onClose} bgColor="#5C95FF" text="Close" />
				</div>
			</div>
		</div>
	);
}

Modal.defaultProps = {
	onAccept: undefined,
	onClose: undefined,
}
