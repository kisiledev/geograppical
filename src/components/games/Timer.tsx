import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid2, Typography } from '@mui/material';

interface TimerProps {
  timeChecked: boolean;
  isStarted: boolean;
  currentCount: number;
}

type Result = number | string;
const Timer = (props: TimerProps) => {
  const { timeChecked, isStarted, currentCount } = props;

  // decrement timer method

  const SecondsToHHMMSS = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    let seconds = totalSeconds - hours * 3600 - minutes * 60;

    // round seconds
    seconds = Math.round(seconds * 100) / 100;

    let result: Result = minutes < 10 ? minutes : minutes;

    let finalResult = `${result}:${seconds < 10 ? `0${seconds}` : seconds}`;
    return finalResult;
  };
  // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
  let time;
  if (timeChecked) {
    time = (
      <Grid2>
        Time
        <Grid2>
          <Box>
            <Typography
              variant="h6"
              color={timeChecked && isStarted ? 'danger' : 'success'}
            >
              <strong>
                {timeChecked !== null && SecondsToHHMMSS(currentCount)}
              </strong>
            </Typography>
            <div />
          </Box>
        </Grid2>
      </Grid2>
    );
  }

  const noTime = <div />;
  return <div>{timeChecked && time !== null ? time : noTime}</div>;
};
export default Timer;
