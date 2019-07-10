import React, {useState} from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
  } from 'react-simple-maps';
import { Link } from 'react-router-dom';
  import data from '../Data/world-110m.json';
  import ReactTooltip from 'react-tooltip';
  import { faPlus, faMinus, faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breakpoint, { BreakpointProvider } from 'react-socks';

const Maps = (props) => {
  const [zoom, setZoom] = useState(1)

  const handleZoomIn = (zoom) => {
    setZoom(zoom * 2)
  }
  const handleZoomOut = (zoom) => {
    setZoom(zoom/2)
  }
  const handleClick = (e) => {
        // access to e.target here
  console.log(e.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, ''))
  props.getCountryInfo(e.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, ''))
  }
        return(
            <BreakpointProvider>
            <div className="card mr-3 mb-3">
              <Breakpoint small up>
              <div className="d-flex justify-content-between">
              <div className="btn-group d-inline">
                <button className="btn btn-info" onClick={() => handleZoomOut(zoom) }><FontAwesomeIcon icon={faMinus}/></button>
                <button className="btn btn-info" onClick={() => handleZoomIn(zoom) }><FontAwesomeIcon icon={faPlus}/></button>
              </div>
              <h2 className="text-center"><strong>Capstone Geography</strong></h2>
              <button 
                className="btn btn-info" 
                onClick={() => props.mapView() }
              >
                <FontAwesomeIcon icon={faGlobeAfrica}/>{ (props.mapVisible === "Show") ? "Hide" : "Show"} Map
              </button>

              </div>
              </Breakpoint>
            <hr />
            {props.mapVisible === "Show" ?
            <ComposableMap 
              projection="robinson"
              width={980}
              height={551}
              style={{
                width: "100%",
                height: "auto",
              }}  
              >
              <ZoomableGroup zoom={zoom}>
              <Geographies  geography={data}>
                {(geographies, projection) =>
                  geographies.map((geography, i) =>
                <Link key={i} to={`${process.env.PUBLIC_URL}/${geography.properties.NAME.toLowerCase()}`}>
                  <Geography
                    data-longname={geography.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '')}
                    data-tip={geography.properties.NAME}
                    data-shortname={geography.properties.NAME}
                    onClick={((e) => handleClick(e))}
                    key={i}
                    geography={geography}
                    projection={projection}
                    className="country"       
                  />
                  </Link>
                )
                }
              </ Geographies>
              </ZoomableGroup>
            </ComposableMap>
            : null }
            <ReactTooltip place="top" type="dark" effect="float" />
            </div>
            </BreakpointProvider>
        )
      }

    export default Maps;