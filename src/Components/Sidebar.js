/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom'
import { faInfoCircle, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';


class Sidebar extends Component {

    state = {};
    componentDidMount(prevState){
        if(prevState !== this.state){
            this.setDynamicRegions(this.props.uniqueRegions)
        };
    }
    componentDidUpdate(prevProps) {
        // only update chart if the data has changed
        if (prevProps.uniqueRegions !== this.props.uniqueRegions && this.props.uniqueRegions.length > 0) {
          this.setDynamicRegions(this.props.uniqueRegions)
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
        // console.log(regions);
        const regionsState = {};
      
        regions.forEach((region) => {
            if(this.state[region] && this.state[region].countries[0]){
                regionsState[region] = { visible: 5, start: 0, countries: this.state[region].countries, open: false};
            } else {
                this.getRegion(region);
                regionsState[region] = { visible: 5, start: 0, countries: this.getRegion(region), open: false};
            }
        });
        // set state here outside the foreach function
         this.setState({...regionsState})
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
    highlightSidebarCountry = (e, region, country) => {
        // e.preventDefault();
        // alert(this.state[region].open + " " + country);
        // const more = {visible: this.state[region].visible, start: this.state[region].start, open: true, countries: this.state[region].countries}
        // this.setState(({[region]: more}))
        this.props.hoverOnCountry(e, region,country);
    }
      
    handleRegion =(e, region) =>{
        e.stopPropagation();
        this.updateOpen(region);
        // this.updateVisibility(region);       
    }

    render(){
        if(this.props === null){
            return <h2>Loading</h2>
        } else {
        return (
            <BreakpointProvider>
            <nav className="sidebar card col-md-3">
                <Breakpoint small down>
                    <button 
                    className="btn btn-sm btn-block btn-outline-secondary mb-3" 
                    onClick={()=> this.props.viewSidebar()}
                    >
                    { (this.props.sidebar === "Hide") ? "Show" : "Hide"} Countries List
                    </button>
                </Breakpoint>
                <div className="sidebar-sticky">
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
                                            className="btn nav-link countryname btn-sm bg-info mb-1"><strong>{country.name}</strong></button>
                                    </Link>
                                    <div className="btn-group w-100">
                                        <button className="btn load-more nav-link btn-sm bg-info mb-1"
                                            onClick={(e) => this.highlightSidebarCountry(e, this.state[region], country.name)} >Locate
                                            <FontAwesomeIcon size="2x" color="white" icon={faMapMarkerAlt} /></button>
                                    </div>
                                    <Link to={`${process.env.PUBLIC_URL}/${country.name.toLowerCase()}`} className="btn-group w-100">
                                        <button className="btn load-more nav-link btn-sm bg-info mb-1"
                                            onClick={() => this.props.getCountryInfo(country.name, country.government.capital.name)}>More Info<FontAwesomeIcon size="2x" color="white" icon={faInfoCircle} /></button>
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
                </div>
            </nav>
            </BreakpointProvider>
        )
        }
    }
}

export default Sidebar;