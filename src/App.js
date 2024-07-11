import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import CreateUser from './components/CreateUser';
import GameList from './components/GameList';
import CreateBolao from './components/CreateBolao';
import MyBoloes from './components/MyBoloes';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/create-bolao" element={<CreateBolao />} />
          <Route path="/myboloes" element={<MyBoloes />} />
          <Route path="/" element={<h1>Bem-vindo ao Bolão</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
