import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Card, Grid, Typography } from '@mui/material';
import Flag from 'react-world-flags';
import { Link } from 'react-router-dom';
import { BreakpointProvider, Breakpoint } from 'react-socks';
import PropTypes, { shape } from 'prop-types';
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { count } from 'd3';
import {
  countryType,
  dataType,
  userType,
  matchType
} from '../../helpers/types/index';
import RecursiveProperty from './DataList';
import AudioPlayer from './AudioPlayer';
import * as ROUTES from '../../constants/Routes';
// import '../../App.css';

import SidebarView from './SidebarView';
import { firebaseApp } from '../../firebase/firebase';
import { withRouter } from '../../helpers/WithRouter';

function getOccurrence(array, value) {
  return array.filter((v) => v === value).length;
}
const DetailView = (props) => {
  const [show, setShow] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState('');

  const {
    countryDetail,
    data,
    user,
    loadingState,
    freezeLoad,
    getCountryInfo,
    match,
    history,
    changeView,
    handleSideBar,
    filterCountryByName
  } = props;

  const db = getFirestore(firebaseApp);
  const numberWithCommas = (x) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const showFunc = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 4000);
  };
  const checkFavorite = async (country) => {
    const docRef = doc(
      db,
      ...`users/${user.uid}/favorites/${country}`.split('/')
    );

    try {
      const countryDoc = await getDoc(docRef);
      if (countryDoc.exists) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
  };
  const makeFavorite = async (e, country) => {
    e.persist();
    console.log('adding');
    if (!user) {
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
        setMessage({
          style: 'success',
          content: `Added ${country.name} to favorites`
        });
        setFavorite(true);
        console.log('added favorite');
        showFunc();
      } catch (error) {
        setMessage({
          style: 'danger',
          content: `Error adding ${country.name} to favorites, ${error}`
        });
        showFunc();
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

  // useEffect(() => {
  //   if (!loadingState) {
  //     freezeLoad(true);
  //   }
  // }, [loadingState]);

  useEffect(() => {
    if (!loadingState) {
      getCountryInfo(match.params.country);
    }
  }, []);

  useEffect(() => {
    if (user && countryDetail) {
      checkFavorite(countryDetail.name);
    }
    getCountryInfo(match.params.country);
  }, [data]);

  const totalRegions = data.map((a) => a.geography.map_references);

  let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
  const errorMsg = (
    <div className="h3">
      There has been an error. We cannot find the country in our database.
      Please go back and choose another country
    </div>
  );
  uniqueRegions = uniqueRegions.filter(Boolean);
  return loadingState || !countryDetail ? (
    <Grid
      container
      sx={{ paddingTop: '50px', justifyContent: 'center' }}
      xs={12}
    >
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </Grid>
  ) : (
    <BreakpointProvider>
      {countryDetail === 'error' || countryDetail === undefined ? (
        errorMsg
      ) : (
        <Grid
          container
          sx={{
            margin: '0 auto',
            justifyContent: 'center'
          }}
        >
          <Grid item xs={12} md={9}>
            <Button
              LinkComponent={Link}
              variant="contained"
              to="/"
              className="btn btn-primary justify-content"
              onClick={() => history.goBack()}
              sx={{ margin: '20px auto' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-3" />
              Back
            </Button>
            <Card elevation={5} sx={{ padding: '10px' }}>
              {message?.length > 0 && show && (
                <Alert
                  severity={message.style}
                  action={<Link to={message.link}>{message.linkContent}</Link>}
                >
                  {message.content}
                </Alert>
              )}
              <Grid container sx={{ justifyContent: 'space-between' }}>
                <Grid
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Breakpoint medium up>
                    <Grid lg={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {countryDetail.name}
                      </Typography>
                      <Typography variant="p" sx={{ fontWeight: 600 }}>
                        {countryDetail?.government?.capital.name}
                      </Typography>
                      <Typography component="h5">
                        {`Population: 
                            ${numberWithCommas(
                              countryDetail.people.population.total
                            )}
                             (${countryDetail.people.population.global_rank})`}
                      </Typography>
                    </Grid>
                  </Breakpoint>

                  <Flag
                    className="detailFlag order-lg-12 align-self-end text-right img-thumbnail"
                    code={
                      (
                        countryDetail.government.country_name.isoCode
                          ? countryDetail.government.country_name.isoCode
                          : '_unknown'
                      )
                        ? countryDetail.government.country_name.isoCode
                        : `_${countryDetail.name}`
                    }
                    alt={`${countryDetail.name}'s Flag`}
                  />
                </Grid>
                <Grid item={12} sx={{ padding: '15px 0px' }}>
                  <Button
                    sx={{ margin: '0 auto', textAlign: 'center' }}
                    onClick={(e) => makeFavorite(e, countryDetail)}
                    endIcon={
                      <FontAwesomeIcon
                        size="2x"
                        color={favorite ? 'gold' : 'gray'}
                        icon={faStar}
                      />
                    }
                    variant="contained"
                    color={favorite ? 'error' : 'success'}
                  >
                    {`${favorite ? 'Remove' : 'Make'} Favorite`}
                  </Button>
                </Grid>
                <AudioPlayer nation={countryDetail} />
              </Grid>
              <RecursiveProperty
                property={countryDetail}
                expanded={Boolean}
                propertyName={countryDetail.name}
                excludeBottomBorder={false}
                rootProperty
              />
            </Card>
          </Grid>
          <Breakpoint medium down>
            <SidebarView
              data={data}
              changeView={changeView}
              totalRegions={totalRegions}
              uniqueRegions={uniqueRegions}
              getOccurrence={getOccurrence}
              getCountryInfo={getCountryInfo}
              handleSideBar={handleSideBar}
              filterCountryByName={filterCountryByName}
            />
          </Breakpoint>
        </Grid>
      )}
    </BreakpointProvider>
  );
};
DetailView.propTypes = {
  freezeLoad: PropTypes.func.isRequired,
  countryDetail: countryType.isRequired,
  data: dataType.isRequired,
  user: userType.isRequired,
  loadingState: PropTypes.bool.isRequired,
  getCountryInfo: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  handleSideBar: PropTypes.func.isRequired,
  filterCountryByName: PropTypes.func.isRequired,
  match: matchType.isRequired,
  history: shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
};
export default withRouter(DetailView);
