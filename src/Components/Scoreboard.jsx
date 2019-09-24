import React from 'react';
import Timer from './Timer';
import Score from './Score';

class Scoreboard extends React.Component {
    render(){
        return(
            <div className="card flex-row row col-sm-4 mt-3 mx-auto">
                <Timer 
                    time={this.props.time}
                />
                <Score 
                    score={this.props.score}
                    correct={this.props.correct}
                    incorrect={this.props.incorrect}
                />
                <div className="col text-center">Questions
                    <div className="col text-danger">{this.props.questions}</div>
                </div>
            </div>
    )}
}

export default Scoreboard;
