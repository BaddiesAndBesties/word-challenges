import { useState } from 'react';
import Instructions from './Instructions';
import Button from './Button';

const Scoreboard = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  return (
    <section className='scoreboard card'>
        <div className='btnContainer'>
            <Button text='New Game' />
            <Button text='Leaderboard' /> 
            <Button text='Instructions' onClick={() => setShowInstructions(true)}/>
            {showInstructions ? <Instructions setShowInstructions={setShowInstructions} /> : null}
        </div>
        <h2>Scoreboard</h2>
      <h3>Check out your Stats!</h3>
      <div>
        <ul>
            <li>Wins: {wins}</li>
            <li>Losses: {losses}</li>
            <li>Total Games Played: {wins + losses}</li>
        </ul>
      </div>
      <div>
      </div>
      <h4>Total Points: {}</h4>
        </section>
    )
}

export default Scoreboard;
