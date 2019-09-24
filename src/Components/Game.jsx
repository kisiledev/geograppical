import React from 'react';
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


class Game extends React.Component {
    state = {
        questionsRemaining: null,
        questions: null,
        score: 0,
        correct: 0,
        incorrect: 0,
        gameMode: null,
        isStarted: false,
        scoreChecked: true,
        timeChecked: true,
        time: {
            currentCount: 60,
            isRunning: false,
            timeMode: 'cd',
            clock: 0,
            elapsed: ''
        },
        show: false,
        saved: false
    }; 
    
    handleClose = () => {
    this.setState({show: false})
    this.endGame();
    }
    handleOpen = () => {
        console.log('opening')
        if(this.state.questions > 10){
            this.handlePointsQuestions(this.state.questions);
        }
        this.setState({show: true})
    }
    timer = () => {
        console.log('starting timer')
        if(this.state.time.timeMode === "cd"){
            this.setState(prevState =>({
                time: {
                    currentCount: this.state.time.currentCount - 1,
                    isRunning: true,
                    timeMode: 'cd'
                }
            }));
        } else {
            console.log(this.state.time.clock)
            this.setState(prevState =>({
                time: {
                    clock: this.state.time.clock + 1,
                    isRunning: true,
                    timeMode: 'et',
                    elapsed: ''
                },
            }));
        }
        //clear interval
        if (this.state.time.currentCount === 0 || !this.state.time.isRunning) {
          this.handleOpen()
          clearInterval(this.intervalId);
          console.log('timer stopped')
          this.setState({time: { isRunning: false}})
        }
      }
    
    startTimer = () => {
        this.intervalId = setInterval(() => this.timer(), 1000);
        console.log('starting time')
        this.setState(prevState =>({time: {isRunning: true}, intervalId: this.intervalId, ...prevState}))
        
      }
    stopTimer = () => {
        this.setState({
          time: {
              isRunning: false,
              currentCount: this.state.time.currentCount
          }
        })
        clearInterval(this.intervalId)
      }

      resetTimer = () => {
          clearInterval(this.intervalId);
          this.setState({
              time: {
                isRunning: false,
                currentCount: 60,
                timeMode: 'cd',
                clock: 0,
                elapsed: ''
            }
          })
      }
    
    
      // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
      componentWillUnmount = () => {
        clearInterval(this.intervalId);
      }
      
    
       
      // Increment the timer
      update = () => {
        let clock = this.state.clock;
        clock += this.calculateOffset();
        this.setState({...this.state, time: {...this.state.time, clock: clock}})
        let elapsed = this.SecondsTohhmmss(clock / 1000);
        this.setState({...this.state, time: {...this.state.time, elapsed: elapsed}})
      }
    
      // Calculate the offset time
      calculateOffset = () => {
        let now = Date.now();
        let offset = now - this.offset;
        this.offset = now; 
        return offset;
      }
    

    startGame = () => {
        this.state.time && this.startTimer();
        this.setState({
            isStarted: true
        })
    }
    endGame = () => {
        
        this.setState({
            isStarted: false,
            questionsRemaining: null,
            questions: null,
            score: 0,
            correct: 0,
            incorrect: 0

        });
        clearInterval(this.intervalId)
        this.resetTimer();
    }
    handlePointsQuestions = (q) => {

        let correctCount = q.filter(question => question.correct === true);
        let incorrectCount = q.filter(question => question.correct === false);
        let c = correctCount.length;
        let i = incorrectCount.length;
        this.setState({
            correct: c, 
            incorrect: i,
            questionsSet: q,
            questions: q.length});
    }
    updateScore = (int) => {
        this.setState(prevState =>({score: prevState.score + int}))
    }
    
