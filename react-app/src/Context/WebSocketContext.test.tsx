import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";

// Build a fake socket whose registered handlers we can invoke from the test.
const { ioMock, getHandlers, resetSocket } = vi.hoisted(() => {
	let handlers: Record<string, (...args: unknown[]) => void> = {};
	const socket = {
		on: (event: string, cb: (...args: unknown[]) => void) => {
			handlers[event] = cb;
		},
		close: () => {},
		emit: () => {},
	};
	return {
		ioMock: vi.fn(() => socket),
		getHandlers: () => handlers,
		resetSocket: () => {
			handlers = {};
		},
	};
});

vi.mock("socket.io-client", () => ({ io: ioMock }));

import { WebSocketContext, WebSocketProvider } from "./WebSocketContext.js";
import { SOCKET_URL } from "../config/api.js";

beforeEach(() => {
	ioMock.mockClear();
	resetSocket();
});

function Probe() {
	const ws = useContext(WebSocketContext);
	return (
		<div>
			<span data-testid="ready">{String(ws.isReady)}</span>
			<span data-testid="value">{ws.value?.content ?? "none"}</span>
		</div>
	);
}

describe("WebSocketProvider", () => {
	it("connects with SOCKET_URL and the username query", () => {
		render(
			<WebSocketProvider username="alice">
				<Probe />
			</WebSocketProvider>,
		);
		expect(ioMock).toHaveBeenCalledWith(SOCKET_URL, { query: { username: "alice" } });
	});

	it("tracks connection state and received messages", () => {
		render(
			<WebSocketProvider username="alice">
				<Probe />
			</WebSocketProvider>,
		);

		expect(screen.getByTestId("ready")).toHaveTextContent("false");
		expect(screen.getByTestId("value")).toHaveTextContent("none");

		act(() => getHandlers().connect());
		expect(screen.getByTestId("ready")).toHaveTextContent("true");

		act(() => getHandlers().receive({ sender: "bobby", content: "hi", timestamp: "2024-01-01" }));
		expect(screen.getByTestId("value")).toHaveTextContent("hi");

		act(() => getHandlers().disconnect());
		expect(screen.getByTestId("ready")).toHaveTextContent("false");
	});
});
