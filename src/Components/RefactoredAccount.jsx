/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import AccountData from './AccountData';
import { db } from './Firebase/firebase';
import {
  userType,
} from '../Helpers/Types/index';
import AcctHeader from './AcctHeader';


const Account = (props) => {
  const [loadingState, setLoadingState] = useState(false);
  const [acctFavorites, setAcctFavorites] = useState('');
  const [acctScores, setAcctScores] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  const {
    user,
    scores,
    favorites,
    simplifyString,
  } = props;

  const deleteFavorite = (id) => {
    db.collection(`users/${user.uid}/favorites`).doc(id).delete()
      .then(() => {
        setShow(true);
        setMessage({ style: 'warning', content: `Removed ${id} from favorites` });
      })
      .catch((err) => {
        setMessage({ style: 'danger', content: `Error removing ${id} from favorites, ${err}` });
      });
  };
  const deleteScore = (id) => {
    db.collection(`users/${user.uid}/scores`).doc(id).delete()
      .then(() => {
        setShow(true);
        setMessage({ style: 'warning', content: `Removed ${id} from scores` });
      })
      .catch((err) => {
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
    if (type === 'favorites') {
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
    if (type === 'scores') {
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

  const data = [
    {
      name: 'favorites',
      data: acctFavorites,
      delete: deleteFavorite,
      boolean: favorites,
    },
    {
      name: 'scores',
      data: acctScores,
      delete: deleteScore,
      boolean: scores,
    },
  ];
  const acct = [];
  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  data.forEach((piece) => {
    const dynamicProps = {
      key: piece.name,
      name: piece.name,
      toggleData,
      loadingState,
      boolean: piece.boolean,
      simplifyString,
      capitalize,
      deleteScore,
      deleteFavorite,
    };
    dynamicProps.acctData = piece.data;
    piece.name = piece.name.slice(0, -1);
    dynamicProps[`delete${capitalize(piece.name)}`] = piece.delete;
    acct.push(<AccountData {...dynamicProps} />);
  });
  return (
    <div className="col-sm-12 col-md-8 mx-auto">
      <Alert show={show} variant={message.style}>{message.content}</Alert>
      <AcctHeader
        loadingState={loadingState}
        acctFavorites={acctFavorites}
        acctScores={acctScores}
        user={user}
      />
      <div className="row">
        {acct}
      </div>
    </div>
  );
};

Account.propTypes = {
  user: userType.isRequired,
  favorites: PropTypes.bool.isRequired,
  scores: PropTypes.bool.isRequired,
  simplifyString: PropTypes.func.isRequired,
};
export default Account;
