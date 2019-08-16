import React from 'react';
import Highlight from './Highlight';
import Find from './Find';
import Scoreboard from './Scoreboard';
import Choice from './Choice';
import Checkbox from './Elements/Checkbox'
import Radio from './Elements/Radio';
import {Modal, Button} from 'react-bootstrap'
import { db } from './Firebase/firebase'
import { firestore } from 'firebase';

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
            clock: '0:00',
            elapsed: ''
        },
        show: false
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
        this.setState(prevState =>({
            time: {
                currentCount: this.state.time.currentCount - 1,
                isRunning: true
            }
        }));
        //clear interval
        if (this.state.time.currentCount === 0) {
          this.handleOpen()
          clearInterval(this.state.intervalId);
        }
      }
    
    startTimer = () => {
        this.intervalId = setInterval(this.timer.bind(this), 1000);
        this.setState(prevState =>({time: {isRunning: true}, intervalId: this.intervalId, ...prevState}))
        
      }
    stopTimer = () => {
        this.setState({
          time: {
              isRunning: false,
              currentCount: this.state.time.currentCount
          }
        })
        clearInterval(this.state.intervalId)
      }

      resetTimer = () => {
          this.setState({
              time: {
                  isRunning: false,
                  currentCount: 60
              }
          })
      }
    
      // decrement every second i.e 1000
      componentDidMount =() => {
          console.log(this.props.user)
      }
    //   componentDidUpdate = (prevProps, prevState) => {
    //       if(prevState.time !== this.state.time){
    //           this.resetTimer()
    //       }
    //   }
    
      // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
      componentWillUnmount = () => {
        clearInterval(this.state.intervalId);
      }
      
    
       SecondsToHHMMSS = (totalSeconds) => {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = totalSeconds - (hours * 3600) - (minutes * 60);
      
        // round seconds
        seconds = Math.round(seconds * 100) / 100
      
        let result = (hours < 10 ? "0" + hours : hours);
        result += ":" + (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
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
        clearInterval(this.state.intervalId)
        this.resetTimer();
    }
    handlePointsQuestions = (q) => {
        console.log(q)

        let correctCount = q.filter(question => question.correct === true);
        let incorrectCount = q.filter(question => question.correct === false);
        console.log(correctCount);
        console.log(incorrectCount);
        let c = correctCount.length;
        let i = incorrectCount.length;
        this.setState({
            correct: c, 
            incorrect: i,
            questionsSet: q,
            questions: q.length}, () => console.log(this.state.correct, this.state.incorrect));
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
    }
    timeMode = (e) => {
        console.log(e.target.value)
        console.log(e.target.checked)
        this.state.time && this.setState({...this.state, time: {...this.state.time, timeMode: e.target.value}})
    }
    handleTimeCheck = (e) => {
        console.log(this.state.time)
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
        console.log(e.target.checked)
    }
    handleScoreCheck = (e) => {
        console.log(this.state.score)
        if(this.state.score === null) {
            this.setState({score: 0,
                correct: 0,
                incorrect: 0,})
        } else {
            this.setState ({score: null})
        }
        this.setState({scoreChecked: e.target.checked})
        console.log(e.target.checked)
    }
    saveScore = () => {
        console.log(this.state)
        db.collection('users').doc(this.props.user.uid).collection('scores').add({
            userId: this.props.user.uid && this.props.user.uid,
            dateCreated: firestore.Timestamp.fromDate(new Date()),
            score: this.state.score,
            correct: this.state.correct,
            incorrect: this.state.incorrect,
            time: 60 - this.state.time.currentCount,
            questions: this.state.questionsSet  
        }).then(() => console.log('Data written successfully'))
        .catch( error => console.error(error))
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
                endGame = {this.endGame}
                updateScore = {this.updateScore}
                handlePoints = {this.handlePointsQuestions}
                handleOpen = {this.handleOpen}/>
            
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
                    handleOpen = {this.handleOpen}/>
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
                    handleOpen = {this.handleOpen}/>
            </div>
        } else {
            gameMode = <div></div>
        }
        let timeButtons = this.state.time && 
            <div>
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
            </div>

        let ModalText = "Congrats! You've reached the end of the game. You answered " + this.state.correct + " questions correctly and " + this.state.incorrect + " incorrectly.\n Thanks for playing";
        let timeExpired = "Sorry, time expired! Try again"
        return(
        <>
        {/* <button onClick={}>Save Score</button> */}
        <Modal show={this.state.show} onHide={() => this.handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Game Over</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.time.currentCount <= 0 ? timeExpired : ModalText}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
                Close
            </Button>
            <Button variant="primary" onClick={() => this.saveScore()}>
                Save Score
            </Button>
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
            <div className="text-center col-md-8 col-lg-12 mx-auto">{gameMode}</div>
            {!this.state.isStarted && <div className="col-12">
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