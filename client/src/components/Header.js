import React, { useState } from "react";
import GoogleSignIn from "./GoogleSignIn";
import Button from "./Button";


const Header = ({ isSignedIn, setIsSignedIn, setUserEmail, setUserDbId, setGameAndLeaderboard, showGame }) => {
    const [userName, setUserName] = useState(undefined);

    const onSignOut = () => {
        setIsSignedIn(false);
        setUserName(undefined);
        setUserEmail(undefined);
        showGame && setGameAndLeaderboard()
    };

    return (
        <section id='header'>
            <img src='word-challenges-logo.png' alt='Word Challenges!'></img>
            <div id='user-sign-in-container'>
                {
                    isSignedIn 
                        ?
                        <div id='signed-in-container'>
                            <p>Welcome, {userName}!</p> 
                            <Button id='sign-out-btn' text='Sign Out' color='#dc8665' onClick={onSignOut} />
                        </div>
                        :
                        <GoogleSignIn 
                            isSignedIn={isSignedIn}    
                            setIsSignedIn={setIsSignedIn}
                            userName={userName}
                            setUserName={setUserName}
                            setUserEmail={setUserEmail}
                            setUserDbId={setUserDbId}
                        />
                }
            </div>
        </section>
    );
};

export default Header;
