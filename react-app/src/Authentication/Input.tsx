import "./Authentication.css";
import type { ChangeEventHandler, ReactNode } from "react";

interface InputProps {
	id: string;
	type: string;
	className?: string;
	name?: string;
	placeholder?: string;
	value?: string;
	error?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	children?: ReactNode;
}

export function Input({
	id,
	type,
	className,
	name,
	placeholder,
	value,
	error,
	onChange,
	children,
}: InputProps) {
	return (
		<div className={className}>
			<label className="fieldLabel" htmlFor={id}>
				{children}
			</label>
			<div className="fieldInputContainer">
				<input
					className="fieldInput"
					type={type}
					name={name}
					id={id}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>
				{error ? <div className="fieldError">{error}</div> : null}
			</div>
		</div>
	);
}
