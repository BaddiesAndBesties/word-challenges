import Button from './Button';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

// const socket = io.connect('https://word-challenges.herokuapp.com'); // Use this for heroku deployment
const socket = io.connect('http://localhost:8080'); 

const Game = ({ userDbId, gameOver, setGameOver }) => {
    const [wordLength, setWordLength] = useState(0);
    const [incorrectGuesses, setIncorrectGuesses] = useState([]);
    const [placeholder, setPlaceholder] = useState([]);
    const [gameResult, setGameResult] = useState(undefined);
    const [remainingGuess, setRemainingGuess] = useState(7);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected: ' + socket.id); 
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected'); 
        });

        socket.emit('placeholder', ({ id: userDbId }));

        socket.on('placeholder', ({ placeholder }) => {
            console.log(placeholder);
            setWordLength(placeholder.length);
            setRemainingGuess(placeholder.length);
            setPlaceholder(placeholder);
        });

        socket.on('guessResult', ({ result, incorrect, remainingGuess }) => {
            setPlaceholder(result);
            setIncorrectGuesses(incorrect.join(' ').toUpperCase());
            setRemainingGuess(remainingGuess);
        });
    }, []);

    const makeGuess = (e) => {
        if (document.querySelector('form').checkValidity()) {
            e.preventDefault();
            const letter = document.querySelector('input');
            socket.emit('userGuess', { letter: letter.value, remainingGuess: remainingGuess });
            letter.value = '';
        }
    };

    const displayGameResult = () => {
        if (gameResult === 'won') {
            return <h1>YOU WIN</h1>
        }
        if (gameResult === 'loss') {
            return <h1>YOU LOSE</h1>
        }
    };

    return (
        <main className='game card'>
            {
                gameOver 
                    ?
                        displayGameResult()
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
        </main>
    );
};

export default Game;