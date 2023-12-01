/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import { BreakpointProvider } from 'react-socks';
import { Alert } from '@mui/material';
import PropTypes from 'prop-types';
import {
  countryType,
  dataType,
  userType,
  matchType
} from '../../helpers/types/index';
import * as ROUTES from '../../constants/Routes';
import Result from './Result';
import { db } from '../../firebase/firebase';
import '../../App.css';

const SearchResults = (props) => {
  const [loadingState, setLoadingState] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(false);
  const [show, setShow] = useState(false);

  const {
    searchText,
    match,
    user,
    data,
    countries,
    changeView,
    getCountryInfo,
    handleOpen,
    handleClose,
    handleRefresh,
    setStateModal,
    login
  } = props;

  useEffect(() => {
    handleRefresh(match.params.input);
    setLoadingState(false);
  }, [data]);

  const makeFavorite = (e, country) => {
    e.persist();
    setShow(true);
    if (!user) {
      setMessage({
        style: 'warning',
        content: 'You need to sign in to favorite countries. Login ',
        link: ROUTES.SIGN_IN,
        linkContent: 'here'
      });
    } else if (!favorite) {
      db.collection(`users/${user.uid}/favorites`)
        .doc(`${country.name}`)
        .set({
          country
        })
        .then(() => {
          setAlert(true);
          setMessage({
            style: 'success',
            content: `Added ${country.name} to favorites`
          });
          setFavorite(true);
        })
        .catch((err) => {
          setAlert(true);
          setMessage({
            style: 'danger',
            content: `Error adding ${country.name} to favorites, ${err}`
          });
        });
    } else {
      db.collection(`users/${user.uid}/favorites`)
        .doc(`${country.name}`)
        .delete()
        .then(() => {
          setAlert(true);
          setMessage({
            style: 'warning',
            content: `Removed ${country.name} from favorites`
          });
          setFavorite(false);
          setShow(true);
        })
        .catch((err) => {
          setAlert(true);
          setMessage({
            style: 'danger',
            content: `Error adding ${country.name} to favorites, ${err}`
          });
        });
    }
  };
  return (
    <BreakpointProvider>
      <div className="row">
        <main className="col-md-9 px-5">
          {countries[0] === undefined ? null : null}
          {alert && show && (
            <Alert
              severity={message.style}
              action={<Link to={message.link}>{message.linkContent}</Link>}
            >
              {message.content}
            </Alert>
          )}
          <div className="col-12 text-center">
            {loadingState ? (
              <FontAwesomeIcon
                className="my-5"
                icon={faSpinner}
                spin
                size="3x"
              />
            ) : searchText === '' ? (
              <h4 className="my-3">No search terms are entered</h4>
            ) : (
              <h4 className="my-3">
                Search Results for {data ? searchText : match.params.input}
              </h4>
            )}
          </div>
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
                flag={country.flag}
                flagCode={country.government.country_name.isoCode}
                imgalt={`${country.name}'s flag`}
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
      </div>
    </BreakpointProvider>
  );
};
SearchResults.defaultProps = {
  user: null
};
SearchResults.propTypes = {
  countries: PropTypes.arrayOf(countryType).isRequired,
  data: dataType.isRequired,
  user: userType,
  match: matchType.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  setStateModal: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired
};
export default withRouter(SearchResults);
