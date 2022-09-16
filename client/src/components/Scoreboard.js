import { useState, useEffect } from 'react';
import Instructions from './Instructions';
import Button from './Button';
import io from 'socket.io-client'

const Scoreboard = ({ isSignedIn, userDbId, gameOver, setGameOver, setSocket }) => {
  const socket = io.connect('http://localhost:8080'); 
  const [showInstructions, setShowInstructions] = useState(false);
  const [point, setPoint] = useState(undefined);
  const [wins, setWins] = useState(undefined);
  const [losses, setLosses] = useState(undefined);
  const [isPlaying, setIsPlaying] = useState(undefined)

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
          setIsPlaying(isPlaying)
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [gameOver, userDbId]);

  const startNewGame = () => {
    setGameOver(false);
    setSocket('http://localhost:8080');
    fetch(`/user/${userDbId}/new-game`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        return res.json();
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
        {showInstructions ? <Instructions setShowInstructions={setShowInstructions} /> : null}

      </div>
      {
        isSignedIn
          ?
          <div id='stats'>
            <h3>Check out your Stats!</h3>
            <div>
              <ul>
                <li>Wins: {wins}</li>
                <li>Losses: {losses}</li>
                <li>Total Games Played: {wins + losses}</li>
              </ul>
            </div>
            <h4>Total Points: {point}</h4>
          </div>
          :
          null
      }
    </section>
  )
}

export default Scoreboard;
