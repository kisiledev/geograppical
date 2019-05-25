import React from 'react'

class AudioPlayer extends React.Component {
  render() {
    return (
      <div>
        <h5>{this.props.nation.name}'s National Anthem, {this.props.nation.government.national_anthem.name}</h5>
        <audio ref="audio_tag" src={this.props.audio} controls/>
      </div>
    );
  }
}

export default AudioPlayer;