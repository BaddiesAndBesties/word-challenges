import React, { useState } from "react";
import GoogleSignIn from "./GoogleSignIn";
import Button from "./Button";

const Header = ({ isSignedIn, setIsSignedIn }) => {
  const [userName, setUserName] = useState(undefined);
  const [userEmail, setUserEmail] = useState(undefined);

  const getUserEmail = (email) => {
    setUserEmail(email);
  };

  const onSignOut = () => {
    setIsSignedIn(false);
    setUserName(undefined);
    setUserEmail(undefined);
    window.google.accounts.id.revoke(userEmail, (done) => {
      console.log(done.error);
    });
  };
  
//   if (isSignedIn) {
//     try {
//       fetch("/userLoggedIn", {
//         method: "post",
//         header: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userName: userName,
//           userEmail,
//           userEmail,
//         }),
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }

  return (
    <section id="header">
      <img src="word-challenges-logo.png" alt="Word Challenges!"></img>
      <div id="user-sign-in-container">
        {isSignedIn ? (
          <div id="signed-in-container">
            <p>Welcome, {userName}!</p>
            <Button
              id="sign-out-btn"
              text="Sign Out"
              color="#dc8665"
              onClick={onSignOut}
            />
          </div>
        ) : (
          <GoogleSignIn
            isSignedIn={isSignedIn}
            setIsSignedIn={setIsSignedIn}
            userName={userName}
            setUserName={setUserName}
            getUserEmail={getUserEmail}
          />
        )}
      </div>
    </section>
  );
};

export default Header;
