import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import Buscar from './components/Busca';
import Inserir from './components/Inserir';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './styles/custom.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/buscar" element={<Buscar />} />
      <Route path="/inserir" element={<Inserir />} />
    </Routes>
  </Router>
);
