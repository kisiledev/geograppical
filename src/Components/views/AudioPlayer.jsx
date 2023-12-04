import { Card, CardMedia } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { countryType } from '../../helpers/types';

const AudioPlayer = ({ nation }) => {
  const {
    government: {
      national_anthem: { audio_url: audioUrl, name: anthemName }
    },
    name
  } = nation;
  const [active, setActive] = useState(false);
  useEffect(async () => {
    const response = await fetch(audioUrl, { mode: 'no-cors' });
    if (response.status === 200 && audioUrl !== undefined) {
      setActive(true);
      // The url exists
    } else {
      // The url does not exist
      setActive(false);
    }
  }, [nation]);

  return active ? (
    <Card raised className="card align-self-start my-3">
      <p>{`${name}'s National Anthem, ${anthemName}`}</p>
      <CardMedia component="audio" src={audioUrl} />
    </Card>
  ) : null;
};

AudioPlayer.propTypes = {
  nation: countryType.isRequired
};
export default AudioPlayer;
