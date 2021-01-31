import React, { useState, useEffect } from "react";

import Nav from "./components/Nav";

import "./App.css";
import axios from "axios";
import { auth } from "./firebase";

function App() {
  const [allPeople, setAllPeople] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  // const [loggedIn, setLoggedIn] = useState(false);

  //loading all people on page render
  useEffect(() => {
    // setIsLoading(true);

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
    // setIsLoading(false);
  }, []);

  //auth
  useEffect(() => {});

  return (
    // !isLoading && (
    <div className="App">
      <Nav allPeople={allPeople} />
    </div>
    // )
    // loggedIn ? <div>Logged In !</div> : <div>Not Logged In !</div>
  );
}

export default App;
