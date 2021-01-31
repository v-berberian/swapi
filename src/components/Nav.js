import React, { useState } from "react";
import PersonCard from "./PersonCard";

import { search_url } from "../api";

import axios from "axios";
import uuid from "react-uuid";

const Nav = ({ allPeople }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [person, setPerson] = useState("");

  const handleInput = (e) => {
    // console.log(e);
    const value = e.target.value;
    setInput(value);

    if (allPeople && value.length > 1) {
      const regex = new RegExp(`${value}`, "i");

      setSuggestions(
        allPeople
          .map((person) => person.name)
          .sort()
          .filter((el) => regex.test(el))
      );
    } else if (value.length === 0) {
      setSuggestions(null);
      setPerson("");
    }
  };

  const handleName = (e) => {
    const name = e.target.innerText;
    setInput(name);
    setSuggestions("");
    // const person = {};
    for (let i = 0; i < allPeople.length; i++) {
      if (allPeople[i]["name"] === name) {
        setPerson(allPeople[i]);
      }
    }
  };

  const handleClear = () => {
    setInput("");
    setPerson("");
    setSuggestions("");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    axios
      .get(search_url(input))
      .then((data) => {
        function sort(a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }
        const sortedArray = data.data.results.sort(sort);
        setPerson(sortedArray[0]);
      })
      .catch((error) => alert(error));
    setSuggestions(null);
  };

  /////////////////////////////AUTH
  // const signInWithFacebook = () => {
  //   const facebookProvider = new firebase.auth.FacebookAuthProvider();
  // };

  return (
    <div>
      <form onSubmit={submitSearch}>
        <input type="text" onChange={handleInput} value={input} />
      </form>
      <button onClick={handleClear}>clear</button>
      {/* AutoComplete */}
      {suggestions &&
        suggestions.map((e) => (
          <p onClick={handleName} key={uuid()}>
            {e}
          </p>
        ))}
      <PersonCard person={person} suggestions={suggestions} />
    </div>
  );
};

export default Nav;
