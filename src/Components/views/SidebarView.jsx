/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from './Sidebar';

const SidebarView = (props) => {
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
    <BreakpointProvider>
      <nav className="sidebar card col-md-12 col-lg-12">
        <Breakpoint medium down>
          <button
            type="button"
            className="btn btn-sm btn-block btn-outline-secondary mb-3"
            onClick={() => viewSidebar()}
          >
            {sidebar === 'Hide' ? 'Show ' : 'Hide '}
          </button>
          {sidebar === 'Show' ? show : null}
        </Breakpoint>
      </nav>
    </BreakpointProvider>
  );
};

export default SidebarView;
