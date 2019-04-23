import React, {Component} from 'react';
import Result from './Result';
import '../App.css';

class ResultView extends Component {
  render() {
    console.log(this.props.countries);
    if(this.props.countries[0] === undefined){
      return(<div>Please search for a country</div>)
    } else {
    return(
      <div className="row">
        <div className="col-sm-12 col-md-8 mb-3">
        {this.props.countries.map( country => 
          <Result 
          name={country.name}
          region = {country.region}
          subregion = {country.subregion}
          type = {country.type}
          excerpt = {country.excerpt}
          number = {country.number}
          flag = {country.flag}
          imgalt = {country.name + "'s flag"}        
          key={country.alpha2Code}
          />
        )}
        </div>
        <div className="sidebar card col-sm-12 col-md-4">
                <ul>
                <li><strong>Countries:</strong> {this.props.geodata.length} </li>
                </ul>
            </div>
      </div>
    )
  }
}
}

export default ResultView;