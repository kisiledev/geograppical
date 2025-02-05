import { Grid2, Typography } from '@mui/material';

interface ScoreProps {
  score: number | null;
  correct: number;
  incorrect: number;
}
const Score = ({ score, correct, incorrect }: ScoreProps) => {
  const sx = { flexDirection: 'column', display: 'flex', alignItems: 'center' };
  const calculatedScore = (
    <Grid2 container justifyContent="space-between" spacing={2}>
      <Grid2 sx={sx}>
        Correct
        <Typography variant="h5" sx={{ color: 'green' }}>
          {correct}
        </Typography>
      </Grid2>
      <Grid2 sx={sx}>
        Incorrect
        <Typography variant="h5" sx={{ color: 'red' }}>
          {incorrect}
        </Typography>
      </Grid2>
      <Grid2 sx={sx}>
        Score
        <Typography variant="h5">{score}</Typography>
      </Grid2>
    </Grid2>
  );
  const noScore = null;
  return score !== null ? calculatedScore : noScore;
};

export default Score;
