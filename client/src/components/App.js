import { useState } from 'react';
import Header from './Header';
import Leaderboard from './Leaderboard';
import Game from './Game';
import Scoreboard from './Scoreboard';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(undefined);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showGame, setShowGame] = useState(true);

    return (
        <div>
            <Header setUserEmail={setUserEmail} isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            <div className='mainBody'>
                <Scoreboard userEmail={userEmail} />
                {showLeaderboard ? <Leaderboard /> : <Game />}
            </div>
        </div>
    );
};

export default App;