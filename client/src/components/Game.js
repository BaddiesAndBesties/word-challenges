import Button from './Button';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

// const socket = io.connect('https://word-challenges.herokuapp.com'); // Use this for heroku deployment
const socket = io.connect(':3000'); 

const Game = ({ userDbId }) => {
    const [wordLength, setWordLength] = useState(undefined);
    const [incorrectGuesses, setIncorrectGuesses] = useState(undefined);
    const [incorrectCounter, setIncorrectCounter] = useState(undefined);
    const [currentWord, setCurrentWord] = useState(undefined)

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected: ' + socket.id); // x8WIv7-mJelg7on_ALbx
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected'); // undefined
        });

        socket.emit('wordLength', ({ id: userDbId }));

        socket.on('wordLength', ({ length }) => {
            console.log('Word length is ' + length);
            setWordLength(length);
        })

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
            // need to change isPlaying to false
            return <h1>YOU WIN</h1>
        } else if (currentWord && incorrectCounter === 8) {
            return <h1>YOU LOSE</h1>
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

    return (
        <main className='game card'>
            <h1>Guess the Word!</h1>
            <div>
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
        </main>
    );
};

export default Game;