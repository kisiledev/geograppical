/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from './Sidebar';
import MediaQuery from 'react-responsive';
import { Button } from '@mui/material';

interface SidebarViewProps {
  data: any;
  handleSideBar: Function;
  changeView: Function;
  loadingState: boolean;
  getCountryInfo: Function;
  totalRegions: any;
  uniqueRegions: any;
  getOccurrence: any;
}
const SidebarView = (props: SidebarViewProps) => {
  const [sidebar, setSidebar] = useState('Show');
  const [loadingState, setLoadingState] = useState(true);

  const viewSidebar = () => {
    if (sidebar === 'Show') {
      setSidebar('Hide');
    } else {
      setSidebar('Show');
    }
  };

  useEffect(() => {
    setLoadingState(false);
  }, [props]);

  const show = loadingState ? (
    <div className="mx-auto text-center">
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  ) : (
    <Sidebar {...props} />
  );
  return (
    <nav className="sidebar card col-md-12 col-lg-12">
      <MediaQuery maxWidth={767}>
        <Button
          variant="contained"
          className="btn btn-sm btn-block btn-outline-secondary mb-3"
          onClick={() => viewSidebar()}
        >
          {sidebar === 'Hide' ? 'Show ' : 'Hide '}
        </Button>
        {sidebar === 'Show' ? show : null}
      </MediaQuery>
    </nav>
  );
};

export default SidebarView;
