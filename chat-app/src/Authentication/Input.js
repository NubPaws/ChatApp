import "./Authentication.css";

export function Input(props) {
    return (
        <div className={props.className}>
            <label className="fieldLabel" htmlFor={props.id}>{props.children}</label>
            <input className="fieldInput" type={props.type}  name={props.name} id={props.id} 
                placeholder={props.placeholder} onChange={props.onChange} required/>
                <span id={props.errorMessageId}></span>
        </div>
    );
}