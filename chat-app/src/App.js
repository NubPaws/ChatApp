import logo from './logo.svg';
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChatScreen } from "./ChatScreen/ChatScreen.js";
import './App.css';
import { LoginScreen } from './Authentication/LoginScreen';
import { RegistrationScreen } from './Authentication/RegistrationScreen';
import { ChatScreen } from './ChatScreen/ChatScreen';

import catImage from "./imgs/cat.png";
import raccoonImage from "./imgs/raccoon.png";

function App() {
  const [userCredentials, setUserCredentials] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [allowChatScreen, setAllowChatScreen] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials}
                currentUser={currentUser} setCurrentUser={setCurrentUser} setAllowChatScreen={setAllowChatScreen}/>}></Route>
          <Route path='/login' element={<LoginScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials}
                currentUser={currentUser} setCurrentUser={setCurrentUser} setAllowChatScreen={setAllowChatScreen}/>}></Route>
          <Route path='/registration' element={<RegistrationScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
          <Route path='/chat' element={<ChatScreen userCredentials={userCredentials} setCurrentUser={setCurrentUser}
                setAllowChatScreen={setAllowChatScreen} allowChatScreen={allowChatScreen} />}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
