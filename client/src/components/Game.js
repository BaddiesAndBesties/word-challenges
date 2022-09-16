import Button from './Button';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

// const socket = io.connect('https://word-challenges.herokuapp.com'); // Use this for heroku deployment
const socket = io.connect('http://localhost:8080'); 

const Game = ({ userDbId, gameOver, setGameOver, userWon, setUserWon, setGamePoint }) => {
    const [incorrectGuesses, setIncorrectGuesses] = useState([]);
    const [placeholder, setPlaceholder] = useState([]);
    const [remainingGuess, setRemainingGuess] = useState(7);

    const updatePlayingStatus = () => {
        // setIsPlaying(!isPlaying)
        // setGameOver(false)
        fetch(`/user/${userDbId}/playingStatus`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => {
            return res.json();
          })
          .catch((error) => {
            console.error(error);
          });
      }

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected: ' + socket.id); 
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected'); 
        });

        socket.emit('placeholder', ({ id: userDbId }));

        socket.once('placeholder', ({ placeholder }) => {
            setRemainingGuess(placeholder.length);
            setGamePoint(placeholder.length);
            setPlaceholder(placeholder);
        });

        socket.on('guessResult', ({ placeholder, incorrect, remainingGuess }) => {
            setPlaceholder(placeholder);
            setIncorrectGuesses(incorrect.join(' ').toUpperCase());
            setRemainingGuess(remainingGuess);
            if (remainingGuess < 1) {
                setGameOver(true);
                setUserWon(false);
                updatePlayingStatus()
            }
            if (placeholder.indexOf('_') < 0) {
                setGameOver(true);
                setUserWon(true);
                updatePlayingStatus()
            }
        });
    }, [gameOver]);
        
        const makeGuess = (e) => {
            if (document.querySelector('form').checkValidity()) {
                e.preventDefault();
                const letter = document.querySelector('input');
                socket.emit('userGuess', { letter: letter.value, remainingGuess: remainingGuess });
                letter.value = '';
            }
        };

    return (
        <main className='game card'>
            <div>
                {
                    gameOver 
                        ?  
                        userWon ? <h1>YOU WON</h1> : <h1>YOU LOST</h1>
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