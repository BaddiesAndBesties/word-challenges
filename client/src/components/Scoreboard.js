import { useState, useEffect } from 'react';
import Instructions from './Instructions';
import Button from './Button';
import io from 'socket.io-client'


const socket = io.connect('http://localhost:8080'); 


const Scoreboard = ({ isSignedIn, userDbId, setShowLeaderboard, showLeaderboard, gameOver, setGameOver }) => {
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
    // setIsPlaying(!isPlaying)
    setGameOver(false)
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
        {(isSignedIn && (!isPlaying || gameOver)) && <Button text='New Game' onClick={startNewGame} />}


        { (userDbId && isSignedIn) && <Button text={!showLeaderboard ? 'Leaderboard' : 'Back to Game'} onClick={() => setShowLeaderboard(!showLeaderboard)} />}

        <Button text='Instructions' onClick={() => setShowInstructions(true)} />
        {showInstructions ? <Instructions setShowInstructions={setShowInstructions} /> : null}

      </div>
      {/* {
        isSignedIn
          ?
          // <div id='stats'>
          //   <h3>Check out your Stats!</h3>
          //   <div>
          //     <ul>
          //       <li>Wins: {wins}</li>
          //       <li>Losses: {losses}</li>
          //       <li>Total Games Played: {wins + losses}</li>
          //     </ul>
          //   </div>
          //   <h4>Total Points: {point}</h4>
          // </div>
          :
          null
      } */}
    </section>
  )
}

export default Scoreboard;
