import Button from './Button';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

// const socket = io.connect('https://word-challenges.herokuapp.com'); // Use this for heroku deployment
const socket = io.connect('http://localhost:8080'); 

const Game = ({ userDbId, gameOver, setGameOver }) => {
    const [wordLength, setWordLength] = useState(undefined);
    const [incorrectGuesses, setIncorrectGuesses] = useState(undefined);
    const [incorrectCounter, setIncorrectCounter] = useState(undefined);
    const [currentWord, setCurrentWord] = useState(undefined);
    const [userWon, setUserWon] = useState(undefined);
    const [maximumGuess, setMaximumGuess] = useState(7);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected: ' + socket.id); 
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected'); 
        });

        socket.emit('wordLength', ({ id: userDbId }));

        socket.on('wordLength', ({ length }) => {
            console.log('Word length is ' + length);
            setWordLength(length);
        });

        socket.on('guessResult', ({ result, incorrect }) => {
            console.log('Returned from server = ' + result);
            console.log('Returned from server = ' + incorrect);
            setIncorrectCounter(incorrect.length)
            setIncorrectGuesses(incorrect.join(' ').toUpperCase())
            setCurrentWord(result)
        });
    }, [userDbId]);

    const makeGuess = (e) => {
        if (document.querySelector('form').checkValidity()) {
            e.preventDefault();
            const letter = document.querySelector('input');
            socket.emit('userGuess', { letter: letter.value });
            letter.value = '';
        }
    };

    const displayWord = (wordLength, currentWord, incorrectCounter) => {
        const wordDisplay = [];
        if (currentWord && !currentWord.includes('1')) {
            const userIsPlaying = fetch('/getIsPlaying', {
                method: 'put', 
                headers:{
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    id: userDbId
                })
            })
                .then((res) => {
                    setGameOver(true);
                })
                .catch((error) => {
                    alert('Server connection was disrupted. Please try again');
                    console.error(error);
                })
                setUserWon(true);
        } else if (currentWord && incorrectCounter === maximumGuess) {
            setUserWon(false);
        } else if (currentWord) {
            for (let i = 0; i < wordLength; i++) {
                if (currentWord[i] === '1') {
                    wordDisplay.push(<li><span className='hidden'>1</span></li>);
                } else {
                    wordDisplay.push(<li><span>{currentWord[i]}</span></li>)
                }
            }
        } else {
            for (let i = 0; i < wordLength; i++) {
                wordDisplay.push(<li><span className='hidden'>1</span></li>);
            }
        }
        return wordDisplay;
    };

    const displayGameResult = () => {
        if (userWon) {
            return <h1>YOU WIN</h1>
        }
        if (!userWon) {
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

                                <ul>{displayWord(wordLength, currentWord, incorrectCounter)}</ul>
                                <p>Attempted Letters: {incorrectGuesses} </p>
                                <p>Incorrect Guess Counter: {incorrectCounter} </p>
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