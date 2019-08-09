import React, {Component} from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Graticule,
    Geography,
  } from 'react-simple-maps';
import { Link } from 'react-router-dom';
  import data from '../Data/world-50m.json';
  import ReactTooltip from 'react-tooltip';
  import Flag from 'react-flags';
  import { faPlus, faMinus, faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breakpoint, { BreakpointProvider } from 'react-socks';

class Maps extends Component {
  state = {
    zoom: 1,
    countries: [],
    regions: []
  }
  handleZoomIn = () => {
    this.setState(prevState => ({zoom: prevState.zoom * 2}))
  }
  handleZoomOut = () => {
    this.setState(prevState => ({zoom: prevState.zoom / 2}))
  }
  handleContent = dataTip => {
    ReactTooltip.rebuild();
    if (!dataTip) {
      return "";
    }
    const obj = JSON.parse(dataTip)
    

    return obj.NAME ? (
      <div>
        <strong>{obj.NAME}</strong> <br />
        <Flag
                  className="mapFlag text-center"
                  name={(obj.ISO_A3 ? obj.ISO_A3 : "_unknown") ? obj.ISO_A3 : `_${obj.NAME}`}
                  format="svg"
                  pngSize={64}
                  shiny={false}
                  alt={`${obj.NAME}'s Flag`}
                  basePath="/img/flags"
                />
      </div>
    ) : null;
  };
  getMapNations = () => {
    const mapCountries = [...(document.getElementsByClassName("country"))];
    const totalMapRegions = mapCountries.map(a => a.dataset.subregion.replace(/;/g, ""));
    let uniqueMapRegions = totalMapRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueMapRegions = uniqueMapRegions.filter(Boolean);
    this.setState({
      countries: mapCountries,
      regions: uniqueMapRegions
    })
  }
  
  getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
  }

  componentDidMount(prevState){
    if(prevState !== this.state){
      this.getMapNations();
      this.setDynamicRegions(this.state.regions)
    };
  }
  componentDidUpdate(prevProps) {
    // only update chart if the data has changed
    if (prevProps.uniqueRegions !== this.props.uniqueRegions && this.props.uniqueRegions.length > 0) {
      this.setDynamicRegions(this.state.regions)
    }
  };
  removeNull(array){
    return array
      .filter(item => 
        item.government.capital !== undefined && 
        item.government.country_name !==undefined && 
        item.name)
      .map(item => Array.isArray(item) ? this.removeNull(item) : item);
  }

  getRegion = (region) => {
    let searchDB = Object.values(this.props.worldData);
    this.removeNull(searchDB);
    let nodes = [...(document.getElementsByClassName("country"))];
    let match = nodes.filter(node => node.dataset.subregion === region);
    
    return match;
  }

  setDynamicRegions = regions => {
    console.log(this.totalMapRegions);
        console.log(this.uniqueMapRegions)
    if (!regions) {
        console.log('no regions')
      return;
    }
    // console.log(regions);
    const regionsState = {};
  
    regions.forEach((region) => {
        if(this.state[region] && this.state[region].countries[0]){
            regionsState[region] = { visible: 5, start: 0, countries: this.state[region].countries, open: false};
        } else {
            this.getRegion(region);
            regionsState[region] = { visible: 5, start: 0, countries: this.getRegion(region), open: false};
        }
    });
    // set state here outside the foreach function
     this.setState({...regionsState})
  };
  handleClick = (e) => {
          // access to e.target here
    console.log(e.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, ''))
    this.props.getCountryInfo(e.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, ''))
    }

  render(){
      return(
        <BreakpointProvider>
        <div className="card mr-3 mb-3">
          <Breakpoint small up>
          <div className="d-flex justify-content-between">
          <div className="btn-group d-inline">
            <button className="btn btn-info" onClick={() => this.handleZoomOut(this.state.zoom) }><FontAwesomeIcon icon={faMinus}/></button>
            <button className="btn btn-info" onClick={() => this.handleZoomIn(this.state.zoom) }><FontAwesomeIcon icon={faPlus}/></button>
          </div>
          <h2 className="text-center"><strong>Capstone Geography</strong></h2>
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
            <Graticule />
          <Geographies  geography={data}>
            {(geos, proj) =>
              geos.map((geo, i) =>
            <Link key={i} to={`${process.env.PUBLIC_URL}/${geo.properties.NAME.toLowerCase()}`}>
              <Geography
                data-longname={geo.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '')}
                data-tip={JSON.stringify(geo.properties)}
                data-shortname={geo.properties.NAME}
                data-continent ={geo.properties.CONTINENT}
                data-subregion = {geo.properties.SUBREGION}
                onClick={((e) => this.handleClick(e))}
                key={geo.id + i}
                geography={geo}
                projection={proj}
                className="country"   
              />
              </Link>
            )
            }
          </ Geographies>
          </ZoomableGroup>
        </ComposableMap>
        : null }
        <ReactTooltip 
          place="top" 
          type="dark" 
          effect="float"
          getContent={(dataTip) => this.handleContent(dataTip)}>
        </ReactTooltip>
        </div>
        </BreakpointProvider>
      )
    }
  }

    export default Maps;