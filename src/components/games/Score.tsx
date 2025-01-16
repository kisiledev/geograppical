import { Grid2, Typography } from '@mui/material';
import React from 'react';

interface ScoreProps {
  score: number | null;
  correct: number;
  incorrect: number;
}
const Score = ({ score, correct, incorrect }: ScoreProps) => {
  const calculatedScore = (
    <Grid2 container justifyContent="space-between" spacing={2}>
      <Grid2>
        Correct
        <Typography variant="h5" sx={{ color: 'green' }}>
          {correct}
        </Typography>
      </Grid2>
      <Grid2>
        Incorrect
        <Typography variant="h5" sx={{ color: 'red' }}>
          {incorrect}
        </Typography>
      </Grid2>
      <Grid2>
        Score
        <Typography variant="h5" fontWeight={600}>
          {score}
        </Typography>
      </Grid2>
    </Grid2>
  );
  const noScore = null;
  return score !== null ? calculatedScore : noScore;
};

export default Score;
