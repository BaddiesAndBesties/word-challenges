import React, { useState } from 'react';
import GoogleSignIn from './GoogleSignIn';

const Header = () => {
    return (
        <section id="header">
            <img src="word-challenges-logo.png"></img>
            <GoogleSignIn/>
            <button id="signOutBtn">Sign Out</button>
        </section>
    )
}

export default Header;
