/* eslint-disable no-console */
import React, { useState } from 'react';
import { Breakpoint, BreakpointProvider } from 'react-socks';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  countryType,
  dataType,
  userType,
} from '../../helpers/Types/index';
import { db } from '../../firebase/firebase';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';
import SidebarView from './SidebarView';
import Maps from './Maps';
import Result from './Result';
import * as ROUTES from '../../constants/Routes';


const ResultView = (props) => {
  const [show, setShow] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(false);

  const {
    user,
    data,
    countries,
    mapVisible,
    changeMapView,
    changeView,
    getCountryInfo,
    hoverOnRegion,
    hoverOffRegion,
    hoverOnCountry,
    hoverOffCountry,
    handleOpen,
    handleClose,
    handleSideBar,
    setStateModal,
    filterCountryByName,
    login,
  } = props;

  const makeFavorite = (e, country) => {
    e.persist();
    setShow(true);
    if (!user) {
      setAlert(true);
      setMessage({
        style: 'warning', content: 'You need to sign in to favorite countries. Login', link: ROUTES.SIGN_IN, linkContent: ' here',
      });
    } else if (!favorite) {
      db.collection(`users/${user.uid}/favorites`).doc(`${country.name}`).set({
        country,
      }).then(() => {
        console.log(`Added ${country.name} to favorites`);
        setAlert(true);
        setMessage({ style: 'success', content: `Added ${country.name} to favorites` });
        setFavorite(true);
      })
        .catch((err) => {
          console.error(err);
          setAlert(true);
          setMessage({ style: 'danger', content: `Error adding ${country.name} to favorites, ${err}` });
        });
    } else {
      db.collection(`users/${user.uid}/favorites`).doc(`${country.name}`).delete()
        .then(() => {
          console.log(`Removed ${country.name} from favorites`);
          setAlert(true);
          setMessage({ style: 'warning', content: `Removed ${country.name} from favorites` });
          setFavorite(false);
          setShow(true);
        })
        .catch((err) => {
          console.error(err);
          setAlert(true);
          setMessage({ style: 'danger', content: `Error adding ${country.name} to favorites, ${err}` });
        });
    }
  };

  const totalRegions = data.map((a) => a.geography.map_references.replace(/;/g, ''));
  function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
  }
  let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
  uniqueRegions = uniqueRegions.filter(Boolean);

  return (
    <BreakpointProvider>
      <div className="row">
        <main className="col-md-9 col-lg-12 px-0">
          {countries[0] === undefined
            ? null
            : null }
          {alert
          && (
          <Alert show={show} variant={message.style}>
            {message.content}
            <Alert.Link href={message.link}>
              {message.linkContent}
            </Alert.Link>
          </Alert>
          )}
          <Breakpoint medium up>
            <Maps
              mapVisible={mapVisible}
              changeMapView={changeMapView}
              worldData={data}
              countries={countries}
              changeView={changeView}
              getCountryInfo={getCountryInfo}
              hoverOnRegion={hoverOnRegion}
              hoverOffRegion={hoverOffRegion}
              totalRegions={totalRegions}
              uniqueRegions={uniqueRegions}
              getOccurrence={getOccurrence}
            />
          </Breakpoint>
          {countries[0] && countries.map((country) => (
            <Result
              filtered={countries[0]}
              worldData={data}
              makeFavorite={makeFavorite}
              changeView={changeView}
              getCountryInfo={getCountryInfo}
              name={country.name}
              region={country.geography.map_references}
              subregion={country.geography.location}
              capital={country.government.capital.name}
              excerpt={country.excerpt}
              population={country.people.population.total}
              flagCode={country.government.country_name.isoCode}
              key={country.alpha3Code}
              country={country}
              code={country.alpha3Code}
              handleOpen={handleOpen}
              handleClose={handleClose}
              user={user}
              setStateModal={setStateModal}
              login={login}
            />
          ))}
        </main>
        <Breakpoint medium down>
          <SidebarView
            hoverOnRegion={hoverOnRegion}
            hoverOffRegion={hoverOffRegion}
            changeView={changeView}
            handleSideBar={handleSideBar}
            data={data}
            totalRegions={totalRegions}
            uniqueRegions={uniqueRegions}
            getOccurrence={getOccurrence}
            getCountryInfo={getCountryInfo}
            filterCountryByName={filterCountryByName}
            hoverOnCountry={hoverOnCountry}
            hoverOffCountry={hoverOffCountry}
          />
        </Breakpoint>
      </div>
    </BreakpointProvider>
  );
};
ResultView.defaultProps = {
  user: null,
};
ResultView.propTypes = {
  countries: PropTypes.arrayOf(countryType).isRequired,
  data: dataType.isRequired,
  user: userType,
  mapVisible: PropTypes.string.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  changeMapView: PropTypes.func.isRequired,
  hoverOffRegion: PropTypes.func.isRequired,
  hoverOnRegion: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSideBar: PropTypes.func.isRequired,
  hoverOnCountry: PropTypes.func.isRequired,
  hoverOffCountry: PropTypes.func.isRequired,
  setStateModal: PropTypes.func.isRequired,
  filterCountryByName: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};
export default ResultView;
