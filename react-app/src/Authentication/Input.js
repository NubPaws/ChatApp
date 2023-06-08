import "./Authentication.css";

export function Input(props) {
    return (
        <div className={props.className}>
            <label className="fieldLabel" htmlFor={props.id}>{props.children}</label>
            <div className="fieldInputContainer">
                <input className="fieldInput" type={props.type}  name={props.name} id={props.id} 
                    placeholder={props.placeholder} onChange={props.onChange} required/>
                <div id={props.errorMessageId}></div>
            </div>
        </div>
    );
}