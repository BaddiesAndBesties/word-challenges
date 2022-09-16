import { useState } from 'react';
import Header from './Header';
import Leaderboard from './Leaderboard';
import Game from './Game';
import Scoreboard from './Scoreboard';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(undefined);
    const [userDbId, setUserDbId] = useState(undefined);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showGame, setShowGame] = useState(true);

    const setGameAndLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard)
        setShowGame(!showGame)
      };

    return (
        <div>
            <Header 
                isSignedIn={isSignedIn} 
                setIsSignedIn={setIsSignedIn} 
                setUserEmail={setUserEmail}
                setUserDbId={setUserDbId}
            />
            <div className='mainBody'>
                <Scoreboard 
                    isSignedIn={isSignedIn} 
                    userDbId={userDbId} 
                    setGameAndLeaderboard={setGameAndLeaderboard} 
                    showGame={showGame} 
                />
                {!userDbId ? 
                <Leaderboard setGameAndLeaderboard={setGameAndLeaderboard} /> : <Game userDbId={userDbId} />}
            </div>
        </div>
    );
};

export default App;