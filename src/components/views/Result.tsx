/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import Flag from 'react-world-flags';
import { Link } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import {
  countryType,
  userType,
  dataType,
  UserType,
  DataType
} from '../../helpers/types/index';
import '../../App.css';

import { favoritesCollection, firebaseApp } from '../../firebase/firebase';

import * as ROUTES from '../../constants/Routes';
import { AlertColor, Card } from '@mui/material';
import { CountryType } from '../../helpers/types/CountryType';
import { User } from 'firebase/auth';

type Message = {
  link: string;
  linkContent: string;
  content: string;
  style: AlertColor;
};
interface ResultProps {
  getCountryInfo: (country: string, capital: string) => void;
  filtered: CountryType;
  user: User | null;
  country: CountryType;
  name: string;
  subregion: string;
  capital: string;
  population: number;
  flagCode: string;
  setShow: (show: boolean) => void;
  setMessage: (message: Message) => void;
  message: Message;
}
const Result = (props: ResultProps) => {
  const [favorite, setFavorite] = useState(false);

  const {
    getCountryInfo,
    filtered,
    user,
    country,
    name,
    subregion,
    capital,
    population,
    flagCode,
    setShow,
    setMessage,
    message
  } = props;

  const db = getFirestore(firebaseApp);

  const showFunc = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 4000);
  };
  const checkFavorite = async (coun: string) => {
    if (!user) {
      return;
    }
    const docRef = doc(
      favoritesCollection,
      ...`users/${user.uid}/favorites/${coun}`.split('/')
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
  const makeFavorite = async (e: React.MouseEvent, coun: CountryType) => {
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
        ...`users/${user.uid}/favorites/${coun.name}`.split('/')
      );

      try {
        await setDoc(docRef, coun);
        setMessage({
          ...message,
          style: 'success',
          content: `Added ${coun.name} to favorites`
        });
        setFavorite(true);
        console.log('added favorite');
        showFunc();
      } catch (error) {
        setMessage({
          ...message,
          style: 'error',
          content: `Error adding ${coun.name} to favorites, ${error}`
        });
        showFunc();
      }
    } else {
      if (!user) {
        return;
      }
      const docRef = doc(
        favoritesCollection,
        ...`users/${user.uid}/favorites/${coun.name}`.split('/')
      );

      try {
        await deleteDoc(docRef);
        setMessage({
          ...message,
          style: 'warning',
          content: `Removed ${coun.name} from favorites`
        });
        setFavorite(false);
        showFunc();
      } catch (error) {
        setMessage({
          ...message,
          style: 'error',
          content: `Error adding ${coun.name} to favorites, ${error}`
        });
        showFunc();
      }
    }
  };

  useEffect(() => {
    if (user) {
      checkFavorite(country.name);
    }
  }, []);
  useEffect(() => {
    if (user) {
      checkFavorite(country.name);
    }
  }, [filtered]);
  return (
    <Card raised className="mr-md-3 card mb-3">
      <div className="result media">
        <div className="media-body">
          <h4 className="title">
            {name} ({flagCode}
            )
            <br />
            <small>
              Capital: {capital?.split(';')[0]} | Pop: {population}
            </small>
          </h4>
          <p className="subregion">
            <strong>Location: </strong>
            {subregion}
          </p>
          <Link
            to={`/${name}`}
            className="btn btn-success btn-sm"
            onClick={() => getCountryInfo(name, capital)}
          >
            Read More
          </Link>
        </div>
        {user && (
          <div className="stars">
            <FontAwesomeIcon
              onClick={(e) => makeFavorite(e, country)}
              size="2x"
              color={favorite ? 'gold' : 'gray'}
              icon={faStar}
            />
          </div>
        )}
        <Flag
          className="img-thumbnail"
          code={flagCode || '_unknown'}
          alt={`${name}'s Flag`}
        />
      </div>
    </Card>
  );
};

export default Result;
