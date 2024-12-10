import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link as RouterLink, Drawer, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { dataType } from '../../helpers/types/index';
import SideCountry from './SideCountry';
import * as ROUTES from '../../constants/Routes';

const SideNaviBar = (props) => {
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [totalRegions, setTotalRegions] = useState([]);
  const {
    loadingState,
    data,
    changeView,
    getCountryInfo,
    handleSideBar,
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
      <RouterLink sx={navLinks} href={ROUTES.HOME} underline="none">
        Learn
      </RouterLink>
      <RouterLink sx={navLinks} href={ROUTES.PLAY} underline="none">
        Play
      </RouterLink>
      <RouterLink sx={navLinks} href={ROUTES.ACCOUNT} underline="none">
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
        filterCountryByName={filterCountryByName}
      />
    </Drawer>
  );
};
SideNaviBar.propTypes = {
  loadingState: PropTypes.bool.isRequired,
  data: dataType.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  handleSideBar: PropTypes.func.isRequired,
  filterCountryByName: PropTypes.func.isRequired
};

export default withRouter(SideNaviBar);
