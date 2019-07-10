import React from 'react'

const AudioPlayer = (props) => {
    return (
      <div className="card col-6 align-self-start">
        <h5>{props.nation.name}'s National Anthem, {props.nation.government.national_anthem.name}</h5>
        <audio src={props.nation.government.national_anthem.audio_url} controls/>
      </div>
    );
  }

export default AudioPlayer;