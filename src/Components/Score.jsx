import React from 'react';

const Score = (props) => {
    let score = <>
    <div className="col text-center">Score
        <div className="col">
            {props.score}
        </div>
    </div>
    <div className="col text-center">Correct
        <div className="col text-success">{props.correct}</div>
    </div>
    <div className="col text-center">Incorrect
        <div className="col text-danger">{props.incorrect}</div>
    </div>
    </>
    let noScore = null
    return(
        <>{props.score !== null ? score : noScore}</>
    )
}

export default Score;
