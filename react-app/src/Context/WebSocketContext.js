import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const WebSocketContext = createContext({
	isReady: false,
	value: null,
	clearValue: () => {},
	lastSent: null,
	setLastSent: () => {},
});

export function WebSocketProvider(props) {
	const [ isReady, setIsReady ] = useState(false);
	const [ val, setVal ] = useState(null);
	const [ lastSent, setLastSent ] = useState(null);
	const webSocket = useRef(null);
	
	const { username } = props;
	
	useEffect(() => {
		const socket = io({
			query: {
				username: username
			}
		});
		
		socket.on("connect", () => setIsReady(true));
		socket.on("disconnect", () => setIsReady(false));
		socket.on("receive", (payload) => setVal(payload));
		
		webSocket.current = socket;
		
		return () => {
			socket.close();
		};
	}, [username]);
	
	const contextValue = {
		isReady: isReady,
		value: val,
		clearValue: () => {setVal(undefined)},
		lastSent: lastSent,
		setLastSent: setLastSent,
	};
	
	return <WebSocketContext.Provider value={contextValue}>{props.children}</WebSocketContext.Provider>
}
