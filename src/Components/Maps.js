import React, {Component} from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
  } from 'react-simple-maps';
  import data from '../Data/world-110m.json';
  import ReactTooltip from 'react-tooltip';
  import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        console.log(e.properties.NAME_LONG)
        this.props.getCountryInfo(e.properties.NAME_LONG)
    }
        return(
            <div className="mr-md-3 card mb-3">
              <div className="btn-group">
                <button className="btn btn-info" onClick={() => this.handleZoomOut() }><FontAwesomeIcon icon={faMinus}/></button>
                <button className="btn btn-info" onClick={() => this.handleZoomIn() }><FontAwesomeIcon icon={faPlus}/></button>
              </div>
              {this.props.countries[0] === undefined ? 
              <h5 className="text-center mb-3">Welcome to the Geography App</h5>
           : null }
            <hr />
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
                  <Geography
                    data-longname={geography.properties.NAME_LONG}
                    data-tip={geography.properties.NAME_LONG}
                    data-shortname={geography.properties.NAME}
                    onClick={((e) => handleClick(e))}
                    key={i}
                    geography={geography}
                    projection={projection}
                    className="country"       
                  />
                )
                }
              </ Geographies>
              </ZoomableGroup>
            </ComposableMap>
            <ReactTooltip place="top" type="dark" effect="float" />
            </div>
        )
      }
    }

    export default Maps;