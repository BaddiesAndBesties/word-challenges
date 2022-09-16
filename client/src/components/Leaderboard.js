import { useEffect, useState } from "react";

const Leaderboard = ({ isSignedIn }) => {
    const [topPlayers, SetTopPlayers] = useState([]);
    
    const getTopScores = async () => {
        const topScores = await fetch('/getTopScores')
            .then((res) => res.json())
            .then(data => data)
            .catch((error) => {
                console.error(error)
            });
        return topScores;
    };

    useEffect(() => {
        const players = [];
        getTopScores()   
            .then((topScores) => {
                for (let i = 0; i < topScores.length; i++) {
                    players.push(<li>{topScores[i].given_name}: {topScores[i].point} points</li>);
                }
            });
        SetTopPlayers(players);
    }, [])

    return (
        <main className='leaderboard card'>
            <h1>LEADERBOARD</h1>
            <ul>{topPlayers}</ul>
        </main>
    );
};

export default Leaderboard;