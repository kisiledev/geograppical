import React from 'react';

class Timer extends React.Component {
    state = {
        time: 60
    }
    count = ()=> {
        this.setState(prevState =>({time: prevState.time - 1}));
        setInterval(() => this.count, 1000);
    }
    
    render(){
        this.count();        
        return(
            <div>{this.state.time}</div>
        )
    }
}

export default Timer;