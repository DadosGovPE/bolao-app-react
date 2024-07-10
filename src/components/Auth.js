import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://10.238.75.122:8888/api/';

function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}token/`, { username, password });
      localStorage.setItem('authToken', response.data.access);
      navigate('/games');
    } catch (error) {
      console.error('Erro na autenticação:', error);
      alert('Erro na autenticação.');
    }
  };

  return (
    <div>
      <h2>Autenticação</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Auth;
