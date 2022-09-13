import React from 'react';
import Button from './Button';

const Game = () => {
    const word = () => {
        const dictionaryWord = 'potato'
        const wordDisplay = []
        for (let i = 0; i < dictionaryWord.length; i++) {
            wordDisplay.push(<li className='hidden'>{dictionaryWord[i]}</li>)
        }
        return wordDisplay
    }

    return (
        <main>
            <h1>Guess the Word!</h1>
            <div>
                <ul>{word()}</ul>
                <p>Incorrect Guess Counter: {} </p>
            </div>
            
            <div>
                <form action='post'>
                    <label>Take a guess!</label>
                    <input type='text' placeholder='Enter letter or word' required />
                    <Button text='Submit' color='green' />
                </form>
            </div>
        </main>
    )
}

export default Game;