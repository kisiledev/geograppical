import React, { useState } from 'react';
import { Breakpoint, BreakpointProvider } from 'react-socks';
import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  getFirestore,
  doc,
  deleteDoc,
  setDoc,
  collection
} from 'firebase/firestore';
import {
  countryType,
  DataType,
  dataType,
  Message,
  UserType,
  userType
} from '../../helpers/types/index';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';
import SidebarView from './SidebarView';
import Maps from './Maps';
import Result from './Result';
import * as ROUTES from '../../constants/Routes';
import { favoritesCollection, firebaseApp } from '../../firebase/firebase';
import { CountryType } from '../../helpers/types/CountryType';
import { m } from 'react-router/dist/production/fog-of-war-CbNQuoo8';
import { User } from 'firebase/auth';

interface ResultViewProps {
  user: User | null;
  data: DataType;
  countries: CountryType[];
  mapVisible: boolean;
  changeMapView: () => void;
  changeView: (view: string) => void;
  getCountryInfo: (country: string) => void;
  handleSideBar: (string: string) => void;
  filterCountryByName: (name: string) => void;
  login: () => void;
}

const ResultView = (props: ResultViewProps) => {
  const [show, setShow] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState<Message>({
    link: '',
    linkContent: '',
    content: '',
    style: 'info'
  });
  const [alert, setAlert] = useState(false);

  const {
    user,
    data,
    countries,
    mapVisible,
    changeMapView,
    changeView,
    getCountryInfo,
    handleSideBar,
    filterCountryByName,
    login
  } = props;

  const db = getFirestore(firebaseApp);
  const showFunc = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 4000);
  };
  const makeFavorite = async (e: Event, country: CountryType) => {
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
        favoritesCollection,
        ...`users/${user.uid}/favorites/${country.name}`.split('/')
      );

      try {
        await setDoc(docRef, country);
        setAlert(true);
        setMessage({
          ...message,
          style: 'success',
          content: `Added ${country.name} to favorites`
        });
        setFavorite(true);
        console.log('added favorite');
        setShow(true);
      } catch (error) {
        setMessage({
          ...message,
          style: 'error',
          content: `Error adding ${country.name} to favorites, ${error}`
        });
      }
    } else {
      const docRef = doc(
        favoritesCollection,
        ...`users/${user.uid}/favorites/${country.name}`.split('/')
      );

      try {
        await deleteDoc(docRef);
        setMessage({
          ...message,
          style: 'warning',
          content: `Removed ${country.name} from favorites`
        });
        setFavorite(false);
        showFunc();
      } catch (error) {
        setMessage({
          ...message,
          style: 'error',
          content: `Error adding ${country.name} to favorites, ${error}`
        });
        showFunc();
      }
    }
  };

  const totalRegions = data.map((a) =>
    a.geography.map_references.replace(/;/g, '')
  );
  function getOccurrence(array: string[], value: string) {
    return array.filter((v) => v === value).length;
  }
  let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
  uniqueRegions = uniqueRegions.filter(Boolean);

  return (
    <BreakpointProvider>
      <div className="row">
        aHello world
        <main className="col-md-9 col-lg-12 px-0">
          {countries[0] === undefined ? null : null}
          {alert && show && (
            <Alert
              severity={message.style || 'warning'}
              action={
                <Link to={message.link} component={RouterLink}>
                  {message.linkContent}
                </Link>
              }
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
                getCountryInfo={getCountryInfo}
                name={country.name}
                subregion={country.geography.location}
                capital={country.government.capital.name}
                population={country.people.population.total}
                flagCode={country.government.country_name.isoCode}
                key={country.alpha3Code}
                country={country}
                user={user}
                setShow={setShow}
                setMessage={setMessage}
                message={message}
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
export default ResultView;