    titleCase = (oldString) => {
        return oldString.replace(/([a-z])([A-Z])/g, function (allMatches, firstMatch, secondMatch) {
                return firstMatch + " " + secondMatch;
            })
            .toLowerCase()
            .replace(/([ -_]|^)(.)/g, function (allMatches, firstMatch, secondMatch) {
                return (firstMatch ? " " : "") + secondMatch.toUpperCase();
            })
    }
    resetMode = () => {
        this.resetTimer();  
        this.setState({
            questionsRemaining: null,
            questions: null,
            score: 0,
            correct: 0,
            incorrect: 0,
            gameMode: null,
            isStarted: false,
            scoreChecked: true,
            timeChecked: true,
            time: {
                currentCount: 60,
                isRunning: false,
                timeMode: 'cd',
                clock: 0,
                elapsed: ''
            }
        })
        clearInterval(this.intervalId);
    }
    timeMode = (e) => {
        this.state.time && this.setState({...this.state, time: {...this.state.time, timeMode: e.target.value}})
    }
    handleTimeCheck = (e) => {
        if(this.state.time === null) {
            let time = {
                currentCount: 60,
                isRunning: false,
                timeMode: 'cd',
                clock: 0,
                elapsed: ''
            }
            this.setState({time})
        } else {
            let time = null;
            this.setState ({time})
        }
        this.setState({timeChecked: e.target.checked})
    }
    handleScoreCheck = (e) => {
        if(this.state.score === null) {
            this.setState({score: 0,
                correct: 0,
                incorrect: 0,})
        } else {
            this.setState ({score: null})
        }
        this.setState({scoreChecked: e.target.checked})
    }
    saveScore = () => {
        if(!this.props.user){
            let modal = {
              title: 'Not Logged In',
              body: 'You need to sign in to favorite countries',
              primaryButton: 
              <Button variant="primary" onClick={this.props.login}>
              Sign In/ Sign Up
              </Button>
            }
            this.props.setModal(modal)
            this.props.handleOpen();
        } else {
            this.setState({loading: true});
            if(this.state.time && this.state.score){
                db.collection('users').doc(this.props.user.uid).collection('scores').add({
                    userId: this.props.user.uid && this.props.user.uid,
                    gameMode: this.state.gameMode,
                    dateCreated: firestore.Timestamp.fromDate(new Date()),
                    score: this.state.score,
                    correct: this.state.correct,
                    incorrect: this.state.incorrect,
                    time: 60 - this.state.time.currentCount,
                    questions: this.state.questionsSet 
                }).then((data) => {
                    console.log('Data written successfully', data, data.id)
                    this.setState({saved: true, loading: false, gameId: data.id})
                })
                .catch( error => console.error(error))
            } else if(this.state.time && !this.state.score){
                db.collection('users').doc(this.props.user.uid).collection('scores').add({
                    userId: this.props.user.uid && this.props.user.uid,
                    gameMode: this.state.gameMode,
                    dateCreated: firestore.Timestamp.fromDate(new Date()),
                    correct: this.state.correct,
                    incorrect: this.state.incorrect,
                    time: 60 - this.state.time.currentCount,
                    questions: this.state.questionsSet 
                }).then((data) => {
                    console.log('Data written successfully', data, data.id)
                    this.setState({saved: true, loading: false, gameId: data.id})
                })
                .catch( error => console.error(error))
            } else {
                db.collection('users').doc(this.props.user.uid).collection('scores').add({
                    userId: this.props.user.uid && this.props.user.uid,
                    gameMode: this.state.gameMode,
                    dateCreated: firestore.Timestamp.fromDate(new Date()),
                    correct: this.state.correct,
                    incorrect: this.state.incorrect,
                    questions: this.state.questionsSet 
                }).then((data) => {
                    console.log('Data written successfully', data, data.id)
                    this.setState({saved: true, loading: false, gameId: data.id})
                })
                .catch( error => console.error(error))
            }
        }
    }

