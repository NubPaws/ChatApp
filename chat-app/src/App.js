import logo from './logo.svg';
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import './App.css';
import { useState } from 'react';
import { LoginScreen } from './Authentication/LoginScreen';
import { RegistrationScreen } from './Authentication/RegistrationScreen';
import { ChatScreen } from './ChatScreen/ChatScreen';

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
