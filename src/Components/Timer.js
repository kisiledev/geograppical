import React, { Component } from "react";

export default class Timer extends Component {
  // decrement timer method
  

  // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
  render() {
    return <div>
      {this.props.time.isRunning ? <h5 className="text-danger"><strong>{this.props.time.currentCount}</strong></h5> : <h5 className="text-success"><strong>{this.props.time.currentCount}</strong></h5>}
      <div></div>
    </div>;
  }
}