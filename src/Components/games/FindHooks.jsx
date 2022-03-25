/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import { faPlus, faMinus, faGlobeAfrica } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import data from '../../data/world-50m.json';

const Find = (props) => {
  const [center, setCenter] = useState([0, 20]);
  const [zoom, setZoom] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
  const [currentCountry, setCurrentCountry] = useState({});
  const [currentCountryId, setCurrentCountryId] = useState(null);
  const [ran, setRan] = useState(null);

  const {
    handlePoints,
    handleOpen,
    saved,
    gameOver,
    worldData,
    isStarted,
    startGame,
    updateScore,
  } = props;

  const handleZoomIn = (z) => {
    setZoom(z * 2);
  };
  const handleZoomOut = (z) => {
    setZoom(z / 2);
  };
  const handleText = (str) => {
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/ig, '');
  };
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i - 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const getRandomInt = (min, max) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
  };
  const getRandomCountry = () => {
    const int = getRandomInt(0, data.length);
    setCurrentCountryId(int);
    const country = data[int];
    return country;
  };
  const randomExcluded = (min, max, excluded) => {
    let n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) {
      n += 1;
    }
    return n;
  };

  const getAnswers = (country) => {
    const logicQuestions = [...questions];
    const question = {};
    question.country = country;
    question.correct = null;
    const answers = [];
    console.log(country.name);
    console.log(country);
    if (country) {
      answers.push({
        name: country.name.split(';')[0],
        id: 0,
        correct: 2,
      });
    }
    for (let x = 0; x < 3; x += 1) {
      let rand = randomExcluded(0, worldData.length - 1, currentCountryId);
      setRan(rand);
      let newName;
      if (worldData[rand].name || rand < 0) {
        [newName] = worldData[rand].name.split(';');
      } else {
        rand = randomExcluded(0, worldData.length - 1, currentCountryId);
        [newName] = worldData[rand].name.split(';');
      }
      const capital = {
        name: newName,
        id: x + 1,
        correct: 2,
};
      answers.push(capital);
      shuffle(answers);
      setAnswers(answers);
    }
    question.answers = answers;

    logicQuestions.push(question);
    setQuestions({ logicQuestions });
  };
  const takeTurn = () => {
          !isStarted && startGame();
          const country = getRandomCountry();
          setGuesses(guesses => guesses + 1);
          setCurrentCountry({ name: 'Khari' });
          console.log(setCurrentCountry);
          setCurrentCountry(country);
          console.log(country);
          console.log(currentCountry);
          getAnswers(country);
          console.log(questions.length);
          if(questions && questions.length > 10){
              alert("Congrats! You've reached the end of the game. You answered " + correct + ' questions correctly and ' + incorrect + ' incorrectly.\n Thanks for playing');
              setQuestions([]);
              setAnswers([]);
              setGuesses(null);
              endGame();
          }
  };
  const checkAnswer = (answer) => {
      //if answer is correct answer (all correct answers have ID of 0)
      let correct, incorrect;
      const checkQuestions = questions;
      const question = checkQuestions.find(question => question.country === currentCountry);
      let checkGuesses = guesses;
      if(answer.id === 0){
          //give score of 2
          updateScore(3 - guesses);
          //set answer style
          answer.correct = 0;
          //initialize correct counter for game
          console.log(question);
          if(guesses === 1){
              question.correct = true;
          }
          checkGuesses = null;
          setTimeout(() => takeTurn(), 300);
      } else {
          answer.correct = 1;
          console.log(question);
          question.correct = false;
          checkGuesses ++;
      }
      setCorrect(correct);
      setIncorrect(incorrect);
      setGuesses(checkGuesses);
      handlePoints(questions);
  };
  const directions =
  <div className="directions">
      <h5>Directions</h5>
      <p>A statement will be shown with four choices. Select the correct answer for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
      <button className="btn btn-lg btn-success" onClick={() => takeTurn()}>Start Game</button>
  </div>;
      return(
          <BreakpointProvider>
          <div className="card mr-3 mb-3">
          {!isStarted && directions}
            <Breakpoint small up>
            <div className="d-flex justify-content-between">
            <div className="btn-group d-inline">
              <button className="btn btn-info" onClick={() => handleZoomOut(zoom) }><FontAwesomeIcon icon={faMinus}/></button>
              <button className="btn btn-info" onClick={() => handleZoomIn(zoom) }><FontAwesomeIcon icon={faPlus}/></button>
            </div>
            <button
              className="btn btn-info"
              onClick={() => changeMapView() }
            >
              <FontAwesomeIcon icon={faGlobeAfrica}/>{ (mapVisible === 'Show') ? 'Hide' : 'Show'} Map
            </button>

            </div>
            </Breakpoint>
          <hr />
          {currentCountry && <div>Find {currentCountry.name}</div>}
          {currentCountry.NAME_LONG && <div>{currentCountry.NAME_LONG}</div>}
          {mapVisible === 'Show' ?
          <ComposableMap
            projection="robinson"
            width={980}
            height={551}
            style={{
              width: '100%',
              height: 'auto',
            }}
            >
            <ZoomableGroup center ={center} zoom={zoom}>
            <Geographies  geography={data}>
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                <Geography
                  data-longname={handleText(geography.properties.NAME_LONG)}
                  data-shortname={geography.properties.NAME}
                  onClick={((e) => setCurrentCountry(e.properties))}
                  key={i}
                  geography={geography}
                  projection={projection}
                  className="gameCountry"
                />,
              )
              }
            </ Geographies>
            </ZoomableGroup>
          </ComposableMap>
          : null }
          <ReactTooltip place="top" type="dark" effect="float" />
          </div>
          </BreakpointProvider>
      );
    };

export default Find;