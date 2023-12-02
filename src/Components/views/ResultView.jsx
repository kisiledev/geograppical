/* eslint-disable no-console */
import React, { useState } from 'react';
import { Breakpoint, BreakpointProvider } from 'react-socks';
import { Alert, Link } from '@mui/material';
import PropTypes from 'prop-types';
import { getFirestore, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { countryType, dataType, userType } from '../../helpers/types/index';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';
import SidebarView from './SidebarView';
import Maps from './Maps';
import Result from './Result';
import * as ROUTES from '../../constants/Routes';
import { firebaseApp } from '../../firebase/firebase';

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
    handleOpen,
    handleSideBar,
    filterCountryByName,
    login
  } = props;

  const db = getFirestore(firebaseApp);
  const makeFavorite = async (e, country) => {
    e.persist();
    console.log('adding');
    if (!user) {
      setAlert(true);
      setMessage({
        style: 'warning',
        content: 'You need to sign in to favorite countries. Login ',
        link: ROUTES.SIGN_IN,
        linkContent: 'here'
      });
    }
    if (!favorite) {
      const docRef = doc(
        db,
        ...`users/${user.uid}/favorites/${country.name}`.split('/')
      );

      try {
        await setDoc(docRef, { country });
        setAlert(true);
        setMessage({
          style: 'success',
          content: `Added ${country.name} to favorites`
        });
        setFavorite(true);
        console.log('added favorite');
        setShow(true);
      } catch (error) {
        setMessage({
          style: 'danger',
          content: `Error adding ${country.name} to favorites, ${error}`
        });
      }
    } else {
      const docRef = doc(
        db,
        ...`users/${user.uid}/favorites/${country.name}`.split('/')
      );

      try {
        await deleteDoc(docRef);
        setMessage({
          style: 'warning',
          content: `Removed ${country.name} from favorites`
        });
        setFavorite(false);
        showFunc();
      } catch (error) {
        setMessage({
          style: 'danger',
          content: `Error adding ${country.name} to favorites, ${error}`
        });
        showFunc();
      }
    }
  };

  const totalRegions = data.map((a) =>
    a.geography.map_references.replace(/;/g, '')
  );
  function getOccurrence(array, value) {
    return array.filter((v) => v === value).length;
  }
  let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
  uniqueRegions = uniqueRegions.filter(Boolean);

  return (
    <BreakpointProvider>
      <div className="row">
        <main className="col-md-9 col-lg-12 px-0">
          {countries[0] === undefined ? null : null}
          {alert && show && (
            <Alert
              severity={message.style}
              action={<Link to={message.link}>{message.linkContent}</Link>}
            >
              {message.content}
            </Alert>
          )}
          <Breakpoint medium up>
            <Maps
              mapVisible={mapVisible}
              changeMapView={changeMapView}
              worldData={data}
              getCountryInfo={getCountryInfo}
            />
          </Breakpoint>
          {countries[0] &&
            countries.map((country) => (
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
                user={user}
                login={login}
                show={show}
                setShow={setShow}
                setMessage={setMessage}
              />
            ))}
        </main>
        <Breakpoint medium down>
          <SidebarView
            changeView={changeView}
            handleSideBar={handleSideBar}
            data={data}
            totalRegions={totalRegions}
            uniqueRegions={uniqueRegions}
            getOccurrence={getOccurrence}
            getCountryInfo={getCountryInfo}
            filterCountryByName={filterCountryByName}
          />
        </Breakpoint>
      </div>
    </BreakpointProvider>
  );
};
ResultView.defaultProps = {
  user: null
};
ResultView.propTypes = {
  countries: PropTypes.arrayOf(countryType).isRequired,
  data: dataType.isRequired,
  user: userType,
  mapVisible: PropTypes.string.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  changeMapView: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleSideBar: PropTypes.func.isRequired,
  filterCountryByName: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired
};
export default ResultView;
