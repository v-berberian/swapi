import React, { useState, useEffect } from "react";
import PersonCard from "./PersonCard";
import Heroes from "./MyHeroes";

import { search_url } from "../api";

import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

import axios from "axios";
import styled from "styled-components";
import uuid from "react-uuid";
import firebase from "firebase";
import { db } from "../firebase";

const Search = ({ allPeople, loggedIn, user }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [person, setPerson] = useState("");
  const [openMyHeroes, setOpenMyHeroes] = useState(false);
  const [myHeroesList, setMyHeroesList] = useState([]);

  useEffect(() => {
    user &&
      db
        .collection("swapi")
        .where("user", "==", user?.displayName)
        .onSnapshot((s) => setMyHeroesList(s.docs.map((d) => d.data().liked)));
  }, [user]);

  const handleInput = (e) => {
    // console.log(e);
    const value = e.target.value;
    setInput(value);

    if (allPeople && value?.length > 1) {
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
    if (allPeople) {
      for (let i = 0; i < allPeople.length; i++) {
        if (allPeople[i]["name"] === name) {
          setPerson(allPeople[i]);
        }
      }
    } else console.log("not scanned");
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

  const handleRemoveHero = (hero) => {
    db.collection("swapi")
      .where("user", "==", user?.displayName)
      .where("liked", "==", hero)
      .get()
      .then((data) => {
        const id = data.docs[0].id;
        db.collection("swapi").doc(id).delete();
      });
  };

  return (
    <>
      <StyledSearch>
        <StyledForm onSubmit={submitSearch}>
          <input
            // key={uuid()}
            type="text"
            onChange={handleInput}
            value={input}
            placeholder={"search"}
          />
          {input && (
            <Cancel>
              <CloseRoundedIcon onClick={handleClear} />
            </Cancel>
          )}
        </StyledForm>

        {/* AutoComplete */}
        {suggestions && (
          <Suggestions>
            {suggestions.map((e) => (
              <p onClick={handleName} key={uuid()}>
                {e}
              </p>
            ))}
          </Suggestions>
        )}
        <PersonCard
          loggedIn={loggedIn}
          handleClear={handleClear}
          person={person}
          suggestions={suggestions}
          user={user}
        />
      </StyledSearch>
      {loggedIn && !person && (
        <Heroes
          handleName={handleName}
          myHeroesList={myHeroesList}
          openMyHeroes={openMyHeroes}
          setOpenMyHeroes={setOpenMyHeroes}
          handleRemoveHero={handleRemoveHero}
        />
      )}
    </>
  );
};

const StyledForm = styled.form`
  display: flex;
  overflow: hidden;
  margin: 0 auto;
  background-color: white;
  max-width: 25rem;
  width: auto;
  border-radius: 5rem;
  position: relative;

  input {
    padding-left: 1rem;
    font-size: 1.3rem;
    height: 3.2rem;
    border: none;
    width: 90%;
    &::placeholder {
      font-size: 0.3;
    }
  }
`;

const Cancel = styled.div`
  color: darkgray;
  width: 10%;
  position: absolute;
  top: 50%;
  right: 0.2rem;
  transform: translateY(-50%);

  &:hover {
    color: black;
    transition: 0.25s;
  }
`;
const StyledSearch = styled.div``;

const Suggestions = styled.div`
  margin: 5% auto;
  line-height: 2.5rem;
  cursor: pointer;

  p {
    &:hover {
      color: red;
    }
  }
`;

export default Search;
