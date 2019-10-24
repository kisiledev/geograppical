import React from 'react';
import PropTypes from 'prop-types';
import Timer from './Timer';
import Score from './Score';


const Scoreboard = (props) => {
  const {
    timeChecked,
    isStarted,
    timeMode,
    currentCount,
    score,
    correct,
    incorrect,
    questions,
  } = props;

  return (
    <div className="card flex-row row col-sm-4 mt-3 mx-auto">
      <Timer
        timeChecked={timeChecked}
        isStarted={isStarted}
        currentCount={currentCount}
        timeMode={timeMode}
      />
      <Score
        score={score}
        correct={correct}
        incorrect={incorrect}
      />
      <div className="col text-center">
        Questions
        <div className="col text-danger">{questions}</div>
      </div>
    </div>
  );
};
Scoreboard.defaultProps = {
  questions: 0,
}
Scoreboard.propTypes = {
  timeChecked: PropTypes.bool.isRequired,
  isStarted: PropTypes.bool.isRequired,
  timeMode: PropTypes.string.isRequired,
  currentCount: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  correct: PropTypes.number.isRequired,
  incorrect: PropTypes.number.isRequired,
  questions: PropTypes.number,
};
export default Scoreboard;
