import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid2 } from '@mui/material';
import Timer from './Timer';
import Score from './Score';

interface ScoreboardProps {
  timeChecked: boolean;
  isStarted: boolean;
  timeMode: string;
  currentCount: number;
  score: number;
  correct: number;
  incorrect: number;
  questions: number;
}
const Scoreboard = (props: ScoreboardProps) => {
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
        margin: '0 auto',
        minHeight: '100px',
        alignItems: 'center',
        width: '50%'
      }}
    >
      <Grid2
        container
        sx={{
          margin: '0 auto',
          justifyContent: 'space-around'
        }}
      >
        <Grid2>
          <Timer
            timeChecked={timeChecked}
            isStarted={isStarted}
            currentCount={currentCount}
          />
        </Grid2>
        <Grid2>
          <Score score={score} correct={correct} incorrect={incorrect} />
        </Grid2>
        <Grid2>
          Questions
          <div className="col text-danger">{questions}</div>
        </Grid2>
      </Grid2>
    </Card>
  );
};
export default Scoreboard;
