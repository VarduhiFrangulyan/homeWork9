import { useReducer, useEffect } from "react";

function Fun() {
  const inicialState = {
    notOnclickFilmSubmit : true,
    requestFilm : false,
    responseFilm : {
      title : [false, false],
      description : [false, false],
      director : [false, false],
      producer : [false, false],
      "release_date" :[false, false],
    },
    errorFilm : false,
  }
  const reducer = (state, action) => {
    switch(action.status) {
      case "pending":
        return {
          ...state,
          notOnclickFilmSubmit : action.notOnclickFilmSubmit,
          requestFilm : action.requestFilm,
          errorFilm : action.errorFilm,
          responseFilm : action.responseFilm,
        };
      case "rejected":
        return {
          ...state,
          notOnclickFilmSubmit : action.notOnclickFilmSubmit,
          requestFilm : action.requestFilm,
          responseFilm : action.responseFilm,
          errorFilm : action.errorFilm.massege,
        };
        case "fullfiled":
          return {
            ...state,
            notOnclickFilmSubmit : action.notOnclickFilmSubmit,
            requestFilm : action.requestFilm,
            responseFilm : action.responseFilm,
            errorFilm: action.errorFilm,
          };
        default: 
          return state; 
    }
  }
  const [state, dispatch] = useReducer(reducer, inicialState);
  const onClickSubmitFunc = () => {
    if (state.notOnclickFilmSubmit) {
      state.notOnclickFilmSubmit = false;
    dispatch({
      status : "pending",
        requestFilm : "...loading",
        responseFilm : {
          title : [false, false],
          description : [false, false],
          director : [false, false],
          producer : [false, false],
          "release_date" : [false, false],
        },
        errorFilm : false,
    });
    fetch("https://ghibliapi.herokuapp.com/films/2baf70d1-42bb-4437-b551-e5fed5a87abe").then((req) => {
      if(req.ok === true) {
          return req.json();
      }
    }).then((res) => {
      if (res) {
        dispatch({
          status : "fullfiled",
          requestFilm : true,
          responseFilm : {
            title : ["title : ", res.title],
            description : ["description :", res.description],
            director : ["director :", res.director],
            producer : ["producer:", res.producer],
            "release_date" : ["release_date :", res["release_date"]],
          },
          errorFilm : false,
        });
        state.notOnclickFilmSubmit = true
        return res;
      }
    }).catch((err) => {
      dispatch({
        status : "rejected",
        requestFilm: false,
        responseFilm : {
          title : [false, false],
          description : [false, false],
          director : [false, false],
          producer : [false, false],
          "release_date" : [false, false],
        },
        errorFilm : err.message,
      });
    })
  }
  }
  return (
    <>
      <div className="film-info-container">
      <button className="film-search-submit" type="submit" onClick={() => onClickSubmitFunc()}>show info obout the film</button>
        <div>{ state.errorFilm }</div>
        <h1>{ state.requestFilm }</h1>
        <div className="film-info-row">
          <div>{ state.responseFilm.title[0] }</div>
          <div className="film-info-column2">{ state.responseFilm.title[1] }</div>
        </div>
        <div className="film-info-row">
          <div>{ state.responseFilm.description[0] }</div>
          <div className="film-info-column2">{ state.responseFilm.description[1] }</div>
        </div>
        <div className="film-info-row">
          <div>{ state.responseFilm.director[0] }</div>
          <div className="film-info-column2">{ state.responseFilm.director[1] }</div>
        </div>
        <div className="film-info-row">
          <div>{ state.responseFilm.producer[0]}</div>
          <div className="film-info-column2">{ state.responseFilm.producer[1]}</div>
        </div>
        <div className="film-info-row">
          <div>{ state.responseFilm["release_date"][0] }</div>
          <div className="film-info-column2">{ state.responseFilm["release_date"][1] }</div>
        </div>
      </div>
    </>
  )
}
export default Fun;  