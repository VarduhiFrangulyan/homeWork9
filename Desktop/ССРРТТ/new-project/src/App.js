import "./App.css";
import { useState, useEffect } from "react";
import Fun from "./FilmFunctionComponent";
import SearchBookComponent from "./SearchBookFunctionComponent";

function App() {
  
  useEffect(() => {
    fetch("https://ghibliapi.herokuapp.com/films")
      .then((req) => {
        const reqStatus = req.status;
        if (reqStatus > 199 && reqStatus < 400) return req.json();
      })
      .then((res) => {
        if (res) {
          const filmsInfo = res.map((filmInfoObj) => {
            return {
              title: filmInfoObj.title,
              releaseDate: filmInfoObj["release_date"],
              director: filmInfoObj.director,
              description: filmInfoObj.description,
            };
          });
          return filmsInfo;
        }
      })
      .catch((err) => err);
  }, []);
  return (
    <>
      <Fun />
      <SearchBookComponent />
    </>
  );
}
export default App;
