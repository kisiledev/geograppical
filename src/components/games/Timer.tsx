import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';

const Timer = (props) => {
  const { timeChecked, isStarted, currentCount } = props;

  // decrement timer method

  const SecondsToHHMMSS = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    let seconds = totalSeconds - hours * 3600 - minutes * 60;

    // round seconds
    seconds = Math.round(seconds * 100) / 100;

    let result = minutes < 10 ? minutes : minutes;
    result += `:${seconds < 10 ? `0${seconds}` : seconds}`;
    return result;
  };
  // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
  let time;
  if (timeChecked) {
    time = (
      <Grid item>
        Time
        <Grid>
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
        </Grid>
      </Grid>
    );
  }

  const noTime = <div />;
  return <div>{timeChecked && time !== null ? time : noTime}</div>;
};
Timer.defaultProps = {
  currentCount: null
};
Timer.propTypes = {
  timeChecked: PropTypes.bool.isRequired,
  isStarted: PropTypes.bool.isRequired,
  currentCount: PropTypes.number
};
export default Timer;