    render(){
        let back = !this.props.isStarted && <button className="btn btn-info mb-3" onClick={() => this.resetMode()}>Go Back</button>
        let gameMode;
        if(this.state.gameMode==="choice"){
            gameMode = 
            <div>
            {back}
            <Choice 
                isStarted={this.state.isStarted}
                correct = {this.state.correct}
                incorrect = {this.state.incorrect}
                flagCodes = {this.props.flagCodes}
                data = {this.props.data}
                getCountryInfo = {this.props.getCountryInfo}
                startGame = {this.startGame}
                stopTimer = {this.stopTimer}
                endGame = {this.endGame}
                updateScore = {this.updateScore}
                handlePoints = {this.handlePointsQuestions}
                handleOpen = {this.handleOpen}
                saved={this.state.saved}/>
            
            </div>
        } else if (this.state.gameMode==="find"){
            gameMode = 
            <div>
                {back}
                <Find
                    simplifyString={this.props.simplifyString}
                    isStarted={this.state.isStarted}
                    correct = {this.state.correct}
                    incorrect = {this.state.incorrect}
                    mapVisible = {this.props.mapVisible}
                    mapView={this.props.mapView} 
                    worldData = {this.props.data}
                    countries = {this.props.countries}
                    changeView = {this.props.changeView}
                    getCountryInfo = {this.props.getCountryInfo}
                    hoverOnRegion = {this.props.hoverOnRegion}
                    hoverOffRegion = {this.props.hoverOffRegion}
                    startGame = {this.startGame}
                    endGame = {this.endGame}
                    updateScore = {this.updateScore}
                    handlePoints = {this.handlePointsQuestions}
                    handleOpen = {this.handleOpen}
                    saved={this.state.saved}/>
            </div>
        } else if (this.state.gameMode==="highlight"){
            gameMode = <div>
                {back}
                <Highlight
                    simplifyString={this.props.simplifyString}
                    isStarted={this.state.isStarted}
                    correct = {this.state.correct}
                    incorrect = {this.state.incorrect}
                    mapVisible = {this.props.mapVisible}
                    mapView={this.props.mapView} 
                    worldData = {this.props.data}
                    countries = {this.props.countries}
                    changeView = {this.props.changeView}
                    getCountryInfo = {this.props.getCountryInfo}
                    hoverOnRegion = {this.props.hoverOnRegion}
                    hoverOffRegion = {this.props.hoverOffRegion}
                    startGame = {this.startGame}
                    endGame = {this.endGame}
                    updateScore = {this.updateScore}
                    handlePoints = {this.handlePointsQuestions}
                    handleOpen = {this.handleOpen}
                    saved={this.state.saved}/>
            </div>
        } else {
            gameMode = <div></div>
        }
        let timeButtons = this.state.time && 
            <>
                <label>
                <Radio 
                    value="et"
                    checked={this.state.time.timeMode === "et"}
                    onChange={(e) => this.timeMode(e)}
                />
                <span style={{ marginLeft: 8, marginRight: 8 }}>Elapsed Time {this.state.timeMode}</span>
                </label>
                <label>
                <Radio 
                    value="cd"
                    checked={this.state.time.timeMode === "cd"}
                    onChange={(e) => this.timeMode(e)}
                />
                <span style={{ marginLeft: 8, marginRight: 8 }}>Countdown</span>
                </label>
            </>

        let ModalText = "Congrats! You've reached the end of the game. You answered " + this.state.correct + " questions correctly and " + this.state.incorrect + " incorrectly.\n Thanks for playing";
        let timeExpired = "Sorry, time expired! Try again"
        let ModalBody = this.state.time && this.state.time.currentCount <= 0 ? timeExpired : ModalText;
        return(
        <>
        {/* <button onClick={}>Save Score</button> */}
        <Modal show={this.state.show} onHide={() => this.handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Game Over</Modal.Title>
            </Modal.Header>
            <Modal.Body>{ModalBody}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
                Close
            </Button>
            {this.state.saved ? 
                <Button variant="success">
                    <Link to={ROUTES.ACCOUNT}>{this.state.loading ? <FontAwesomeIcon icon={faSpinner} spin size="3x"/> : "View Score"}</Link>
                </Button> 
            :
                <Button variant="primary" onClick={() => this.saveScore()}>
                    Save Score
                </Button>
            }
            </Modal.Footer>
        </Modal>
        <Scoreboard 
            score={this.state.score}
            time={this.state.time}
            startTimer={this.startTimer}
            stopTimer={this.stopTimer}
            timer={this.timer}
            correct={this.state.correct}
            incorrect={this.state.incorrect}
            questions={this.state.questions}
            questionsRemaining={this.state.questionsRemaining}/> 
        <div className="card mt-5 col-md-8 mx-auto">
            <h3 className="text-center">{this.state.gameMode ? ("Game Mode: " + this.titleCase(this.state.gameMode)) : "Choose a Game Mode"}</h3>
            {!this.state.gameMode && <div>
                <div className="row">
                    <div className="col-md-12 mx-auto">
                        <ul className="px-0 text-center">
                            <li className="choice list-group-item text-dark btn-info" onClick={() => this.setState({gameMode: 'choice'})}>Questions</li>
                            <li className="choice list-group-item text-dark btn-info" onClick={() => this.setState({gameMode: 'find'})}>Find Country on Map</li>
                            <li className="choice list-group-item text-dark btn-info" onClick={() => this.setState({gameMode: 'highlight'})}>Select Highlighted Country</li>
                        </ul>
                    </div>
                </div>
            </div>}
            <div className="text-center col-md-8 col-lg-12 px-0 mx-auto">{gameMode}</div>
            {!this.state.isStarted && <div className="col-12 d-flex justify-content-center flex-wrap">
                <label>
                    <Checkbox
                        checked={this.state.timeChecked}
                        onChange={(e) => this.handleTimeCheck(e)}
                    />
                    <span style={{ marginLeft: 8, marginRight: 8 }}>Keep Time</span>
                </label>
                <label>
                    <Checkbox
                        checked={this.state.scoreChecked}
                        onChange={(e) => this.handleScoreCheck(e)}
                    />
                    <span style={{ marginLeft: 8 }}>Keep Score</span>
                </label>
                {this.state.time && timeButtons}
            </div>}
        </div>
        </>
        )
    }
}

export default Game;