import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input.js";

describe("Input", () => {
	it("associates the label with the input and reflects its value", () => {
		render(
			<Input id="username" type="text" value="alice" onChange={() => {}}>
				Username
			</Input>,
		);
		expect(screen.getByLabelText("Username")).toHaveValue("alice");
	});

	it("calls onChange as the user types", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Input id="username" type="text" value="" onChange={onChange}>
				Username
			</Input>,
		);
		await user.type(screen.getByLabelText("Username"), "a");
		expect(onChange).toHaveBeenCalled();
	});

	it("renders an error message when provided", () => {
		render(
			<Input id="username" type="text" error="Required">
				Username
			</Input>,
		);
		expect(screen.getByText("Required")).toBeInTheDocument();
	});
});
