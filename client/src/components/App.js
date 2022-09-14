import { useState } from 'react';
import Header from './Header';
import Leaderboard from './Leaderboard';
import Game from './Game';
import Scoreboard from './Scoreboard';

const App = () => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showGame, setShowGame] = useState(true);

    return (
        <div>
            <Header />
            <div className='mainBody'>
                <Scoreboard />
                {showLeaderboard ? <Leaderboard /> : <Game />}
            </div>
        </div>
    );
};

export default App;