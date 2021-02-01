import React from "react";
import styled from "styled-components";
import uuid from "react-uuid";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

const Heroes = ({
  setOpenMyHeroes,
  handleRemoveHero,
  openMyHeroes,
  myHeroesList,
  handleName,
}) => {
  return (
    <div>
      <MyHeroesBtn onClick={() => setOpenMyHeroes(!openMyHeroes)}>
        my heroes
      </MyHeroesBtn>

      <MyHeroes>
        {myHeroesList.map((hero) => (
          <div key={uuid()} className="hero" onClick={handleName}>
            {hero}
            <div
              className="close"
              onClick={() => {
                handleRemoveHero(hero);
              }}
            >
              <CloseRoundedIcon />
            </div>
          </div>
        ))}
      </MyHeroes>
    </div>
  );
};

const MyHeroesBtn = styled.div`
  margin: 3% auto 0 auto;
  text-transform: uppercase;
  border: 5px solid gray;
  max-width: 25rem;
  padding: 1rem;
  &&:hover {
    color: red;
    cursor: pointer;
  }
`;

const MyHeroes = styled.div`
  margin: 3% auto 0 auto;
  max-width: 25rem;
  padding: 1rem;

  .hero {
    margin-top: 5%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
      cursor: pointer;
      color: red;
    }
  }
`;

export default Heroes;
