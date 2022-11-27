import logo from './logo.svg?url';
import Logo from "./logo.svg";
import './welcome.css';

const Welcome = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Logo />
        <p>
          Edit <code>web_src/welcome.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Welcome;
