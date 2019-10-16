/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../App.css';

const Sidebar = (props) => {
  const [regions, setRegions] = useState('');

  const removeNull = (array) => {
    array.filter((item) => item.government.capital !== undefined
      && item.government.country_name !== undefined
      && item.government.country_name.isoCode !== undefined
      && item.name)
      .map((item) => (Array.isArray(item) ? removeNull(item) : item));
  };

  const getRegion = (region) => {
    const searchDB = Object.values(props.data);
    removeNull(searchDB);
    const match = searchDB.filter((place) => place.geography.map_references === region);
    return match;
  };

  const setDynamicRegions = (reg) => {
    if (!reg) {
      return;
    }
    const regionsState = {};
    reg.forEach((region) => {
      if (reg[region] && reg[region].countries[0]) {
        regionsState[region] = {
          visible: 5,
          start: 0,
          countries: reg[region].countries,
          open: false,
        };
      } else {
        getRegion(region);
        regionsState[region] = {
          visible: 5,
          start: 0,
          countries: getRegion(region),
          open: false,
        };
      }
    });
    console.log(regionsState);
    setRegions({ ...regionsState });
    console.log(regions)
  };
  const updateOpen = (region) => {
    const open = {
      visible: 5,
      start: 0,
      countries: regions[region].countries,
      open: !regions[region].open,
    };
    const oldReg = { ...regions };
    oldReg[region] = open;
    setRegions(oldReg);
  };

  const sidebarDataHandling = (event, region, change, start) => {
    event.stopPropagation();
    const more = {
      visible: regions[region].visible + change,
      start: regions[region].start + start,
      open: true,
      countries: regions[region].countries,
    };
    const oldReg = { ...regions };
    oldReg[region] = more;
    setRegions(oldReg);
  };

  const handleRegion = (e, region) => {
    e.stopPropagation();
    updateOpen(region);
  };

  useEffect(() => {
    setDynamicRegions(props.uniqueRegions);
  }, []);

  useEffect(() => {
    console.log(regions)
    console.log(props.uniqueRegions)
  }, [regions])

  useEffect(() => {
    console.log(props.uniqueRegions);
    setDynamicRegions(props.uniqueRegions);
  }, [props.uniqueRegions]);
  return (
    <div className="sidebar-sticky">
      <ul className="nav nav-pills flex-column">
        {props.uniqueRegions && props.uniqueRegions.map((region) => (
          <li
            className="nav-item regionlist"
            key={region}
            onClick={(e) => handleRegion(e, region)}
            onFocus={(e) => props.hoverOnRegion(e, regions[region])}
            onMouseOver={(e) => props.hoverOnRegion(e, regions[region])}
            onMouseLeave={(e) => props.hoverOffRegion(e, regions[region])}
          >
            <span className="nav-link btn-sm bg-success mb-1">
              <strong>{region}</strong>
              -
              {props.getOccurrence(props.totalRegions, region)}
            </span>
            <Collapse in={regions[region] && regions[region].open}>
              <ul className="countryul">
                {regions[region] && regions[region].countries[0] && regions[region].countries.slice(regions[region].start, regions[region].visible).map((country) => (
                  <li
                    key={country.name}
                    className="nav-item countrylist"
                  >
                    <div className="btn-group d-flex">
                      <Link to={`${process.env.PUBLIC_URL}/${country.name.toLowerCase()}`} className="btn-group w-100">
                        <button
                          type="button"
                          onFocus={(e) => props.hoverOnCountry(e, regions[region], country.name)}
                          onClick={() => props.getCountryInfo(country.name, country.government.capital.name)}
                          onMouseOver={(e) => props.hoverOnCountry(e, regions[region], country.name)}
                          onMouseLeave={(e) => props.hoverOffCountry(e, regions[region], country.name)}
                          className="btn nav-link countryname btn-sm bg-info mb-1"
                        >
                          <strong>{country.name}</strong>
                          <FontAwesomeIcon size="2x" color="white" icon={faInfoCircle} />
                        </button>
                      </Link>
                    </div>
                  </li>
                ))}
                {regions[region] && regions[region].open && (regions[region].visible < regions[region].countries.length)
                && (
                  <div className="btn-group countryactions">
                    <button
                      type="button"
                      onClick={(e) => sidebarDataHandling(e, region, 5, 0)}
                      className="btn load-more nav-link btn-sm bg-secondary mb-1"
                    >
                      Load More
                    </button>
                    <button
                      type="button"
                      onClick={(e) => sidebarDataHandling(e, region, -5, -5)}
                      className="btn load-more nav-link btn-sm bg-warning mb-1"
                    >
                      Previous
                      {regions[region].visible - regions[region].start}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => sidebarDataHandling(e, region, 5, 5)}
                      className="btn load-more nav-link btn-sm bg-success mb-1"
                    >
                      Next
                      {regions[region].visible - regions[region].start}
                    </button>
                  </div>
                )}
              </ul>
            </Collapse>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Sidebar;