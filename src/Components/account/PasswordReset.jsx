/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import "firebaseui";
import { Link, Redirect } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { userType } from "../../helpers/Types/index";
import useSignUpForm from "../../helpers/CustomHooks";
import { auth } from "../../firebase/firebase";

const PasswordReset = (props) => {
  const [message, setMessage] = useState({});
  const [loadingState, setLoadingState] = useState(true);

  const reset = () => {
    auth
      .sendPasswordResetEmail(inputs.email)
      .then(() => {
        setMessage({
          style: "success",
          content: `Password Reset Link sent to: ${inputs.email}`,
        });
      })
      .catch((error) => {
        setMessage({ style: "danger", content: `${error.message}` });
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
    return <Redirect to="/account" />;
  }

  return loadingState ? (
    <div className="mx-auto col-lg-4 text-center">
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  ) : (
    <div className="mx-auto col-lg-4">
      <Alert variant={message.style}>{message.content}</Alert>
      <div className="row mb-3">
        <div className="col-lg-12 text-center">
          <h1 className="mt-3">Reset Password</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          {/* <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} /> */}
          <form>
            <div className="form-group col-12 mx-auto">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                value={inputs.email || ""}
                onChange={handleInputChange}
                type="email"
                name="email"
                className="form-control prefinput"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
            </div>
            <div className="col-12 d-flex justify-content-center mb-3">
              <button
                onClick={handleSubmit}
                type="button"
                className="btn-primary email-button"
              >
                <span className="email-button__icon">
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg"
                    className="emailicon"
                    alt="email icon"
                  />
                </span>
                <span className="email-button__text">Reset Password</span>
              </button>
            </div>
            <div className="col-12 d-flex justify-content-center">
              <p>
                Don't have an account?
                <Link to={`/signup`}>Sign Up</Link>
              </p>
            </div>
            <div className="col-12 d-flex justify-content-center">
              <p>
                Already have an account?
                <Link to={`/login`}>Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
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
  user: null,
};
PasswordReset.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: userType,
};
export default PasswordReset;
export { SignUpLink };
