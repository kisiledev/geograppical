import React, { useState, useEffect } from 'react';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from './Sidebar';
import MediaQuery from 'react-responsive';
import { Button } from '@mui/material';
import { DataType } from '../../helpers/types';

interface SidebarViewProps {
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
      <CircularProgress />
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
