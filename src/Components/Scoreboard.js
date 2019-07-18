import React from 'react';
import Timer from './Timer';

class Scoreboard extends React.Component {
    render(){
        return(
            <div className="card flex-row row col-sm-4 mx-auto">
                <div className="col text-center">Time
                    <div className="col">
                        <Timer 
                        time={this.props.time}
                        startTimer={this.props.startTimer}
                        stopTimer={this.props.stopTimer}
                        timer={this.props.timer}/>
                    </div>
                </div>
                <div className="col text-center">Score
                    <div className="col">
                        {this.props.score}
                    </div>
                </div>
                <div className="col text-center">Correct
                    <div className="col text-success">{this.props.correct}</div>
                </div>
                <div className="col text-center">Incorrect
                    <div className="col text-danger">{this.props.incorrect}</div>
                </div>
                <div className="col text-center">Questions
                    <div className="col text-danger">{this.props.questions}</div>
                </div>
            </div>
    )}
}

export default Scoreboard;
