import React, { useState, useEffect } from 'react';
import Highlight from './Highlight';
import { Link } from 'react-router-dom';
import Find from './Find';
import Scoreboard from './Scoreboard';
import Choice from './Choice';
import Checkbox from './Elements/Checkbox'
import Radio from './Elements/Radio';
import {Modal, Button} from 'react-bootstrap'
import { db } from './Firebase/firebase'
import { firestore } from 'firebase';
import * as ROUTES from '../Constants/Routes'
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Game = props => {
    const [loadingState, setLoadingState] = useState(false)
    const [questionsRemaining, setQuestionsRemaining] = useState(null)
    const [questions, setQuestions] = useState(null)
    const [questionsSet, setQuestionsSet] = useState(null)
    const [score, setScore] = useState(0)
    const [correct, setCorrect] = useState(0)
    const [incorrect, setIncorrect] = useState(0)
    const [gameMode, setGameMode] = useState(null)
    const [isStarted, setIsStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [scoreChecked, setScoreChecked] = useState(true)
    const [timeChecked, setTimeChecked] = useState(true)
    const [time, setTime] = useState({
        currentCount: 60,
        isRunning: false,
        timeMode: 'cd',
        clock: 0,
        elapsed: ''
    })
    const [show, setShow] = useState(false)
    const [saved, setSaved] = useState(false)
    const [intId, setIntId] = useState(null)
    const [gameId, setGameId] = useState(null)

    useEffect(() => {
        let intervalId;
        if(isStarted && time && time.isRunning && time.timeMode){
            intervalId = setInterval(() => timer(), 1000);
            setIntId(intervalId)
        } 
        return () => {
            clearInterval(intervalId)
        };
    }, [isStarted, time.currentCount])
    
    const handleClose = () => {
        setShow(false)
        endGame();
    }
    const handleOpen = () => {
        console.log('opening')
        if(questions > 10){
            this.handlePointsQuestions(questions);
        }
        setShow(true)
    }
    const timer = () => {
        console.log('starting timer')
        console.log(time)
        console.log(time.currentCount)
        if(time.timeMode === "cd"){
            setTime(({
                ...time,
                currentCount: time.currentCount - 1,
                isRunning: true,
                timeMode: 'cd'
            }))
        } else {
            console.log(time.clock)
            setTime(({
                ...time,
                clock: time.clock + 1,
                isRunning: true,
                timeMode: 'et',
                elapsed: ''
            }))
        //clear interval
        if (time.currentCount === 0 || !time.isRunning) {
          handleOpen()
          clearInterval(intId);
          console.log('timer stopped')
          setTime(({...time, isRunning: false}))
        }
      }
    }
    
    const startTimer = () => {
        let intervalId = setInterval(() => timer(), 1000);
        console.log('starting time')
        setTime(({
            ...time, 
            isRunning: true
        }))
        setIntId(intervalId) 
        
      }
    const stopTimer = () => {
        setTime(({
          ...time,
            isRunning: false,
            currentCount: time.currentCount
          }))
        clearInterval(intId)
      }

    const resetTimer = () => {
        console.log(intId)
        clearInterval(intId);
        setTime({
            isRunning: false,
            currentCount: 60,
            timeMode: 'cd',
            clock: 0,
            elapsed: ''
        })
        setIsStarted(false)
    }
      
    
       
    //   Increment the timer
      const update = () => {
        let updateClock = time.clock;
        updateClock += calculateOffset();
        let elapsed = this.SecondsTohhmmss(updateClock / 1000);
        setTime(time => ({
            ...time,
            clock: updateClock,
            elapsed: elapsed
        }))
      }
    
      // Calculate the offset time
      const calculateOffset = () => {
        let now = Date.now();
        let offset = now - this.offset;
        this.offset = now; 
        return offset;
      }
    

    const startGame = () => {
        time && startTimer();
        setIsStarted(true)
    }
    const endGame = () => {
        setIsStarted(false)
        setGameOver(true)
        setQuestionsRemaining(null)
        setQuestions(null)
        setScore(0)
        setCorrect(0)
        setIncorrect(0)
        clearInterval(intId)
        resetTimer();
    }
    const handlePointsQuestions = (q) => {

        let correctCount = q.filter(question => question.correct === true);
        let incorrectCount = q.filter(question => question.correct === false);
        let c = correctCount.length;
        let i = incorrectCount.length;
        setCorrect(c)
        setIncorrect(i)
        setQuestionsSet(q)
        setQuestions(q.length)
    }
    const updateScore = (int) => {
        setScore(score + int)
    }
    
    const titleCase = (oldString) => {
        return oldString.replace(/([a-z])([A-Z])/g, function (allMatches, firstMatch, secondMatch) {
                return firstMatch + " " + secondMatch;
            })
            .toLowerCase()
            .replace(/([ -_]|^)(.)/g, function (allMatches, firstMatch, secondMatch) {
                return (firstMatch ? " " : "") + secondMatch.toUpperCase();
            })
    }
    const resetMode = () => {
        resetTimer();  
        setQuestionsRemaining(null);
        setQuestions(null)
        setScore(0)
        setCorrect(0)
        setIncorrect(0)
        setGameMode(null)
        setIsStarted(false)
        setScoreChecked(true)
        setTimeChecked(true)
        setTime({
            currentCount: 60,
            isRunning: false,
            timeMode: 'cd',
            clock: 0,
            elapsed: ''
        })
        clearInterval(intId);
    }
    const timeMode = (e) => {
        e.persist();
        time && setTime(time => ({...time, timeMode: e.target.value}))
    }
    const handleTimeCheck = (e) => {
        if(time === null) {
            let newTime = {
                currentCount: 60,
                isRunning: false,
                timeMode: 'cd',
                clock: 0,
                elapsed: ''
            }
            setTime(newTime)
        } else {
            let newTime = null;
            setTime(newTime)
        }
        setTimeChecked(e.target.checked)
    }
    const handleScoreCheck = (e) => {
        if(score === null) {
            setScore(0)
            setCorrect(0)
            setIncorrect(0)
        } else {
            setScore(null)
        }
        setScoreChecked(e.target.checked)
    }
    const saveScore = () => {
        if(!props.user){
            let modal = {
              title: 'Not Logged In',
              body: 'You need to sign in to favorite countries',
              primaryButton: 
              <Button variant="primary" onClick={props.login}>
              Sign In/ Sign Up
              </Button>
            }
            props.setModal(modal)
            props.handleOpen();
        } else {
            setLoadingState(true)
            if(time && score){
                db.collection('users').doc(props.user.uid).collection('scores').add({
                    userId: props.user.uid && props.user.uid,
                    gameMode: gameMode,
                    dateCreated: firestore.Timestamp.fromDate(new Date()),
                    score: score,
                    correct: correct,
                    incorrect: incorrect,
                    time: 60 - time.currentCount,
                    questions: questionsSet 
                }).then((data) => {
                    console.log('Data written successfully', data, data.id)
                    setSaved(true)
                    setLoadingState(false)
                    setGameId(data.id)
                })
                .catch( error => console.error(error))
            } else if(time && !score){
                db.collection('users').doc(props.user.uid).collection('scores').add({
                    userId: props.user.uid && props.user.uid,
                    gameMode: gameMode,
                    dateCreated: firestore.Timestamp.fromDate(new Date()),
                    correct: correct,
                    incorrect: incorrect,
                    time: 60 - time.currentCount,
                    questions: questionsSet 
                }).then((data) => {
                    console.log('Data written successfully', data, data.id)
                    setSaved(true)
                    setLoadingState(false)
                    setGameId(data.id)
                })
                .catch( error => console.error(error))
            } else {
                db.collection('users').doc(props.user.uid).collection('scores').add({
                    userId: props.user.uid && props.user.uid,
                    gameMode: gameMode,
                    dateCreated: firestore.Timestamp.fromDate(new Date()),
                    correct: correct,
                    incorrect: incorrect,
                    questions: questionsSet 
                }).then((data) => {
                    console.log('Data written successfully', data, data.id)
                    setSaved(true)
                    setLoadingState(false)
                    setGameId(data.id)
                })
                .catch( error => console.error(error))
            }
        }
    }

    let back = !props.isStarted && <button className="btn btn-info mb-3" onClick={() => resetMode()}>Go Back</button>
    let returnGameMode;
    if(gameMode==="choice"){
        returnGameMode = 
        <div>
        {back}
        <Choice 
            isStarted={isStarted}
            gameOver = {gameOver}
            correct = {correct}
            incorrect = {incorrect}
            flagCodes = {props.flagCodes}
            data = {props.data}
            getCountryInfo = {props.getCountryInfo}
            startGame = {startGame}
            stopTimer = {stopTimer}
            endGame = {endGame}
            updateScore = {updateScore}
            handlePoints = {handlePointsQuestions}
            handleOpen = {handleOpen}
            saved={saved}/>
        
        </div>
    } else if (gameMode==="find"){
        returnGameMode = 
        <div>
            {back}
            <Find
                simplifyString={props.simplifyString}
                isStarted={isStarted}
                gameOver = {gameOver}
                correct = {correct}
                incorrect = {incorrect}
                mapVisible = {props.mapVisible}
                mapView={props.mapView} 
                worldData = {props.data}
                countries = {props.countries}
                changeView = {props.changeView}
                getCountryInfo = {props.getCountryInfo}
                hoverOnRegion = {props.hoverOnRegion}
                hoverOffRegion = {props.hoverOffRegion}
                startGame = {startGame}
                endGame = {endGame}
                updateScore = {updateScore}
                handlePoints = {handlePointsQuestions}
                handleOpen = {handleOpen}
                saved={saved}/>
        </div>
    } else if (gameMode==="highlight"){
        returnGameMode = <div>
            {back}
            <Highlight
                simplifyString={props.simplifyString}
                isStarted={isStarted}
                gameOver = {gameOver}
                correct = {correct}
                incorrect = {incorrect}
                mapVisible = {props.mapVisible}
                mapView={props.mapView} 
                worldData = {props.data}
                countries = {props.countries}
                changeView = {props.changeView}
                getCountryInfo = {props.getCountryInfo}
                hoverOnRegion = {props.hoverOnRegion}
                hoverOffRegion = {props.hoverOffRegion}
                startGame = {startGame}
                endGame = {endGame}
                updateScore = {updateScore}
                handlePoints = {handlePointsQuestions}
                handleOpen = {handleOpen}
                saved={saved}/>
        </div>
    } else {
        returnGameMode = <div></div>
    }
    let timeButtons = time && 
        <div className="col-12 d-flex justify-content-center flex-wrap">
            <label>
            <Radio 
                value="et"
                checked={time.timeMode === "et"}
                onChange={(e) => timeMode(e)}
            />
            <span style={{ marginLeft: 8, marginRight: 8 }}>Elapsed Time</span>
            </label>
            <label>
            <Radio 
                value="cd"
                checked={time.timeMode === "cd"}
                onChange={(e) => timeMode(e)}
            />
            <span style={{ marginLeft: 8, marginRight: 8 }}>Countdown</span>
            </label>
        </div>

    let ModalText = "Congrats! You've reached the end of the game. You answered " + correct + " questions correctly and " + incorrect + " incorrectly.\n Thanks for playing";
    let timeExpired = "Sorry, time expired! Try again"
    let ModalBody = time && time.currentCount <= 0 ? timeExpired : ModalText;
    return(
    <>
    {/* <button onClick={}>Save Score</button> */}
    <Modal show={show} onExit = {() => setGameOver(true)} onHide={() => handleClose()}>
        <Modal.Header closeButton>
        <Modal.Title>Game Over</Modal.Title>
        </Modal.Header>
        <Modal.Body>{ModalBody}</Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
            Close
        </Button>
        {saved ? 
            <Button variant="success">
                <Link to={ROUTES.ACCOUNT}>{loadingState ? <FontAwesomeIcon icon={faSpinner} spin size="3x"/> : "View Score"}</Link>
            </Button> 
        :
            <Button variant="primary" onClick={() => saveScore()}>
                Save Score
            </Button>
        }
        </Modal.Footer>
    </Modal>
    <Scoreboard 
        score={score}
        time={time}
        startTimer={startTimer}
        stopTimer={stopTimer}
        timer={timer}
        correct={correct}
        incorrect={incorrect}
        questions={questions}
        questionsRemaining={questionsRemaining}/> 
    <div className="card mt-5 col-md-8 mx-auto">
        <h3 className="text-center">{gameMode ? ("Game Mode: " + titleCase(gameMode)) : "Choose a Game Mode"}</h3>
        {!gameMode && <div>
            <div className="row">
                <div className="col-md-12 mx-auto">
                    <ul className="px-0 text-center">
                        <li className="choice list-group-item text-dark btn-info" onClick={() => setGameMode('choice')}>Questions</li>
                        <li className="choice list-group-item text-dark btn-info" onClick={() => setGameMode('find')}>Find Country on Map</li>
                        <li className="choice list-group-item text-dark btn-info" onClick={() => setGameMode('highlight')}>Select Highlighted Country</li>
                    </ul>
                </div>
            </div>
        </div>}
        <div className="text-center col-md-8 col-lg-12 px-0 mx-auto">{returnGameMode}</div>
        {!isStarted && <div className="col-12 d-flex justify-content-center flex-wrap">
            <label>
                <Checkbox
                    checked={timeChecked}
                    onChange={(e) => handleTimeCheck(e)}
                />
                <span style={{ marginLeft: 8, marginRight: 8 }}>Keep Time</span>
            </label>
            <label>
                <Checkbox
                    checked={scoreChecked}
                    onChange={(e) => handleScoreCheck(e)}
                />
                <span style={{ marginLeft: 8 }}>Keep Score</span>
            </label>
            {time && timeButtons}
        </div>}
    </div>
    </>
    )
}

export default Game;