/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import Flag from 'react-flags';
import {
  faPlus,
  faMinus,
  faGlobeAfrica
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import PropTypes from 'prop-types';
import { dataType } from '../../Helpers/Types/index';
import data from '../../Data/world-50m.json';

const Maps = (props) => {
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [regions, setRegions] = useState('');
  const [continents, setContinents] = useState('');
  const [countries, setCountries] = useState('');
  // const [bypassClick, setBypassClick] = useState(false);

  const { mapVisible, changeMapView, worldData, getCountryInfo } = props;

  const proj = d3
    .geoEqualEarth()
    .translate([800 / 2, 400 / 2])
    .scale(150);

  const getMapNations = () => {
    const mapCountries = [...document.getElementsByClassName('country')];
    const totalMapRegions = mapCountries.map((a) =>
      a.dataset.subregion.replace(/;/g, '')
    );
    let uniqueMapRegions = totalMapRegions.filter(
      (v, i, a) => a.indexOf(v) === i
    );
    uniqueMapRegions = uniqueMapRegions.filter(Boolean);
    const totalMapContinents = mapCountries.map((a) =>
      a.dataset.continent.replace(/;/g, '')
    );
    let uniqueMapContinents = totalMapContinents.filter(
      (v, i, a) => a.indexOf(v) === i
    );
    uniqueMapContinents = uniqueMapContinents.filter(Boolean);
    setCountries(mapCountries);
    setRegions(uniqueMapRegions);
    setContinents(uniqueMapContinents);
  };

  const getRegion = (region) => {
    const nodes = [...document.getElementsByClassName('country')];
    const match = nodes.filter((node) => node.dataset.subregion === region);
    return match;
  };

  const getContinent = (continent) => {
    const nodes = [...document.getElementsByClassName('country')];
    const match = nodes.filter((node) => node.dataset.continent === continent);
    return match;
  };

  const setDynamicRegions = (regs) => {
    if (!regs) {
      return;
    }
    const regionsState = {};
    if (regions.length > 0) {
      regions.forEach((region) => {
        if (regions[region] && regions[region].countries[0]) {
          regionsState[region] = {
            visible: 5,
            start: 0,
            countries: regions[region].countries,
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
    }
    setRegions({ ...regionsState });
  };

  const setDynamicContinents = (conts) => {
    if (!conts) {
      return;
    }

    const continentsState = {};
    if (conts.length > 0) {
      conts.forEach((continent) => {
        if (conts[continent] && conts[continent].countries[0]) {
          continentsState[continent] = {
            id: continent,
            countries: conts[continent].countries
          };
        } else {
          getContinent(continent);
          continentsState[continent] = {
            id: continent,
            countries: getContinent(continent)
          };
        }
      });
    }
    // set state here outside the foreach function
    setContinents({ ...continentsState });
    //  setState({continents: {...continentsState}})
  };
  const setLocations = (regs, conts) => {
    setDynamicContinents(conts);
    setDynamicRegions(regs);
  };
  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 2);
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 2);
  };

  const handleClick = (e) => {
    console.log('getting info');
    getCountryInfo(
      e.properties?.NAME_LONG.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z\s]/gi, ''),
      e.properties.ISO_A3
    );
  };
  // const handleText = (str) => {
  //   return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/ig, '');
  // };
  const handleMoveStart = (newCenter) => {
    setCenter(newCenter);
    // setBypassClick(true);
  };

  const handleMoveEnd = (newCenter) => {
    setCenter(newCenter);
    // setBypassClick(JSON.stringify(newCenter) !== JSON.stringify(center));
  };
  const handleWheel = (event) => {
    const oldZoom = zoom;
    const zoomDirectionFactor = event.deltaY > 0 ? 1 : -1;

    // Set new zoom level
    const newZoom = oldZoom + zoomDirectionFactor;
    // Ignore nonsens
    if (newZoom > 10 || newZoom < 1) {
      return null;
    }
    // const cursor = getCursorLocation(event);
    // const oldCenter = center;

    // const newCenter = [
    //   oldCenter[0] +
    //     ((cursor[0] - oldCenter[0]) / newZoom) * zoomDirectionFactor,
    //   oldCenter[1] +
    //     ((cursor[1] - oldCenter[1]) / newZoom) * zoomDirectionFactor
    // ];
    // setState({zoom: newZoom, center: newCenter})
  };
  const handleContent = (dataTip) => {
    ReactTooltip.rebuild();
    if (!dataTip) {
      return '';
    }
    const obj = JSON.parse(dataTip);
    return obj.NAME ? (
      <div>
        <strong>{obj.NAME}</strong>
        <br />
        <Flag
          className="mapFlag text-center"
          name={
            (obj.ISO_A3 ? obj.ISO_A3 : '_unknown') ? obj.ISO_A3 : `_${obj.NAME}`
          }
          format="svg"
          pngSize={64}
          shiny={false}
          alt={`${obj.NAME}'s Flag`}
          basePath="/img/flags"
        />
      </div>
    ) : null;
  };

  useEffect(() => {
    setDynamicRegions(regions);
    setLocations(regions, continents);
  }, []);

  useEffect(() => {
    getMapNations();
  }, [worldData]);

  useEffect(() => {
    setLocations(regions, continents);
  }, [countries]);

  return (
    <div className="pt-3 container-fluid">
      <BreakpointProvider>
        <div className="card mr-3 mb-3">
          <Breakpoint small up>
            <div className="d-flex justify-content-between pb-3">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => handleZoomOut(zoom)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => handleZoomIn(zoom)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <h2 className="text-center">
                <strong>Capstone Geography</strong>
              </h2>
              <button
                type="button"
                className="btn btn-info"
                onClick={() => changeMapView()}
              >
                <FontAwesomeIcon className="mr-1" icon={faGlobeAfrica} />
                {mapVisible === 'Show' ? 'Hide' : 'Show'}
                Map
              </button>
            </div>
          </Breakpoint>
          {mapVisible === 'Show' ? (
            <ComposableMap
              projection={proj}
              width={800}
              height={400}
              style={{
                width: '100%',
                height: 'auto'
              }}
            >
              <ZoomableGroup
                onWheel={handleWheel}
                zoom={zoom}
                center={center}
                // onMoveStart={handleMoveStart}
                // onMoveEnd={handleMoveEnd}
              >
                <Geographies geography={data}>
                  {({ geographies, projection }) =>
                    geographies &&
                    geographies.map((geo) => (
                      <Link
                        key={geo.properties.NAME}
                        to={`/${geo.properties.NAME_LONG.toLowerCase()}`}
                      >
                        <Geography
                          key={geo.properties.NAME}
                          onWheel={(e) => handleWheel(e)}
                          data-longname={geo.properties.NAME_LONG.normalize(
                            'NFD'
                          )
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/[^a-z\s]/gi, '')}
                          data-tip={JSON.stringify(geo.properties)}
                          data-shortname={geo.properties.NAME}
                          data-continent={geo.properties.CONTINENT}
                          data-subregion={geo.properties.SUBREGION}
                          data-iso={geo.properties.ISO_A3}
                          onClick={(e) => handleClick(e)}
                          geography={geo}
                          // projection={projection}
                          className="country"
                        />
                      </Link>
                    ))
                    }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          ) : null}
          <ReactTooltip
            place="top"
            type="dark"
            effect="float"
            getContent={(dataTip) => handleContent(dataTip)}
          />
        </div>
      </BreakpointProvider>
    </div>
  );
};

Maps.propTypes = {
  worldData: dataType.isRequired,
  mapVisible: PropTypes.string.isRequired,
  changeMapView: PropTypes.func.isRequired,
  getCountryInfo: PropTypes.func.isRequired
};
export default Maps;
// const BlockPageScroll = ({ children }) => {
//   console.log(children)
//   const stopScroll = (e) => e.preventDefault();
//   const scrollRef = useRef(null);
//   useEffect(() => {
//     const scrollEl = scrollRef.current;
//     scrollEl.addEventListener('wheel', stopScroll);
//     return () => scrollEl.removeEventListener('wheel', stopScroll);
//   }, []);
//   return <div ref={scrollRef}>{children}</div>;
// };
