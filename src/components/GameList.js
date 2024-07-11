import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const BASE_URL = 'http://10.238.75.122:8888/api/';

function GameList() {
  const [games, setGames] = useState([]);
  const [bets, setBets] = useState({});
  const [inputs, setInputs] = useState({});
  const token = localStorage.getItem('authToken');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bolaoId = searchParams.get('bolao_id');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${BASE_URL}games/mygames/${bolaoId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(response.data);
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
      }
    };

    const fetchBets = async () => {
      try {
        const response = await axios.get(`${BASE_URL}bets/mybets/${bolaoId}/`, {
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
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleBet = async (gameId) => {
    try {
      const team1Score = inputs[`team1_${gameId}`];
      const team2Score = inputs[`team2_${gameId}`];

      await axios.post(`${BASE_URL}bets/`, {
        game_id: gameId,
        bolao: bolaoId,
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
      console.log(bets)
    } catch (error) {
      console.error('Erro ao salvar palpite:', error);
      alert('Erro ao salvar palpite.');
    }
  };

  return (
    <div>
      <h2>Jogos Disponíveis</h2>
      {games.map((game) => (
        <Grid container spacing={2} key={game.id} alignItems="center">
        <Grid item xs={12} sm={2} alignItems="end" textAlign="end">
          {game.team2.name}
        </Grid>
          <Grid item xs={12} sm={2} textAlign="center">
            <TextField
                type="number"
                name={`team1_${game.id}`}
                value={inputs[`team1_${game.id}`] !== undefined ? inputs[`team1_${game.id}`] : ''}
                onChange={handleInputChange}
                label="Placar Time 1"
                variant="outlined"
                margin="normal"
              />
          </Grid>
          <Grid item xs={1} sm={1} textAlign="center" alignItems="center"><p>vs</p></Grid>
          <Grid item xs={12} sm={2} textAlign="center">
            <TextField
              type="number"
              name={`team2_${game.id}`}
              value={inputs[`team2_${game.id}`] !== undefined ? inputs[`team2_${game.id}`] : ''}
              onChange={handleInputChange}
              label="Placar Time 2"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={2} alignItems="start" textAlign="start">
          {game.team2.name}
        </Grid>
          <Grid item xs={12} sm={2}>
            <Button
                variant="contained"
                onClick={() => handleBet(game.id)}
                style={{
                  backgroundColor: bets[game.id] ? 'green' : 'grey',
                  color: 'white',
                }}
              >
                Apostar
              </Button>
            </Grid>
          </Grid>
        
      ))}
    </div>
  );
}

export default GameList;
