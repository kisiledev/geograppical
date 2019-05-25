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
        <main className="col-md-9 px-0">
          {this.props.countries[0] === undefined ? 
              <h5 className="text-center mb-3">Search Above to Begin</h5>
           : null }
          {this.props.countries[0] && this.props.countries.map( country => 
            <Result
            worldData = {this.props.data}
            changeView = {this.props.changeView}
            getCountryInfo = {this.props.getCountryInfo}
            name={country.name}
            region = {country.region}
            subregion = {country.subregion}
            capital = {country.capital}
            excerpt = {country.excerpt}
            population = {country.population}
            flag = {country.flag}
            imgalt = {country.name + "'s flag"}        
            key={country.alpha2Code}
            code={country.alpha3Code}
            />
          )}
        </main>
        <Sidebar
            handleSideBar = {this.props.handleSideBar} 
            geodata = {this.props.geodata}
            totalRegions = {totalRegions}
            uniqueRegions = {uniqueRegions}
            getOccurrence = {getOccurrence}
        />
      </div>
    )
  }
}
export default ResultView;