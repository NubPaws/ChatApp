import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, IconButton } from "./Button.js";

describe("Button", () => {
	it("renders its children and fires onClick", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Click me</Button>);
		await user.click(screen.getByRole("button", { name: "Click me" }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("applies the given background color", () => {
		render(<Button bgColor="rgb(255, 0, 0)">Styled</Button>);
		expect(screen.getByRole("button", { name: "Styled" })).toHaveStyle({
			backgroundColor: "rgb(255, 0, 0)",
		});
	});
});

describe("IconButton", () => {
	it("renders an image with the given alt text and fires onClick", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<IconButton image="/icon.svg" alt="Add" onClick={onClick} />);
		expect(screen.getByRole("img", { name: "Add" })).toBeInTheDocument();
		await user.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
