import { useEffect, useState } from "react";

const Leaderboard = () => {
    const [topPlayers, SetTopPlayers] = useState([]);
    
    useEffect(() => {
        fetch('leaderboard/top-five')
            .then((res) => res.json())
            .then((users) => {
                const userArr = [];
                for (let i = 0; i < users.length; i++) {
                    userArr.push(<li key={i}>{i + 1} - {users[i].given_name}: {users[i].point} points</li>);
                }
                SetTopPlayers(userArr);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <main className='leaderboard card'>
            <h1>LEADERBOARD - TOP 5</h1>
            <ul>{topPlayers}</ul>
        </main>
    );
};

export default Leaderboard;