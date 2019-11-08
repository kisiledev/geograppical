import React from 'react';
import { countryType } from '../Helpers/Types';


const AudioPlayer = (props) => {
  const { nation } = props;
  return (
    <div className="card align-self-start my-3">
      <p>{`${nation.name}'s National Anthem, {nation.government.national_anthem.name}`}</p>
      <audio src={nation.government.national_anthem.audio_url} controls />
    </div>
  );
};

AudioPlayer.propTypes = {
  nation: countryType.isRequired,
};
export default AudioPlayer;
