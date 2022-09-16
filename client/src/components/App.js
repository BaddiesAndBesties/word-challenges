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
    const [gameOver, setGameOver] = useState(false);
    const [userWon, setUserWon] = useState(undefined);
    const [gamePoint, setGamePoint] = useState(0);
    const [showLeaderboard, setShowLeaderboard] = useState(true);

    if (gameOver) {
        fetch(`/user/${userDbId}/update-stat`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result: userWon,
                point: gamePoint,
            })
        })
            .then((res) => res.json())
            .then(({ mongoId }) => {
                setUserDbId(mongoId);
            })
            .catch((error) => {
                console.error(error);
            });
    }

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
                    gameOver={gameOver}
                    setGameOver={setGameOver}
                    showLeaderboard={showLeaderboard}
                    setShowLeaderboard={setShowLeaderboard}
                />
                {
                    isSignedIn 
                        ?
                            showLeaderboard 
                            ? <Leaderboard /> 
                            : <Game 
                                userDbId={userDbId} 
                                gameOver={gameOver} 
                                setGameOver={setGameOver}
                                userWon={userWon} 
                                setUserWon={setUserWon}
                                setGamePoint={setGamePoint} />
                        :
                        <WeclomeMessage />
                }
            </div>
        </div>
    );
};

export default App;