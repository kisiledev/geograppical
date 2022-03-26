/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
import React from "react";
import { Navbar, Nav, Form, FormControl, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { auth, googleProvider } from "../../firebase/firebase";
import { userType } from "../../helpers/Types/index";
import * as ROUTES from "../../constants/Routes";
import userImg from "../../img/user.png";

const NaviBar = (props) => {
  const { history, getResults, searchText, handleInput, user } = props;
  const login = () => {
    auth
      .signInWithPopup(googleProvider)
      .then((result) => {
        const u = result.user;
        console.log(u);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };
  const logout = () => {
    auth.signOut();
    history.push("/");
  };
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="info"
      variant="dark"
      className="mb-5"
    >
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Form
        className="ml-auto searchForm"
        onSubmit={(e) => getResults(searchText, e)}
      >
        <Row>
          <FormControl
            type="text"
            placeholder="Search"
            className="search mr-sm-2"
            value={searchText}
            onChange={(e) => handleInput(e)}
          />
        </Row>
      </Form>
      <Navbar.Collapse
        className="justify-content-end text-center"
        id="responsive-navbar-nav"
      >
        <Nav.Link href={ROUTES.ACCOUNT} className="nav-item-avatar">
          <img
            className="nav-avatar"
            src={user ? user.photoURL : userImg}
            alt="avatar"
          />
        </Nav.Link>
        {user ? null : (
          <Nav>
            <Nav.Link className="navbarlink" href={ROUTES.SIGN_UP}>
              Sign Up
            </Nav.Link>
            <Nav.Link className="navbarlink" href={ROUTES.SIGN_IN}>
              Sign In
            </Nav.Link>
          </Nav>
        )}
        {user ? (
          <button
            type="button"
            onClick={logout}
            className="btn btn-warning my-2"
          >
            Log Out
          </button>
        ) : (
          <button onClick={login} type="button" className="ml-2 google-button">
            <span className="google-button__icon">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="emailicon"
                alt="google icon"
              />
            </span>
            <span className="google-button__text">Sign in</span>
          </button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
NaviBar.defaultProps = {
  user: null,
};
NaviBar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  getResults: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  handleInput: PropTypes.func.isRequired,
  user: userType,
};
export default withRouter(NaviBar);
