import React, { Component } from "react";

export default class Timer extends Component {
  // decrement timer method
  

  // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
  render() {
    return <div>
      {this.props.time.isRunning ? <div className="text-danger">{this.props.time.currentCount}</div> : <div className="text-success">{this.props.time.currentCount}</div>}
      <div></div>
    </div>;
  }
}