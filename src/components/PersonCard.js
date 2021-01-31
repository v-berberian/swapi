import React, { useState, useEffect } from "react";
import uuid from "react-uuid";

import axios from "axios";

const PersonCard = ({ person, suggestions }) => {
  const [homeworld, setHomeworld] = useState("");
  const [films, setFilms] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        ]).then((result) => setIsLoading(false));
      };
      handleAllRequests();
    }

    // const fetchHomeworld = () => {
    //   axios
    //     .get(person.homeworld)
    //     .then((planet) => {
    //       return setHomeworld(planet.data.name);
    //     })
    //     .catch((error) => console.log(error));
    // };

    // const fetchVehicles = () => {
    //   Promise.all(
    //     person.vehicles.map((vehicle) => {
    //       return axios.get(vehicle).then((resp) => {
    //         return { name: resp.data.name, model: resp.data.model };
    //       });
    //     })
    //   ).then((resp) => {
    //     setVehicles(resp);
    //   });
    // };

    // const fetchFilms = () => {
    //   Promise.all(
    //     person.films.map((film) => {
    //       return axios.get(film).then((e) => {
    //         return e.data.title;
    //       });
    //     })
    //   ).then((resp) => setFilms(resp));
    // };

    // if (person) {
    //   fetchHomeworld();
    //   fetchVehicles();
    //   fetchFilms();
    // }
  }, [person]);

  return (
    !isLoading && (
      <div>
        {person && !suggestions && (
          <div>
            <p>Name:{person.name}</p>
            <p>Height: {person.height}</p>
            <p>Mass: {person.mass}</p>
            <p>Hair Color: {person.hair_color}</p>
            <p>Skin Color: {person.skin_color}</p>
            <p>Eye Color: {person.eye_color}</p>
            <p>Birth Year: {person.birth_year}</p>
            <p>Gender: {person.gender}</p>
            <ul>
              Vehicles:
              {vehicles.map((i) => (
                <li key={uuid()}>
                  Name: {i.name} (model:{i.model})
                </li>
              ))}
            </ul>
            <ul>
              Films:
              {films.map((i) => (
                <li key={uuid()}>{i}</li>
              ))}
            </ul>
            <p>Homewold: {homeworld}</p>
          </div>
        )}
      </div>
    )
  );
};

export default PersonCard;
