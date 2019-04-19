import React, {Component} from 'react';
import '../App.css';

class Result extends Component {

    render() {
        return(
            <div className="card mb-3">
                <div className="result media">
                    <div className="media-body">
                    <h4 className="title">
                        {this.props.name}
                    </h4>
                    <p className="excerpt">
                    {this.props.excerpt}
                    </p>
                    <button className="btn btn-primary btn-sm">Read More</button>
                    </div>  
                    <img className="ml-3" src={this.props.imgurl} alt={this.props.imgalt}/>
                    
                </div>
                
            </div>
        )
    }
}

export default Result;