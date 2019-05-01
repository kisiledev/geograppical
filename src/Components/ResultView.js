import React, {Component} from 'react';
import Result from './Result';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import '../App.css';
import Sidebar from './Sidebar';

class ResultView extends Component {
  render() {
    // (regionCountries[0].name !== undefined) ? console.log(regionCountries): console.log('nothing');
    let totalRegions = this.props.geodata.map(a => a.region)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);

    let lis = [];
    for (let i = 0; i < uniqueRegions.length -1; i++) {
      lis.push(
        <li className="nav-item" key={i}>
          <span className="nav-link bg-success mb-1"><strong>{uniqueRegions[i]}</strong> - {getOccurrence(totalRegions, uniqueRegions[i])}</span>
          <ul>
          </ul>
        </li>

      )
      
    }
    if(this.props.countries[0] === undefined){
      return(<div className="text-center"><h3>Waiting for Input</h3> <FontAwesomeIcon icon={faSpinner} spin size="3x" /></div>
        )
    } else {
    return(
      <div className="row">
        <main className="col-md-9">
          {this.props.countries.map( country => 
            <Result 
            name={country.name}
            region = {country.region}
            subregion = {country.subregion}
            capital = {country.capital}
            excerpt = {country.excerpt}
            population = {country.population}
            flag = {country.flag}
            imgalt = {country.name + "'s flag"}        
            key={country.alpha2Code}
            />
          )}
        </main>
        <Sidebar 
          regionData={this.props.regionData}
          geodata = {this.props.geodata}
          sideBar= {this.props.sideBarData}
          totalRegions = {this.props.totalRegions}
            uniqueRegions = {this.props.uniqueRegions}
            getOccurrence = {this.props.getOccurrence}
        />
      </div>
    )
  }
}
}

export default ResultView;