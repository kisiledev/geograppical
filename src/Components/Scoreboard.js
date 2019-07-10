import React from 'react';
import Timer from './Timer';

class Scoreboard extends React.Component {
    render(){
        return(
            <div className="card flex-row row col-4 mx-auto">
                <div className="col-4 text-center">Name
                    <div className="col-12">Khari</div>
                </div>
                <div className="col-4 text-center">Score
                    <div className="col-12">
                        {this.props.score}
                    </div>
                </div>
                <div className="col-4 text-center">Time
                    <div className="col-12">
                        <Timer 
                        time={this.props.time}
                        startTimer={this.props.startTimer}
                        stopTimer={this.props.stopTimer}
                        timer={this.props.timer}/>
                    </div>
                </div>
            </div>
    )}
}

export default Scoreboard;
