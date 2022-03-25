/* eslint-disable linebreak-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable no-mixed-operators */
import React, { useState } from 'react';
import { BreakpointProvider } from 'react-socks';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {
  dataType,
} from '../../helpers/Types/index';
import Sidebar from './Sidebar';
import '../../App.css';


const SideCountry = (props) => {
  const [sidebar, setSidebar] = useState('Show');

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
    filterCountryByName,
  } = props;


  const viewSidebar = () => {
    if (sidebar === 'Show') {
      setSidebar('Hide');
    } else {
      setSidebar('Show');
    }
  };

  return (
    <BreakpointProvider>
      <nav className="countriesnav">
        <button
          type="button"
          className="btn btn-sm btn-block btn-outline-secondary mb-3"
          onClick={() => viewSidebar()}
        >
          { (sidebar === 'Hide') ? 'Show ' : 'Hide '}
          Countries List
        </button>
        {sidebar === 'Show'
          ? (loadingState ? (
            <div className="mx-auto text-center">
              <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
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
          )) : null}
      </nav>
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
  hoverOffCountry: PropTypes.func.isRequired,
};
export default SideCountry;
