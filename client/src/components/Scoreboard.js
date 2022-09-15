import React from 'react'
import Button from './Button'

const Scoreboard = ({ isSignedIn }) => {

  function startNewGame(isSignedIn){
    if(!isSignedIn){
        alert('Sorry! Please sign in first.')
        console.log("not signed in", isSignedIn);
    }else{
      //start a new game
    }
  }
  function getLeaderboard(isSignedIn){
    if(!isSignedIn){
      alert('Sorry! Please sign in first.')
      console.log("not signed in", isSignedIn);
    }else{
      //get leaderboard
  }
  }

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
            <Button text='Instructions' />
            {/* make Instructions modal window, will doing this now  */}

        </div>
        <h2>Scoreboard</h2>
      <h3>Check out your Stats!</h3>
      <div>
        <ul>
            <li>Wins: {}</li>
            <li>Losses: {}</li>
            <li>Total Games Played: {}</li>
        </ul>
      </div>

      <div>
        <h5>Difficulty</h5>
        <ul>
            <li>Easy: {} games played</li>
            <li>Medium: {} games played</li>
            <li>Hard: {} games played</li>
        </ul>
      </div>

      <h4>Total Points: {}</h4>

        </section>
    )
}

export default Scoreboard;
