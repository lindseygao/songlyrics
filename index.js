/**
 * Name: Lindsey Gao
 * Date: July 25th, 2020
 * Section: CSE 154 AE
 *
 * This index.js file uses the lyrics API from https://lyricsovh.docs.apiary.io/#
 * to fetch the lyrics to a given song title and artist name. It allows the index.html
 * page to respond to a user's given artist name and song title.
 */
"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * Listens for the user to click the submit button and then finds the lyrics
   * to a song given the user's input text
   */
  function init() {
    id("song-form").addEventListener("submit", function(event) {
      event.preventDefault();
      getLyrics();
    });
  }

  const BASE_URL = "https://api.lyrics.ovh/v1/"; // lyrics API

  /**
   * Fetches lyrics given a user's input into the form (song title and artist name)
   * from the lyrics API
   */
  function getLyrics() {
    let inputs = qsa("input");
    let artistName = inputs[0].value;
    let songTitle = inputs[1].value;
    let url = BASE_URL + artistName + "/" + songTitle;
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(displayLyrics)
      .catch(handleError);
  }

  /**
   * Processes the lyrics data fetched from the API and displays the lyrics to
   * the user
   * @param {JSON} lyricsData - the lyrics to the song from the searched song
   */
  function displayLyrics(lyricsData) {
    let section = gen("section");
    section.classList.add("result");
    qs("main").appendChild(section);
    let title = gen("h2");
    title.textContent = "lyrics:";
    section.appendChild(title);
    let lyricArray = lyricsData.lyrics.split("\n");
    for (let i = 0; i < lyricArray.length; i++) {
      let lyricText = gen("p");
      lyricText.textContent = lyricArray[i];
      section.appendChild(lyricText);
    }
    if (section.previousElementSibling.classList.contains("result")) {
      section.parentElement.replaceChild(section, section.previousElementSibling);
    }
    removeFormValues();
  }

  /**
   * Helper function that removes the user's inputed text from the form
   */
  function removeFormValues() {
    let formInputs = qsa("input");
    for (let i = 0; i < formInputs.length; i++) {
      formInputs[i].value = "";
    }
  }

  /**
   * Checks to make sure the response is ok
   * If the response is not ok, it throws an error. Otherwise it returns the
   * response
   * @param {Object} response - requested response data from API
   * @return {Object} returns the response data if it can be fetched from API
   */
  function checkStatus(response) {
    removeFormValues();
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

  /**
   * Displays the error message to the user when fetching fails
   * @param {Object} error - the error thrown when fetching fails.
   */
  function handleError(error) {
    let parent = qs("main");
    let message = gen("p");
    message.textContent = "Unexpected Problem: " + error;
    parent.appendChild(message);
  }

  /** ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();