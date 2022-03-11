import { useState, useEffect } from "react";
import getId from "./getIdFun.js";

function SearchBookComponent() {
    const [stateSearchInput, setStateSearchInput] = useState({
        notCallSubmitBooks: true,
        divSearch: {
          classDiv: "search-div",
          id: "searchDiv",
        },
        inputSearc: {
          typeInput: "search",
          name: "search",
          id: "searchBook",
          classInput: "search-book",
        },
        submitInput: {
          typeSubmit: "submit",
          name: "search-submit",
          id: "serchButtonSubmitBook",
          classSubmit: "search-book-submit",
        },
        searchresponeInfo: {
          searchBookRequest: false,
          searchBookResponse: false,
          searchBookError: false,
        },
      });
      const endpointFromInputValue = (inputValue = "") => {
        if (typeof inputValue === "string") {
          const endUrl = inputValue.replace(/ {1,}/g, "+");
          if (endUrl.length > 1) return endUrl;
        }
        return false;
      };
      const creatUrlFromInputValues = (
        startUrl = "",
        inputValue = "",
        endpointFromInputValue = () => false
      ) => {
        const endUrl = endpointFromInputValue(inputValue);
        if (
          typeof startUrl == "string" &&
          typeof inputValue == "string" &&
          endUrl
        ) {
          return `${startUrl}?q=${endUrl}`;
        }
        return false;
      };
      const urlFromInputValue = (
        eventTargetValue = "",
        creatUrlFromInputValues = () => false,
        endpointFromInputValue = () => false
      ) => {
        const searchValue = creatUrlFromInputValues(
          "https://openlibrary.org/search.json",
          eventTargetValue,
          endpointFromInputValue
        );
        if (stateSearchInput.notCallSubmitBooks && searchValue) {
          stateSearchInput.notCallSubmitBooks = false;
          stateSearchInput.searchresponeInfo.searchBookRequest = true;
          setStateSearchInput({ ...stateSearchInput });
          if (!stateSearchInput.notCallSubmitBooks) {
            fetch(`${searchValue}`)
              .then((req) => {
                const reqStatus = req.status;
                if (reqStatus > 199 && reqStatus < 400) return req.json();
              })
              .then((res) => {
                if (res.numFound < 1) {
                  stateSearchInput.searchresponeInfo.searchBookError = true;
                  stateSearchInput.searchresponeInfo.searchBookRequest = false;
                  stateSearchInput.notCallSubmitBooks = true;
                  setStateSearchInput({ ...stateSearchInput });
                  return;
                }
                const booksInfoList = res.docs?.map((bookinfoObj) => {
                  const bookInfo = {
                    title: bookinfoObj.title,
                    "author-name": bookinfoObj["author_name"],
                    first_publish_year: bookinfoObj["first_publish_year"],
                    subject: bookinfoObj.subject?.slice(0, 5),
                  };
                  return bookInfo;
                });
                const booksObjInfo = {
                  numFound: res.numFound,
                  "book-listInfo": booksInfoList,
                };
                stateSearchInput.searchresponeInfo.searchBookRequest = false;
                stateSearchInput.searchresponeInfo.searchBookResponse =
                  booksObjInfo;
                stateSearchInput.notCallSubmitBooks = true;
                setStateSearchInput({ ...stateSearchInput });
                return booksObjInfo;
              })
              .catch((err) => err);
          }
        }
      };
      return (
        <div
          className={stateSearchInput.divSearch.classDiv}
          id={stateSearchInput.divSearch.id}
        >
          <input
            type={stateSearchInput.inputSearc.typeInput}
            name={stateSearchInput.inputSearc.name}
            id={stateSearchInput.inputSearc.id}
            className={stateSearchInput.inputSearc.classInput}
            onBlur={(e) => {
              if (
                e.relatedTarget?.type === "submit" &&
                stateSearchInput.notCallSubmitBooks
              )
                return urlFromInputValue(
                  e.target.value,
                  creatUrlFromInputValues,
                  endpointFromInputValue
                );
              return false;
            }}
            onKeyUp={(e) => {
              if (e.code === "Enter" && stateSearchInput.notCallSubmitBooks) {
                return urlFromInputValue(
                  e.target.value,
                  creatUrlFromInputValues,
                  endpointFromInputValue
                );
              }
              return false;
            }}
          />
          <button
            type={stateSearchInput.submitInput.typeSubmit}
            name={stateSearchInput.submitInput.name}
            id={stateSearchInput.submitInput.id}
            className={stateSearchInput.submitInput.classSubmit}
          >
            Search
          </button>
          <div id="responeSearchBooks">
            {(stateSearchInput.searchresponeInfo.searchBookRequest && (
              <h2>...loading</h2>
            )) ||
              (stateSearchInput.searchresponeInfo.searchBookResponse && [
                <h2 className="book-info-pozition" key={getId()}>
                  found /
                  {
                    stateSearchInput.searchresponeInfo.searchBookResponse[
                      "numFound"
                    ]
                  }
                </h2>,
                stateSearchInput.searchresponeInfo.searchBookResponse[
                  "book-listInfo"
                ]?.map((bookInfo) => {
                  return (
                    <div className="book-info-pozition" key={getId()}>
                      <div key={getId()}>{"Title / " && bookInfo.title}</div>
                      <div key={getId()}>
                        {"author name / " && bookInfo["author-name"]}
                      </div>
                      <div key={getId()}>
                        {"first publish year / " &&
                          bookInfo["first_publish_year"]
                        }
                      </div>
                      <div key={getId()}>
                        {"subject / " && bookInfo["subject"]}
                      </div>
                    </div>
                  );
                }),
              ]) ||
              (stateSearchInput.searchresponeInfo.searchBookError && (
                <h2>Not found</h2>
              ))}
          </div>
        </div>
      );
}
export default SearchBookComponent;
