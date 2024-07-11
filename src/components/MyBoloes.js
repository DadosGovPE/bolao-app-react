import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const BASE_URL = 'http://10.238.75.122:8888/api/';

function MyBoloes() {
  const [boloes, setBoloes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchBoloes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}boloes/myBoloes/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoloes(response.data);
      } catch (error) {
        console.error('Erro ao carregar bolões:', error);
      }
    };

    fetchBoloes();
  }, [token]);

  const handleGoToBolao = (bolaoId) => {
    navigate(`/bolao/${bolaoId}`);
  };

  const handleGoToGames = (bolaoId) => {
    navigate(`/games?bolao_id=${bolaoId}`);
  };

  return (
    <div>
      <h2>Meus Bolões</h2>
      {boloes.map((bolao) => (
        <div key={bolao.id}>
          <h3>{bolao.nome}</h3>
          <p>Campeonato: {bolao.campeonato}</p>
          <p>Criado por: {bolao.criado_por}</p>
          <button onClick={() => handleGoToBolao(bolao.id)}>Ver Bolão</button>
          <Button variant="contained" onClick={() => handleGoToGames(bolao.id)}>Palpitar</Button>
        </div>
      ))}
    </div>
  );
}

export default MyBoloes;
