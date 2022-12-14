import { useState, useEffect, useContext} from 'react';
import Instructions from './Instructions';
import Button from './Button';
import { SocketContext } from '../socketProvider';

const Scoreboard = ({ isSignedIn, setShowLeaderboard, showLeaderboard }) => {
  const { socketConnection, userDbId, isPlaying, setIsPlaying } = useContext(SocketContext);
  const [showInstructions, setShowInstructions] = useState(false);
  const [point, setPoint] = useState(undefined);
  const [wins, setWins] = useState(undefined);
  const [losses, setLosses] = useState(undefined);

  useEffect(() => {
    if (userDbId) {
      fetch(`/user/${userDbId}/stats`)
        .then((res) => res.json())
        .then(({ point, wins, losses }) => {
          setPoint(point);
          setWins(wins);
          setLosses(losses);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userDbId, isPlaying]);

  const startNewGame = () => {
    socketConnection.emit('newGame', {id: userDbId});
    setIsPlaying(true);
    setShowLeaderboard(false);
  };

  return (
    <section className='scoreboard card'>
      <div className='btnContainer'>
        {isSignedIn && !isPlaying ? <Button text='New Game' onClick={startNewGame} /> : null}
        {isSignedIn && isPlaying ? <Button text={!showLeaderboard ? 'Leaderboard' : 'Back to Game'} 
                                           onClick={() => setShowLeaderboard(!showLeaderboard)} /> : null}
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
  );
};

export default Scoreboard;
