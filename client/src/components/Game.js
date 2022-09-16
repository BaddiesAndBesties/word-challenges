import Button from './Button';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io.connect(":8080");

const Game = ({ userDbId }) => {
    const [wordLength, setWordLength] = useState(undefined);
    const [incorrectGuesses, setIncorrectGuesses] = useState(undefined);
    const [incorrectCounter, setIncorrectCounter] = useState(undefined);
    const [currentWord, setCurrentWord] = useState(undefined)

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

    const displayWord = (wordLength, currentWord) => {
        console.log('poop', currentWord)
        const wordDisplay = [];
        if (currentWord && !currentWord.includes('1')){
            // need to change isPlaying to false
            //fetch get
            //sending the isPLaying var back
            let resp = fetch('/getIsPlaying', {
                method: 'put', 
                headers:{
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    'id': userDbId
                })
            })
            .then(response =>{
                console.log("userDbId is", userDbId);
                if(response.ok) console.log("ok");
                // return response.json()
            })
            
            return <h1>YOU WIN</h1>
        } else if (currentWord) {
            for (let i = 0; i < wordLength; i++) {
                if (currentWord[i] === '1'){
                    wordDisplay.push(<li><span className='hidden'>1</span></li>);
                } else {
                    wordDisplay.push(<li><span>{currentWord[i]}</span></li>)
                }
            }
        }else {
            for (let i = 0; i < wordLength; i++) {
                wordDisplay.push(<li><span className='hidden'>1</span></li>);
            }
        }
        return wordDisplay;
    };
    displayWord()

    return (
        <main className='game card'>
            <h1>Guess the Word!</h1>
            <div>
                {
                    wordLength ? <ul>{displayWord(wordLength, currentWord)}</ul> : null
                }
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