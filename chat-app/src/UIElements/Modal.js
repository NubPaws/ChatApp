import { Button } from "./Button";
import { useEffect } from "react";

export function Modal(props) {
	useEffect(() => {
		document.body.addEventListener("keydown", closeOnEscapeKeyDown);
		return function cleanup() {
			document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
		}
	}, []);
	
	if (!props.show)
		return null;
	
	function closeOnEscapeKeyDown(e) {
		if (e.key === "Escape") {
			props.onClose();
		}
	}
	
	return (
		<div className="modal" onClick={props.onClose}>
			<div className="modalContent" onClick={e => e.stopPropagation()}>
				<div className="modalHeader">
					<h4 className="modalTitle">{props.title}</h4>
				</div>
				<div className="modalBody">{props.children}</div>
				<div className="modalFooter">
					<Button onClick={props.onClose} text="Close" />
				</div>
			</div>
		</div>
	);
}
