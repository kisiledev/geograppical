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
import userImg from '../../img/user.png';
import { Avatar, Button, Card, Grid } from '@mui/material';
import { Edit } from '@mui/icons-material';
// import PropTypes from 'prop-types';
// import {
//   countryType,
// } from '../../helpers/Types/index';

const AcctHeader = (props) => {
  const { loadingState, favorites, scores, user } = props;
  return (
    <Card
      raised
      sx={{
        marginBottom: '50px',
        padding: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontSize: 16
      }}
    >
      <Grid
        container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Grid
          item
          sm={12}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            sx={{ width: 96, height: 96 }}
            src={user ? user.photoURL : userImg}
            alt={user.name}
          />
        </Grid>
        <Grid
          item
          sm={12}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <h5 className="mt-3">{user.displayName}</h5>
          <p>
            {`Account created ${new Date(
              user.metadata.creationTime
            ).toLocaleDateString()}`}
          </p>
          <p>{user.email}</p>
          <p>{user.phoneNumber ? user.phoneNumber : 'No phone number added'}</p>
          {loadingState ? (
            <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="2x" />
          ) : (
            <>
              <h6>Stats</h6>
              <p>
                {favorites?.length === 0
                  ? 'No Favorites'
                  : `${favorites?.length} Favorite${
                      favorites?.length === 1 && 's'
                    }`}
              </p>
              <p>
                {scores?.length === 0
                  ? 'No Scores'
                  : `${scores?.length} Score${scores?.length === 1 && 's'}`}
              </p>
            </>
          )}
        </Grid>
        <Grid item sm={12}>
          <Button
            LinkComponent={Link}
            variant="contained"
            color="success"
            to="/account/edit"
            startIcon={<Edit />}
          >
            Edit Account
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AcctHeader;
