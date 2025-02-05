import { Card, Grid2, Typography } from '@mui/material';
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
        <Grid2 sx={{ paddingX: '10px' }}>
          <Score score={score} correct={correct} incorrect={incorrect} />
        </Grid2>
        <Grid2
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          Questions
          <Typography variant="h5">{questions}</Typography>
        </Grid2>
      </Grid2>
    </Card>
  );
};
export default Scoreboard;
