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



    const updatePlayingStatus = (id, wordLength) => {
        console.log('i started fetch', id)
        fetch(`/user/${id}/update-stat`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                result: userWon,
                point: wordLength
            })
        })
            .then((res) => {
                return res.json();
            })
            .catch((error) => {
                console.error(error);
            });
    }

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
                setRemainingGuess(placeholder.length);
                setPlaceholder(placeholder);
            });

            socketConnection.on('guessResult', ({ placeholder, incorrect, remainingGuess, wordLength, id }) => {
                setPlaceholder(placeholder);
                setIncorrectGuesses(incorrect.join(' ').toUpperCase());
                setRemainingGuess(remainingGuess);
                if (remainingGuess < 1) {
                    setUserWon(false);
                    setIsPlaying(false)
                    updatePlayingStatus(id, wordLength)
                    setIncorrectGuesses([])
                    setRemainingGuess(7)
                    console.log('WOmW YOU LOSeee')
                }
                console.log("interestubggfgyhk", placeholder);
                if (placeholder.indexOf('_') < 0) {
                    setUserWon(true);
                    setIsPlaying(false)
                    updatePlayingStatus(id, wordLength)
                    setIncorrectGuesses([])
                    setRemainingGuess(7)
                    console.log('WOW YOU WINNNNa')
                }
            });
        }
        // }

    }, [socketConnection])

    useEffect(() => {
        if (socketConnection && userDbId && isPlaying) {
            socketConnection.emit('placeholder', ({ id: userDbId }));
        }
    }, [userDbId, isPlaying])


    // useEffect(() => {

    // }, [socketConnection, userDbId])

    return <SocketContext.Provider value={{ socketConnection, remainingGuess, placeholder, incorrectGuesses, userWon, userDbId, setUserDbId, isPlaying, setIsPlaying }} >{children}</SocketContext.Provider>

}

