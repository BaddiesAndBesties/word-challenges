import { useRef } from 'react';
import ReactDOM from 'react-dom';

const Instructions = ({ setShowInstructions }) => {
    const modalRef = useRef();
    const closeInstructions = (e) => {
        if (e.target === modalRef.current) {
            setShowInstructions(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="container" ref={modalRef} onClick={closeInstructions}>
            <div className="modal">
            <main className='card'>
                <h1>Welcome to Word Challenge!</h1>
                <div>
                    <h3>Getting Started</h3>
                    <ul>
                        <li>Sign up by using your google account</li>
                        <li>Start a new game</li>
                        <li>Choose your difficulty</li>
                        <li>Enter your guesses</li>
                        <li>Have fun!</li>
                    </ul>
                </div>
                <div>
                    <h3>How to Play</h3>
                    <ul>
                        <li>Choose a difficulty level</li>
                        <li>Guess the word by entering letters</li>
                        <li>If you think you can guess the entire word you can submit it, but if you are wrong it counts as an incorrect guess!</li>
                        <li>Number of guesses is based on difficulty. When you surpass the amount of allowed guesses you lose!</li>
                        <li>When you guess the word, you win!</li>
                        <li>Your score gets calculated and added to your stats.</li>
                    </ul>
                    <button onClick={() => setShowInstructions(false)}>X</button>
                </div>
            </main>
            </div>
        </div>,
        document.getElementById("portal")
      );
};

export default Instructions;
