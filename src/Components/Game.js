import React from 'react';
import Maps from './Maps';
import Find from './Find';
import Scoreboard from './Scoreboard';
import Choice from './Choice';

class Game extends React.Component {
    state = {
        questionsRemaining: null,
        questions: null,
        score: 0,
        correct: 0,
        incorrect: 0,
        gameMode: null,
        isStarted: false,
        time: {
            currentCount: 60,
            isRunning: false
        }
    };

    timer = () => {
        this.setState(prevState =>({
            time: {
                currentCount: this.state.time.currentCount - 1,
                isRunning: true
            }
        }));
        //clear interval
        if (this.state.time.currentCount === 0) {
          clearInterval(this.intervalId);
          this.setState({
              time: {
            isRunning: false,
            currentCount: 60
            }})
        }
      }
    
    startTimer = () => {
        this.setState(prevState =>({time: {isRunning: true}, ...prevState}))
        this.intervalId = setInterval(this.timer.bind(this), 1000);
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
          this.setState({
              time: {
                  isRunning: false,
                  currentCount: 60
              }
          })
      }
    
      // decrement every second i.e 1000
      componentDidMount =() => {
      }
    
      // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
      componentWillUnmount = () => {
        clearInterval(this.intervalId);
      }

    startGame = () => {
        this.startTimer();
        this.setState({
            isStarted: true
        })
    }
    endGame = () => {
        this.resetTimer();
        this.setState({
            isStarted: false,
            questionsRemaining: null,
            questions: null,
            score: 0,
            correct: 0,
            incorrect: 0

        });
        clearInterval(this.intervalId)
    }
    handlePointsQuestions = (q) => {
        let correctCount = q.filter(question => question.correct === true);
        let incorrectCount = q.filter(question => question.correct === false);
        console.log(correctCount);
        console.log(incorrectCount);
        let c = correctCount.length;
        let i = incorrectCount.length;
        this.setState(prevState =>({
            correct: c, 
            incorrect: i,
            questions: q.length}));
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
        this.setState({
            questionsRemaining: null,
            questions: null,
            score: 0,
            correct: 0,
            incorrect: 0,
            gameMode: null,
            isStarted: false,
            time: {
                currentCount: 60,
                isRunning: false
            }
        })
        this.resetTimer();
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
                handlePoints = {this.handlePointsQuestions}/>
            
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
                    handlePoints = {this.handlePointsQuestions}/>
            </div>
        } else if (this.state.gameMode==="highlight"){
            gameMode = <div>
                {back}
                <Maps
                    mapVisible = {this.props.mapVisible}
                    mapView={this.props.mapView} 
                    worldData = {this.props.data}
                    countries = {this.props.countries}
                    changeView = {this.props.changeView}
                    getCountryInfo = {this.props.getCountryInfo}
                    hoverOnRegion = {this.props.hoverOnRegion}
                    hoverOffRegion = {this.props.hoverOffRegion}
                    startGame = {this.startGame}/>
            </div>
        } else {
            gameMode = <div></div>
        }
        return(
        <>
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
            <h3 className="text-center">{this.state.gameMode ? this.titleCase(this.state.gameMode) : "Choose a Game Mode"}</h3>
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
        </div>
        </>
        )
    }
}

export default Game;