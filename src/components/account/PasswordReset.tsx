/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import 'firebaseui';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, TextField, Link } from '@mui/material';
import { EmailOutlined, EmailRounded, Google } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { userType } from '../../helpers/types/index';
import useSignUpForm from '../../helpers/CustomHooks';
import { auth } from '../../firebase/firebase';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  loginButtons: {
    marginBottom: '10px'
  }
});

const PasswordReset = (props) => {
  const [message, setMessage] = useState({});
  const [loadingState, setLoadingState] = useState(true);

  const classes = useStyles();
  const reset = () => {
    auth
      .sendPasswordResetEmail(inputs.email)
      .then(() => {
        setMessage({
          style: 'success',
          content: `Password Reset Link sent to: ${inputs.email}`
        });
      })
      .catch((error) => {
        setMessage({ style: 'danger', content: `${error.message}` });
      });
  };
  const { inputs, handleInputChange, handleSubmit } = useSignUpForm(reset);

  // const uiConfig = {
  //   signInFlow: 'popup',
  //   signInSuccessUrl: '/',
  //   signInOptions: [
  //     firebase.auth.EmailAuthProvider.PROVIDER_ID,
  //     firebase.auth.GoogleAuthProvider.PROVIDER_ID
  //   ],
  //   callbacks: {
  //     signInSuccessWithAuthResult: (authResult, redirectUrl) => {
  //       console.log('signInSuccessWithAuthResult', authResult, redirectUrl)
  //       this.props.history.push('/')
  //       return false
  //     }
  //   }
  // }

  useEffect(() => {
    setTimeout(() => {
      setLoadingState(false);
    }, 1000);
  }, []);

  const { user } = props;
  if (user && user.uid) {
    return <Route path="/account" />;
  }

  return loadingState ? (
    <div className="mx-auto col-lg-4 text-center">
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  ) : (
    <Box
      sx={{
        maxWidth: '600px',
        margin: '50px auto 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {Object.keys(message)?.length > 0 && (
        <Alert severity={message.style}>{message.content}</Alert>
      )}
      <div className="row mb-3">
        <div className="col-lg-12 text-center">
          <h1 className="mt-3">Reset Password</h1>
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
          label="Email Address"
          value={inputs.email || ''}
          onChange={handleInputChange}
          type="email"
          name="email"
          placeholder="Enter email"
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          className={classes.loginButtons}
          startIcon={<EmailRounded />}
        >
          Send Password Reset
        </Button>
        <p>
          Don&apos;t have an account?
          <Link component={RouterLink} marginLeft="5px" to={`/signup`}>
            Sign Up
          </Link>
        </p>
        <p>
          Want to Sign In Instead?
          <Link component={RouterLink} marginLeft="5px" to={`/login`}>
            Sign In
          </Link>
        </p>
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
PasswordReset.defaultProps = {
  user: null
};
PasswordReset.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: userType
};
export default PasswordReset;
export { SignUpLink };
