import { Button } from "./Button.js";
import { useEffect } from "react";
import type { ReactNode } from "react";

import "./Modal.css";

interface ModalProps {
	title: string;
	show: boolean;
	onClose: () => void;
	onAccept?: () => void;
	children?: ReactNode;
}

export function Modal({ title, show, onClose, onAccept, children }: ModalProps) {
	useEffect(() => {
		function closeOnEscapeKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				onClose();
			}
		}
		document.body.addEventListener("keydown", closeOnEscapeKeyDown);
		return () => {
			document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
		};
	});

	if (!show) {
		return null;
	}

	return (
		<div className="modal" onClick={onClose}>
			<div className="modalContent" onClick={(e) => e.stopPropagation()}>
				<div className="modalHeader">
					<h3 className="modalTitle">{title}</h3>
				</div>
				<div className="modalBody">{children}</div>
				<div className="modalFooter">
					{onAccept && (
						<Button
							onClick={() => {
								onAccept();
								onClose();
							}}
							bgColor="#28A745"
						>
							Accept
						</Button>
					)}
					<Button onClick={onClose} bgColor="#5C95FF">
						Close
					</Button>
				</div>
			</div>
		</div>
	);
}
