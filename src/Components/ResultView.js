import React, {Component} from 'react';
import Result from './Result';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import '../App.css';
import Sidebar from './Sidebar';

class ResultView extends Component {
  render() {
    // (regionCountries[0].name !== undefined) ? console.log(regionCountries): console.log('nothing');
    const totalRegions = this.props.geodata.map(a => a.region)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean);

    return(
      <div className="row">
        <main className="col-md-9">
          {this.props.countries[0] === undefined ? <div className="text-center mb-3"><h3>Waiting for Input</h3> <FontAwesomeIcon icon={faSpinner} spin size="3x" /></div> : null }
          {this.props.countries[0] && this.props.countries.map( country => 
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
          totalRegions = {totalRegions}
          uniqueRegions = {uniqueRegions}
          getOccurrence = {getOccurrence}
          filterRegion = {this.props.filterRegion}
          handleSideBar = {this.props.handleSideBar}
        />
      </div>
    )
  }
}
export default ResultView;