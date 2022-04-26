import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import {
  Link as RouterLink,
  Drawer,
  Typography,
  Collapse
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { dataType, userType } from '../../Helpers/Types/index';
import SideCountry from './SideCountry';
import * as ROUTES from '../../Constants/Routes';

const SideNaviBar = (props) => {
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [totalRegions, setTotalRegions] = useState([]);
  const {
    loadingState,
    data,
    changeView,
    getCountryInfo,
    handleSideBar,
    hoverOffCountry,
    hoverOffRegion,
    hoverOnCountry,
    hoverOnRegion,
    filterCountryByName
  } = props;

  const navLinks = {
    color: 'hsla(0,0%,100%,.5)',
    '&:hover': {
      color: 'hsla(0,0%,100%,.75)'
    },
    padding: '1rem'
  };
  const drawerWidth = 275;

  const theme = useTheme();
  const getRegions = () => {
    if (data) {
      setTotalRegions(data.map((a) => a.geography.map_references));
    }
  };
  function getOccurrence(array, value) {
    return array.filter((v) => v === value).length;
  }
  const getUniqueRegions = (totRegs) => {
    setUniqueRegions(
      totRegs.filter((v, i, a) => a.indexOf(v) === i).filter(Boolean)
    );
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
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          textAlign: 'center',
          backgroundColor: '#343a40',
          '& ::webkit-scrollbar-thumb': {
            backgroundColor: 'transparent'
          }
        }
      }}
      variant="permanent"
      open
    >
      <Typography
        sx={{
          padding: '10px',
          textDecoration: 'none',
          lineHeight: '62px',
          color: '#fff',
          fontFamily: theme.typography.fontFamily
        }}
        variant="h5"
        component={Link}
        to="/"
      >
        Geograppical
      </Typography>
      <RouterLink sx={navLinks} href="/" underline="none">
        Learn
      </RouterLink>
      <RouterLink sx={navLinks} href="/play" underline="none">
        Play
      </RouterLink>
      <RouterLink href={ROUTES.ACCOUNT} underline="none" sx={navLinks}>
        Account
      </RouterLink>
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
    </Drawer>
  );
};
SideNaviBar.defaultProps = {
  user: null
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
  hoverOffCountry: PropTypes.func.isRequired
};

export default withRouter(SideNaviBar);
