import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { ContactList } from "./ContactList.js";
import { WebSocketContext } from "../Context/WebSocketContext.js";
import { chatsUrl } from "../config/api.js";
import type { ChatSummary } from "@chatapp/shared";

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const webSocketValue = {
	isReady: false,
	value: null,
	clearValue: vi.fn(),
	lastSent: null,
	setLastSent: vi.fn(),
};

function renderContactList() {
	render(
		<WebSocketContext.Provider value={webSocketValue}>
			<ContactList
				username="alice"
				token="Bearer token"
				image="/alice.png"
				displayName="Alice"
				setActiveChat={vi.fn()}
			/>
		</WebSocketContext.Provider>,
	);
}

describe("ContactList", () => {
	it("renders the contacts returned by GET /api/Chats", async () => {
		const chats: ChatSummary[] = [
			{
				id: 1,
				user: { username: "bobby", displayName: "Bobby", profilePic: "/bobby.png" },
				lastMessage: { id: 1, created: "2024-01-01T10:00:00", content: "hi" },
			},
		];
		server.use(http.get(chatsUrl(), () => HttpResponse.json(chats)));

		renderContactList();

		expect(await screen.findByText(/Bobby/)).toBeInTheDocument();
	});
});
