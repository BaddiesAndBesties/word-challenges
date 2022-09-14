import React, { useState } from 'react';
import Header from './Header';
import Leaderboard from './Leaderboard';
import Game from './Game';
import Scoreboard from './Scoreboard';
import Instructions from './Instructions';

const App = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showGame, setShowGame] = useState(true);

    return (
        <div>
            <Header />
            <div className='mainBody'>
                <Scoreboard />
                {showInstructions ? <Instructions /> : showLeaderboard ? <Leaderboard /> : <Game />}
            </div>
        </div>
    )
}

export default App;