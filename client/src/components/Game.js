import Button from './Button';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io.connect(":8080");

const Game = ({ userDbId }) => {
    const [wordLength, setWordLength] = useState(undefined);

    useEffect(() => {
        // console.log(userDbId);
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
    
        socket.on('guessResult', ({ result }) => {
            console.log('Returned from server = ' + result);
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

    const displayWord = (wordLength) => {
        const wordDisplay = [];
        for (let i = 0; i < wordLength; i++) {
            wordDisplay.push(<li><span className='hidden'>1</span></li>);
        }
        return wordDisplay;
    };

    return (
        <main className='game card'>
            <h1>Guess the Word!</h1>
            <div>
            { 
                wordLength ? <ul>{displayWord(wordLength)}</ul> : null
            }
                <p>Attempted Letters: {} </p>
                <p>Incorrect Guess Counter: {} </p>
            </div>
            <div>
                <form action='post'>
                    <input type='text' placeholder='Enter a letter or word' pattern="[A-Za-z]{1}" required />
                    <Button onClick={makeGuess} text='Submit' color='#dc8665' />
                </form>
            </div>
        </main>
    );
};

export default Game;