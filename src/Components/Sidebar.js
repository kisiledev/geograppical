import React from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom'
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';

class Sidebar extends React.Component {
    state = {
    }
    componentDidMount = () => {
        this.setState({loading: true}, console.log('setting dynamics'), this.setDynamicRegions(this.props.uniqueRegions))
}
componentDidUpdate = (prevProps, prevState)  => {
    if(this.props.sidebar !==prevProps.sidebar){
        this.setState({loading: false})
    }
    if (prevProps.uniqueRegions !== this.props.uniqueRegions && this.props.uniqueRegions.length > 0) {
        console.log('updated component')
      this.setDynamicRegions(this.props.uniqueRegions)
    }
    if(this.state.loading !== prevState.loading){
        this.setState({loading: false}, console.log('loading is now false', this.state.loading))
    }
};
removeNull(array){
    return array
      .filter(item => 
        item.government.capital !== undefined && 
        item.government.country_name !==undefined && 
        item.name)
      .map(item => Array.isArray(item) ? this.removeNull(item) : item);
  }

getRegion = (region) => {
    let searchDB = Object.values(this.props.data);
    this.removeNull(searchDB);
    let match = searchDB.filter(place => place.geography.map_references === region);
    return match;
}

setDynamicRegions = regions => {
    if (!regions) {
        console.log('no regions')
      return;
    }
    const regionsState = {};
    regions.forEach((region) => {
        if(this.state[region] && this.state[region].countries[0]){
            regionsState[region] = { visible: 5, start: 0, countries: this.state[region].countries, open: false};
        } else {
            this.getRegion(region);
            regionsState[region] = { visible: 5, start: 0, countries: this.getRegion(region), open: false};
        }
    });
        this.setState({...regionsState, loading: false}, console.log('loading is false', this.state.loading))
};
updateOpen = (region) => {
    const open = {start: 0, visible: 5, open: !this.state[region].open, countries: this.state[region].countries}
    this.setState(({ [region]: open}));
};

sidebarDataHandling = (event, region, change, start) => {
    event.stopPropagation();
    const more = {visible: this.state[region].visible + change, start: this.state[region].start + start, open: true, countries: this.state[region].countries}
    this.setState(({[region]: more}));
}
  
handleRegion =(e, region) =>{
    e.stopPropagation();
    this.updateOpen(region);
    // this.updateVisibility(region);       
}
    render(){
        return (<div className="sidebar-sticky">
        <ul className="nav nav-pills flex-column">
        {this.props.uniqueRegions.map( (region, index ) => 
            <li 
                className="nav-item regionlist" 
                key={index} 
                onClick={(e) => this.handleRegion(e, region)} 
                onMouseOver={(e) => this.props.hoverOnRegion(e, this.state[region], region)} 
                onMouseLeave={(e) => this.props.hoverOffRegion(e, this.state[region], region)} 
            >
                <span className="nav-link btn-sm bg-success mb-1">
                    <strong>{region}</strong> - {this.props.getOccurrence(this.props.totalRegions, region)}
                </span>
                <Collapse in={this.state[region] && this.state[region].open}>
                <ul className="countryul">
                {this.state[region] && this.state[region].countries[0] && this.state[region].countries.slice(this.state[region].start, this.state[region].visible).map((country, index) => 
                    <li 
                        key={index} 
                        className="nav-item countrylist">
                        <div className="btn-group d-flex">
                        <Link to={`${process.env.PUBLIC_URL}/${country.name.toLowerCase()}`} className="btn-group w-100">
                            <button 
                                onClick={() => this.props.getCountryInfo(country.name, country.government.capital.name)}
                                onMouseOver={(e) => this.props.hoverOnCountry(e, this.state[region], country.name)} 
                                onMouseLeave={(e) => this.props.hoverOffCountry(e, this.state[region], country.name)} 
                                className="btn nav-link countryname btn-sm bg-info mb-1"><strong>{country.name}</strong><FontAwesomeIcon size="2x" color="white" icon={faInfoCircle} /></button>
                        </Link>
                        </div>
                    </li>
                )}
                {this.state[region] && this.state[region].open && (this.state[region].visible < this.state[region].countries.length) && 
                    <div className="btn-group countryactions">
                        <button 
                            onClick={(e) => this.sidebarDataHandling(e, region, 5, 0)} 
                            className="btn load-more nav-link btn-sm bg-secondary mb-1">
                            Load More
                        </button> 
                        <button 
                            onClick={(e) => this.sidebarDataHandling(e, region, -5, -5)} 
                            className="btn load-more nav-link btn-sm bg-warning mb-1">
                            Previous {this.state[region].visible - this.state[region].start}
                        </button>
                        <button 
                            onClick={(e) => this.sidebarDataHandling(e, region, 5, 5)} 
                            className="btn load-more nav-link btn-sm bg-success mb-1">
                            Next {this.state[region].visible - this.state[region].start}
                        </button>
                    </div>}
                </ul>
                </Collapse>
            </li>
            )}
        </ul>
        {/* </div> */}
    </div> )
    }
}


            
export default Sidebar;