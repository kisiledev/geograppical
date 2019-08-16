import React from "react";

const Timer = (props) => {

  // decrement timer method
  

  // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
  let time;
  if(props.time){
    time = 
    <div className="col text-center">Time
      <div className="col">
        <div>
        <h5 className={props.time && props.time.isRunning ? "text-danger" : "text-success"}>
          <strong>{props.time !== null && props.time.timeMode === "et" ? props.time.clock : props.time.currentCount}</strong>
        </h5>
        <div></div>
        </div>
      </div>
      </div>
  }

  let noTime = <div></div>
  return (
    <div>{props.time && props.time !==null ? time : noTime}</div>
  )
}
export default Timer;