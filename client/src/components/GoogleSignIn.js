//External imports
import React, { useState, useEffect } from 'react';

const GoogleSignIn = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userName, setUserName] = useState(undefined);
    const [userEmail, setUserEmail] = useState(undefined);

    useEffect(() => {
        if (isSignedIn && userName) {
            return;
        }

        const jwtDecoder = (token) => {
            const base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload)
        };

        const signInHandler = (res) => {
            const response = jwtDecoder(res.credential);
            setIsSignedIn(true);
            setUserName(response.name);
            setUserEmail(response.eamil);
        };

        const initGsi = async () => {
            try {
                if (!window.google) {
                    console.error('Error loading the GSI script');
                    return;
                }
                window.google.accounts.id.initialize({
                    client_id: await fetch('/google-client')
                                    .then((res) => res.text())
                                    .then((data) => data),
                    callback: signInHandler,
                });
                window.google.accounts.id.renderButton(
                    document.querySelector("#gsi-container"),
                    { 
                        theme: 'outline', 
                        size: 'large' 
                    }
                );
                window.google.accounts.id.prompt();
            } catch(error) {
                console.error(error);
            } finally {
                window.google.accounts.id.cancel();
                document.querySelector("#google-client-script").remove();
            }
        };

        const script = document.createElement('script');
        script.id = 'google-client-script';
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initGsi;
        // document.querySelector('body').appendChild(script);
        document.getElementById('header').appendChild(script);

    }, [isSignedIn, userName]);

    // const script = document.createElement('script');
    // script.id = 'google-client-script';
    // script.src = "https://accounts.google.com/gsi/client";
    // script.async = true;
    // script.onload = initGsi;
    // // document.querySelector('body').appendChild(script);
    // document.getElementById('headerDiv').appendChild(script);

// }, [isSignedIn, userName]);

    // fetch('/user', {
    //     method: 'POST',
    //     headers: { 
    //         'Content-Type': 'application/json' 
    //     },
    //     body: JSON.stringify({
    //         name: userName,
    //         email: userEmail,
    //     })
    // })
    //     .then((res) => res.json())
    //     .then((data) => console.log(data))
    //     .catch((error) => {
    //         console.log(error);
    //     });

    
    return (
        <React.Fragment>
        <div id="googleAuth">
            {
                userName ? 
                    <div id="welcome-container">
                        <p>Welcome, {userName}!</p> 
                    </div> : 
                    null
            }
            {
                !isSignedIn ?
                    <div id="gsi-container"></div> :
                    null
            }
        </div>
        {/* <div>
            <button>Sign Out</button>
        </div> */}
        </React.Fragment>
    );
}

export default GoogleSignIn;