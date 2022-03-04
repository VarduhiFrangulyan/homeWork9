import './App.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import getId from './getIdFun.js';

function App() {
  const [stateSearchInput, setStateSearchInput] = useState({
    isCallSubmitBooks : false,
    divSearch : {
      classDiv : "search-div",
      id : "searchDiv",
    },
    inputSearc : {
      typeInput : "search",
      name : "search",
      id : "searchBook",
      classInput : "search-book",
    },
    submitInput : {
      typeSubmit : "submit",
      name : "search-submit",
      id : "serchButtonSubmitBook",
      classSubmit : "search-book-submit",
    },
    searchresponeInfo : {
      searchBookResponse : false,
    }
  })
  const endpointFromInputValue = (inputValue = "") => {
    console.log(1);
    if(typeof inputValue == "string") return (inputValue.replace(/ {1,}/g, '+'));
    return false;  
  };
  const creatUrlFromInputValues = (startUrl = "", inputValue = "", endpointFromInputValue = () => false) => {
    console.log(2);
    const endUrl = endpointFromInputValue(inputValue);
    if((typeof startUrl == "string") && (typeof inputValue == "string") && endUrl) {
      return (`${startUrl}?q=${endUrl}`);
    }
    return false;
  };
  const urlFromInputValue = (eventTargetValue = "", creatUrlFromInputValues = () => false, endpointFromInputValue = () => false) => {
    console.log(3);
    if(!stateSearchInput.isCallSubmitBooks) {
      console.log(4);
      stateSearchInput.isCallSubmitBooks = true;
      if (stateSearchInput.isCallSubmitBooks) {
        const searchValue = creatUrlFromInputValues("https://openlibrary.org/search.json",eventTargetValue, endpointFromInputValue);
        console.log(searchValue);
        fetch(`${searchValue}`).then((req) => {
          const reqStatus = req.status;
        // console.log("req   ", req);
          if((reqStatus > 199) && (reqStatus < 400)) return req.json();
      }).then((res) => {
          console.log("res   ", res);
          const booksInfoList = res.docs?.map((bookinfoObj) => {
            const bookInfo = {
              'title' : bookinfoObj.title ,
              'author-name' : bookinfoObj['author_name'],
              'first_publish_year' : bookinfoObj['first_publish_year'],
              'subject': bookinfoObj.subject?.slice(0,5),
            }
            return bookInfo;
          });
          const booksObjInfo = {
            'numFound' : res.numFound, 
            'book-listInfo' : booksInfoList,
          };
        // console.log("bookInfoObj is   ", booksObjInfo);
          return booksObjInfo;
        }).then((booksInfoObj) => {
        //console.log(stateSearchInput.searchresponeInfo.searchBookResponse)
          stateSearchInput.searchresponeInfo.searchBookResponse = booksInfoObj;
          setStateSearchInput({...stateSearchInput})
  
        }).catch((err) => err);
      }
    }
  }
  useEffect(() => {
    fetch("https://ghibliapi.herokuapp.com/films").then((req) => {
      const reqStatus = req.status;
      if((reqStatus > 199) && (reqStatus < 400)) return req.json();
    }).then((res) => {
      if(res) {
        const filmsInfo = res.map((filmInfoObj) => {
          return {
            title : filmInfoObj.title,
            releaseDate : filmInfoObj['release_date'],
            director : filmInfoObj.director,
            description : filmInfoObj.description,
          }
        });
        return filmsInfo;
      }
    }).catch((err) => err);
    console.log("useEfectikn em updayti")
  },[])
  return (
    <div className={stateSearchInput.divSearch.classDiv} id={stateSearchInput.divSearch.id}>
      <input type={stateSearchInput.inputSearc.typeInput} name={stateSearchInput.inputSearc.name} id={stateSearchInput.inputSearc.id} className={stateSearchInput.inputSearc.classInput} onBlur={(e) => {
         return (urlFromInputValue(e.target.value, creatUrlFromInputValues, endpointFromInputValue));
      }} />
      <button type={stateSearchInput.submitInput.typeSubmit} name={stateSearchInput.submitInput.name} id={stateSearchInput.submitInput.id} className={stateSearchInput.submitInput.classSubmit}>
        Search
      </button>
      <div id="responeSearchBooks">{stateSearchInput.searchresponeInfo.searchBookResponse['book-listInfo']?.map((bookInfo) => {
        return (
        <div className='book-info-div' key={getId()}>
          <div key={getId()}>Title /  {bookInfo.title}.</div>
          <div key={getId()}>author name /  {bookInfo['author-name']}.</div>
          <div key={getId()}>first publish year / {bookInfo['first_publish_year']}.</div>
          <div key={getId()}>subject / {bookInfo['subject']}.</div>
        </div>
        );
      })}</div>
    </div>
  );
}

export default App;
