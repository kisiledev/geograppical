import React from 'react';
import Maps from './Maps';
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
    handlePointsQuestions = (c, i, q) => {
        this.setState(prevState =>({
            correct: prevState.correct + c, 
            incorrect: i,
            questions: q}));
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
    }
    render(){
        let back = !this.props.isStarted && <button className="btn btn-info" onClick={() => this.resetMode()}>Go Back</button>
        let gameMode;
        if(this.state.gameMode==="choice"){
            gameMode = 
            <div>
            {back}
            <Choice 
                isStarted={this.state.isStarted}
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
        <div className="card mt-5 col-8 mx-auto">
            <h1 className="text-center">{this.state.gameMode ? this.titleCase(this.state.gameMode) : "Choose a Game Mode"}</h1>
            {!this.state.gameMode && <div>
                <div className="row">
                    <div className="col-12 mx-auto">
                        <ul className="text-center">
                            <button className="choice btn btn-info mr-3" onClick={() => this.setState({gameMode: 'choice'})}>Questions</button>
                            <button className="choice btn btn-info mr-3" onClick={() => this.setState({gameMode: 'find'})}>Find Country on Map</button>
                            <button className="choice btn btn-info mr-3" onClick={() => this.setState({gameMode: 'highlight'})}>Select Highlighted Country</button>
                        </ul>
                    </div>
                </div>
            </div>}
            <div className="text-center col-8 mx-auto">{gameMode}</div>
        </div>
        </>
        )
    }
}

export default Game;