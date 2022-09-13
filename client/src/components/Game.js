import React from 'react';
import Button from './Button';

const Game = () => {
    const word = () => {
        const dictionaryWord = 'potato';
        const wordDisplay = [];
        for (let i = 0; i < dictionaryWord.length; i++) {
            wordDisplay.push(<li><span className='hidden'>{dictionaryWord[i]}</span></li>)
        }
        return wordDisplay;
    };

    return (
        <main className='game card'>
            <h1>Guess the Word!</h1>
            <div>
                <ul>{word()}</ul>
                <p>Attempted Letters: {} </p>
                <p>Incorrect Guess Counter: {} </p>
            </div>
            
            <div>
                <form action='post'>
                    <input type='text' placeholder='Enter a letter or word' required />
                    <Button text='Submit' color='#dc8665' />
                </form>
            </div>
        </main>
    );
};

export default Game;