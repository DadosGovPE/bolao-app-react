import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://10.238.75.122:8888/api/';

function CreateBolao() {
  const [nome, setNome] = useState('');
  const [campeonato, setCampeonato] = useState('');
  const [campeonatos, setCampeonatos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}campeonatos/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampeonatos(response.data);
      } catch (error) {
        console.error('Erro ao carregar campeonatos:', error);
      }
    };

    fetchCampeonatos();
  }, [token]);

  const handleCreateBolao = async () => {
    try {
      const response = await axios.post(`${BASE_URL}boloes/`, {
        nome,
        campeonato,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Bolão criado com sucesso!');
      navigate('/games');
    } catch (error) {
      console.error('Erro ao criar bolão:', error);
      alert('Erro ao criar bolão.');
    }
  };

  return (
    <div>
      <h2>Criar Novo Bolão</h2>
      <input
        type="text"
        placeholder="Nome do Bolão"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <select
        value={campeonato}
        onChange={(e) => setCampeonato(e.target.value)}
      >
        <option value="">Selecione um Campeonato</option>
        {campeonatos.map((camp) => (
          <option key={camp.id} value={camp.id}>
            {camp.nome}
          </option>
        ))}
      </select>
      <button onClick={handleCreateBolao}>Criar Bolão</button>
    </div>
  );
}

export default CreateBolao;
