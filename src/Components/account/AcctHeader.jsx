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
import { Avatar, Button, Card, Grid, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
// import PropTypes from 'prop-types';
// import {
//   countryType,
// } from '../../helpers/Types/index';

const AcctHeader = (props) => {
  const { loadingState, favorites, scores, user } = props;
  return (
    <Card
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
            sx={{ width: 96, height: 96, border: '2px solid #000' }}
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
          <Typography component="h5" variant="h5" sx={{ marginTop: '5px' }}>
            {user.displayName}
          </Typography>
          <Typography component="p" variant="p">
            {`User since ${new Date(
              user.metadata.creationTime
            ).toLocaleDateString()}`}
          </Typography>
          <Typography component="p" variant="p" sx={{ fontWeight: 600 }}>
            {user.email}
          </Typography>
          <Typography component="p" variant="p">
            {user.phoneNumber ? user.phoneNumber : 'No phone number added'}
          </Typography>
          {loadingState ? (
            <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="2x" />
          ) : (
            <>
              <Typography
                component="h6"
                variant="h6"
                sx={{ marginTop: '25px', fontWeight: 600 }}
              >
                Stats
              </Typography>
              <Typography>
                {favorites?.length === 0
                  ? 'No Favorites'
                  : `${favorites?.length} Favorite${
                      favorites?.length > 1 && 's'
                    }`}
              </Typography>
              <Typography>
                {scores?.length === 0
                  ? 'No Scores'
                  : `${scores?.length} Score${scores?.length > 1 && 's'}`}
              </Typography>
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
            sx={{ marginTop: '20px' }}
          >
            Edit Account
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AcctHeader;
