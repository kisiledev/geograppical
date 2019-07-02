import React from 'react';
import Timer from './Timer'

class Scoreboard extends React.Component {
    render(){
        return(
            <div className="row col-4">
                <div className="col-3 text-center">Name
                    <div className="col-12">Khari</div>
                </div>
                <div className="col-3 text-center">Score</div>
                <div className="col-3 text-center">Age</div>
                <div className="col-3 text-center">Time
                    <div className="col-12">
                        <Timer/>
                    </div>
                </div>
            </div>
    )}
}

export default Scoreboard;
