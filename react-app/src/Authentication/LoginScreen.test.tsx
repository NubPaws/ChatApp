import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("./Login.js", () => ({ loginUser: vi.fn() }));
import { loginUser } from "./Login.js";
import { LoginScreen } from "./LoginScreen.js";

function renderLogin() {
	const setUserCredentials = vi.fn();
	render(
		<MemoryRouter>
			<LoginScreen userCredentials={null} setUserCredentials={setUserCredentials} />
		</MemoryRouter>,
	);
	return { setUserCredentials };
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("LoginScreen", () => {
	it("shows a validation error and does not log in for a short username", async () => {
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByLabelText("Username"), "ab");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Login" }));

		expect(screen.getByText(/at least 4 characters/i)).toBeInTheDocument();
		expect(loginUser).not.toHaveBeenCalled();
	});

	it("calls loginUser with the entered credentials when valid", async () => {
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByLabelText("Username"), "alice");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Login" }));

		expect(loginUser).toHaveBeenCalledWith(
			"alice",
			"password123",
			expect.any(Function),
			expect.any(Function),
			expect.any(Function),
		);
	});
});
