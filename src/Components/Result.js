import React, {Component} from 'react';
import '../App.css';

class Result extends Component {

    render() {
        return(
            <div className="card col-sm-12 col-md-9 mb-3 mb-3">
                <div className="result media">
                    <div className="media-body">
                    <h4 className="title">
                        {this.props.name}
                    </h4>
                    <p className="region">
                    <strong>Region: </strong>{this.props.region}
                    </p>
                    <p className="subregion">
                    <strong>Subregion: </strong>{this.props.subregion}
                    </p>
                    <button className="btn btn-primary btn-sm">Read More</button>
                    </div>  
                    <img className="ml-3" src={this.props.flag} alt={this.props.imgalt}/>
                    
                </div>
                
            </div>
        )
    }
}

export default Result;