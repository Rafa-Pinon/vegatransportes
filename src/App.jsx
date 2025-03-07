import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import logo from "./assets/logosinfondo.png";
import Factura from "./componentes/facturas";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="apptrnsportes">
      <div className="logo">
        <img src={logo} alt="Mi Logo" />
      </div>
      <div className="botones">
        <button onClick={() => navigate("/factura")}>Factura</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/factura" element={<Factura />} />
      </Routes>
    </Router>
  );
}

export default App;
