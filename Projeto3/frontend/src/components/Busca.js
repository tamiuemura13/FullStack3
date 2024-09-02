import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Buscar = () => {
  const [emails, setEmails] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/emails', {
          headers: {
            'Authorization': token
          }
        });
        setEmails(response.data);
      } catch (error) {
        alert('Erro ao buscar emails: ' + error.response.data.error);
      }
    };
    fetchEmails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pendente':
        return 'badge bg-warning text-dark'; 
      case 'verificado':
        return 'badge bg-success'; 
      case 'invalido':
        return 'badge bg-danger'; 
      default:
        return 'badge bg-secondary'; 
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lista de Emails</h2>
      <ul className="list-group mb-3">
        {emails.map((email) => (
          <li key={email.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{email.email}</span> 
            <span className={getStatusClass(email.status_verificacao)}>
              {email.status_verificacao.charAt(0).toUpperCase() + email.status_verificacao.slice(1)}
            </span>
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-between">
        <Link to="/inserir" className="btn btn-primary">Ir para Inserir Email</Link>
      </div>
      <button onClick={handleLogout} className="btn btn-danger mt-3">Sair</button>
    </div>
  );
};

export default Buscar;
