import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Card, Grid2, Typography } from '@mui/material';
import Flag from 'react-world-flags';
import { Link, useNavigate } from 'react-router-dom';
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
  matchType,
  DataType,
  Message
} from '../../helpers/types/index';
import RecursiveProperty from './DataList';
import AudioPlayer from './AudioPlayer';
import * as ROUTES from '../../constants/Routes';
// import '../../App.css';

import SidebarView from './SidebarView';
import { favoritesCollection, firebaseApp } from '../../firebase/firebase';
import { CountryType } from '../../helpers/types/CountryType';
import { User } from 'firebase/auth';
import { useParams } from 'react-router';

function getOccurrence(array: string[], value: string) {
  return array.filter((v) => v === value).length;
}

interface DetailViewProps {
  freezeLoad: (loadState: boolean) => void;
  countryDetail: CountryType;
  data: DataType;
  user: User | null;
  loadingState: boolean;
  getCountryInfo: (country: string) => void;
  changeView: (view: string) => void;
  handleSideBar: (string: string) => void;
  filterCountryByName: (name: string) => void;
}
const DetailView = (props: DetailViewProps) => {
  const [show, setShow] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState<Message>({
    style: 'info',
    content: '',
    link: '',
    linkContent: ''
  });

  const navigate = useNavigate();
  const {
    countryDetail,
    data,
    user,
    loadingState,
    freezeLoad,
    getCountryInfo,
    changeView,
    handleSideBar,
    filterCountryByName
  } = props;

  const db = getFirestore(firebaseApp);

  const params = useParams();
  const { country = '' } = params;
  const numberWithCommas = (x: number) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const showFunc = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 4000);
  };
  const checkFavorite = async (country: string) => {
    if (!user) {
      return;
    }
    const docRef = doc(
      favoritesCollection,
      ...`users/${user.uid}/favorites/${country}`.split('/')
    );

    try {
      const countryDoc = await getDoc(docRef);
      if (countryDoc.exists()) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
  };
  const makeFavorite = async (e: React.MouseEvent, country: CountryType) => {
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
      if (!user) {
        return;
      }
      const docRef = doc(
        favoritesCollection,
        ...`users/${user.uid}/favorites/${country.name}`.split('/')
      );

      try {
        await setDoc(docRef, country);
        setMessage({
          ...message,
          style: 'success',
          content: `Added ${country.name} to favorites`
        });
        setFavorite(true);
        console.log('added favorite');
        showFunc();
      } catch (error) {
        setMessage({
          ...message,
          style: 'error',
          content: `Error adding ${country.name} to favorites, ${error}`
        });
        showFunc();
      }
    } else {
      if (!user) {
        return;
      }
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

  // useEffect(() => {
  //   if (!loadingState) {
  //     freezeLoad(true);
  //   }
  // }, [loadingState]);

  useEffect(() => {
    if (!loadingState) {
      getCountryInfo(country);
    }
  }, []);

  useEffect(() => {
    if (user && countryDetail) {
      checkFavorite(countryDetail.name);
    }
    getCountryInfo(country);
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
    <Grid2
      container
      sx={{ paddingTop: '50px', justifyContent: 'center' }}
      size={{ xs: 12 }}
    >
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </Grid2>
  ) : (
    <BreakpointProvider>
      {countryDetail === undefined ? (
        errorMsg
      ) : (
        <Grid2
          container
          sx={{
            margin: '0 auto',
            justifyContent: 'center'
          }}
        >
          <Grid2 size={{ xs: 12, md: 9 }}>
            <Button
              LinkComponent={Link}
              variant="contained"
              className="btn btn-primary justify-content"
              onClick={() => navigate(-1)}
              sx={{ margin: '20px auto' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-3" />
              Back
            </Button>
            <Card elevation={5} sx={{ padding: '10px' }}>
              {message?.linkContent && show && (
                <Alert
                  severity={message.style}
                  action={<Link to={message.link}>{message.linkContent}</Link>}
                >
                  {message.content}
                </Alert>
              )}
              <Grid2 container sx={{ justifyContent: 'space-between' }}>
                <Grid2
                  size={{ xs: 12, lg: 6 }}
                  sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Breakpoint medium up>
                    <Grid2 size={{ lg: 12 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {countryDetail.name}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {countryDetail?.government?.capital.name}
                      </Typography>
                      <Typography component="h5">
                        {`Population: 
                            ${numberWithCommas(
                              countryDetail.people.population.total
                            )}
                             (${countryDetail.people.population.global_rank})`}
                      </Typography>
                    </Grid2>
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
                </Grid2>
                <Grid2 sx={{ padding: '15px 0px' }}>
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
                </Grid2>
                <AudioPlayer nation={countryDetail} />
              </Grid2>
              <RecursiveProperty
                property={countryDetail}
                expanded={false}
                propertyName={countryDetail.name}
                excludeBottomBorder={false}
                rootProperty
              />
            </Card>
          </Grid2>
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
        </Grid2>
      )}
    </BreakpointProvider>
  );
};
export default DetailView;
