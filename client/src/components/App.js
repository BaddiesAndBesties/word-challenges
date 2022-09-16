import { useState } from 'react';
import Header from './Header';
import Scoreboard from './Scoreboard';
import WeclomeMessage from './WeclomeMessage';
import Leaderboard from './Leaderboard';
import Game from './Game';
import io from 'socket.io-client';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(undefined);
    const [userDbId, setUserDbId] = useState(undefined);
    let [gameOver, setGameOver] = useState(false);
    let [userWon, setUserWon] = useState(undefined);
    let [gamePoint, setGamePoint] = useState(0);
    let [showLeaderboard, setShowLeaderboard] = useState(true);
    let [socket, setSocket] = useState(undefined);

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
                    setSocket={setSocket}
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
                                setGamePoint={setGamePoint}
                                socket={socket} />
                        :
                        <WeclomeMessage />
                }
            </div>
        </div>
    );
};

export default App;