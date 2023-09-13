import "./ContactList.css"

export function Contact(props) {
	return (
		<div className={`contactCard ${props.className}`}
			onClick={props.onClick}
		>
			<img className="profileImg" alt="Profile" src={props.image} />
			<h5 className="displayName">{props.displayName}</h5>
			<span className="lastMessage">{props.lastMessage}</span>
		</div>
	);
}
