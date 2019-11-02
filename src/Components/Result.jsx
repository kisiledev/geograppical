/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import Flag from 'react-flags';
import { Link } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {
  countryType,
  userType,
  dataType,
} from '../Helpers/Types/index';
import '../App.css';
import { db } from './Firebase/firebase'
// import * as ROUTES from '../Constants/Routes';


const Result = props => {
  // const [show, setShow] = useState(false)
  const [favorite, setFavorite] = useState(false);
  // const [message, setMessage] = useState('');

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
  } = props;

  console.log(props);

  const checkFavorite = (coun) => {
    const docRef = db.collection(`users/${user.uid}/favorites`).doc(`${coun}`);
    docRef.get()
      .then((doc) => {
        if (doc) {
          if (doc.exists) {
            const data = doc.data();
            setFavorite(true);
            console.log(data);
          } else {
            setFavorite(false);
          }
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
  };
  const makeFavorite = (e, coun) => {
    e.persist();
    // setShow(true)
    if (!user) {
      // setMessage({style: "warning", content: `You need to sign in to favorite countries. Login `, link: ROUTES.SIGN_IN, linkContent: 'here'})
    } else if (!favorite) {
      db.collection(`users/${user.uid}/favorites`).doc(`${coun.name}`).set({
        coun,
      }).then(() => {
        console.log(`Added ${coun.name} to favorites`);
        // setMessage({style: "success", content: `Added ${country.name} to favorites`})
        setFavorite(true);
      })
        .catch((err) => {
          console.error(err);
          // setMessage({style: "danger", content: `Error adding ${country.name} to favorites, ${err}`})
        });
    } else {
      db.collection(`users/${user.uid}/favorites`).doc(`${coun.name}`).delete()
        .then(() => {
          console.log(`Removed ${coun.name} from favorites`);
          // setMessage({style: "warning", content: `Removed ${country.name} from favorites`})
          setFavorite(false);
          // setShow(true)
        })
        .catch((err) => {
          console.error(err);
          // setMessage({style: "danger", content: `Error adding ${country.name} to favorites, ${err}`})
        });
    }
  };

  useEffect(() => {
    if (user) {
      checkFavorite(country);
    }
  }, []);
  useEffect(() => {
    if (user) {
      checkFavorite(country);
    }
  }, [filtered]);
  return (
    <div className="mr-md-3 card mb-3">
      <div className="result media">
        <div className="media-body">
          <h4 className="title">
            {name}
            {' '}
            (
            {flagCode}
            )
            <br />
            <small>
            Capital:
              {' '}
              {capital && capital.split(';')[0]}
              {' '}
              | Pop:
              {' '}
              {population}
            </small>
          </h4>
          <p className="subregion">
            <strong>Location: </strong>
            {subregion}
          </p>
          <Link to={`${process.env.PUBLIC_URL}/${name}`} className="btn btn-success btn-sm" onClick={() => getCountryInfo(name, capital)}>Read More</Link>
        </div>
        {user && <div className="stars"><FontAwesomeIcon onClick={(e) => makeFavorite(e, country)} size="2x" value={country} color={favorite ? 'gold' : 'gray'} icon={faStar} /></div>}
        <Flag
          className="img-thumbnail"
          name={(flagCode) || '_unknown'}
          format="svg"
          pngSize={64}
          shiny={false}
          alt={`${name}'s Flag`}
          basePath="/img/flags"
        />
      </div>
    </div>

  // <div className="card h-100 col-sm-12 col-md-9 mb-3">
  //     <img className="card-img" src={flag} alt={imgalt}/>
  //     <div className="card-img-overlay">
  //         <h5 className="card-title">{name} <small>Capital: {capital}</small></h5>
  //         <p>Pop: {population}</p>
  //         <p className="card-text"><strong>Region: </strong>{region}</p>
  //         <p className="subregion"><strong>Subregion: </strong>{subregion}</p>
  //         <button className="btn btn-primary btn-sm">Read More</button>
  //     </div>
  // </div>
  );
};

Result.propTypes = {
  getCountryInfo: PropTypes.func.isRequired,
  filtered: dataType.isRequired,
  user: userType.isRequired,
  country: countryType.isRequired,
  name: PropTypes.string.isRequired,
  subregion: PropTypes.string.isRequired,
  capital: PropTypes.string.isRequired,
  population: PropTypes.number.isRequired,
  flagCode: PropTypes.string.isRequired,
};
export default Result;
