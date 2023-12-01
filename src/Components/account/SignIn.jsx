/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import 'firebaseui';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Alert, Box, Button, TextField, Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { fetchSignInMethodsForEmail, signInWithPopup } from 'firebase/auth';
import { userType } from '../../helpers/types/index';
import { auth, googleProvider } from '../../firebase/firebase';
import useSignUpForm from '../../helpers/CustomHooks';
import { EmailOutlined, EmailRounded, Google } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  loginButtons: {
    marginBottom: '10px'
  }
});
const SignIn = (props) => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [methods, setMethods] = useState(null);
  const [message, setMessage] = useState({});

  const classes = useStyles();
  const login = () => {
    // console.log('reunning login');
    fetchSignInMethodsForEmail(auth, inputs.email)
      .then((u) => {
        // console.log(u);
        setMethods(u);
        if (u.length === 0 || u.includes('password')) {
          console.log('no methods');
          auth
            .signInWithEmailAndPassword(inputs.email, inputs.password)
            .then((us) => {
              // console.log(us);
              setMessage({
                style: 'success',
                content: `Logged in user ${us.user.email}`
              });
            })
            .catch((error) => {
              // console.log(error);
              // console.log(error.message);
              setMessage({
                style: 'danger',
                content: `${error.message} Sign up using the link below`
              });
            });
        } else {
          // console.log('methods found');
          // console.log(methods);
          const content = `You already have an account at ${u[0]} 
        Please login using this authentication method. Method: ${methods}`;
          // console.log(content);
          setMessage({ style: 'warning', content });
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
        setMessage({ style: 'danger', content: `${error.message}` });
      });
  };
  const { inputs, handleInputChange, handleSubmit } = useSignUpForm(login);

  useEffect(() => {
    checkEmail(inputs.email);
  }, [inputs.email]);

  const checkEmail = (value) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const checkValidity = regex.test(value);
    setIsEmailValid(checkValidity);
  };
  const googleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      const { credential } = error.credential;
    }
  };

  const { user, loadingState } = props;
  if (user && user.uid) {
    return <Redirect to="/account" />;
  }

  const isInvalid =
    inputs.password === '' ||
    !inputs.password ||
    inputs.email === '' ||
    !inputs.email;

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
          <h1 className="mt-3">Sign In</h1>
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
        <TextField
          variant="outlined"
          size="small"
          label="Password"
          value={inputs.password || ''}
          onChange={handleInputChange}
          type="password"
          name="password"
          placeholder="Password"
        />
        <Button
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
          onClick={googleSignUp}
          variant="contained"
          fullWidth
          className={classes.loginButtons}
          startIcon={<Google />}
        >
          Sign in with Google
        </Button>
        <p>
          Don&apos;t have an account?
          <Link component={RouterLink} marginLeft="5px" to={`/signup`}>
            Sign Up
          </Link>
        </p>
        <p>
          Forgot Your Password?
          <Link component={RouterLink} marginLeft="5px" to={`/passwordreset`}>
            Reset It
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
SignIn.defaultProps = {
  user: null
};
SignIn.propTypes = {
  user: userType,
  loadingState: PropTypes.bool.isRequired
};
export default SignIn;
export { SignUpLink };
