/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Navigate, Outlet, Route, RouterProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

interface PrivateRouteProps extends RouterProps {
  component: any;
  authenticated: boolean;
  loadingState: boolean;
  path: string;
}
const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, authenticated, loadingState, ...rest } = props;
  if (loadingState) {
    return (
      <div className="mt-5 mx-auto text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    );
  }
  return (
    <Route
      {...rest}
      element={(props: PrivateRouteProps) =>
        authenticated ? <Route element={Component} /> : <Navigate to="/login" />
      }
    />
  );
};
export default PrivateRoute;
