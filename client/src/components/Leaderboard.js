import React from 'react';
import Button from './Button.js';

const Leaderboard = () => {
    const addTopPlayers = () => {
        const topPlayers = ['Will', 'Dennis', 'Kelly', 'Italians', 'Dogs'];
        const topPoints = [100, 90, 80, 70, 60];
        const players = [];
        for (let i = 0; i < topPlayers.length; i++) {
            players.push(<li>{topPlayers[i]}: {topPoints[i]} points</li>);
        }
        return players;
    }
    return (
        <main className='leaderboard card'>
            <h1>LEADERBOARD</h1>
            <ol>{addTopPlayers()}</ol>
            <Button text='Back to Game' color='#dc8665' onClick={null} />
        </main>
    );
};

export default Leaderboard;