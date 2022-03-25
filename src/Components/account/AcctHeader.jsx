/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable global-require */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import {
//   countryType,
// } from '../../helpers/Types/index';

const AcctHeader = (props) => {
  const {
    loadingState,
    acctFavorites,
    acctScores,
    user,
  } = props;
  return (
    <div className="card col-lg-8 col-xl-6 mx-auto mb-3">
      <div className="row">
        <div className="col-12 text-center">
          <img className="avatar img-fluid" src={user && user.photoURL ? user.photoURL : require('../../img/user.png')} alt="" />
        </div>
        <div className="col-12 text-center">
          <h5 className="mt-3">
            {user.displayName}
          </h5>
          <p>
            Account created
            {new Date(user.metadata.creationTime).toLocaleDateString()}
          </p>
          <p>{user.email}</p>
          <p>{user.phoneNumber ? user.phoneNumber : 'No phone number added'}</p>
          {loadingState ? <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="2x" />
            : (
              <>
                <h6>Stats</h6>
                <p>
                  {acctFavorites && acctFavorites.data.length}
                  {acctFavorites && acctFavorites.length === 1 ? ' Favorite' : ' Favorites'}
                </p>
                <p>
                  {acctScores && acctScores.data.length}
                  {acctScores && acctScores.length === 1 ? ' Score' : ' Scores'}
                </p>
              </>
            )}
        </div>
        <div className="col-12 text-center">
          <Link
            className="btn btn-success"
            to={`${process.env.PUBLIC_URL}/account/edit`}
          >
            <FontAwesomeIcon className="acctedit" icon={faPencilAlt} />
              Edit Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AcctHeader;
