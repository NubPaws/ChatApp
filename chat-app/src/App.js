import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import './App.css';
import { LoginScreen } from './Authentication/LoginScreen';
import { RegistrationScreen } from './Authentication/RegistrationScreen';
import { ChatScreen } from './ChatScreen/ChatScreen';

function App() {
    const [database, setDatabase] = useState({});
    const [token, setToken] = useState("");

    return (
        <div className="App">
            <header className="App-header">
            </header>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LoginScreen setToken={setToken} token={token} />}></Route>
                    <Route path='/login' element={<LoginScreen setToken={setToken} token={token} />}></Route>
                    <Route path='/registration' element={<RegistrationScreen databaseHook={[database, setDatabase]} />}></Route>
                    <Route path='/chat' element={<ChatScreen databaseHook={[database, setDatabase]} 
                        setToken={setToken} token={token} />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
