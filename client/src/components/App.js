import { useState } from 'react';
import Header from './Header';
import Leaderboard from './Leaderboard';
import Game from './Game';
import Scoreboard from './Scoreboard';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(undefined);
    const [userDbId, setUserDbId] = useState(undefined);
    const [showLeaderboard, setShowLeaderboard] = useState(true);

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
            <div className='mainBody'>
                <Scoreboard
                    isSignedIn={isSignedIn}
                    userDbId={userDbId}
                    setShowLeaderboard={setShowLeaderboard}
                    showLeaderboard={showLeaderboard}
                />
                {showLeaderboard ? <Leaderboard /> : <Game userDbId={userDbId} />}
            </div>
        </div>
    );
};

export default App;