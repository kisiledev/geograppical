import React from 'react';
import Timer from './Timer';
import Score from './Score';

const Scoreboard = props => {
    return(
        <div className="card flex-row row col-sm-4 mt-3 mx-auto">
            <Timer 
                timeChecked={props.timeChecked}
                isStarted={props.isStarted}
                testTime={props.testTime}
                currentCount={props.currentCount}
                timeMode={props.timeMode}
            />
            <Score 
                score={props.score}
                correct={props.correct}
                incorrect={props.incorrect}
            />
            <div className="col text-center">Questions
                <div className="col text-danger">{props.questions}</div>
            </div>
        </div>
    )
}

export default Scoreboard;
