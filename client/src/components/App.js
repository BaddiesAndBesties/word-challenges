import { useState } from 'react';
import Header from './Header';
import Scoreboard from './Scoreboard';
import WeclomeMessage from './WeclomeMessage';
import Leaderboard from './Leaderboard';
import Game from './Game';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(undefined);
    const [userDbId, setUserDbId] = useState(undefined);
    const [showLeaderboard, setShowLeaderboard] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    return (
        <div>
            <Header
                isSignedIn={isSignedIn}
                setIsSignedIn={setIsSignedIn}
                setUserEmail={setUserEmail}
                setUserDbId={setUserDbId}
                setShowLeaderboard={setShowLeaderboard}
                showLeaderboard={showLeaderboard}
            />
            <div id='main-screen'>
                <Scoreboard
                    isSignedIn={isSignedIn}
                    userDbId={userDbId}
                    setShowLeaderboard={setShowLeaderboard}
                    showLeaderboard={showLeaderboard}
                />
                {
                    isSignedIn 
                        ?
                            showLeaderboard 
                            ? <Leaderboard /> 
                            : <Game userDbId={userDbId} gameOver={gameOver} setGameOver={setGameOver} />
                        :
                        <WeclomeMessage />
                }
            </div>
        </div>
    );
};

export default App;