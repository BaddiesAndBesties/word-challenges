import React from 'react';
import Button from './Button';

const Game = (isSignedIn) => {
    const word = () => {
        const dictionaryWord = 'potato';
        const wordDisplay = [];
        for (let i = 0; i < dictionaryWord.length; i++) {
            wordDisplay.push(<li><span className='hidden'>{dictionaryWord[i]}</span></li>)
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
                <form action='post' method="/submitGuess" pattern="[A-Za-z]"> 
                {/* onSubmit={(e)=>{
                    e.preventDefault()
                    console.log("dflt prevented?", e.defaultPrevented);
                }}>   */}
                                {/* tried to prevent default above b/c user is signed out once page is auto
                refreshed via form submission */}
                    {/* maxlength="{**length of current word here**}" */}

                    <input type='text' name="userInput" placeholder='Enter a letter or word' required />
                    <Button text='Submit' color='#dc8665' onClick={()=>{
                        cantClickIfNotSignedIn(isSignedIn)
                        }
                    }/>
                </form>
            </div>
        </main>
    );
};

export default Game;