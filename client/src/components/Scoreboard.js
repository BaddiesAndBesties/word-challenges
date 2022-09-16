import { useState, useEffect, useContext} from 'react';
import Instructions from './Instructions';
import Button from './Button';
import { SocketContext } from '../socketProvider';



const Scoreboard = ({ isSignedIn, setShowLeaderboard, showLeaderboard }) => {
  const {userDbId, setIsPlaying, isPlaying, socketConnection} = useContext(SocketContext)
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
          setIsPlaying(isPlaying)
        })
        .catch((error) => {
          console.error(error);
        });
    }

  }, [userDbId, point, wins, losses]);


  const startNewGame = () => {
    socketConnection.emit('newGame', {id: userDbId})
    setIsPlaying(true)
  }

  return (
    <section className='scoreboard card'>
      <div className='btnContainer'>
        {(isSignedIn && !isPlaying) && <Button text='New Game' onClick={ startNewGame } />}


        { (userDbId && isSignedIn) && <Button text={!showLeaderboard ? 'Leaderboard' : 'Back to Game'} onClick={() => setShowLeaderboard(!showLeaderboard)} />}


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
