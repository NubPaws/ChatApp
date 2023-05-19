export function Input(props) {
    return (
        <div className="dataEntry">
            <div className="col-3">
                <label htmlFor={props.id}>{props.inputText}</label>
            </div>
            <div className="col-9">
                <input type={props.type}  name={props.name} className="form-control" id={props.id} 
                    placeholder={props.placeholder} onChange={props.onChange} required/>
                    <span id={props.errorMessageId}></span>
            </div>
        </div>
    );
}