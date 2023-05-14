import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { LoginScreen } from './Authentication/LoginScreen';
import { RegistrationScreen } from './Authentication/RegistrationScreen';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginScreen />}></Route>
          <Route path='/login' element={<LoginScreen />}></Route>
          <Route path='/registration' element={<RegistrationScreen />}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
