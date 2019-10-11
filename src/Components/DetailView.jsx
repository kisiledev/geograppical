/* eslint-disable no-console */
/* eslint-disable operator-linebreak */
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faStar } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap';
import Flag from 'react-flags';
import { withRouter, Link } from 'react-router-dom';
import { BreakpointProvider, Breakpoint } from 'react-socks';
import PropTypes, { shape } from 'prop-types';
import {
  countryType,
  dataType,
  userType,
  matchType,
} from '../Helpers/Types/index';
import RecursiveProperty from './DataList';
import AudioPlayer from './AudioPlayer';
import '../App.css';

import SidebarView from './SidebarView';
import { db } from './Firebase/firebase';


import * as ROUTES from '../Constants/Routes';


const DetailView = (props) => {
  const [show, setShow] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState('');

  const {
    countryDetail, data, user, loading, getCountryInfo, match, history, changeView,
    viewSidebar, handleSideBar, hoverOffRegion, hoverOnRegion, filterCountryByName,
    hoverOnCountry, hoverOffCountry,
  } = props;

  const checkFavorite = (country) => {
    const docRef = db.collection(`users/${user.uid}/favorites`).doc(`${country}`);
    docRef.get()
      .then((doc) => {
        if (doc) {
          if (doc.exists) {
            setFavorite(true);
          } else {
            setFavorite(false);
          }
        }
      }).catch((error) => {
        console.log('Error getting document:', error);
      });
  };
  const makeFavorite = (e, country) => {
    e.persist();
    setShow(true);
    if (!user) {
      setMessage({
        style: 'warning',
        content: 'You need to sign in to favorite countries. Login ',
        link: ROUTES.SIGN_IN,
        linkContent: 'here',
      });
      if (!favorite) {
        db.collection(`users/${user.uid}/favorites`).doc(`${country.name}`).set({
          country,
        }).then(() => {
          // console.log(`Added ${country.name} to favorites`)
          setMessage({ style: 'success', content: `Added ${country.name} to favorites` });
          setFavorite(true);
        })
          .catch((err) => {
          // console.error(err)
            setMessage({ style: 'danger', content: `Error adding ${country.name} to favorites, ${err}` });
          });
      } else {
        db.collection(`users/${user.uid}/favorites`).doc(`${country.name}`).delete()
          .then(() => {
          // console.log(`Removed ${country.name} from favorites`)
            setMessage({ style: 'warning', content: `Removed ${country.name} from favorites` });
            setFavorite(false);
            setShow(true);
          })
          .catch((err) => {
          // console.error(err)
            setMessage({ style: 'danger', content: `Error adding ${country.name} to favorites, ${err}` });
          });
      }
    }
  };

  useEffect(() => {
    if (countryDetail
      && (countryDetail.length !== 0 || countryDetail === undefined)
    ) {
      // console.log(countryDetail)
    }
    if (!loading) {
      getCountryInfo(match.params.country);

    }
  }, []);

  useEffect(() => {
    if (user && countryDetail && !favorite) {
      checkFavorite(countryDetail.name);
    }
    // console.log('reloading')
    // console.log(match.params.country)
    getCountryInfo(match.params.country);

  }, [data]);

  const totalRegions = data.map((a) => a.geography.map_references);
  function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
  }
  let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
  const errorMsg = (<div className="h3">There has been an error. We cannot find the country in our database. Please go back and choose another country</div>);
  uniqueRegions = uniqueRegions.filter(Boolean);
  return (
    loading || !countryDetail ? <div className="my-5 text-center mx-auto"><FontAwesomeIcon icon={faSpinner} spin size="3x" /></div> :
      (
        <BreakpointProvider>
          {countryDetail === 'error' || countryDetail === undefined ? (
            errorMsg
          ) : (
            <div className="row">
              <div className="col-md-12 col-md-9">
                <div className="card my-3">
                  <Alert show={show} variant={message.style}>
                    {message.content}
                    {message && message.length > 0 && message.link && (
                      <Alert.Link href={message.link && message.link}>
                        {message.linkContent}
                      </Alert.Link>
                    )}
                  </Alert>
                  <div className="row justify-content-between">
                    <div className="col-md-12 col-lg-12 flex-md-nowrap d-flex justify-content-between align-items-center">
                      <Link
                        to={`${process.env.PUBLIC_URL}/`}
                        className="btn btn-primary"
                        onClick={() => history.goBack()}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Back
                      </Link>
                      <Breakpoint medium up>
                        <div className="col-lg-12">
                          <h3>
                            {countryDetail.name}
                            -
                            <small>{countryDetail.government.capital.name.split(';')[0]}</small>
                          </h3>
                          <h5>
                            Pop:
                            {countryDetail.people.population.total}
                            - Ranked (
                            {countryDetail.people.population.global_rank}
                            )
                          </h5>
                        </div>
                      </Breakpoint>
                      <FontAwesomeIcon onClick={(e) => makeFavorite(e, countryDetail)} size="2x" color={favorite ? 'gold' : 'gray'} icon={faStar} />
                      <Flag
                        className="detailFlag order-lg-12 align-self-end text-right img-thumbnail"
                        name={(countryDetail.government.country_name.isoCode ? countryDetail.government.country_name.isoCode : '_unknown') ? countryDetail.government.country_name.isoCode : `_${countryDetail.name}`}
                        format="svg"
                        pngSize={64}
                        shiny={false}
                        alt={`${countryDetail.name}'s Flag`}
                        basePath="/img/flags"
                      />
                      <AudioPlayer nation={countryDetail} />
                    </div>
                  </div>
                  <RecursiveProperty
                    property={countryDetail}
                    expanded={Boolean}
                    propertyName={countryDetail.name}
                    excludeBottomBorder={false}
                    rootProperty
                  />
                </div>
              </div>
              <Breakpoint medium down>
                <SidebarView
                  data={data}
                  changeView={changeView}
                  viewSidebar={viewSidebar}
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
              </Breakpoint>
            </div>
          )}
        </BreakpointProvider>
      )
  );
};
DetailView.propTypes = {
  countryDetail: countryType.isRequired,
  data: dataType.isRequired,
  user: userType.isRequired,
  loading: PropTypes.bool.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  viewSidebar: PropTypes.func.isRequired,
  handleSideBar: PropTypes.func.isRequired,
  hoverOffRegion: PropTypes.func.isRequired,
  hoverOnRegion: PropTypes.func.isRequired,
  filterCountryByName: PropTypes.func.isRequired,
  hoverOnCountry: PropTypes.func.isRequired,
  hoverOffCountry: PropTypes.func.isRequired,
  match: matchType.isRequired,
  history: shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
export default withRouter(DetailView);
