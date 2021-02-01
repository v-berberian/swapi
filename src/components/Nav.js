import React, { useState } from "react";
import styled from "styled-components";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";

const Nav = ({ loggedIn, user }) => {
  const [open, setOpen] = useState(false);

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/signedIn",
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.FacebookAuthProvider.PROVIDER_ID],
  };

  const handleLogin = () => {
    // Sign in using a popup.
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("user_birthday");
    // provider.setCustomParameters({ auth_type: "reauthenticate" });
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Facebook Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
      });
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .catch((error) => console.log(error));
  };

  return (
    <NavBar>
      {loggedIn ? (
        <>
          <Login onClick={handleLogout}>Logout</Login>
          <div onClick={() => setOpen(true)} className="logged-in-btn">
            {user.displayName}
          </div>
        </>
      ) : (
        // <Login onClick={() => setOpen(true)}> Login</Login>
        <Login onClick={handleLogin}>Login with FB</Login>
      )}
    </NavBar>
  );
};

const NavBar = styled.nav`
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logged-in-btn {
    &:hover {
      color: none;
    }
  }
`;

const Login = styled.div`
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

export default Nav;
