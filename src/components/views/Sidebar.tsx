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
import {
  Button,
  ButtonGroup,
  Collapse,
  List,
  ListItemButton,
  Typography
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { simplifyString } from '../../helpers/utils';
import { changeView } from '../../redux-toolkit';
import { DataType } from '../../helpers/types';
import { CountryType } from '../../helpers/types/CountryType';
import { useSelector } from '../../redux-hooks';

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

interface RegionsType {
  [key: string]: RegionDataType;
}
interface RegionDataType {
  visible: number;
  start: number;
  countries: CountryType[];
  open: boolean;
}

interface SidebarProps {
  data: DataType;
  getCountryInfo: Function;
  totalRegions: string[];
  uniqueRegions: string[];
  getOccurrence: Function;
}
const Sidebar = (props: SidebarProps) => {
  const [regions, setRegions] = useState<RegionsType>({});
  const view = useSelector((state) => state.view.value);
  const { data, getCountryInfo, totalRegions, uniqueRegions, getOccurrence } =
    props;

  const hoverCountry = (
    e: React.FocusEvent | React.MouseEvent,
    direction: string,
    country: string
  ) => {
    const on = direction === 'on';
    e.stopPropagation();
    let nodes = [
      ...(document.getElementsByClassName(
        'gameCountry'
      ) as HTMLCollectionOf<HTMLElement>)
    ];
    nodes = nodes.filter((y) => {
      if (y.dataset.longname && y.dataset.shortname) {
        return (
          simplifyString(country) === simplifyString(y.dataset.longname) ||
          simplifyString(country) === simplifyString(y.dataset.shortname)
        );
      }
    });
    nodes.forEach((node) => {
      if (!on) {
        node.removeAttribute('style');
      }
      node.style.fill = on ? '#ee0a43' : '#024e1b';
      node.style.stroke = '#111';
      node.style.strokeWidth = '0.1';
      node.style.outline = 'none';
      node.style.willChange = 'all';
    });
  };

  const hoverRegion = (
    e: React.FocusEvent | React.MouseEvent,
    direction: string,
    region: string
  ) => {
    const on = direction === 'on';
    e.stopPropagation();
    let nodes = [
      ...(document.getElementsByClassName(
        'gameCountry'
      ) as HTMLCollectionOf<HTMLElement>)
    ];
    const countries = regions[region].countries;
    const svgs = countries.map((country) => simplifyString(country.name));
    nodes = nodes.filter((y) => {
      if (y.dataset.longname && y.dataset.shortname) {
        return (
          svgs.includes(simplifyString(y.dataset.longname)) ||
          svgs.includes(simplifyString(y.dataset.shortname))
        );
      }
    });
    nodes.forEach((node) => {
      if (!on) {
        node.removeAttribute('style');
      } else {
        node.style.fill = '#024e1b';
        node.style.stroke = '#111';
        node.style.strokeWidth = '0.1';
        node.style.outline = 'none';
        node.style.willChange = 'all';
      }
    });
  };
  const removeNull = (array: CountryType[]) => {
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

  const getRegion = (region: string) => {
    const searchDB = Object.values(data);
    removeNull(searchDB);
    const match = searchDB.filter(
      (place) => place.geography.map_references === region
    );
    return match;
  };

  const setDynamicRegions = (reg: string[]) => {
    if (!reg) {
      return;
    }
    const regionsState: RegionsType = {};
    reg.forEach((region: string) => {
      const countries = getRegion(region);
      regionsState[region] = {
        visible: 5,
        start: 0,
        countries,
        open: false
      };
    });
    setRegions({ ...regionsState });
  };
  const updateOpen = (region: string) => {
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

  const sidebarDataHandling = (
    event: React.MouseEvent,
    region: string,
    change: number,
    start: number
  ) => {
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

  const handleRegion = (e: React.MouseEvent, region: string) => {
    e.stopPropagation();
    updateOpen(region);
  };

  useEffect(() => {
    setDynamicRegions(uniqueRegions);
  }, []);

  useEffect(() => {
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
              onFocus={(e) => hoverRegion(e, 'on', region)}
              onMouseOver={(e) => hoverRegion(e, 'on', region)}
              onMouseLeave={(e) => hoverRegion(e, 'off', region)}
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
              <Typography>
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
                    .map((country: CountryType) => (
                      <ListItemButton
                        component={RouterLink}
                        to={`/${country.name.toLowerCase()}`}
                        key={country.name}
                        onFocus={(e) => hoverCountry(e, 'on', country.name)}
                        onClick={(e) =>
                          getCountryInfo(
                            e,
                            country.name,
                            country.government.capital.name
                          )
                        }
                        onMouseOver={(e) => hoverCountry(e, 'on', country.name)}
                        onMouseLeave={(e) =>
                          hoverCountry(e, 'off', country.name)
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
export default Sidebar;
