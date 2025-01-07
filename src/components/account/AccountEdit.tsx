/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  Icon,
  IconButton,
  Typography
} from '@mui/material';
import { getFirestore } from 'firebase/firestore';
import {
  FacebookAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
  unlink,
  User
} from 'firebase/auth';
import {
  EmailTwoTone,
  FacebookTwoTone,
  Google,
  LinkOff
} from '@mui/icons-material';
import X from '@mui/icons-material/X';
import { auth, firebaseApp } from '../../firebase/firebase';
import LinkEmailModal from '../views/LinkEmailModal';
import { userType } from '../../helpers/types';

interface AccountEditProps {
  user: User | null;
}
const AccountEdit = (props: AccountEditProps) => {
  const { user } = props;

  const [providers, setProviders] = useState(user ? user.providerData : []);
  const [message, setMessage] = useState('');
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
        console.log(user.providerData);
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

  const providersArray = [
    {
      id: 1,
      name: 'Google',
      provName: 'google.com',
      icon: <Google />,
      onClick: () => providerLink('Google')
    },
    {
      id: 2,
      name: 'Facebook',
      provName: 'facebook.com',
      icon: <FacebookTwoTone />,
      onClick: () => providerLink('Facebook')
    },
    {
      id: 3,
      name: 'X',
      provName: 'x.com',
      icon: <X />,
      onClick: () => providerLink('Twitter')
    },
    {
      id: 4,
      name: 'Email',
      provName: 'password',
      icon: <EmailTwoTone />,
      color: 'primary',
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
      <Dialog open={show} onClose={() => setShow(false)}>
        <LinkEmailModal
          linkEmail={linkEmail}
          close={close}
          message={modalMessage}
        />
      </Dialog>
      {message && show && (
        <Alert severity={message.style}>{message.content}</Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5" margin="30px">
          Account Credentials
        </Typography>

        <Typography variant="h6" margin="15px">
          {providers && providers.length === 0 && 'No '} Linked Auth Providers
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {providers &&
            providers.map((data) => (
              <Card
                key={data.uid}
                sx={{
                  padding: '20px',
                  width: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                {providersArray.map((prov) => {
                  if (data.providerId === prov.provName) {
                    return (
                      <Box
                        key={prov.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <IconButton sx={{ marginRight: '10px' }}>
                          {prov.icon}
                        </IconButton>
                        <Typography>{prov.name}</Typography>
                      </Box>
                    );
                  }
                  return null;
                })}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ alignItems: 'flex-start' }}>
                    <Typography fontSize="16px" component="p">
                      {data.displayName}
                    </Typography>
                    {data.email && (
                      <Typography
                        fontSize="16px"
                        fontWeight={600}
                        component="p"
                      >
                        {data.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Button
                  onClick={() => unlinkProvider(data.providerId)}
                  color="error"
                  variant="contained"
                  size="small"
                  endIcon={<LinkOff />}
                  sx={{ marginTop: '10px' }}
                >
                  Unlink
                </Button>
              </Card>
            ))}
        </Box>

        <Typography variant="h6" margin="15px">
          Available Auth Providers
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: '50px'
          }}
        >
          {providersArray.map((provider) => {
            if (!userProvs.includes(provider.provName)) {
              return (
                <IconButton
                  title={provider.name}
                  onClick={provider.onClick}
                  variant="contained"
                >
                  {provider.icon}
                </IconButton>
              );
            }
            return null;
          })}
        </Box>
      </Box>
    </>
  );
};

export default AccountEdit;
