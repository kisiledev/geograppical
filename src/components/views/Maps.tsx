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
import Flag from 'react-world-flags';
import {
  faPlus,
  faMinus,
  faGlobeAfrica
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PropTypes from 'prop-types';
import { Button, ButtonGroup, Card, Grid2 } from '@mui/material';
import data from '../../data/world-50m.json';
import { DataType } from '../../helpers/types';
import MediaQuery from 'react-responsive';

interface MapsProps {
  mapVisible: string;
  changeMapView: () => void;
  worldData: DataType;
  getCountryInfo: (country: string) => void;
}
const Maps = (props: MapsProps) => {
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(1);
  // const [bypassClick, setBypassClick] = useState(false);

  const { mapVisible, changeMapView, worldData, getCountryInfo } = props;

  const proj = d3
    .geoEqualEarth()
    .translate([800 / 2, 400 / 2])
    .scale(150);

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 2);
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 2);
  };

  const handleClick = (e: React.MouseEvent, country: string) => {
    getCountryInfo(country);
  };
  const handleMoveStart = ({
    coordinates
  }: {
    coordinates: [number, number];
  }) => {
    setCenter(coordinates);
  };

  const handleMoveEnd = ({
    coordinates
  }: {
    coordinates: [number, number];
  }) => {
    setCenter(coordinates);
    // setBypassClick(JSON.stringify(newCenter) !== JSON.stringify(center));
  };
  const handleWheel = (event: React.WheelEvent) => {
    const oldZoom = zoom;
    const zoomDirectionFactor = event.deltaY > 0 ? 1 : -1;

    // Set new zoom level
    const newZoom = oldZoom + zoomDirectionFactor;
    // Ignore nonsens
    if (newZoom > 10 || newZoom < 1) {
      return null;
    }
    setZoom(newZoom);
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
  const handleContent = (dataTip: string) => {
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
          code={
            (obj.ISO_A3 ? obj.ISO_A3 : '_unknown') ? obj.ISO_A3 : `_${obj.NAME}`
          }
          alt={`${obj.NAME}'s Flag`}
        />
      </div>
    ) : null;
  };

  return (
    <div className="pt-3 container-fluid">
      <Card
        sx={{
          margin: 5,
          padding: '15px',
          boxShadow:
            '0 5px 15px 0 rgba(37, 97, 52, 0.15), 0 2px 4px 0 rgba(93, 148, 100, 0.2)'
        }}
        className="card mr-3 mb-3"
      >
        <MediaQuery minWidth={576}>
          <Grid2
            container
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexDirection: 'row',
              height: '100%'
            }}
          >
            <ButtonGroup
              variant="contained"
              size="small"
              sx={{ height: '48px' }}
            >
              <Button
                variant="contained"
                className="btn btn-info"
                size="small"
                onClick={() => handleZoomOut()}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <Button
                type="button"
                className="btn btn-info"
                size="small"
                onClick={() => handleZoomIn()}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </ButtonGroup>
            <h2 className="text-center">
              <strong>Capstone Geography</strong>
            </h2>
            <Button
              variant="contained"
              sx={{ height: '48px' }}
              onClick={() => changeMapView()}
              startIcon={
                <FontAwesomeIcon className="mr-1" icon={faGlobeAfrica} />
              }
            >
              {`${mapVisible === 'Show' ? 'Hide' : 'Show'} Map`}
            </Button>
          </Grid2>
        </MediaQuery>
        {mapVisible === 'Show' ? (
          <ComposableMap
            projection="geoEqualEarth"
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
              onMoveStart={handleMoveStart}
              onMoveEnd={handleMoveEnd}
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
                        data-longname={geo.properties.NAME_LONG.normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z\s]/gi, '')}
                        data-tip={JSON.stringify(geo.properties)}
                        data-shortname={geo.properties.NAME}
                        data-continent={geo.properties.CONTINENT}
                        data-subregion={geo.properties.SUBREGION}
                        data-iso={geo.properties.ISO_A3}
                        onClick={(e) => handleClick(e, geo.properties.ISO_A3)}
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
      </Card>
    </div>
  );
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
