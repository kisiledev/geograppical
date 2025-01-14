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
import { DataType, dataType } from '../../helpers/types/index';
import Sidebar from './Sidebar';
// import '../../App.css';

interface SideCountryProps {
  data: DataType;
  loadingState: boolean;
  changeView: Function;
  uniqueRegions: string[];
  totalRegions: string[];
  getOccurrence: Function;
  getCountryInfo: Function;
  handleSideBar: Function;
  filterCountryByName: Function;
}
const SideCountry = (props: SideCountryProps) => {
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
    <List component="nav" sx={{ padding: '20px' }}>
      <Button
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
            totalRegions={totalRegions}
            uniqueRegions={uniqueRegions}
            getOccurrence={getOccurrence}
            getCountryInfo={getCountryInfo}
          />
        )
      ) : null}
    </List>
  );
};
export default SideCountry;
