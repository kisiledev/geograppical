/* eslint-disable no-use-before-define */
import { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import { Alert, AlertColor, Box, Button, TextField } from '@mui/material';
import 'firebaseui';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase';
import useSignUpForm from '../../helpers/CustomHooks';
import { EmailRounded, Google } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  loginButtons: {
    marginBottom: '10px'
  }
});

interface SignUpProps {
  user: User | null;
}
const SignUp = (props: SignUpProps) => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPWValid, setIsPWValid] = useState(false);
  const [message, setMessage] = useState<{
    style: AlertColor;
    content: string;
  }>({
    style: 'info',
    content: ''
  });

  const classes = useStyles();
  const signup = () => {
    createUserWithEmailAndPassword(auth, inputs.email, inputs.passwordOne)
      .then((u) => {
        setMessage({
          style: 'success',
          content: `Created user ${u.user.email}`
        });
      })
      .catch((error) => {
        setMessage({ style: 'error', content: `${error.message}` });
      });
  };
  const { inputs, handleInputChange, handleSubmit } = useSignUpForm(signup);

  console.log(inputs.passwordOne);

  const checkEmail = (value: string) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEMV = regex.test(value);
    console.log(isEmailValid);
    setIsEmailValid(isEMV);
  };
  const checkPWValue = (value: string) => {
    const re2 = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
    const isPWV = !re2.test(value);
    console.log(isPWValid);
    setIsPWValid(isPWV);
  };
  const googleSignUp = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
        const credential = error.credential;
        console.log(credential);
      });
  };
  useEffect(() => {
    console.log('checking email');
    checkEmail(inputs.email);
  }, [inputs.email]);

  useEffect(() => {
    console.log('checking password');
    checkPWValue(inputs.passwordOne);
  }, [inputs.passwordOne]);

  const { user } = props;
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
          <h1 className="mt-3">Sign Up</h1>
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
      </Box>
      <SignUpLink />
    </Box>
  );
};

const SignUpLink = () => (
  <div className="col-12 d-flex justify-content-center">
    <p>
      Already have an account? <Link to={`/login`}>Sign In</Link>
    </p>
  </div>
);
export default SignUp;
export { SignUpLink };
