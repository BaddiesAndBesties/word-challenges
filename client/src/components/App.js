import { useState } from 'react';
import Header from './Header';
import Scoreboard from './Scoreboard';
import WeclomeMessage from './WeclomeMessage';
import Leaderboard from './Leaderboard';
import Game from './Game';
import { SocketProvider } from '../socketProvider';


const App = () => {

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(undefined);
    const [showLeaderboard, setShowLeaderboard] = useState(true);

    return (
        <SocketProvider>
            <Header
                isSignedIn={isSignedIn}
                setIsSignedIn={setIsSignedIn}
                setUserEmail={setUserEmail}
                setShowLeaderboard={setShowLeaderboard}
                showLeaderboard={showLeaderboard}
            />
            <div id='main-screen'>
                <Scoreboard
                    isSignedIn={isSignedIn}
                    showLeaderboard={showLeaderboard}
                    setShowLeaderboard={setShowLeaderboard}
                    setSocket={setSocket}
                />
                {
                    isSignedIn
                        ?
                        showLeaderboard
                            ? <Leaderboard />
                            : <Game />
                        :
                        <WeclomeMessage />
                }
            </div>
        </SocketProvider>
    );
};

export default App;