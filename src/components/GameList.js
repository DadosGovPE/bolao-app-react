import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://10.238.75.122:8888/api/';

function GameList() {
  const [games, setGames] = useState([]);
  const [bets, setBets] = useState({});
  const [inputs, setInputs] = useState({});
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${BASE_URL}games/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(response.data);
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
      }
    };

    const fetchBets = async () => {
      try {
        const response = await axios.get(`${BASE_URL}bets/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const betsDict = response.data.reduce((acc, bet) => {
          acc[bet.game.id] = bet;
          return acc;
        }, {});
        setBets(betsDict);

        // Initialize inputs with existing bets
        const initialInputs = response.data.reduce((acc, bet) => {
          acc[`team1_${bet.game.id}`] = bet.team1_score;
          acc[`team2_${bet.game.id}`] = bet.team2_score;
          return acc;
        }, {});
        setInputs(initialInputs);
      } catch (error) {
        console.error('Erro ao carregar apostas:', error);
      }
    };

    fetchGames();
    fetchBets();
  }, [token]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [id]: value,
    }));
  };

  const handleBet = async (gameId) => {
    try {
      const team1Score = inputs[`team1_${gameId}`];
      const team2Score = inputs[`team2_${gameId}`];

      await axios.post(`${BASE_URL}bets/`, {
        game_id: gameId,
        team1_score: team1Score,
        team2_score: team2Score,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Palpite salvo com sucesso!');
      setBets((prevBets) => ({
        ...prevBets,
        [gameId]: {
          game: { id: gameId },
          team1_score: team1Score,
          team2_score: team2Score,
        },
      }));
    } catch (error) {
      console.error('Erro ao salvar palpite:', error);
      alert('Erro ao salvar palpite.');
    }
  };

  return (
    <div>
      <h2>Jogos Disponíveis</h2>
      {games.map((game) => (
        <div key={game.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ flex: 3, textAlign: 'center' }}>{game.team1.name}</div>
          <input
            type="number"
            id={`team1_${game.id}`}
            value={inputs[`team1_${game.id}`] || 0}
            onChange={handleInputChange}
            style={{ flex: 1, textAlign: 'center' }}
          />
          <input
            type="number"
            id={`team2_${game.id}`}
            value={inputs[`team2_${game.id}`] || 0}
            onChange={handleInputChange}
            style={{ flex: 1, textAlign: 'center' }}
          />
          <div style={{ flex: 3, textAlign: 'center' }}>{game.team2.name}</div>
          <button
            style={{
              flex: 2,
              backgroundColor: bets[game.id] ? 'green' : 'grey',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
            onClick={() => handleBet(game.id)}
          >
            Apostar
          </button>
        </div>
      ))}
    </div>
  );
}

export default GameList;
