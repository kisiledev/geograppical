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
import { dataType } from '../../Helpers/Types/index';
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
    hoverOffCountry,
    hoverOffRegion,
    hoverOnCountry,
    hoverOnRegion,
    filterCountryByName
  } = props;

  const theme = useTheme();
  const toggleSidebar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <BreakpointProvider>
      <List sx={{ padding: '20px' }}>
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
              hoverOffRegion={hoverOffRegion}
              hoverOnRegion={hoverOnRegion}
              filterCountryByName={filterCountryByName}
              hoverOnCountry={hoverOnCountry}
              hoverOffCountry={hoverOffCountry}
            />
          )
        ) : null}
      </List>
    </BreakpointProvider>
  );
};

SideCountry.propTypes = {
  data: dataType.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  loadingState: PropTypes.bool.isRequired,
  changeView: PropTypes.func.isRequired,
  totalRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniqueRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSideBar: PropTypes.func.isRequired,
  getOccurrence: PropTypes.func.isRequired,
  hoverOffRegion: PropTypes.func.isRequired,
  hoverOnRegion: PropTypes.func.isRequired,
  filterCountryByName: PropTypes.func.isRequired,
  hoverOnCountry: PropTypes.func.isRequired,
  hoverOffCountry: PropTypes.func.isRequired
};
export default SideCountry;
