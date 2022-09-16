import Button from './Button';
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../socketProvider';


// const socket = io.connect('https://word-challenges.herokuapp.com'); // Use this for heroku deployment
// const socket = io.connect('http://localhost:8080')

const Game = () => {
    
    const { socketConnection, remainingGuess, placeholder, incorrectGuesses, userWon, isPlaying } = useContext(SocketContext)

    const makeGuess = (e) => {
        if (document.querySelector('form').checkValidity()) {
            e.preventDefault();
            const letter = document.querySelector('input');
            socketConnection.emit('userGuess', { letter: letter.value, remainingGuess: remainingGuess });
            letter.value = '';
        }
    };

    return (
        <main className='game card'>
            <div>
                {
                    !isPlaying 
                        ?  
                        userWon ? <h1>WIN</h1> : <h1>LOST</h1>
                        :
                        <div>
                            <div id='game-screen'>
                                <h1>Guess the Word!</h1>

                                <ul>{
                                        placeholder.map((letter, i) => {
                                            if (letter === '_') {
                                                return <li key={i}><span className='hidden'>_</span></li>;
                                            } else {
                                                return <li key={i}><span>{letter}</span></li>;
                                            }
                                        })
                                    }
                                </ul>
                                <p>Attempted Letters: {incorrectGuesses} </p>
                                <p>Remaining Guesses: {remainingGuess} </p>
                            </div>
                            <div>
                                <form action='post'>
                                    <input type='text' placeholder='Enter a letter' pattern="[A-Za-z]{1}" required />
                                    <Button onClick={makeGuess} text='Submit' color='#dc8665' />
                                </form>
                            </div>
                        </div>
                }
            </div>
        </main>
    );
};

export default Game;