/* eslint-disable linebreak-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable no-mixed-operators */
import React, { useState } from 'react';
import { BreakpointProvider } from 'react-socks';
import {
  faEye,
  faEyeSlash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Box, Button, List } from '@mui/material';
import { useTheme } from '@mui/styles';
import { dataType } from '../../helpers/types/index';
import Sidebar from './Sidebar';
// import '../../App.css';

const SideCountry = (props) => {
  const [showSideBar, setShowSideBar] = useState(true);

  const {
    data,
    loadingState,
    changeView,
    uniqueRegions,
    totalRegions,
    getOccurrence,
    getCountryInfo,
    handleSideBar,
    filterCountryByName
  } = props;

  const theme = useTheme();
  const toggleSidebar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <BreakpointProvider>
      <List component="nav" sx={{ padding: '20px' }}>
        <Button
          sx={{ fontFamily: theme.typography.fontFamily }}
          variant="contained"
          color="primary"
          onClick={() => toggleSidebar()}
        >
          {showSideBar ? 'Hide ' : 'Show '}
          Countries List
          <FontAwesomeIcon
            style={{ marginLeft: '5px' }}
            icon={showSideBar ? faEyeSlash : faEye}
            size="sm"
          />
        </Button>
        {showSideBar ? (
          loadingState ? (
            <Box sx={{ margin: '0 auto', textAlign: 'center' }}>
              <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </Box>
          ) : (
            <Sidebar
              data={data}
              changeView={changeView}
              totalRegions={totalRegions}
              uniqueRegions={uniqueRegions}
              getOccurrence={getOccurrence}
              getCountryInfo={getCountryInfo}
              handleSideBar={handleSideBar}
              filterCountryByName={filterCountryByName}
            />
          )
        ) : null}
      </List>
    </BreakpointProvider>
  );
};
export default SideCountry;
