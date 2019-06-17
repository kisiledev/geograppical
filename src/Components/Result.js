import React, {Component} from 'react';
import Flag from 'react-flags';
import { Link } from 'react-router-dom';
import '../App.css';

class Result extends Component {
    render() {
        return(
            <div className="mr-md-3 card mb-3">
                <div className="result media">
                    <div className="media-body">
                    <h4 className="title">
                        {this.props.name} ({this.props.flagCode})<br/><small>Capital: {this.props.capital} | Pop: {this.props.population}</small> 
                    </h4>
                    <p className="subregion">
                    <strong>Location: </strong>{this.props.subregion}
                    </p>
                    <Link to={this.props.name} className="btn btn-success btn-sm" onClick={() => this.props.getCountryInfo(this.props.name, this.props.capital)}>Read More</Link>
                    </div> 
                    <Flag 
                        name={(this.props.flagCode)? this.props.flagCode : "_unknown"}
                        format="svg"
                        pngSize={64}
                        shiny={false}
                        alt={`${this.props.name}'s Flag`}
                        basePath="/img/flags"
                    /> 
                    
                </div>
                
            </div>

            // <div className="card h-100 col-sm-12 col-md-9 mb-3">
            //     <img className="card-img" src={this.props.flag} alt={this.props.imgalt}/>
            //     <div className="card-img-overlay">
            //         <h5 className="card-title">{this.props.name} <small>Capital: {this.props.capital}</small></h5>
            //         <p>Pop: {this.props.population}</p>
            //         <p className="card-text"><strong>Region: </strong>{this.props.region}</p>
            //         <p className="subregion"><strong>Subregion: </strong>{this.props.subregion}</p>
            //         <button className="btn btn-primary btn-sm">Read More</button>
            //     </div>
            // </div>
        )
    }
}

export default Result;