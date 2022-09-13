import React, { useState } from 'react';
import GoogleSignIn from './GoogleSignIn';
import Button from './Button';

const Header = () => {
    return (
        <section id="header">
            <img src="word-challenges-logo.png"></img>
            <GoogleSignIn/>
            <Button text='Sign Out' color='#dc8665' onClick={null} />
        </section>
    )
}

export default Header;
