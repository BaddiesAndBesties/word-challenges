import React from 'react';
import Header from './Header';
import Leaderboard from './Leaderboard';
import Game from './Game';
import Scoreboard from './Scoreboard';
import Instructions from './Instructions';

const App = () => (
    <div>
        <Header />
        <Scoreboard />
        <Instructions />
        <Leaderboard />
        <Game />
    </div>
)

export default App;