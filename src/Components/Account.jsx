/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import Flag from 'react-flags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner, faAngleUp, faAngleDown, faTrashAlt, faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Alert, Badge } from 'react-bootstrap';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from './Firebase/firebase';
import {
  userType,
} from '../Helpers/Types/index';


const Account = (props) => {
  const [loadingState, setLoadingState] = useState(false);
  const [acctFavorites, setAcctFavorites] = useState('');
  const [acctScores, setAcctScores] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  const {
    user,
    handleData,
    scores,
    favorites,
    simplifyString,
  } = props;

  const deleteFavorite = (id) => {
    db.collection(`users/${user.uid}/favorites`).doc(id).delete()
      .then(() => {
        console.log(`Removed ${id} from favorites`);
        setShow(true);
        setMessage({ style: 'warning', content: `Removed ${id} from favorites` });
      })
      .catch((err) => {
        console.error(err);
        setMessage({ style: 'danger', content: `Error removing ${id} from favorites, ${err}` });
      });
  };
  const deleteScore = (id) => {
    db.collection(`users/${user.uid}/scores`).doc(id).delete()
      .then(() => {
        console.log(`Removed ${id} from scores`);
        setShow(true);
        setMessage({ style: 'warning', content: `Removed ${id} from scores` });
      })
      .catch((err) => {
        console.error(err);
        setMessage({ style: 'danger', content: `Error removing ${id} from scores, ${err}` });
      });
  };
  const getFavoritesData = () => {
    const countriesRef = db.collection(`/users/${user.uid}/favorites`);
    countriesRef.onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        const info = {
          id: doc.id,
          data: doc.data().country,
        };
        data.push(info);
        data.isOpen = true;
      });
      setAcctFavorites({ isOpen: false, data });
      setLoadingState(false);
    });
  };
  const toggleData = (type) => {
    if (type === 'f') {
      if (acctFavorites.isOpen) {
        const oldFav = { ...acctFavorites };
        oldFav.isOpen = false;
        setAcctFavorites(oldFav);
      } else {
        const oldFav = { ...acctFavorites };
        oldFav.isOpen = true;
        setAcctFavorites(oldFav);
      }
    }
    if (type === 's') {
      if (acctScores.isOpen) {
        const oldSco = { ...acctScores };
        oldSco.isOpen = false;
        setAcctScores(oldSco);
      } else {
        const oldSco = { ...acctScores };
        oldSco.isOpen = true;
        setAcctScores(oldSco);
      }
    }
  };
  const getScoresData = () => {
    const scoresRef = db.collection(`/users/${user.uid}/scores`);
    scoresRef.onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        const info = {
          id: doc.id,
          data: doc.data(),
        };
        data.push(info);
        data.isOpen = true;
      });
      setAcctScores({ isOpen: false, data });
      setLoadingState(false);
    });
  };

  useEffect(() => {
    setLoadingState(true);
    getFavoritesData();
    getScoresData();
    // return () => {

    // };
  }, [favorites, scores]);

  return (
    <div className="col-sm-12 col-md-8 mx-auto">
      <Alert show={show} variant={message.style}>{message.content}</Alert>
      <div className="card col-lg-8 col-xl-6 mx-auto mb-3">
        <div className="row">
          <div className="col-12 text-center">
            <img className="avatar img-fluid" src={user && user.photoURL ? user.photoURL : require('../img/user.png')} alt="" />
          </div>
          <div className="col-12 text-center">
            <h5 className="mt-3">
              {user.displayName}
            </h5>
            <p>
              Account created
              {new Date(user.metadata.creationTime).toLocaleDateString()}
            </p>
            <p>{user.email}</p>
            <p>{user.phoneNumber ? user.phoneNumber : 'No phone number added'}</p>
            {loadingState ? <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="2x" />
              : (
                <>
                  <h6>Stats</h6>
                  <p>
                    {acctFavorites && acctFavorites.data.length}
                    {acctFavorites && acctFavorites.length === 1 ? ' Favorite' : ' Favorites'}
                  </p>
                  <p>
                    {acctScores && acctScores.data.length}
                    {acctScores && acctScores.length === 1 ? ' Score' : ' Scores'}
                  </p>
                </>
              )}
          </div>
          <div className="col-12 text-center">
            <Link
              className="btn btn-success"
              to={`${process.env.PUBLIC_URL}/account/edit`}
            >
              <FontAwesomeIcon className="acctedit" icon={faPencilAlt} />
                Edit Account
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12 col-lg-5 card datacard mx-auto my-1">
          <h5
            className="list-group-item d-flex align-items-center"
            onClick={() => toggleData('f')}
            role="button"
          >
            Favorites
            <Badge variant="primary">
              {loadingState ? <FontAwesomeIcon icon={faSpinner} spin />
                : acctFavorites && acctFavorites.data.length > 0 && acctFavorites.data.length}
            </Badge>
            {acctFavorites && <FontAwesomeIcon className="align-text-top" icon={favorites ? faAngleUp : faAngleDown} />}
          </h5>
          {loadingState ? null
            : (
              acctFavorites && (
              <Collapse in={acctFavorites.isOpen}>
                <ul className="list-group list-group-flush">
                  {acctFavorites && acctFavorites.data.length > 0
                    ? acctFavorites.data.map((favorite) => (
                      <li className="list-group-item" key={favorite.id}>
                        <h5>
                          {favorite.id}
                           -
                          <small>
                            {favorite.data.government.capital.name.split(';')[0]}
                          </small>
                        </h5>
                        <div className="d-flex justify-content-between">
                          <Link to={`${process.env.PUBLIC_URL}/${simplifyString(favorite.id.toLowerCase())}`}>
                            <Flag
                              className="favFlag img-thumbnail"
                              name={(favorite.data.government.country_name.isoCode ? favorite.data.government.country_name.isoCode : '_unknown') ? favorite.data.government.country_name.isoCode : `_${favorite.data.name}`}
                              format="svg"
                              pngSize={64}
                              shiny={false}
                              alt={`${favorite.data.name}'s Flag`}
                              basePath="/img/flags"
                            />
                          </Link>
                          <FontAwesomeIcon className="align-self-center" onClick={() => deleteFavorite(favorite.id)} icon={faTrashAlt} size="2x" color="darkred" />
                        </div>
                      </li>
                    )) : <h5>You have no favorites saved</h5> }
                </ul>
              </Collapse>
              )
            )}
        </div>
        <div className="col-sm-12 col-lg-5 card datacard mx-auto my-1">
          <h5 className="list-group-item d-flex align-items-center" onClick={() => toggleData('s')}>
            Scores
            <Badge variant="primary">
              {loadingState ? <FontAwesomeIcon icon={faSpinner} spin />
                : (acctScores && acctScores.data)
                && acctScores.data.length > 0
                && acctScores.data.length}
            </Badge>
            {acctScores && <FontAwesomeIcon className="align-text-top" icon={scores ? faAngleUp : faAngleDown} />}
          </h5>
          {loadingState ? null
            : (acctScores && (
              <Collapse in={acctScores.isOpen}>
                <ul className="list-group list-group-flush">
                  {acctScores && acctScores.data.length > 0 ? acctScores.data.map((score) => {
                    const milliseconds = score.data.dateCreated.seconds * 1000;
                    const currentDate = new Date(milliseconds);
                    const dateTime = currentDate.toGMTString();
                    return (
                      <li className="list-group-item" key={score.id}>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex flex-column">
                            <h6>
                              <strong>{dateTime}</strong>
                            </h6>
                            {score.data.gameMode
                              && (
                                <h6>
                                  Mode -
                                  {score.data.gameMode}
                                </h6>
                              )}
                            {score.data.score
                              && (
                              <h6>
                                Score -
                                {score.data.score}
                              </h6>
                              )}
                            <h6>
                              Correct -
                              {score.data.correct}
                            </h6>
                            <h6>
                              Incorrect -
                              {score.data.incorrect}
                            </h6>
                          </div>
                          <FontAwesomeIcon className="align-self-center" onClick={() => deleteScore(score.id)} icon={faTrashAlt} size="2x" color="darkred" />
                        </div>
                      </li>
                    );
                  }) : <h5>You have no scores saved</h5>}
                </ul>
              </Collapse>
            ))}
        </div>
      </div>
    </div>
  );
};

Account.propTypes = {
  handleData: PropTypes.func.isRequired,
  user: userType.isRequired,
  favorites: PropTypes.bool.isRequired,
  scores: PropTypes.bool.isRequired,
  simplifyString: PropTypes.func.isRequired,
};
export default Account;
