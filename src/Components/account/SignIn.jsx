/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import "firebaseui";
import { Link, Redirect } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { userType } from "../../helpers/Types/index";
import { auth, googleProvider } from "../../firebase/firebase";
import useSignUpForm from "../../helpers/CustomHooks";

const SignIn = (props) => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [methods, setMethods] = useState(null);
  const [message, setMessage] = useState({});

  const { inputs, handleInputChange, handleSubmit } = useSignUpForm(login);

  const login = () => {
    // console.log('reunning login');
    auth
      .fetchSignInMethodsForEmail(inputs.email)
      .then((u) => {
        // console.log(u);
        setMethods(u);
        if (u.length === 0 || u.includes("password")) {
          console.log("no methods");
          auth
            .signInWithEmailAndPassword(inputs.email, inputs.password)
            .then((us) => {
              // console.log(us);
              setMessage({
                style: "success",
                content: `Logged in user ${us.user.email}`,
              });
            })
            .catch((error) => {
              // console.log(error);
              // console.log(error.message);
              setMessage({
                style: "danger",
                content: `${error.message} Sign up using the link below`,
              });
            });
        } else {
          // console.log('methods found');
          // console.log(methods);
          const content = `You already have an account at ${u[0]} 
        Please login using this authentication method. Method: ${methods}`;
          // console.log(content);
          setMessage({ style: "warning", content });
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
        setMessage({ style: "danger", content: `${error.message}` });
      });
  };

  useEffect(() => {
    checkEmail(inputs.email);
  }, [inputs.email]);

  const checkEmail = (value) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const checkValidity = regex.test(value);
    setIsEmailValid(checkValidity);
  };
  const googleSignUp = () => {
    auth
      .signInWithPopup(googleProvider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
        const { credential } = error.credential;
        console.log(credential);
      });
  };

  const { user, loadingState } = props;
  if (user && user.uid) {
    return <Redirect to="/account" />;
  }

  const isInvalid =
    inputs.password === "" ||
    !inputs.password ||
    inputs.email === "" ||
    !inputs.email;

  return loadingState ? (
    <div className="mx-auto col-lg-4 text-center">
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  ) : (
    <div className="mx-auto col-lg-4">
      <Alert variant={message.style}>{message.content}</Alert>
      <div className="row mb-3">
        <div className="col-lg-12 text-center">
          <h1 className="mt-3">Sign In</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <form>
            <div className="form-group mx-auto">
              <label htmlFor="exampleInputEmail1">Email address</label>
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
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
            </div>
            <div className="form-group mx-auto mb-3">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                value={inputs.password || ""}
                onChange={handleInputChange}
                type="password"
                name="password"
                className="form-control prefinput"
                id="exampleInputPassword1"
                placeholder="Password"
              />
            </div>
            <div className="col-12 d-flex justify-content-center mt-5 mb-3">
              <button
                onClick={handleSubmit}
                disabled={isInvalid}
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
                <span className="email-button__text">Sign in with Email</span>
              </button>
            </div>
            <div className="col-12 d-flex justify-content-center mb-3">
              <button
                onClick={googleSignUp}
                type="button"
                className="google-button"
              >
                <span className="google-button__icon">
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    className="emailicon"
                    alt="google icon"
                  />
                </span>
                <span className="google-button__text">Sign in with Google</span>
              </button>
            </div>
            <div className="col-12 d-flex justify-content-center">
              <p>
                Don&apos;t have an account?
                <Link to={`/signup`}>Sign Up</Link>
              </p>
            </div>
            <div className="col-12 d-flex justify-content-center">
              <p>
                Forgot Your Password?
                <Link to={`/passwordreset`}>Reset It</Link>
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
SignIn.defaultProps = {
  user: null,
};
SignIn.propTypes = {
  user: userType,
  loadingState: PropTypes.bool.isRequired,
};
export default SignIn;
export { SignUpLink };
