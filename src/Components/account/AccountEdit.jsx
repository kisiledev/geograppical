/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faArrowLeft,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import {
  EmailAuthProvider,
  FacebookAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
  unlink
} from 'firebase/auth';
import { auth, firebaseApp } from '../../Firebase/firebase';
import LinkEmailModal from '../views/LinkEmailModal';
import { userType } from '../../Helpers/Types';
import userImg from '../../img/user.png';
import facebookIcon from '../../img/facebook-icon-white.svg';
import twitterIcon from '../../img/Twitter_Logo_WhiteOnBlue.svg';
import emailIcon from '../../img/auth_service_email.svg';

const AccountEdit = (props) => {
  const { user } = props;

  const [providers, setProviders] = useState(user.providerData);
  const [message, setMessage] = useState('');
  const [favorites, setFavorites] = useState('');
  const [scores, setScores] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [show, setShow] = useState(false);

  const db = getFirestore(firebaseApp);
  const unlinkProvider = async (provider) => {
    try {
      console.log('provider', provider);
      await unlink(auth.currentUser, provider);
      setMessage({
        style: 'danger',
        content: `Unlinked provider ${provider}`
      });
      setProviders(user.providerData);
    } catch (error) {
      console.log(error);
    }
  };
  const close = () => {
    setShow(false);
    setProviders(user.providerData);
  };
  const linkEmail = (email, password) => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    auth.currentUser
      .linkWithCredential(credential)
      .then((usercred) => {
        const funcuser = usercred.user;
        setModalMessage({
          style: 'success',
          content: 'Linked email credentials to account'
        });
        console.log('success', funcuser);
      })
      .catch((error) => {
        console.log(error);
        setModalMessage({ style: 'danger', content: error.message });
      });
  };
  const providerLink = async (provider) => {
    let providerSource;
    switch (provider) {
      case 'Twitter':
        providerSource = new TwitterAuthProvider();
        break;
      case 'Facebook':
        providerSource = new FacebookAuthProvider();
        break;
      case 'Google':
        providerSource = new GoogleAuthProvider();
        break;
      default:
        return providerSource;
    }
    try {
      const result = await signInWithPopup(auth, providerSource);
      const redirectResult = await getRedirectResult(auth);

      if (redirectResult) {
        const credential = providerSource.credentialFromResult(redirectResult);
        const token = credential.accessToken;
        console.log(credential, token);
        setProviders(user.providerData);
      }
    } catch (error) {
      console.error(error);
      const { credential } = error;
      console.log(credential);
    }
    // auth
    //   .getRedirectResult()
    //   .then((result) => {
    //     if (result.credential) {
    //       const { credential, resuser } = result;
    //       console.log(credential, resuser);
    //       console.log(providers);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     const { credential } = error;
    //     console.log(credential);
    //   });
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
        });
        if (isSubscribed) {
          setFavorites(data);
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
        });
        if (isSubscribed) {
          setScores(data);
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
  }, [user]);

  const providersArray = [
    {
      id: 1,
      name: 'Google',
      provName: 'google.com',
      icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
      onClick: () => providerLink('Google')
    },
    {
      id: 2,
      name: 'Facebook',
      provName: 'facebook.com',
      icon: facebookIcon,
      onClick: () => providerLink('Facebook')
    },
    {
      id: 3,
      name: 'Twitter',
      provName: 'twitter.com',
      icon: twitterIcon,
      onClick: () => providerLink('Twitter')
    },
    {
      id: 4,
      name: 'Email',
      provName: 'password',
      icon: emailIcon,
      onClick: () => setShow(true)
    }
  ];
  const userProvs = [];
  if (providers) {
    providers.map((data) => userProvs.push(data.providerId));
  }
  const provIcons = [];
  providersArray.map((prov) => {
    const provider = {};
    provider.name = prov.provName;
    provider.icon = prov.icon;
    return provIcons.push(provider);
  });
  return (
    <>
      <Modal show={show}>
        <LinkEmailModal
          linkEmail={linkEmail}
          close={close}
          message={modalMessage}
        />
      </Modal>
      <div className="col-sm-12 col-md-6 mx-auto">
        {message && show && (
          <Alert severity={message.style}>{message.content}</Alert>
        )}
        <div className="card col-lg-8 col-xl-8 mx-auto ">
          <div className="row">
            <div className="col-12 text-center d-flex align-items-center justify-content-center flex-column">
              <img
                className="avatar img-fluid"
                src={user ? user.photoURL : userImg}
                alt=""
              />
              <div className="btn btn-link btn-file">
                Edit avatar
                <input type="file" id="upload-img" />
              </div>
            </div>
            <div className="col-12 text-center">
              <h5 className="mt-3">{user.displayName}</h5>
              <p>
                Account created
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </p>
              <p>{user.email}</p>
              <p>
                {user.phoneNumber ? (
                  user.phoneNumber
                ) : (
                  <Link to="/account/edit">Add Phone</Link>
                )}
              </p>
              {loadingState ? (
                <FontAwesomeIcon
                  className="my-5"
                  icon={faSpinner}
                  spin
                  size="2x"
                />
              ) : (
                <>
                  <h6>Stats</h6>
                  <p>
                    {favorites?.length === 0
                      ? 'No Favorites'
                      : `${favorites?.length} Favorite${
                          favorites?.length === 1 && 's'
                        }`}
                  </p>
                  <p>
                    {scores?.length === 0
                      ? 'No Scores'
                      : `${scores?.length} Score${scores?.length === 1 && 's'}`}
                  </p>
                </>
              )}
            </div>
            <div className="col-12 text-center">
              <Link className="btn btn-primary" to={`/account`}>
                <FontAwesomeIcon className="acctedit" icon={faArrowLeft} />
                Back to Account
              </Link>
            </div>
          </div>
        </div>
        <h3 className="mt-5">Account Credentials</h3>
        <div className="d-flex">
          {providers &&
            providers.map((data) => (
              <div key={data.uid} className="card mb-3">
                {providersArray.map((prov) => {
                  if (data.providerId === prov.provName) {
                    return (
                      <img
                        src={prov.icon}
                        key={prov.id}
                        className="mb-3 providericon"
                        alt={`${prov.name.toLowerCase()} icon`}
                      />
                    );
                  }
                  return null;
                })}
                <div className="d-flex justify-content-between">
                  <div className="align-items-start">
                    <p>
                      <strong>Name </strong>-{data.displayName}
                    </p>
                    {data.email && (
                      <p>
                        <strong>Email </strong>-{data.email}
                      </p>
                    )}
                    {providersArray.map((prov) => {
                      if (data.providerId === prov.provName) {
                        return (
                          <p key={prov.id}>
                            <strong>Provider </strong>-{prov.name}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    onClick={() => unlinkProvider(data.providerId)}
                    color="error"
                    variant="contained"
                    size="small"
                    endIcon={
                      <FontAwesomeIcon icon={faTrashAlt} color="white" />
                    }
                  >
                    Unlink
                  </Button>
                </div>
              </div>
            ))}
        </div>
        {providersArray.map((provider) => {
          if (!userProvs.includes(provider.provName)) {
            return (
              <div
                key={provider.id}
                className="col-12 d-flex w-100 justify-content-center mb-3"
              >
                <Button
                  onClick={provider.onClick}
                  variant="contained"
                  className={`provider-button ${provider.name.toLowerCase()}-button`}
                  startIcon={
                    <img
                      src={provider.icon}
                      className={`${provider.name.toLowerCase()}icon`}
                      alt="google icon"
                    />
                  }
                >
                  {`Link with ${provider.name}`}
                </Button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

AccountEdit.propTypes = {
  user: userType.isRequired
};

export default AccountEdit;
