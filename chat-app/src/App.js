import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import './App.css';
import { LoginScreen } from './Authentication/LoginScreen.js';
import { RegistrationScreen } from './Authentication/RegistrationScreen.js';
import { ChatScreen } from './ChatScreen/ChatScreen.js';

function App() {
    const [userCredentials, setUserCredentials] = useState({});

    return (
        <div className="App">
            <header className="App-header">
            </header>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LoginScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
                    <Route path='/login' element={<LoginScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
                    <Route path='/registration' element={<RegistrationScreen />}></Route>
                    <Route path='/chat' element={
                        <ChatScreen
                            userCredentials={userCredentials}
                            setUserCredentials={setUserCredentials}
                        />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
