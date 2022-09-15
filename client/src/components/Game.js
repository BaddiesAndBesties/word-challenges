import Button from './Button';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:8080");

const Game = ({ userDbId }) => {
    const makeGuess = (e) => {
        e.preventDefault();
        const letter = document.querySelector('input');
        socket.emit('userGuess', {letter : letter.value}, userDbId);
        letter.value = '';
    };

    socket.on('guessResult', ({ result }) => {
        console.log('Returned from server = ' + result);
    });

    const word = () => {
        const dictionaryWord = 'potato';
        const wordDisplay = [];
        for (let i = 0; i < dictionaryWord.length; i++) {
            wordDisplay.push(<li><span className='hidden'>{dictionaryWord[i]}</span></li>);
        }
        return wordDisplay;
    };

    function cantClickIfNotSignedIn(isSignedIn){
        if(!isSignedIn){
          alert('Sorry! Please sign in first.')
          console.log("not signed in", isSignedIn);
        }
      }
    return (
        <main className='game card'>
            <h1>Guess the Word!</h1>
            <div>
                <ul>{word()}</ul>
                <p>Attempted Letters: {} </p>
                <p>Incorrect Guess Counter: {} </p>
            </div>
            <div>
                <form action='post'>
                    <input type='text' placeholder='Enter a letter or word' required />
                    <Button onClick={makeGuess} text='Submit' color='#dc8665' />
                </form>
            </div>
        </main>
    );
};

export default Game;