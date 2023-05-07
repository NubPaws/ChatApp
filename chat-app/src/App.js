import logo from './logo.svg';
import './App.css';
import { LoginScreen } from './Authentication/LoginScreen';
import { RegistrationScreen } from './Authentication/RegistrationScreen';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <RegistrationScreen></RegistrationScreen>
    </div>
  );
}

export default App;
