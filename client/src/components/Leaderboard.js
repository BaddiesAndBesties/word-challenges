const Leaderboard = async (setGameAndLeaderboard) => {
    

    const getTopScores = async (req, res) => {
        // return new Promise ( (resolve, reject)=>{

            let response = await fetch('/getTopScores')
            let responseText = await response.json()
            console.log("RSPNSE", responseText);
            return responseText
        }

    const addTopPlayers = async () => {
        console.log("top scores", await getTopScores())
        let topScores = await getTopScores()
        const players = [];
        for (let i = 0; i < topScores.length; i++) {
            players.push(<li>{topScores[i].given_name}: {topScores[i].point} points</li>);
            console.log("top scoresssssssss", topScores[i].point);
        }
        console.log("PLAYERS", players);
    
        // for(let i=0; i<players.length; i++){
        //     console.log(players[i])
        // }
        return players;
    }
    console.log(addTopPlayers())
    return (
        <main className='leaderboard card'>
            <h1>LEADERBOARD</h1>
            <ol>{(await addTopPlayers()).map(onePlayer => onePlayer)}</ol>
        </main>
    );
};


export default Leaderboard;