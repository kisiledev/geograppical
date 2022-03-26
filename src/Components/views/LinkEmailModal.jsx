/* eslint-disable global-require */
/* eslint-disable no-use-before-define */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebaseui";
import { Link, Redirect } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";
import { userType } from "../../helpers/Types/index";
import useSignUpForm from "../../helpers/CustomHooks";
import { auth } from "../../firebase/firebase";

const LinkEmailModal = (props) => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPWValid, setIsPWValid] = useState(false);

  const { message, close, show, user } = props;

  const linkEmail = () => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      inputs.email,
      inputs.passwordOne
    );
    auth.currentUser
      .linkWithCredential(credential)
      .then((usercred) => {
        const u = usercred.user;
        // setModalMessage({style: "success", content: "Linked email credentials to account"})
        console.log("success", u);
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

  const checkEmail = (value) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const iEV = regex.test(value);
    setIsEmailValid(iEV);
  };
  const checkPWValue = (value) => {
    const re2 = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
    const iPWV = !re2.test(value);
    setIsPWValid(iPWV);
  };

  if (user && user.uid) {
    return <Redirect to="/account" />;
  }

  const isInvalid =
    inputs.passwordOne !== inputs.passwordTwo ||
    inputs.passwordOne === "" ||
    inputs.email === "" ||
    inputs.username === "";

  return (
    <div className="mx-auto text-center col-lg-12">
      <Alert className="mt-3" show={show} variant={message.style}>
        {message.content}
      </Alert>
      <div className="row mb-3">
        <div className="col-lg-12 text-center">
          <h1 className="mt-2">Link Email</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <form onSubmit={handleSubmit}>
            <div className="form-group col-12 mb-4 mx-auto">
              <input
                value={inputs.username || ""}
                onChange={handleInputChange}
                type="text"
                name="username"
                className="form-control prefinput"
                placeholder="Full Name"
              />
            </div>
            <div className="form-group col-12 mb-4 mx-auto">
              <input
                value={inputs.email || ""}
                onChange={handleInputChange}
                type="email"
                name="email"
                className={`form-control ${
                  inputs.email === "" || !inputs.email
                    ? "prefinput"
                    : isEmailValid
                    ? "form-success"
                    : "form-error"
                }`}
                placeholder="Enter email"
              />
            </div>
            <div className="form-group col-12 mb-4 mx-auto">
              <input
                value={inputs.passwordOne || ""}
                onChange={handleInputChange}
                type="password"
                name="passwordOne"
                className={`form-control ${
                  inputs.passwordOne === "" || !inputs.passwordOne
                    ? "prefinput"
                    : isPWValid
                    ? "form-success"
                    : "form-error"
                }`}
                placeholder="Password"
              />
            </div>
            <div className="form-group col-12 mb-4 mx-auto">
              <input
                value={inputs.passwordTwo || ""}
                onChange={handleInputChange}
                type="password"
                name="passwordTwo"
                className={`form-control ${
                  inputs.passwordTwo === "" || !inputs.passwordTwo
                    ? "prefinput"
                    : inputs.passwordTwo === inputs.passwordOne
                    ? "form-success"
                    : "form-error"
                }`}
                placeholder="Confirm Password"
              />
            </div>
            <div className="mx-auto form-group">
              <button
                disabled={isInvalid}
                type="submit"
                className="provider-button email-button"
              >
                <span className="email-button__icon">
                  <img
                    src={require("../../img/auth_service_email.svg")}
                    className="emailicon"
                    alt="email icon"
                  />
                </span>
                <span className="google-button__text">Link with Email</span>
              </button>
            </div>
            <div className="mx-auto form-group">
              <button
                disabled={isInvalid}
                onClick={() => close()}
                type="button"
                className="provider-button"
              >
                <span className="google-button__text">
                  {message.style && message.style === "success"
                    ? "Close"
                    : "Cancel"}
                </span>
              </button>
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
LinkEmailModal.defaultProps = {
  user: null,
};
LinkEmailModal.propTypes = {
  user: userType,
  message: PropTypes.shape({
    style: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  close: PropTypes.bool.isRequired,
};
export default LinkEmailModal;
export { SignUpLink };
