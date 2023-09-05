/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import { Alert, Box, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore
} from 'firebase/firestore';
import AccountData from './AccountData';
import { firebaseApp } from '../../Firebase/firebase';
import { userType } from '../../Helpers/Types/index';
import AcctHeader from './AcctHeader';

const Account = (props) => {
  const [loadingState, setLoadingState] = useState(false);
  const [acctFavorites, setAcctFavorites] = useState('');
  const [acctScores, setAcctScores] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  const { user, scores, favorites, simplifyString } = props;

  const db = getFirestore(firebaseApp);
  const deleteDocument = async (id, type) => {
    const docRef = doc(db, ...`users/${user.uid}/${type}/${id}`.split('/'));
    try {
      await deleteDoc(docRef);
      setShow(true);
      setMessage({
        style: 'warning',
        content: `Removed ${id} from ${type}`
      });
    } catch (error) {
      setMessage({
        style: 'danger',
        content: `Error removing ${id} from ${type}, ${error}`
      });
    }
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

  useEffect(() => {
    setLoadingState(true);
    let isSubscribed = true;
    const getFavoritesData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, ...`users/${user.uid}/favorites`.split('/'))
        );
        const data = [];
        querySnapshot.forEach((favoriteDoc) => {
          const info = {
            id: favoriteDoc.id,
            data: favoriteDoc.data().country
          };
          data.push(info);
          data.isOpen = true;
        });
        if (isSubscribed) {
          setAcctFavorites({ isOpen: false, data });
        }
        setLoadingState(false);
      } catch (error) {
        console.error(error);
      }
    };

    const getScoresData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, ...`users/${user.uid}/scores`.split('/'))
        );
        const data = [];
        querySnapshot.forEach((scoreDoc) => {
          const info = {
            id: scoreDoc.id,
            data: scoreDoc.data()
          };
          data.push(info);
          data.isOpen = true;
        });
        if (isSubscribed) {
          setAcctScores({ isOpen: false, data });
        }
        setLoadingState(false);
      } catch (error) {
        console.error(error);
      }
    };
    getFavoritesData();
    getScoresData();
    // eslint-disable-next-line no-return-assign
    return () => (isSubscribed = false);
  }, [user, favorites, scores]);

  const data = [
    {
      name: 'favorites',
      data: acctFavorites,
      boolean: favorites
    },
    {
      name: 'scores',
      data: acctScores,
      boolean: scores
    }
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
      deleteDocument
    };
    dynamicProps.acctData = piece.data;
    acct.push(<AccountData {...dynamicProps} />);
  });
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto'
      }}
    >
      {show && <Alert severity={message.style}>{message.content}</Alert>}
      <Grid item md={8} xs={12}>
        <AcctHeader
          loadingState={loadingState}
          favorites={acctFavorites?.data}
          scores={acctScores?.data}
          user={user}
        />
        {acct}
      </Grid>
    </Grid>
  );
};

Account.propTypes = {
  user: userType.isRequired,
  favorites: PropTypes.bool.isRequired,
  scores: PropTypes.bool.isRequired,
  simplifyString: PropTypes.func.isRequired
};
export default Account;
