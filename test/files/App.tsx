import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Todo from "./Todo";
import NormalTodo from "./NormalTodo";
import { Home } from "./Home";
import "./App.css";

const logo = require("./logo.svg");

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>

          <Route path="/" component={Home} />

          <Route path="/todo" component={Todo} />
          <Route path="/normaltodo" component={NormalTodo} />
          
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
        </div>
      </Router>
    );
  }
}

export default App;
