import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavbarComponent } from "./components/NavbarComponent";
import React from "react";

function App() {
     return (
          <div className="App">
               <NavbarComponent />
          </div>
     );
}

export default App;
