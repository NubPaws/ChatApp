import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Contact } from "./Contact.js";

describe("Contact", () => {
	it("renders the display name and last message", () => {
		render(<Contact displayName="Bob" lastMessage="see you" image="/bob.png" />);
		expect(screen.getByText("Bob")).toBeInTheDocument();
		expect(screen.getByText("see you")).toBeInTheDocument();
	});

	it("fires onClick when clicked", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<Contact displayName="Bob" lastMessage="hi" onClick={onClick} />);
		await user.click(screen.getByText("Bob"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
