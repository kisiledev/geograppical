/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const PrivateRoute = ({
  component: Component,
  authenticated,
  loadingState,
  ...rest
}) => {
  console.log(loadingState, 'loading');
  console.log(authenticated);
  if (loadingState || authenticated === false) {
    return (
      <div className="mt-5 mx-auto text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    );
  }
  return (
    <Route
      {...rest}
      render={(props) => (authenticated ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect to="/login" />
      ))}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  loadingState: PropTypes.bool.isRequired,
};
export default PrivateRoute;
