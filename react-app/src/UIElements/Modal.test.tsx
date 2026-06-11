import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal.js";

describe("Modal", () => {
	it("renders nothing when show is false", () => {
		const { container } = render(<Modal title="Title" show={false} onClose={() => {}} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders the title and children when show is true", () => {
		render(
			<Modal title="My Title" show onClose={() => {}}>
				<p>Body content</p>
			</Modal>,
		);
		expect(screen.getByText("My Title")).toBeInTheDocument();
		expect(screen.getByText("Body content")).toBeInTheDocument();
	});

	it("calls onClose when the Close button is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(<Modal title="t" show onClose={onClose} />);
		await user.click(screen.getByRole("button", { name: "Close" }));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("calls onClose when Escape is pressed", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(<Modal title="t" show onClose={onClose} />);
		await user.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalled();
	});

	it("shows an Accept button that calls onAccept then onClose", async () => {
		const user = userEvent.setup();
		const onAccept = vi.fn();
		const onClose = vi.fn();
		render(<Modal title="t" show onClose={onClose} onAccept={onAccept} />);
		await user.click(screen.getByRole("button", { name: "Accept" }));
		expect(onAccept).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("omits the Accept button when onAccept is not provided", () => {
		render(<Modal title="t" show onClose={() => {}} />);
		expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
	});
});
