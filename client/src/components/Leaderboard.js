const Leaderboard = () => {
    

    const getTopScores = () => {
        fetch('/getTopScores')
        .then((res) => {
            return res.json()
        })
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error(error)
        })
    }

    const addTopPlayers = () => {
        console.log(getTopScores())
        const topPlayers = ['Will', 'Dennis', 'Kelly', 'Italians', 'Dogs'];
        const topPoints = [100, 90, 80, 70, 60];
        const players = [];
        for (let i = 0; i < topPlayers.length; i++) {
            players.push(<li>{topPlayers[i]}: {topPoints[i]} points</li>);
        }
        getTopScores()
        return players;
    }
    return (
        <main className='leaderboard card'>
            <h1>LEADERBOARD</h1>
            <ol>{addTopPlayers()}</ol>
        </main>
    );
};

export default Leaderboard;