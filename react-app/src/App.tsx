import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { LoginScreen } from "./Authentication/LoginScreen.js";
import { RegistrationScreen } from "./Authentication/RegistrationScreen.js";
import { ChatScreen } from "./ChatScreen/ChatScreen.js";
import type { UserCredentials } from "./types.js";
import "./App.css";

function App() {
	const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null);

	return (
		<div className="App">
			<header className="App-header"></header>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<LoginScreen
								userCredentials={userCredentials}
								setUserCredentials={setUserCredentials}
							/>
						}
					/>
					<Route
						path="/login"
						element={
							<LoginScreen
								userCredentials={userCredentials}
								setUserCredentials={setUserCredentials}
							/>
						}
					/>
					<Route path="/registration" element={<RegistrationScreen />} />
					<Route
						path="/chat"
						element={
							<ChatScreen
								userCredentials={userCredentials}
								setUserCredentials={setUserCredentials}
							/>
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
