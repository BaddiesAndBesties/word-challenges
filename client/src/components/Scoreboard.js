import { useState, useEffect } from 'react';
import Instructions from './Instructions';
import Button from './Button';

const Scoreboard = ({ isSignedIn, userDbId, gameOver, setGameOver, setShowLeaderboard }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [point, setPoint] = useState(undefined);
  const [wins, setWins] = useState(undefined);
  const [losses, setLosses] = useState(undefined);

  useEffect(() => {
    if (userDbId) {
      fetch(`/user/${userDbId}/stats`)
        .then((res) => {
          return res.json();
        })
        .then(({ point, wins, losses }) => {
          setPoint(point);
          setWins(wins);
          setLosses(losses);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [gameOver, userDbId]);

  const startNewGame = () => {
    setShowLeaderboard(false);
    fetch(`/user/${userDbId}/update-playing`, {
      method: 'put'
    })
      .then((res) => {
          setGameOver(false);
      })
      .catch((error) => {
          alert('Updating game result was disrupted. Please try again.');
          console.error(error);
      });
  };

  return (
    <section className='scoreboard card'>
      <div className='btn-container'>
        {
          !isSignedIn ? null : gameOver
              ? <Button text='Another Game' onClick={startNewGame} />
              : <Button text='Start Game' onClick={startNewGame} />
        }
        <Button text='Instructions' onClick={() => setShowInstructions(true)} />
        {
          showInstructions 
            ? <Instructions setShowInstructions={setShowInstructions} /> 
            : null
        }
      </div>
      {
        isSignedIn
          ?
          <div id='stats'>
            <h3>Check out your Stats!</h3>
            <div>
              <ul>
                <li key={'win'}>Wins: {wins}</li>
                <li key={'loss'}>Losses: {losses}</li>
                <li key={'total'}>Total Games Played: {wins + losses}</li>
              </ul>
            </div>
            <h4>Total Points: {point}</h4>
          </div>
          : null
      }
    </section>
  );
};

export default Scoreboard;
