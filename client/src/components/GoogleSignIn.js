import { useEffect } from 'react';

const GoogleSignIn = ({ isSignedIn, setIsSignedIn, userName, setUserName, getUserEmail }) => {
    useEffect(() => {
        const signInHandler = (res) => {
            fetch('/user-info', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    jwtToken: res.credential
                })
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setUserName(data.firstname);
                    getUserEmail(data.email);
                })
                .catch((error) => {
                    console.error(error);
                });
            setIsSignedIn(true);
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
            } catch(error) {
                console.error(error);
            } finally {
                document.querySelector("#google-client-script").remove();
            }
        };

        // Script that gets attached to the body (i.e., <script>)
        const script = document.createElement('script');
        script.id = 'google-client-script';
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initGsi;
        document.querySelector('body').appendChild(script);

    }, [isSignedIn, setIsSignedIn, userName, setUserName, getUserEmail]);

    return (
        <div id="gsi-container"></div>
    );
};

export default GoogleSignIn;