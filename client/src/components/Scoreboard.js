import { useState, useEffect } from 'react';
import Instructions from './Instructions';
import Button from './Button';

const Scoreboard = ({ isSignedIn, userDbId, setGameAndLeaderboard, showGame }) => {
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
        .then(({ point, wins, losses, isPlaying }) => {
          setPoint(point);
          setWins(wins);
          setLosses(losses);
          setIsPlaying(isPlaying)
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userDbId]);

  const startNewGame = () => {
    fetch(`/user/${userDbId}/newGame`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <section className='scoreboard card'>
      <div className='btnContainer'>
        {(isSignedIn && !isPlaying) && <Button text='New Game' onClick={startNewGame} />}


        <Button text={showGame ? 'Leaderboard' : 'Back to Game'} onClick={setGameAndLeaderboard} />

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
