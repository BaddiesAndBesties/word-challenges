import React, { useState } from "react";
import GoogleSignIn from "./GoogleSignIn";
import Button from "./Button";

const Header = ({ isSignedIn, setIsSignedIn, setUserEmail, setShowLeaderboard, showLeaderboard }) => {
    const [userName, setUserName] = useState(undefined);

    const onSignOut = () => {
        setIsSignedIn(false);
        setUserName(undefined);
        setUserEmail(undefined);
        setShowLeaderboard(true);
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
                        />
                }
            </div>
        </section>
    );
};

export default Header;
