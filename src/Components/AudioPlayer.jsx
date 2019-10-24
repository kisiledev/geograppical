import React from 'react'

const AudioPlayer = (props) => {
    return (
      <div className="card align-self-start my-3">
        <p>{props.nation.name}'s National Anthem, {props.nation.government.national_anthem.name}</p>
        <audio src={props.nation.government.national_anthem.audio_url} controls/>
      </div>
    );
  }

export default AudioPlayer;