/* eslint-disable global-require */
/* eslint-disable no-use-before-define */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebaseui';
import { Link } from 'react-router-dom';
import useSignUpForm from '../../helpers/CustomHooks';
import { auth } from '../../firebase/firebase';
import { Alert, AlertColor, Box, Button, TextField } from '@mui/material';
import { EmailOutlined, EmailRounded, Google } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { linkWithCredential, User } from 'firebase/auth';
import { Route } from 'react-router';

const useStyles = makeStyles({
  loginButtons: {
    marginBottom: '10px'
  }
});

interface LinkEmailModalProps {
  user: User | null;
  linkEmail: (email: string, password: string) => void;
  message: {
    style: AlertColor;
    content: string;
  };
  close: () => void;
  show: boolean;
}
const LinkEmailModal = (props: LinkEmailModalProps) => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPWValid, setIsPWValid] = useState(false);

  const { message, close, show, user } = props;

  const classes = useStyles();
  const linkEmail = () => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      inputs.email,
      inputs.passwordOne
    );
    if (!auth.currentUser) {
      return;
    }
    linkWithCredential(auth.currentUser, credential)
      .then((usercred) => {
        const u = usercred.user;
        // setModalMessage({style: "success", content: "Linked email credentials to account"})
        console.log('success', u);
      })
      .catch((error) => {
        console.log(error);
        // setModalMessage({style: "danger", content: error.message})
      });
  };

  const { inputs, handleInputChange, handleSubmit } = useSignUpForm(linkEmail);
  useEffect(() => {
    checkEmail(inputs.email);
  }, [inputs.email]);

  useEffect(() => {
    checkPWValue(inputs.passwordOne);
  }, [inputs.passwordOne]);

  const checkEmail = (value: string) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmailValid = regex.test(value);
    setIsEmailValid(isEmailValid);
  };
  const checkPWValue = (value: string) => {
    const re2 = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
    const isPasswordValueValid = !re2.test(value);
    setIsPWValid(isPasswordValueValid);
  };

  if (user && user.uid) {
    return <Route path="/account" />;
  }

  const isInvalid =
    inputs.passwordOne !== inputs.passwordTwo ||
    inputs.passwordOne === '' ||
    inputs.email === '' ||
    inputs.username === '';

  return (
    <Box
      sx={{
        width: '600px',
        margin: '50px auto 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {Object.keys(message)?.length > 0 && (
        <Alert className="mt-3" color={message.style}>
          {message.content}
        </Alert>
      )}
      <div className="row mb-3">
        <div className="col-lg-12 text-center">
          <h1 className="mt-2">Link Email</h1>
        </div>
      </div>
      <Box
        component="form"
        sx={{
          margin: '10px',
          display: 'flex',
          width: '80%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '& .MuiTextField-root': {
            margin: 1,
            width: '100%'
          }
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          label="Full Name"
          value={inputs.username || ''}
          onChange={handleInputChange}
          type="text"
          name="username"
          placeholder="Enter Full Name"
        />
        <TextField
          variant="outlined"
          size="small"
          label="Email Address"
          value={inputs.email || ''}
          onChange={handleInputChange}
          type="email"
          name="email"
          placeholder="Enter email"
        />
        <TextField
          variant="outlined"
          size="small"
          label="Enter Password"
          value={inputs.passwordOne || ''}
          onChange={handleInputChange}
          type="password"
          name="passwordOne"
          placeholder="Enter Password"
        />
        <TextField
          variant="outlined"
          size="small"
          label="Confirm Password"
          error={
            (inputs.passwordTwo && inputs.passwordTwo !== inputs.passwordOne) ||
            inputs.passwordTwo === '' ||
            !inputs.passwordTwo
          }
          value={inputs.passwordTwo || ''}
          onChange={handleInputChange}
          type="password"
          name="passwordTwo"
          placeholder="Confirm Password"
        />
        <Button
          sx={{ marginTop: '20px' }}
          onClick={handleSubmit}
          disabled={isInvalid}
          variant="contained"
          fullWidth
          className={classes.loginButtons}
          startIcon={<EmailRounded />}
        >
          Sign in with Email
        </Button>
        <Button
          disabled={isInvalid}
          onClick={() => close()}
          variant="contained"
          fullWidth
          className={classes.loginButtons}
        >
          {message.style && message.style === 'success' ? 'Close' : 'Cancel'}
        </Button>
      </Box>
    </Box>
  );
};

const SignUpLink = () => (
  <div className="col-12 d-flex justify-content-center">
    <p>
      Already have an account?
      <Link to={`/login`}>Sign In</Link>
    </p>
  </div>
);
export default LinkEmailModal;
export { SignUpLink };
