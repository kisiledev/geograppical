import React, { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom'
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';

const Sidebar = props => {
    const [regions, setRegions] = useState('')

    useEffect(() =>{
        setDynamicRegions(props.uniqueRegions)
    }, [])

    useEffect(() =>{
        setDynamicRegions(props.uniqueRegions)
    }, [props.uniqueRegions])

    const removeNull = (array) => {
        return array
          .filter(item => 
            item.government.capital !== undefined && 
            item.government.country_name !==undefined && 
            item.government.country_name.isoCode !==undefined &&
            item.name)
          .map(item => Array.isArray(item) ? removeNull(item) : item);
      }

    const getRegion = (region) => {
        let searchDB = Object.values(props.data);
        removeNull(searchDB);
        let match = searchDB.filter(place => place.geography.map_references === region);
        return match;
    }
    
    const setDynamicRegions = regions => {
        if (!regions) {
            console.log('no regions')
          return;
        }
        const regionsState = {};
        regions.forEach((region) => {
            if(regions[region] && regions[region].countries[0]){
                regionsState[region] = { visible: 5, start: 0, countries: regions[region].countries, open: false};
            } else {
                getRegion(region);
                regionsState[region] = { visible: 5, start: 0, countries: getRegion(region), open: false};
            }
        });
        setRegions({...regionsState})
    };
    const updateOpen = (region) => {
        const open = {start: 0, visible: 5, open: !regions[region].open, countries: regions[region].countries}
        setRegions(({ [region]: open}));
    };

    const sidebarDataHandling = (event, region, change, start) => {
        event.stopPropagation();
        const more = {visible: regions[region].visible + change, start: regions[region].start + start, open: true, countries: regions[region].countries}
        setRegions(({[region]: more}));
    }
      
    const handleRegion =(e, region) =>{
        e.stopPropagation();
        updateOpen(region);      
    }
    return (<div className="sidebar-sticky">
        <ul className="nav nav-pills flex-column">
        {props.uniqueRegions.map( (region, index ) => 
            <li 
                className="nav-item regionlist" 
                key={index} 
                onClick={(e) => handleRegion(e, region)} 
                onMouseOver={(e) => props.hoverOnRegion(e, regions[region], region)} 
                onMouseLeave={(e) => props.hoverOffRegion(e, regions[region], region)} 
            >
                <span className="nav-link btn-sm bg-success mb-1">
                    <strong>{region}</strong> - {props.getOccurrence(props.totalRegions, region)}
                </span>
                <Collapse in={regions[region] && regions[region].open}>
                <ul className="countryul">
                {regions[region] && regions[region].countries[0] && regions[region].countries.slice(regions[region].start, regions[region].visible).map((country, index) => 
                    <li 
                        key={index} 
                        className="nav-item countrylist">
                        <div className="btn-group d-flex">
                        <Link to={`${process.env.PUBLIC_URL}/${country.name.toLowerCase()}`} className="btn-group w-100">
                            <button 
                                onClick={() => props.getCountryInfo(country.name, country.government.capital.name)}
                                onMouseOver={(e) => props.hoverOnCountry(e, regions[region], country.name)} 
                                onMouseLeave={(e) => props.hoverOffCountry(e, regions[region], country.name)} 
                                className="btn nav-link countryname btn-sm bg-info mb-1"><strong>{country.name}</strong><FontAwesomeIcon size="2x" color="white" icon={faInfoCircle} /></button>
                        </Link>
                        </div>
                    </li>
                )}
                {regions[region] && regions[region].open && (regions[region].visible < regions[region].countries.length) && 
                    <div className="btn-group countryactions">
                        <button 
                            onClick={(e) => sidebarDataHandling(e, region, 5, 0)} 
                            className="btn load-more nav-link btn-sm bg-secondary mb-1">
                            Load More
                        </button> 
                        <button 
                            onClick={(e) => sidebarDataHandling(e, region, -5, -5)} 
                            className="btn load-more nav-link btn-sm bg-warning mb-1">
                            Previous {regions[region].visible - regions[region].start}
                        </button>
                        <button 
                            onClick={(e) => sidebarDataHandling(e, region, 5, 5)} 
                            className="btn load-more nav-link btn-sm bg-success mb-1">
                            Next {regions[region].visible - regions[region].start}
                        </button>
                    </div>}
                </ul>
                </Collapse>
            </li>
            )}
        </ul>
    </div> )
    }

            
export default Sidebar;