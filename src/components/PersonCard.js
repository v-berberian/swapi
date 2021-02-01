import React, { useState, useEffect } from "react";

import uuid from "react-uuid";
import styled from "styled-components";
import axios from "axios";
import { db, storage } from "../firebase";
import firebase from "firebase";

const PersonCard = ({ person, suggestions, handleClear, loggedIn, user }) => {
  const [homeworld, setHomeworld] = useState("");
  const [films, setFilms] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [liked, setLiked] = useState(false);
  const [image, setImage] = useState("");
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setImage("");
    setUploadedImageURL("");

    if (person && user) {
      setLiked(false);
      db.collection("swapi")
        .where("user", "==", user?.displayName)
        .onSnapshot((snap) => {
          snap.docs.map((entry) => {
            if (person.name === entry.data().liked) {
              setLiked(true);
              setUploadedImageURL(entry.data().image);
            }
          });
        });
    }
  }, [person, user]);

  //Getting async Vehicles/Films/Homeworld requests
  useEffect(() => {
    setIsLoading(true);
    setVehicles([]);
    setHomeworld("");
    setFilms([]);

    if (person) {
      const handleAllRequests = () => {
        Promise.all([
          Promise.all(
            person.vehicles.map((vehicle) => {
              return axios.get(vehicle).then((resp) => {
                return { name: resp.data.name, model: resp.data.model };
              });
            })
          ).then((resp) => {
            setVehicles(resp);
          }),
          Promise.all(
            person.films.map((film) => {
              return axios.get(film).then((e) => {
                return e.data.title;
              });
            })
          ).then((resp) => setFilms(resp)),
          axios
            .get(person.homeworld)
            .then((planet) => {
              return setHomeworld(planet.data.name);
            })
            .catch((error) => console.log(error)),
        ]).then((result) => setIsLoading(false));
      };
      handleAllRequests();
    }
  }, [person]);

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      storage
        .ref("images")
        .child(image.name)
        .getDownloadURL()
        .then((url) => {
          db.collection("swapi")
            .where("user", "==", user?.displayName)
            .where("liked", "==", person.name)
            .get()
            .then((data) => {
              return data.docs[0].id;
            })
            .then((id) => {
              return db.collection("swapi").doc(id).update({
                image: url,
              });
            });
        })
    );
  };

  const likeHandler = () => {
    db.collection("swapi")
      .where("user", "==", user?.displayName)
      .get()
      .then((snapshot) => {
        if (
          !snapshot.docs.map((doc) => doc.data().liked).includes(person?.name)
        ) {
          db.collection("swapi").add({
            user: user.displayName,
            liked: person?.name,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      });
  };

  return (
    !isLoading && (
      <>
        <StyledCard>
          {person && !suggestions && (
            <div>
              <div>
                {!uploadedImageURL && liked && (
                  <ChooseImage>
                    <label htmlFor="choose-img">choose photo</label>
                    <input id="choose-img" type="file" onChange={handleImage} />
                    {image && (
                      <button onClick={handleUpload}>upload</button>
                    )}{" "}
                  </ChooseImage>
                )}
                {/* <button onClick={handleUpload}>upload</button> */}
              </div>
              {uploadedImageURL && loggedIn && (
                <UploadedImage>
                  <img src={uploadedImageURL} alt="img" />
                </UploadedImage>
              )}
              <p>
                <span className="title">Name:</span>
                {person.name}
              </p>
              <p>
                <span className="title">Height: </span>
                {person.height}
              </p>
              <p>
                <span className="title">Mass: </span>
                {person.mass}
              </p>
              <p>
                <span className="title">Hair Color:</span> {person.hair_color}
              </p>
              <p>
                <span className="title">Skin Color: </span>
                {person.skin_color}
              </p>
              <p>
                <span className="title">Eye Color:</span> {person.eye_color}
              </p>
              <p>
                <span className="title">Birth Year:</span> {person.birth_year}
              </p>
              <p>
                <span className="title">Gender:</span> {person.gender}
              </p>
              <ul>
                <span className="title">Vehicles:</span>
                {vehicles.map((i) => (
                  <li key={uuid()}>
                    <span className="subtitle"> </span>
                    {i?.name} (<span className="subtitle">model:</span>
                    {i?.model})
                  </li>
                ))}
              </ul>
              <ul>
                <span className="title">Films:</span>
                {films.map((i) => (
                  <li key={uuid()}>{i}</li>
                ))}
              </ul>
              <p>
                <span className="title">Homewold: </span>
                {homeworld}
              </p>
            </div>
          )}
        </StyledCard>
        <StyledButtons>
          {loggedIn && !liked && <Button onClick={likeHandler}>like</Button>}
          <Button onClick={handleClear}>close</Button>
        </StyledButtons>
      </>
    )
  );
};

const StyledCard = styled.div`
  margin: 3% auto 0 auto;
  padding: 0.8rem;
  max-width: 25rem;
  width: auto;
  background-color: #2b2b2b;
  line-height: 1.5rem;
  border-radius: 1rem;
  text-align: left;

  .title {
    color: #635c5c;
    text-transform: uppercase;
  }

  .subtitle {
  }
`;
const StyledButtons = styled.div`
  display: flex;
  max-width: 25rem;
  margin: auto;
  margin: 3% auto 0 auto;
  justify-content: space-evenly;
`;

const Button = styled.div`
  cursor: pointer;
  padding: 1rem;
  border: 5px solid gray;
  &:hover {
    color: red;
  }
`;

const ChooseImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0.1rem;
  flex-direction: column;
  color: #6262d8;
  width: 13rem;
  padding: 1rem 0;
  min-height: 1rem;
  margin: 0 auto;
  text-align: center;

  label {
    cursor: pointer;
  }
  input {
    visibility: hidden;
  }

  button {
    padding: 0.3rem;
    width: 50%;
  }
`;

const UploadedImage = styled.div`
  border-radius: 1rem;
  max-height: 15rem;
  margin-bottom: 0.8rem;

  overflow: hidden;
  img {
    width: 100%;
  }
`;

export default PersonCard;
