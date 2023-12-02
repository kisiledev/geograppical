/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable linebreak-style */
import React, { useState, useEffect, Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Collapse,
  List,
  ListItemButton,
  Typography
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { dispatch } from 'd3';
import { changeView } from 'redux-toolkit';
import { useSelector } from 'react-redux';
import { dataType } from '../../helpers/types/index';
import { simplifyString } from '../../helpers/utils';

const useStyles = makeStyles({
  region: {
    cursor: 'pointer',
    backgroundColor: '#28a745',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: '5px',
    textDecoration: 'none',
    textTransform: 'none',
    color: 'black',
    '&:hover': {
      backgroundColor: '#067520'
    }
  },
  countryList: {
    display: 'flex',
    flexDirection: 'row',
    textDecoration: 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0dcaf0',
    borderRadius: '5px',
    marginBottom: '2px',
    '&:hover': {
      backgroundColor: '#0dcaf0'
    }
  },
  buttonStyle: {
    textTransform: 'none'
  }
});
console.log('running second');
const Sidebar = (props) => {
  const [regions, setRegions] = useState('');
  const view = useSelector((state) => state.view.value);
  const { data, getCountryInfo, totalRegions, uniqueRegions, getOccurrence } =
    props;

  const theme = useTheme();
  const classes = useStyles();

  const hoverOnCountry = (e, region, country) => {
    e.stopPropagation();
    if (view === 'detail') {
      dispatch(changeView('default'));
    }
    let nodes = document.getElementsByClassName('country');
    nodes = [...nodes];
    nodes = nodes.filter(
      (y) =>
        simplifyString(country) === simplifyString(y.dataset.longname) ||
        simplifyString(country) === simplifyString(y.dataset.shortname)
    );
    nodes.forEach((node) => {
      node.style.fill = '#ee0a43';
      node.style.stroke = '#111';
      node.style.strokeWidth = 0.1;
      node.style.outline = 'none';
      node.style.willChange = 'all';
    });
  };
  const hoverOffCountry = (e, region, country) => {
    e.stopPropagation();
    let nodes = document.getElementsByClassName('country');
    nodes = [...nodes];
    nodes = nodes.filter(
      (y) =>
        simplifyString(country) === simplifyString(y.dataset.longname) ||
        simplifyString(country) === simplifyString(y.dataset.shortname)
    );
    nodes.forEach((node) => {
      node.removeAttribute('style');
      node.style.fill = '#024e1b';
      node.style.stroke = '#111';
      node.style.strokeWidth = 0.1;
      node.style.outline = 'none';
      node.style.willChange = 'all';
    });
  };
  const hoverOnRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = region && Object.values(region)[2];
    if (typeof countries === 'object') {
      svgs = countries.map((country) => simplifyString(country.name));
    }
    let nodes = document.getElementsByClassName('country');
    nodes = [...nodes];
    nodes = nodes.filter(
      (y) =>
        svgs.includes(simplifyString(y.dataset.longname)) ||
        svgs.includes(simplifyString(y.dataset.shortname))
    );
    nodes.forEach((node) => {
      node.style.fill = '#024e1b';
      node.style.stroke = '#111';
      node.style.strokeWidth = 0.1;
      node.style.outline = 'none';
      node.style.willChange = 'all';
    });
  };
  const hoverOffRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = Object.values(region)[2];
    if (typeof countries === 'object') {
      svgs = countries.map((country) => simplifyString(country.name));
    }
    let nodes = document.getElementsByClassName('country');
    nodes = [...nodes];
    nodes = nodes.filter(
      (y) =>
        svgs.includes(simplifyString(y.dataset.longname)) ||
        svgs.includes(simplifyString(y.dataset.shortname))
    );
    nodes.forEach((node) => {
      node.removeAttribute('style');
    });
  };
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

  return (
    <List>
      {uniqueRegions &&
        uniqueRegions.map((region) => (
          <Fragment key={region}>
            <Button
              key={region}
              onClick={(e) => handleRegion(e, region)}
              onFocus={(e) => hoverOnRegion(e, regions[region])}
              onMouseOver={(e) => hoverOnRegion(e, regions[region])}
              onMouseLeave={(e) => hoverOffRegion(e, regions[region])}
              sx={{
                cursor: 'pointer',
                backgroundColor: '#28a745',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                marginBottom: '5px',
                textDecoration: 'none',
                textTransform: 'none',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#067520'
                }
              }}
            >
              <Typography sx={{ fontFamily: theme.typography.fontFamily }}>
                <strong>{region}</strong>-{getOccurrence(totalRegions, region)}
              </Typography>
            </Button>
            <Collapse
              orientation="vertical"
              in={regions[region] && regions[region].open}
            >
              <List sx={{ marginLeft: '10px' }}>
                {regions[region] &&
                  regions[region].countries[0] &&
                  regions[region].countries
                    .slice(regions[region].start, regions[region].visible)
                    .map((country) => (
                      <ListItemButton
                        LinkComponent={RouterLink}
                        to={`/${country.name.toLowerCase()}`}
                        key={country.name}
                        onFocus={(e) =>
                          hoverOnCountry(e, regions[region], country.name)
                        }
                        onClick={(e) =>
                          getCountryInfo(
                            e,
                            country.name,
                            country.government.capital.name
                          )
                        }
                        onMouseOver={(e) =>
                          hoverOnCountry(e, regions[region], country.name)
                        }
                        onMouseLeave={(e) =>
                          hoverOffCountry(e, regions[region], country.name)
                        }
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          textDecoration: 'none',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#0dcaf0',
                          borderRadius: '5px',
                          marginBottom: '5px',
                          '&:hover': {
                            backgroundColor: '#0dcaf0'
                          }
                        }}
                      >
                        <strong>{country.name}</strong>
                        <FontAwesomeIcon
                          size="lg"
                          color="white"
                          icon={faInfoCircle}
                        />
                      </ListItemButton>
                    ))}
                {regions[region] &&
                  regions[region].open &&
                  regions[region].visible <
                    regions[region].countries.length && (
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        onClick={(e) => sidebarDataHandling(e, region, 5, 0)}
                        sx={{
                          textTransform: 'none',
                          textDecoration: 'none',
                          color: 'black',
                          lineHeight: 'inherit',
                          backgroundColor: '#6c757d'
                        }}
                        disableFocusRipple
                        disableRipple
                      >
                        Load More
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => sidebarDataHandling(e, region, -5, -5)}
                        sx={{
                          textTransform: 'none',
                          textDecoration: 'none',
                          color: 'black',
                          lineHeight: 'inherit',
                          backgroundColor: '#ffc107'
                        }}
                        disableFocusRipple
                        disableRipple
                      >
                        {`Previous  
                  ${regions[region].visible - regions[region].start}`}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => sidebarDataHandling(e, region, 5, 5)}
                        sx={{
                          textTransform: 'none',
                          textDecoration: 'none',
                          color: 'black',
                          lineHeight: 'inherit',
                          backgroundColor: '#198754'
                        }}
                        disableFocusRipple
                        disableRipple
                      >
                        {`Next 
                  ${regions[region].visible - regions[region].start}`}
                      </Button>
                    </ButtonGroup>
                  )}
              </List>
            </Collapse>
          </Fragment>
        ))}
    </List>
  );
};

Sidebar.propTypes = {
  data: dataType.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  totalRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniqueRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
  getOccurrence: PropTypes.func.isRequired
};
export default Sidebar;
