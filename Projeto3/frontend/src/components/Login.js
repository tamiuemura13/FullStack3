import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(''); // Estado para mensagem de erro
  const [isInvalid, setIsInvalid] = useState(false); // Estado para destacar campos inválidos
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        senha
      });
      localStorage.setItem('token', response.data.token);
      setError('');
      setIsInvalid(false); 
      navigate('/buscar');
    } catch (error) {
      setError('Email ou senha inválidos'); 
      setIsInvalid(true); 
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuário:</label>
          <input
            type="text"
            id="username"
            className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Senha:</label>
          <input
            type="password"
            id="password"
            className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {error && <div className="text-danger mb-3">{error}</div>}
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
