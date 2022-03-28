/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Collapse, Drawer, List, ListItem } from '@mui/material';
import { dataType } from '../../Helpers/Types/index';
import '../../App.css';

const Sidebar = (props) => {
  const [regions, setRegions] = useState('');

  const {
    data,
    getCountryInfo,
    totalRegions,
    uniqueRegions,
    getOccurrence,
    hoverOffRegion,
    hoverOnRegion,
    hoverOnCountry,
    hoverOffCountry
  } = props;
  const removeNull = (array) => {
    array
      .filter(
        (item) =>
          item.government.capital !== undefined &&
          item.government.country_name !== undefined &&
          item.government.country_name.isoCode !== undefined &&
          item.name
      )
      .map((item) => (Array.isArray(item) ? removeNull(item) : item));
  };

  const getRegion = (region) => {
    const searchDB = Object.values(data);
    removeNull(searchDB);
    const match = searchDB.filter(
      (place) => place.geography.map_references === region
    );
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
          open: false
        };
      } else {
        getRegion(region);
        regionsState[region] = {
          visible: 5,
          start: 0,
          countries: getRegion(region),
          open: false
        };
      }
    });
    // console.log(regionsState);
    setRegions({ ...regionsState });
    // console.log(regions)
  };
  const updateOpen = (region) => {
    const open = {
      visible: 5,
      start: 0,
      countries: regions[region].countries,
      open: !regions[region].open
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
      countries: regions[region].countries
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
    setDynamicRegions(uniqueRegions);
  }, []);

  useEffect(() => {
    // console.log(regions)
    // console.log(uniqueRegions)
  }, [regions]);

  useEffect(() => {
    // console.log(uniqueRegions);
    setDynamicRegions(uniqueRegions);
  }, [uniqueRegions]);

  console.log(uniqueRegions);
  return (
    <List>
      {uniqueRegions &&
        uniqueRegions.map((region) => (
          <ListItem
            className="nav-item regionlist"
            key={region}
            onClick={(e) => handleRegion(e, region)}
            onFocus={(e) => hoverOnRegion(e, regions[region])}
            onMouseOver={(e) => hoverOnRegion(e, regions[region])}
            onMouseLeave={(e) => hoverOffRegion(e, regions[region])}
          >
            <span className="nav-link btn-sm bg-success mb-1">
              <strong>{region}</strong>-{getOccurrence(totalRegions, region)}
            </span>
            <Collapse in={regions[region] && regions[region].open}>
              <List className="countryul">
                {regions[region] &&
                  regions[region].countries[0] &&
                  regions[region].countries
                    .slice(regions[region].start, regions[region].visible)
                    .map((country) => (
                      <ListItem
                        key={country.name}
                        className="nav-item countrylist"
                      >
                        <div className="btn-group d-flex">
                          <Link
                            to={`/${country.name.toLowerCase()}`}
                            className="btn-group w-100"
                          >
                            <button
                              type="button"
                              onFocus={(e) =>
                                hoverOnCountry(e, regions[region], country.name)
                              }
                              onClick={() =>
                                getCountryInfo(
                                  country.name,
                                  country.government.capital.name
                                )
                              }
                              onMouseOver={(e) =>
                                hoverOnCountry(e, regions[region], country.name)
                              }
                              onMouseLeave={(e) =>
                                hoverOffCountry(
                                  e,
                                  regions[region],
                                  country.name
                                )
                              }
                              className="btn nav-link countryname btn-sm bg-info mb-1"
                            >
                              <strong>{country.name}</strong>
                              <FontAwesomeIcon
                                size="2x"
                                color="white"
                                icon={faInfoCircle}
                              />
                            </button>
                          </Link>
                        </div>
                      </ListItem>
                    ))}
                {regions[region] &&
                  regions[region].open &&
                  regions[region].visible <
                    regions[region].countries.length && (
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
                        {`Previous  
                      ${regions[region].visible - regions[region].start}`}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => sidebarDataHandling(e, region, 5, 5)}
                        className="btn load-more nav-link btn-sm bg-success mb-1"
                      >
                        {`Next 
                      ${regions[region].visible - regions[region].start}`}
                      </button>
                    </div>
                  )}
              </List>
            </Collapse>
          </ListItem>
        ))}
    </List>
  );
};

Sidebar.propTypes = {
  data: dataType.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  totalRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniqueRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
  getOccurrence: PropTypes.func.isRequired,
  hoverOffRegion: PropTypes.func.isRequired,
  hoverOnRegion: PropTypes.func.isRequired,
  hoverOnCountry: PropTypes.func.isRequired,
  hoverOffCountry: PropTypes.func.isRequired
};
export default Sidebar;
