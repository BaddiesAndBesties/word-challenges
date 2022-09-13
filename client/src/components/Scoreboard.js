import React from 'react'
import Button from './Button'

const Scoreboard = () => {
  return (
    <section className='scoreboard card'>
        <div className='btnContainer'>
            <Button text='New Game' />
            <Button text='Leaderboard' />
            <Button text='Instructions' />

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

export default Scoreboard
