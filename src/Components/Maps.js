import React, {Component} from 'react';
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

class Maps extends Component {
  state = {
    zoom: 1
  }

  handleZoomIn() {
    this.setState({
      zoom: this.state.zoom * 2,
    })
  }
  handleZoomOut() {
    this.setState({
      zoom: this.state.zoom / 2,
    })
  }
    render() {
      const handleClick = (e) => {
        // access to e.target here
        console.log(e.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, ''))
        this.props.getCountryInfo(e.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, ''))
    }
        return(
            <BreakpointProvider>
            <div className="card mr-3 mb-3">
              <Breakpoint small up>
              <div className="d-flex justify-content-between">
              <div className="btn-group d-inline">
                <button className="btn btn-info" onClick={() => this.handleZoomOut() }><FontAwesomeIcon icon={faMinus}/></button>
                <button className="btn btn-info" onClick={() => this.handleZoomIn() }><FontAwesomeIcon icon={faPlus}/></button>
              </div>
              <h5 className="text-center mb-3">Welcome to the Geography App</h5>
              <button 
                className="btn btn-info" 
                onClick={() => this.props.mapView() }
              >
                <FontAwesomeIcon icon={faGlobeAfrica}/>{ (this.props.mapVisible === "Show") ? "Hide" : "Show"} Map
              </button>

              </div>
              </Breakpoint>
            <hr />
            {this.props.mapVisible === "Show" ?
            <ComposableMap 
              projection="robinson"
              width={980}
              height={551}
              style={{
                width: "100%",
                height: "auto",
              }}
              >
              <ZoomableGroup zoom={this.state.zoom}>
              <Geographies  geography={data}>
                {(geographies, projection) =>
                  geographies.map((geography, i) =>
                  <Link to={geography.properties.NAME.toLowerCase()}>
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
    }

    export default Maps;