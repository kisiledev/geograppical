import React from "react";

const Timer = (props) => {

  // decrement timer method
  
  const SecondsToHHMMSS = (totalSeconds) => {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);
  
    // round seconds
    seconds = Math.round(seconds * 100) / 100
  
    let result = (minutes < 10 ? minutes : minutes);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
  }
  // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
  let time;
  if(props.timeChecked){
    time = 
    <div className="col text-center">Time
      <div className="col">
        <div>
        <h5 className={props.timeChecked && props.isStarted ? "text-danger" : "text-success"}>
          <strong>{props.timeChecked !== null && SecondsToHHMMSS(props.currentCount)}</strong>
        </h5>
        <div></div>
        </div>
      </div>
      </div>
  }

  let noTime = <div></div>
  return (
    <div>{props.timeChecked && props.time !==null ? time : noTime}</div>
  )
}
export default Timer;