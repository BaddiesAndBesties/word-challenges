import { useState, useEffect } from 'react';
import Instructions from './Instructions';
import Button from './Button';

const Scoreboard = ({ isSignedIn, userEmail, userDbId }) => {
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
}, [userDbId]);


  function startNewGame(isSignedIn) {
    if(!isSignedIn){
        alert('Sorry! Please sign in first.');
        console.log("not signed in", isSignedIn);
    }else{
      //start a new game
    }
  };

  function getLeaderboard(isSignedIn){
    if(!isSignedIn){
      alert('Sorry! Please sign in first.');
      console.log("not signed in", isSignedIn);
    }else{
      //get leaderboard
    }
  };

  return (
    <section className='scoreboard card'>
        <div className='btnContainer'>
            <Button text='New Game' onClick={()=>{
              startNewGame(isSignedIn)
            }
            }/>
            
            <Button text='Leaderboard' onClick={()=>{
              getLeaderboard(isSignedIn)
            }} />

            <Button text='Instructions' onClick={() => setShowInstructions(true)}/>
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
