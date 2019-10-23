import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Collapse } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import {
  dataType,
  userType,
} from '../Helpers/Types/index';
import SideCountry from './SideCountry';
import * as ROUTES from '../Constants/Routes';


const SideNaviBar = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [totalRegions, setTotalRegions] = useState([]);

  const {
    loadingState,
    user,
    handleData,
    data,
    changeView,
    getCountryInfo,
    handleSideBar,
    hoverOffCountry,
    hoverOffRegion,
    hoverOnCountry,
    hoverOnRegion,
    filterCountryByName,
  } = props;

  const expandLinks = (e, type) => {
    if (e && type) {
      e.persist();
      handleData(type);
      setExpanded(false);
    } else {
      setExpanded(!expanded);
      e.stopPropagation();
    }
  };
  const getRegions = () => {
    if (data) {
      setTotalRegions(data.map((a) => a.geography.map_references));
    }
  };
  function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
  }
  const getUniqueRegions = (totRegs) => {
    setUniqueRegions(totRegs.filter((v, i, a) => a.indexOf(v) === i).filter(Boolean));
  };

  useEffect(() => {
    getRegions();
  }, [data]);

  useEffect(() => {
    if (totalRegions.length > 0) {
      getUniqueRegions(totalRegions);
    }
  }, [totalRegions]);

  return (
    <Navbar className="flex-column sidenav" bg="dark" variant="dark">
      <Navbar.Brand href="/">Geograppical</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Nav>
        <Nav.Link className="navbarlink" href="/">Home</Nav.Link>
        <Nav.Link className="navbarlink" href="/play">Games</Nav.Link>
        <Nav
          onMouseEnter={(e) => expandLinks(e)}
          onMouseLeave={(e) => expandLinks(e)}
          onFocus={(e) => expandLinks(e)}
          onBlur={(e) => expandLinks(e)}
        >
          <Nav.Link href={ROUTES.ACCOUNT} title="Account" className="navbarlink">
            Account
            {' '}
            {user && <FontAwesomeIcon className="ml-1 align-middle" icon={!expanded ? faAngleDown : faAngleUp} />}
          </Nav.Link>
          {user && (
          <Collapse in={expanded}>
            <Nav>
              <Nav.Link className="sublinks" onClick={(e) => expandLinks(e, 'favorites')}>Favorites</Nav.Link>
              <Nav.Link className="sublinks" onClick={(e) => expandLinks(e, 'scores')}>Scores</Nav.Link>
              <Nav.Link href={ROUTES.EDIT} className="sublinks">Edit</Nav.Link>
            </Nav>
          </Collapse>
          )}
        </Nav>
      </Nav>
      <SideCountry
        loadingState={loadingState}
        data={data}
        changeView={changeView}
        totalRegions={totalRegions}
        uniqueRegions={uniqueRegions}
        getOccurrence={getOccurrence}
        getCountryInfo={getCountryInfo}
        handleSideBar={handleSideBar}
        hoverOffRegion={hoverOffRegion}
        hoverOnRegion={hoverOnRegion}
        filterCountryByName={filterCountryByName}
        hoverOnCountry={hoverOnCountry}
        hoverOffCountry={hoverOffCountry}
      />
    </Navbar>

  );
};
SideNaviBar.defaultProps = {
  user: null,
};
SideNaviBar.propTypes = {
  loadingState: PropTypes.bool.isRequired,
  data: dataType.isRequired,
  user: userType,
  getCountryInfo: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  handleSideBar: PropTypes.func.isRequired,
  handleData: PropTypes.func.isRequired,
  hoverOffRegion: PropTypes.func.isRequired,
  hoverOnRegion: PropTypes.func.isRequired,
  filterCountryByName: PropTypes.func.isRequired,
  hoverOnCountry: PropTypes.func.isRequired,
  hoverOffCountry: PropTypes.func.isRequired,
};

export default withRouter(SideNaviBar);
