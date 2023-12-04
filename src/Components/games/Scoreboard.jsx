import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid } from '@mui/material';
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
    questions
  } = props;

  return (
    <Card
      sx={{
        display: 'flex',
        margin: '20px',
        minHeight: '100px',
        alignItems: 'center'
      }}
      container
      sm={12}
      spacing={2}
    >
      <Grid
        container
        sm={6}
        sx={{ margin: '0 auto', justifyContent: 'space-between' }}
      >
        <Grid item>
          <Timer
            timeChecked={timeChecked}
            isStarted={isStarted}
            currentCount={currentCount}
            timeMode={timeMode}
          />
        </Grid>
        <Grid item>
          <Score score={score} correct={correct} incorrect={incorrect} />
        </Grid>
        <Grid item>
          Questions
          <div className="col text-danger">{questions}</div>
        </Grid>
      </Grid>
    </Card>
  );
};
Scoreboard.defaultProps = {
  questions: 0,
  currentCount: null
};
Scoreboard.propTypes = {
  timeChecked: PropTypes.bool.isRequired,
  isStarted: PropTypes.bool.isRequired,
  timeMode: PropTypes.string.isRequired,
  currentCount: PropTypes.number,
  score: PropTypes.number.isRequired,
  correct: PropTypes.number.isRequired,
  incorrect: PropTypes.number.isRequired,
  questions: PropTypes.number
};
export default Scoreboard;
