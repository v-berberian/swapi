import React, { useState, useEffect } from "react";

import GlobalStyles from "./components/GlobalStyles";
import Nav from "./components/Nav";
import Search from "./components/Search";

import "./App.css";
import axios from "axios";
import styled from "styled-components";
import { auth } from "./firebase";
import firebase from "firebase";

function App() {
  const [allPeople, setAllPeople] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    let people = [];
    axios
      .get("https://swapi.dev/api/people/")
      .then((response) => {
        people = response.data.results;
        return response.data.count;
      })
      .then((count) => {
        const numberOfPagesLeft = Math.ceil((count - 1) / 10);
        let promises = [];

        for (let i = 2; i <= numberOfPagesLeft; i++) {
          promises.push(axios(`https://swapi.dev/api/people?page=${i}`));
        }
        return Promise.all(promises);
      })
      .then((response) => {
        people = response.reduce(
          (acc, data) => [...acc, ...data.data.results],
          people
        );
        return setAllPeople(people);
      });
  }, []);

  //auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoggedIn(true);
      } else {
        setUser("");
        setLoggedIn(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <>
      <GlobalStyles />
      <div className="App">
        <Container>
          <Wrapper>
            <Nav loggedIn={loggedIn} user={user} />
            <Search allPeople={allPeople} loggedIn={loggedIn} user={user} />
          </Wrapper>
        </Container>
      </div>
    </>
  );
}

const Container = styled.div`
  width: 100%;
  background-color: black;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 16px 32px;
  background-image: url("/images/background.jpg");
  min-height: 100vh;
`;
export default App;
