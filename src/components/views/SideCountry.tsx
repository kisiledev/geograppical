import { useState } from 'react';
import {
  faEye,
  faEyeSlash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Box, Button, List } from '@mui/material';
import { DataType } from '../../helpers/types/index';
import Sidebar from './Sidebar';
// import '../../App.css';

interface SideCountryProps {
  data: DataType;
  loadingState: boolean;
  uniqueRegions: string[];
  totalRegions: string[];
  getOccurrence: (array: string[], value: string) => number;
  getCountryInfo: (country: string) => void;
  changeView: (view: string) => void;
  handleSideBar: (string: string) => void;
  filterCountryByName: (name: string) => void;
}
const SideCountry = (props: SideCountryProps) => {
  const [showSideBar, setShowSideBar] = useState(true);

  const {
    data,
    loadingState,
    uniqueRegions,
    totalRegions,
    getOccurrence,
    getCountryInfo
  } = props;

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
            <CircularProgress />
          </Box>
        ) : (
          <Sidebar
            loadingState={loadingState}
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
