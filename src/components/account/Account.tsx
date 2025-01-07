/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import { Alert, Grid2 } from '@mui/material';
import PropTypes from 'prop-types';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore
} from 'firebase/firestore';
import AccountData from './AccountData';
import {
  favoritesCollection,
  firebaseApp,
  scoresCollection
} from '../../firebase/firebase';
import {
  AccountDataType,
  FavoriteData,
  FavoritePayload,
  GameData,
  Message,
  ScoreData,
  ScorePayload,
  userType
} from '../../helpers/types/index';
import AcctHeader from './AcctHeader';
import AccountEdit from './AccountEdit';
import { User } from 'firebase/auth';

interface AccountProps {
  user: User | null;
  scores: boolean;
  favorites: boolean;
  simplifyString: (string: string) => string;
}
const Account = (props: AccountProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const [acctFavorites, setAcctFavorites] = useState<FavoritePayload>({
    isOpen: false,
    data: []
  });
  const [acctScores, setAcctScores] = useState<ScorePayload>({
    isOpen: false,
    data: []
  });
  const [message, setMessage] = useState<Message>({
    link: '',
    linkContent: '',
    content: '',
    style: 'info'
  });
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);

  console.log(acctScores, acctFavorites);
  const { user, scores = [], favorites = [], simplifyString } = props;

  const db = getFirestore(firebaseApp);
  const deleteDocument = async (id: string, type: string) => {
    if (!user) {
      return;
    }
    let docRef;
    if (type === 'favorites') {
      docRef = doc(
        favoritesCollection,
        ...`users/${user.uid}/${type}/${id}`.split('/')
      );
    } else {
      docRef = doc(
        scoresCollection,
        ...`users/${user.uid}/${type}/${id}`.split('/')
      );
    }
    try {
      await deleteDoc(docRef);
      setShow(true);
      setMessage({
        ...message,
        style: 'warning',
        content: `Removed ${id} from ${type}`
      });
    } catch (error) {
      setMessage({
        ...message,
        style: 'error',
        content: `Error removing ${id} from ${type}, ${error}`
      });
    }
  };

  const toggleData = (type: AccountDataType) => {
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
        if (!user) {
          return;
        }
        const querySnapshot = await getDocs(
          collection(db, `users/${user.uid}/favorites`)
        );
        const data: FavoriteData = [];
        querySnapshot.forEach((favoriteDoc) => {
          const info = {
            id: favoriteDoc.id,
            data: favoriteDoc.data().country
          };
          data.push(info);
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
      if (!user?.uid) {
        return;
      }
      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${user.uid}/scores`)
        );
        const data: ScoreData = [];
        querySnapshot.forEach((scoreDoc) => {
          const info = {
            id: scoreDoc.id,
            data: scoreDoc.data() as GameData
          };
          data.push(info);
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
    return () => {
      isSubscribed = false;
    };
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
  const acct: JSX.Element[] = [];
  const capitalize = (s: string) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  data.forEach((piece) => {
    const dynamicProps = {
      key: piece.name,
      name: piece.name,
      toggleData,
      loadingState,
      simplifyString,
      capitalize,
      deleteDocument,
      acctData: piece.data
    };
    acct.push(<AccountData {...dynamicProps} />);
  });
  return (
    <Grid2
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
      <Grid2 size={{ md: 8, xs: 12 }}>
        <AcctHeader
          edit={edit}
          setEdit={setEdit}
          loadingState={loadingState}
          favorites={acctFavorites?.data}
          scores={acctScores?.data}
          user={user}
        />
        {!edit && acct}
        {edit && <AccountEdit user={user} />}
      </Grid2>
    </Grid2>
  );
};
export default Account;
