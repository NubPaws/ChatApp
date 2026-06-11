import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatTextField } from "./ChatTextField.js";

const PLACEHOLDER = "Write your message here...";

describe("ChatTextField", () => {
	it("sends a trimmed message on Enter and clears the field", async () => {
		const user = userEvent.setup();
		const setInputText = vi.fn();
		const onSend = vi.fn();
		render(<ChatTextField setInputText={setInputText} onSend={onSend} />);

		const input = screen.getByPlaceholderText(PLACEHOLDER);
		await user.type(input, "  hello  {Enter}");

		expect(setInputText).toHaveBeenCalledWith("hello");
		expect(onSend).toHaveBeenCalledTimes(1);
		expect(input).toHaveValue("");
	});

	it("sends when the Send button is clicked", async () => {
		const user = userEvent.setup();
		const setInputText = vi.fn();
		const onSend = vi.fn();
		render(<ChatTextField setInputText={setInputText} onSend={onSend} />);

		await user.type(screen.getByPlaceholderText(PLACEHOLDER), "hi");
		await user.click(screen.getByRole("button", { name: "Send" }));

		expect(setInputText).toHaveBeenCalledWith("hi");
		expect(onSend).toHaveBeenCalledTimes(1);
	});

	it("ignores whitespace-only input", async () => {
		const user = userEvent.setup();
		const setInputText = vi.fn();
		const onSend = vi.fn();
		render(<ChatTextField setInputText={setInputText} onSend={onSend} />);

		await user.type(screen.getByPlaceholderText(PLACEHOLDER), "   {Enter}");

		expect(onSend).not.toHaveBeenCalled();
	});
});
