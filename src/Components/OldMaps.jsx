import React, { Component, useRef, useEffect } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Flag from 'react-flags';
import { faPlus, faMinus, faGlobeAfrica } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import data from '../Data/world-50m.json';

class Maps extends Component {
  state = {
    zoom: 1,
    countries: [],
    regions: [],
  }

  handleZoomIn = () => {
    this.setState((prevState) => ({ zoom: prevState.zoom * 2 }));
  }

  handleZoomOut = () => {
    this.setState((prevState) => ({ zoom: prevState.zoom / 2 }));
  }

  handleContent = (dataTip) => {
    ReactTooltip.rebuild();
    if (!dataTip) {
      return '';
    }
    const obj = JSON.parse(dataTip);
    return obj.NAME ? (
      <div>
        <strong>{obj.NAME}</strong>
        {' '}
        <br />
        <Flag
          className="mapFlag text-center"
          name={(obj.ISO_A3 ? obj.ISO_A3 : '_unknown') ? obj.ISO_A3 : `_${obj.NAME}`}
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
    const mapCountries = [...(document.getElementsByClassName('country'))];
    const totalMapRegions = mapCountries.map((a) => a.dataset.subregion.replace(/;/g, ''));
    let uniqueMapRegions = totalMapRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueMapRegions = uniqueMapRegions.filter(Boolean);
    this.setState({
      countries: mapCountries,
      regions: uniqueMapRegions,
    });
  }

  componentDidMount(prevState) {
    if (prevState !== this.state) {
      this.getMapNations();
      this.setDynamicRegions(this.state.regions);
    }
  }

  componentDidUpdate(prevProps) {
    // only update chart if the data has changed
    if (prevProps.uniqueRegions !== this.props.uniqueRegions && this.props.uniqueRegions.length > 0) {
      this.setDynamicRegions(this.state.regions);
    }
  }

  removeNull(array) {
    return array
      .filter((item) =>
        item.government.capital !== undefined
        && item.government.country_name !== undefined && item.government.country_name.isoCode !== undefined
        && item.name)
      .map((item) => (Array.isArray(item) ? this.removeNull(item) : item));
  }

  getRegion = (region) => {
    const searchDB = Object.values(this.props.worldData);
    this.removeNull(searchDB);
    const nodes = [...(document.getElementsByClassName('country'))];
    const match = nodes.filter((node) => node.dataset.subregion === region);

    return match;
  }

  setDynamicRegions = (regions) => {
    if (!regions) {
        console.log('no regions');
      return;
    }
    // console.log(regions);
    const regionsState = {};

    regions.forEach((region) => {
        if (this.state[region] && this.state[region].countries[0]) {
            regionsState[region] = { visible: 5, start: 0, countries: this.state[region].countries, open: false };
        } else {
            this.getRegion(region);
            regionsState[region] = { visible: 5, start: 0, countries: this.getRegion(region), open: false };
        }
    });
    // set state here outside the foreach function
     this.setState({ ...regionsState });
  };

  handleWheel(event) {
    if (this.state.zoom < 1) {
      if (event.deltaY < 0) {
        this.setState({
          zoom: this.state.zoom * 1.1,
        });
      }
    }
    if (this.state.zoom >= 1) {
      if (event.deltaY > 0) {
      this.setState({
        zoom: this.state.zoom / 1.1,
      });
    }
    if (event.deltaY < 0) {
      this.setState({
        zoom: this.state.zoom * 1.1,
      });
    }
    }
  }

  handleClick = (e) => {
          // access to e.target here
    console.log('getting info');
    this.props.getCountryInfo(e.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/ig, ''), e.properties.ISO_A3);
    }

  render() {
      return (

        <div className="pt-3 container-fluid">
          <BreakpointProvider>
          <div className="card mr-3 mb-3">
            <Breakpoint small up>
            <div className="d-flex justify-content-between pb-3">
            <div className="btn-group">
              <button className="btn btn-info" onClick={() => this.handleZoomOut(this.state.zoom)}><FontAwesomeIcon icon={faMinus} /></button>
              <button className="btn btn-info" onClick={() => this.handleZoomIn(this.state.zoom)}><FontAwesomeIcon icon={faPlus} /></button>
            </div>
            <h2 className="text-center"><strong>Capstone Geography</strong></h2>
            <button
              className="btn btn-info"
              onClick={() => this.props.changeMapView()}
            >
              <FontAwesomeIcon icon={faGlobeAfrica} />
{ (this.props.mapVisible === 'Show') ? 'Hide' : 'Show'}
{' '}
Map
            </button>

            </div>
            </Breakpoint>
          {this.props.mapVisible === 'Show'
          ? <BlockPageScroll>
          <div
            ref={(wrapper) => (this._wrapper = wrapper)}
            onWheel={(e) => this.handleWheel(e)}

          >
          <ComposableMap
            projection="robinson"
            width={980}
            height={551}
            style={{
              width: '100%',
              height: 'auto',
            }}
            >
            <ZoomableGroup zoom={this.state.zoom}>
            <Geographies geography={data}>
              {(geos, proj) =>
                geos.map((geo, i) =>
              <Link key={i} to={`${process.env.PUBLIC_URL}/${geo.properties.NAME_LONG.toLowerCase()}`}>
                <Geography
                  onWheel={(e) => this.handleWheel(e)}
                  data-longname={geo.properties.NAME_LONG.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\s]/ig, '')}
                  data-tip={JSON.stringify(geo.properties)}
                  onMouseEnter={() => console.log(geo.properties)}
                  data-shortname={geo.properties.NAME}
                  data-continent ={geo.properties.CONTINENT}
                  data-subregion = {geo.properties.SUBREGION}
                  data-iso = {geo.properties.ISO_A3}
                  onClick={((e) => this.handleClick(e))}
                  key={geo.id + i}
                  geography={geo}
                  projection={proj}
                  className="country"
                />
              </Link>,
              )
              }
            </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          </div>
            </BlockPageScroll>
          : null }
          <ReactTooltip
            place="top"
            type="dark"
            effect="float"
            getContent={(dataTip) => this.handleContent(dataTip)}>
          </ReactTooltip>
          </div>
          </BreakpointProvider>
        </div>
      );
    }
  }

    export default Maps;
    const BlockPageScroll = ({ children }) => {
      const scrollRef = useRef(null);
      useEffect(() => {
        const scrollEl = scrollRef.current;
        scrollEl.addEventListener('wheel', stopScroll);
        return () => scrollEl.removeEventListener('wheel', stopScroll);
      }, []);
      const stopScroll = (e) => e.preventDefault();
      return <div ref={scrollRef}>{children}</div>;
    };