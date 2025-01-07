/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Navigate, Outlet, Route, RouterProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

interface PrivateRouteProps extends RouterProps {
  authenticated: boolean;
  loadingState: boolean;
}
const PrivateRoute = ({
  children,
  authenticated,
  loadingState
}: {
  children: JSX.Element;
  authenticated: boolean;
  loadingState: boolean;
}) => {
  if (loadingState) {
    return (
      <div className="mt-5 mx-auto text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    );
  }
  return authenticated ? children : <Navigate to="/login" />;
};
export default PrivateRoute;
