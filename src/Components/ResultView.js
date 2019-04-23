import React, {Component} from 'react';
import Result from './Result';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import '../App.css';

class ResultView extends Component {
  render() {
    let totalRegions = this.props.geodata.map(a => a.region)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    console.log(uniqueRegions);
    console.log(getOccurrence(totalRegions, uniqueRegions[2]))
    console.log(totalRegions);
    console.log(this.props.countries);
    if(this.props.countries[0] === undefined){
      return(<div className="text-center"><h3>Waiting for Input</h3> <FontAwesomeIcon icon={faSpinner} spin size="3x" /></div>
        )
    } else {
    return(
      <div className="row">
        <div className="col-sm-12 col-md-9 mb-3">
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
        <div className="sidebar card col-sm-12 col-md-3">
                <ul>
                <li><strong>Countries:</strong> {this.props.geodata.length} </li>
                <ul>
                  <li><strong>{uniqueRegions[0]}</strong> - {getOccurrence(totalRegions, uniqueRegions[0])} </li>
                  <li><strong>{uniqueRegions[1]}</strong> - {getOccurrence(totalRegions, uniqueRegions[1])} </li>
                  <li><strong>{uniqueRegions[2]}</strong> - {getOccurrence(totalRegions, uniqueRegions[2])} </li>
                  <li><strong>{uniqueRegions[3]}</strong> - {getOccurrence(totalRegions, uniqueRegions[3])} </li>
                  <li><strong>{uniqueRegions[4]}</strong> - {getOccurrence(totalRegions, uniqueRegions[4])} </li>
                  <li><strong>{uniqueRegions[5]}</strong> - {getOccurrence(totalRegions, uniqueRegions[5])} </li>
                </ul>
                </ul>
            </div>
      </div>
    )
  }
}
}

export default ResultView;