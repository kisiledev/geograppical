import React, {useState} from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
  } from 'react-simple-maps';
import { Link } from 'react-router-dom';
  import data from '../Data/world-50m.json';
  import ReactTooltip from 'react-tooltip';
  import { faPlus, faMinus, faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breakpoint, { BreakpointProvider } from 'react-socks';

const Find = (props) => {
    const [center, setCenter] = useState([0, 20])
    const [zoom, setZoom] = useState(1)
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [guesses, setGuesses] = useState([])
    const [correct, setCorrect] = useState([])
    const [incorrect, setIncorrect] = useState([])
    const [currentCountry, setCurrentCountry] = useState({});
    const [currentCountryId, setCurrentId] = useState(null);
    const [ran, setRan] = useState(null);

    const handleZoomIn = (zoom) => {
    setZoom(zoom * 2)
    }
    const handleZoomOut = (zoom) => {
    setZoom(zoom/2)
    }
    const handleText = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '');
    }
    const handleClick = (e) => {
    // access to e.target here
    console.log(handleText(e.properties.NAME_LONG));
    console.log(e.properties)
    console.log(currentCountry);
    handleText(e.properties.NAME_LONG) === currentCountry.name && console.log(true);
    }
    const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
    }
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min)) + min;
    }
    const getRandomCountry = () => {
        const int = getRandomInt(0, props.worldData.length);
        setCurrentId(int)
        let country = props.worldData[int];
        return country;
    }
    const randomExcluded = (min, max, excluded) => {
        let n = Math.floor(Math.random() * (max-min) + min);
        if (n >= excluded) n++;
        return n;
    }

    const getAnswers = (country) => {
        let logicQuestions = [...questions]
        let question = {};
        question['country'] = country;
        question['correct'] = null;
        let answers = [];
        console.log(country.name);
        console.log(country)
        country && answers.push({
            name: country.name.split(';')[0],
            id: 0,
            correct: 2
        });
        for (let x = 0; x < 3; x++) {
            let ran = randomExcluded(0, props.worldData.length -1, currentCountryId);
            setRan(ran)
            let newName;
            if(props.worldData[ran].name || ran < 0){
                newName = props.worldData[ran].name.split(';')[0]
            } else {
                ran = randomExcluded(0, props.worldData.length-1, currentCountryId);
                newName = props.worldData[ran].name.split(';')[0]
            }
            let capital = {
                name: newName,
                id: x + 1, 
                correct: 2}
            answers.push(capital);
            shuffle(answers);
            setAnswers({answers: answers})
        }
        question['answers'] = answers;
        
        logicQuestions.push(question);
        setQuestions({logicQuestions});
    }
    const takeTurn = () => {
            !props.isStarted && props.startGame();
            let country = getRandomCountry();
            setGuesses(guesses => guesses + 1);
            setCurrentCountry({name: 'Khari'})
            console.log(setCurrentCountry)
            setCurrentCountry(country);
            console.log(country);
            console.log(currentCountry);
            getAnswers(country);
            console.log(questions.length)
            if(questions && questions.length > 10){
                alert("Congrats! You've reached the end of the game. You answered " + props.correct + " questions correctly and " + props.incorrect + " incorrectly.\n Thanks for playing");
                setQuestions([]);
                setAnswers([]);
                setGuesses(null);
                props.endGame();
            }
    }
    const checkAnswer = (answer) => {
        //if answer is correct answer (all correct answers have ID of 0)
        let correct, incorrect;
        let checkQuestions = questions;
        let question = checkQuestions.find(question => question.country === currentCountry);
        let checkGuesses = guesses;
        if(answer.id === 0){
            //give score of 2
            props.updateScore(3-guesses);
            //set answer style
            answer['correct'] = 0;
            //initialize correct counter for game
            console.log(question);
            if(guesses === 1){
                question['correct'] = true;
            }
            checkGuesses = null;
            setTimeout(() => takeTurn(), 300);   
        } else {
            answer['correct'] = 1;
            console.log(question);
            question['correct'] = false;
            checkGuesses ++
        }
        setCorrect(correct);
        setIncorrect(incorrect);
        setGuesses(checkGuesses);
        props.handlePoints(questions);
    }
  let directions = 
    <div className="directions">
        <h5>Directions</h5>
        <p>A statement will be shown with four choices. Select the correct answer for the maximum number of points. Incorrect answers will receive less points and make two incorrect choices will yield no points. Select all incorrect answers and you will LOSE a point. Good luck!</p>
        <button className="btn btn-lg btn-success" onClick={() => takeTurn()}>Start Game</button>
    </div>;
        return(
            <BreakpointProvider>
            <div className="card mr-3 mb-3">
            {!props.isStarted && directions}
              <Breakpoint small up>
              <div className="d-flex justify-content-between">
              <div className="btn-group d-inline">
                <button className="btn btn-info" onClick={() => handleZoomOut(zoom) }><FontAwesomeIcon icon={faMinus}/></button>
                <button className="btn btn-info" onClick={() => handleZoomIn(zoom) }><FontAwesomeIcon icon={faPlus}/></button>
              </div>
              <button 
                className="btn btn-info" 
                onClick={() => props.changeMapView() }
              >
                <FontAwesomeIcon icon={faGlobeAfrica}/>{ (props.mapVisible === "Show") ? "Hide" : "Show"} Map
              </button>

              </div>
              </Breakpoint>
            <hr />
            {currentCountry && <div>Find {currentCountry.name}</div>}
            {currentCountry.NAME_LONG && <div>{currentCountry.NAME_LONG}</div>}
            {props.mapVisible === "Show" ?
            <ComposableMap 
              projection="robinson"
              width={980}
              height={551}
              style={{
                width: "100%",
                height: "auto",
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
                  />
                )
                }
              </ Geographies>
              </ZoomableGroup>
            </ComposableMap>
            : null }
            <ReactTooltip place="top" type="dark" effect="float" />
            </div>
            </BreakpointProvider>
        )
      }

    export default Find;