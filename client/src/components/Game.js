import React from 'react';
import Button from './Button';
import io from 'socket.io-client'


const socket = io.connect("http://localhost:8080")

const Game = () => {
    const room = 'kellykchhe'
    const joinRoom = () => {
        socket.emit('joinRoom', room)
        console.log(`Room: ${room}`)
    }

    const guessedLetter = (e) => {
        e.preventDefault()
        const letter = document.querySelector('input')
        socket.emit('guessedLetter', {letter : letter.value, room} )
        letter.value = ''
    }

    socket.on('gameData', (args) => {
        console.log(args.game)
    })

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
            {joinRoom()}
            <h1>Guess the Word!</h1>
            <div>
                <ul>{word()}</ul>
                <p>Attempted Letters: {} </p>
                <p>Incorrect Guess Counter: {} </p>
            </div>
            
            <div>
                <form action='post'>
                    <input type='text' placeholder='Enter a letter or word' required />
                    <Button onClick={guessedLetter} text='Submit' color='#dc8665' />
                </form>
            </div>
        </main>
    );
};

export default Game;