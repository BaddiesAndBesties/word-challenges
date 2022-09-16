import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"

export const SocketContext = React.createContext({})
export const SocketProvider = ({ children }) => {
    const [socketConnection, setSocketConnection] = useState(null)
    const [incorrectGuesses, setIncorrectGuesses] = useState([]);
    const [placeholder, setPlaceholder] = useState([]);
    const [userWon, setUserWon] = useState(undefined);
    const [remainingGuess, setRemainingGuess] = useState(7);
    const [userDbId, setUserDbId] = useState(undefined);
    const [isPlaying, setIsPlaying] = useState(undefined)



    // const updatePlayingStatus = () => {
    //     fetch(`/user/${userDbId}/playingStatus`, {
    //         method: 'put',
    //         headers: { 'Content-Type': 'application/json' },
    //     })
    //         .then((res) => {
    //             return res.json();
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }

    useEffect(() => {
        if (!socketConnection) {
            setSocketConnection(io())
        }
        if (socketConnection) {
            socketConnection.on('connect', () => {
                console.log('Socket connected: ' + socketConnection.id);
            });

            socketConnection.on('disconnect', () => {
                console.log('Socket disconnected');
            });


            socketConnection.on('placeholder', ({ placeholder }) => {
                console.log('hellloo', placeholder)
                setRemainingGuess(placeholder.length);
                setPlaceholder(placeholder);
            });

            socketConnection.on('guessResult', ({ placeholder, incorrect, remainingGuess }) => {
                console.log('poop', placeholder)
                setPlaceholder(placeholder);
                setIncorrectGuesses(incorrect.join(' ').toUpperCase());
                setRemainingGuess(remainingGuess);
                if (remainingGuess < 1) {
                    setUserWon(false);
                    setIsPlaying(false)
                }
                console.log(placeholder);
                if (placeholder.indexOf('_') < 0) {
                    setUserWon(true);
                    setIsPlaying(false)
                }
            });
        }
    }, [socketConnection])

    useEffect(() => {
        console.log({socketConnection, userDbId, isPlaying})
        if (socketConnection && userDbId && isPlaying) {
            console.log('inside if')
            socketConnection.emit('placeholder', ({ id: userDbId }));
        }
    }, [userDbId, isPlaying])
    return <SocketContext.Provider value={{ socketConnection, remainingGuess, placeholder, incorrectGuesses, userWon, userDbId, setUserDbId, isPlaying, setIsPlaying }} >{children}</SocketContext.Provider>

}

