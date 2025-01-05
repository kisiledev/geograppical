import { Grid, Typography } from '@mui/material';
import React from 'react';

const Score = ({ score, correct, incorrect }) => {
  const calculatedScore = (
    <Grid container justifyContent="space-between" spacing={2}>
      <Grid item>
        Correct
        <Typography variant="h5" sx={{ color: 'green' }}>
          {correct}
        </Typography>
      </Grid>
      <Grid item>
        Incorrect
        <Typography variant="h5" sx={{ color: 'red' }}>
          {incorrect}
        </Typography>
      </Grid>
      <Grid item>
        Score
        <Typography variant="h5" fontWeight={600}>
          {score}
        </Typography>
      </Grid>
    </Grid>
  );
  const noScore = null;
  return score !== null ? calculatedScore : noScore;
};

export default Score;
