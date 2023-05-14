import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { LoginScreen } from './Authentication/LoginScreen';
import { RegistrationScreen } from './Authentication/RegistrationScreen';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  
  const [userCredentials, setUserCredentials] = useState("");

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginScreen userCredentials={userCredentials} />}></Route>
          <Route path='/login' element={<LoginScreen userCredentials={userCredentials}/>}></Route>
          <Route path='/registration' element={<RegistrationScreen setUserCredentials={setUserCredentials}/>}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
