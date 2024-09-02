import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Inserir = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('pendente');
  const [emailError, setEmailError] = useState(''); 

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um email válido.');
      return;
    }
    
    setEmailError(''); 
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/emails', {
        email,
        status_verificacao: status
      }, {
        headers: {
          'Authorization': token
        }
      });
      alert('Email inserido com sucesso!');
      setEmail('');
      setStatus('pendente');
    } catch (error) {
      alert('Erro ao inserir email: ' + error.response.data.error);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Inserir Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            className={`form-control ${emailError ? 'is-invalid' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status:</label>
          <select id="status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pendente">Pendente</option>
            <option value="verificado">Verificado</option>
            <option value="invalido">Inválido</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Inserir</button>
      </form>
      <Link to="/buscar" className="btn btn-secondary mt-3">Voltar para Buscar</Link>
    </div>
  );
};

export default Inserir;
