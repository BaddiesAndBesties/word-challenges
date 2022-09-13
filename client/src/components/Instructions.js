import React from 'react'
import Button from './Button'

const Instructions = () => {
    return (
        <main className='card'>
            <h1>Welcome to Word Challenge!</h1>
            <div>
                <h3>Getting Started</h3>
                <ul>
                    <li>Sign up by using your google account</li>
                    <li>Start a new game</li>
                    <li>Choose your difficulty</li>
                    <li>Enter your guesses</li>
                    <li>Have fun!</li>
                </ul>
            </div>
            <div>
                <h3>How to Play</h3>
                <ul>
                    <li>Choose a difficulty level</li>
                    <li>Guess the word by entering letters</li>
                    <li>If you think you can guess the entire word you can submit it, but if you are wrong it counts as an incorrect guess!</li>
                    <li>Number of guesses is based on difficulty. When you surpass the amount of allowed guesses you lose!</li>
                    <li>When you guess the word, you win!</li>
                    <li>Your score gets calculated and added to your stats.</li>
                </ul>
                {<Button text='Play Game' color='#dc8665' onClick={null} />}
            </div>
        </main>
    )
}

export default Instructions
