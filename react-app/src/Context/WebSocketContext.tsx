import { createContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/api.js";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type {
	ClientToServerEvents,
	ReceivePayload,
	ServerToClientEvents,
} from "@chatapp/shared";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface WebSocketContextValue {
	isReady: boolean;
	value: ReceivePayload | null;
	clearValue: () => void;
	lastSent: string | null;
	setLastSent: Dispatch<SetStateAction<string | null>>;
}

export const WebSocketContext = createContext<WebSocketContextValue>({
	isReady: false,
	value: null,
	clearValue: () => {},
	lastSent: null,
	setLastSent: () => {},
});

interface WebSocketProviderProps {
	username: string;
	children?: ReactNode;
}

export function WebSocketProvider({ username, children }: WebSocketProviderProps) {
	const [isReady, setIsReady] = useState(false);
	const [val, setVal] = useState<ReceivePayload | null>(null);
	const [lastSent, setLastSent] = useState<string | null>(null);
	const webSocket = useRef<AppSocket | null>(null);

	useEffect(() => {
		const socket: AppSocket = io(SOCKET_URL, { query: { username } });

		socket.on("connect", () => setIsReady(true));
		socket.on("disconnect", () => setIsReady(false));
		socket.on("receive", (payload) => setVal(payload));

		webSocket.current = socket;

		return () => {
			socket.close();
		};
	}, [username]);

	const contextValue: WebSocketContextValue = {
		isReady,
		value: val,
		clearValue: () => setVal(null),
		lastSent,
		setLastSent,
	};

	return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
}
