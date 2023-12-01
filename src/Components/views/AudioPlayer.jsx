import { Card, CardMedia } from '@mui/material';
import React from 'react';
import { countryType } from '../../helpers/types';

const AudioPlayer = (props) => {
  const { nation } = props;
  return (
    <Card raised className="card align-self-start my-3">
      <p>{`${nation.name}'s National Anthem, ${nation.government.national_anthem.name}`}</p>
      <CardMedia
        component="audio"
        src={nation.government.national_anthem.audio_url}
      />
    </Card>
  );
};

AudioPlayer.propTypes = {
  nation: countryType.isRequired
};
export default AudioPlayer;
