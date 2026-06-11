import { render, screen } from "@testing-library/react";
import App from "./App.js";

describe("App", () => {
	it("renders the login screen by default", () => {
		render(<App />);
		expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
	});
});
