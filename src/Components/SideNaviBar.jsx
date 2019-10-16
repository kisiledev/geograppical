import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Collapse } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes, { shape } from 'prop-types';
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
    history,
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

  const expandLinks = (type) => {
    if (!user) {
      history.push('/login');
    }
    setExpanded(!expanded);
    if (type) {
      handleData(type);
    }
  };
  const closeNav = () => {
    setExpanded(false);
  };
  // const logout = () => {
  //     auth.signOut()
  //     return <Redirect to="/" />
  // }
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
        <Nav>
          <Nav.Link href={ROUTES.ACCOUNT} title="Account" onMouseEnter={() => expandLinks()} onMouseLeave={() => expandLinks()} className="navbarlink">
            Account
            {' '}
            {user && <FontAwesomeIcon className="ml-1 align-middle" icon={!expanded ? faAngleDown : faAngleUp} />}
          </Nav.Link>
        </Nav>
        {user && (
          <Collapse in={expanded}>
            <Nav onSelect={closeNav}>
              <Nav.Link onSelect={closeNav} className="sublinks" onClick={() => expandLinks('favorites')}>Favorites</Nav.Link>
              <Nav.Link onSelect={closeNav} className="sublinks" onClick={() => expandLinks('scores')}>Scores</Nav.Link>
              <Nav.Link onSelect={closeNav} href={ROUTES.EDIT} className="sublinks">Edit</Nav.Link>
            </Nav>
          </Collapse>
        )}
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
  history: shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(SideNaviBar);
