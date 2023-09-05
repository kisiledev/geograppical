import React from 'react';
import PropTypes from 'prop-types';
import Timer from './Timer';
import Score from './Score';
import { Card, Grid } from '@mui/material';

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
    <Grid container spacing={2}>
      <Grid item sm={4} sx={{ margin: '0 auto' }}>
        <Card
          raised
          sx={{ padding: '15px', display: 'flex', flexDirection: 'row' }}
        >
          <Timer
            timeChecked={timeChecked}
            isStarted={isStarted}
            currentCount={currentCount}
            timeMode={timeMode}
          />
          <Score score={score} correct={correct} incorrect={incorrect} />
          <div className="col text-center">
            Questions
            <div className="col text-danger">{questions}</div>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};
Scoreboard.defaultProps = {
  questions: 0,
  currentCount: null,
}
Scoreboard.propTypes = {
  timeChecked: PropTypes.bool.isRequired,
  isStarted: PropTypes.bool.isRequired,
  timeMode: PropTypes.string.isRequired,
  currentCount: PropTypes.number,
  score: PropTypes.number.isRequired,
  correct: PropTypes.number.isRequired,
  incorrect: PropTypes.number.isRequired,
  questions: PropTypes.number,
};
export default Scoreboard;
