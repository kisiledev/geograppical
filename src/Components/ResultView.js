import React, {Component} from 'react';
import Result from './Result';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import '../App.css';
import Sidebar from './Sidebar';

class ResultView extends Component {

  render() {
    // (regionCountries[0].name !== undefined) ? console.log(regionCountries): console.log('nothing');
    const totalRegions = this.props.data.map(a => a.geography.map_references)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean);

    return(
      <BreakpointProvider>
      <div className="row">
        <main className="col-md-9 px-0">
          {this.props.countries[0] === undefined ? 
              <h5 className="text-center mb-3">Welcome to the Geography App</h5>
           : null }
          {this.props.countries[0] && this.props.countries.map( (country, index) => 
            <Result
            worldData = {this.props.data}
            changeView = {this.props.changeView}
            getCountryInfo = {this.props.getCountryInfo}
            name={country.name}
            region = {country.geography.map_references}
            subregion = {country.geography.location}
            capital = {country.government.capital.name}
            excerpt = {country.excerpt}
            population = {country.people.population.total}
            flag = {country.flag}
            flagCode = {this.props.flagCodes[country.name]}
            imgalt = {country.name + "'s flag"}        
            key={index}
            code={country.alpha3Code}
            />
          )}
        </main>
        {this.props.sidebar === "Show" ?
        <Sidebar
            changeView = {this.props.changeView}
            handleSideBar = {this.props.handleSideBar}
            viewSidebar={this.props.viewSidebar}
            geodata = {this.props.geodata}
            data={this.props.data}
            totalRegions = {totalRegions}
            uniqueRegions = {uniqueRegions}
            getOccurrence = {getOccurrence}
            sidebar={this.props.sidebar}
            getCountryInfo = {this.props.getCountryInfo}
        /> :     
        <Breakpoint small down>
            <div className="col-12 text-center px-0">
            <button 
            className="btn btn-sm btn-block btn-outline-secondary" 
            onClick={()=> this.props.viewSidebar()}
            >
            { (this.props.sidebar === "Hide") ? "Show" : "Hide"} Countries List
            </button>
            </div>
        </Breakpoint> 
      }
      </div>
      </BreakpointProvider>
    )
  }
}
export default ResultView;