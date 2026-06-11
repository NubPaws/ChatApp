import { render, screen } from "@testing-library/react";
import { SpeechBubble } from "./SpeechBubble.js";

describe("SpeechBubble", () => {
	it("renders content and timestamp", () => {
		render(
			<SpeechBubble direction="left" timestamp="09:05">
				Hello there
			</SpeechBubble>,
		);
		expect(screen.getByText("Hello there")).toBeInTheDocument();
		expect(screen.getByText("09:05")).toBeInTheDocument();
	});

	it("uses the left class for a left-facing bubble", () => {
		const { container } = render(
			<SpeechBubble direction="left" timestamp="09:05">
				Hi
			</SpeechBubble>,
		);
		expect(container.querySelector(".speechBubbleLeft")).not.toBeNull();
	});

	it("uses the right class for a right-facing bubble", () => {
		const { container } = render(
			<SpeechBubble direction="right" timestamp="09:05">
				Hi
			</SpeechBubble>,
		);
		expect(container.querySelector(".speechBubbleRight")).not.toBeNull();
	});
});
