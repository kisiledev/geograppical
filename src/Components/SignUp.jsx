import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import 'firebaseui';
import {
  userType,
} from '../Helpers/Types/index';
import { auth, googleProvider } from './Firebase/firebase';
import useSignUpForm from '../Helpers/CustomHooks';


const SignUp = (props) => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPWValid, setIsPWValid] = useState(false);
  const [message, setMessage] = useState({});

  const { inputs, handleInputChange, handleSubmit } = useSignUpForm(signup);

  const signup = () => {
    auth.createUserWithEmailAndPassword(inputs.email, inputs.passwordOne)
      .then((u) => {
        setMessage({ style: 'success', content: `Created user ${u.user.email}` });
      }).catch((error) => {
        setMessage({ style: 'danger', content: `${error.message}` });
      });
  };

  console.log(inputs.email);


  const checkEmail = (value) => {
    const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEMV = regex.test(value);
    console.log(isEmailValid);
    setIsEmailValid(isEMV);
  };
  const checkPWValue = (value) => {
    const re2 = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
    const isPWV = !re2.test(value);
    console.log(isPWValid);
    setIsPWValid(isPWV);
  };
  const googleSignUp = () => {
    auth.signInWithPopup(googleProvider).then((result) => {
      console.log(result);
    }).catch((error) => {
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
    return <Redirect to="/account" />;
  }

  const isInvalid = inputs.passwordOne !== inputs.passwordTwo
  || inputs.passwordOne === ''
  || inputs.email === ''
  || inputs.username === '';


  return (

    <div className="mx-auto col-lg-4">
      <Alert variant={message.style}>{message.content}</Alert>
      <div className="row mb-3">
        <div className="col-lg-12 text-center">
          <h1 className="mt-3">Sign Up</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <form onSubmit={handleSubmit}>
            <div className="form-group col-12 mb-4 mx-auto">
              <input
                value={inputs.username || ''}
                onChange={handleInputChange}
                type="text"
                name="username"
                className="form-control prefinput"
                placeholder="Full Name"
              />
            </div>
            <div className="form-group col-12 mb-4 mx-auto">
              <input
                value={inputs.email || ''}
                onChange={handleInputChange}
                type="email"
                name="email"
                className={`form-control ${(inputs.email === '' || !inputs.email) ? 'prefinput' : (isEmailValid ? 'form-success' : 'form-error')}`}
                placeholder="Enter email"
              />
            </div>
            <div className="form-group col-12 mb-4 mx-auto">
              <input
                value={inputs.passwordOne || ''}
                onChange={handleInputChange}
                type="password"
                name="passwordOne"
                className={`form-control ${(inputs.passwordOne === '' || !inputs.passwordOne) ? 'prefinput' : (isPWValid ? 'form-success' : 'form-error')}`}
                placeholder="Password"
              />
            </div>
            <div className="form-group col-12 mb-4 mx-auto">
              <input
                value={inputs.passwordTwo || ''}
                onChange={handleInputChange}
                type="password"
                name="passwordTwo"
                className={`form-control ${(inputs.passwordTwo === '' || !inputs.passwordTwo) ? 'prefinput' : (inputs.passwordTwo === inputs.passwordOne ? 'form-success' : 'form-error')}`}
                placeholder="Confirm Password"
              />
            </div>
            <div className="col-12 d-flex justify-content-center mb-3">
              <button disabled={isInvalid} type="submit" className="btn-primary email-button">
                <span className="email-button__icon">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg" className="emailicon" alt="email icon" />
                </span>
                <span className="email-button__text">Sign Up with Email</span>
              </button>
            </div>
            <div className="col-12 d-flex justify-content-center mb-3">
              <button onClick={(e) => googleSignUp(e)} type="button" className="google-button">
                <span className="google-button__icon">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="emailicon" alt="google icon" />
                </span>
                <span className="google-button__text">Sign Up with Google</span>
              </button>
            </div>
          </form>
          <SignUpLink />
        </div>
      </div>
    </div>
  );
};

const SignUpLink = () => (
  <div className="col-12 d-flex justify-content-center">
    <p>Already have an account? <Link to={`${process.env.PUBLIC_URL}/login`}>Sign In</Link></p>
  </div>
);

SignUp.propTypes = {
  user: userType.isRequired,
};
export default SignUp;
export { SignUpLink };
