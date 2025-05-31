import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { NavbarComponent } from "./components/NavbarComponent";
import KasirPage from "./pages/KasirPage";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
     return (
          <Router>
               <div className="App">
                    <NavbarComponent />
                    <Routes>
                         <Route path="/" element={<KasirPage />} />
                    </Routes>
               </div>
          </Router>
     );
}

export default App;
