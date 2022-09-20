import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// const connection = io.connect('https://word-challenges.herokuapp.com'); // Use this for heroku deployment
const connection = io.connect('http://localhost:8080');

export const SocketContext = React.createContext({})
export const SocketProvider = ({ children }) => {
    const [socketConnection, setSocketConnection] = useState(null);
    const [userDbId, setUserDbId] = useState(undefined);
    const [placeholder, setPlaceholder] = useState([]);
    const [incorrectGuesses, setIncorrectGuesses] = useState([]);
    const [remainingGuess, setRemainingGuess] = useState(7);
    const [isPlaying, setIsPlaying] = useState(undefined);
    const [userWon, setUserWon] = useState(undefined);

    useEffect(() => {
        if (!socketConnection) {
            setSocketConnection(connection);
        }

        if (socketConnection) {
            socketConnection.on('connect', () => {
                console.log('Socket connected: ' + socketConnection.id);
            });

            socketConnection.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            socketConnection.on('newGame', ({ placeholder }) => {
                setRemainingGuess(placeholder.length);
                setPlaceholder(placeholder);
            });

            socketConnection.on('guessResult', ({ placeholder, incorrect, remainingGuess }) => {
                setPlaceholder(placeholder);
                setIncorrectGuesses(incorrect.join(' ').toUpperCase());
                setRemainingGuess(remainingGuess);
            });

            socketConnection.on('gameOver', ({ userWon }) => {
                setIsPlaying(false);
                setPlaceholder([]);
                setIncorrectGuesses([]);
                setRemainingGuess(undefined);
                setUserWon(userWon);
            });
        }
    }, [userDbId]);

    useEffect(() => {
        if (socketConnection && userDbId && isPlaying) {
            socketConnection.emit('placeholder', ({ id: userDbId }));
        }
    }, [userDbId, isPlaying, socketConnection]);

    return <SocketContext.Provider value={{ 
        socketConnection, 
        remainingGuess, 
        placeholder, 
        incorrectGuesses, 
        userWon, 
        userDbId, 
        setUserDbId, 
        isPlaying, 
        setIsPlaying }} >{children}</SocketContext.Provider>
};
