/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable global-require */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  Avatar,
  Button,
  Card,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import userImg from '../../img/user.png';

const AcctHeader = (props) => {
  const { loadingState, favorites, scores, user, edit, setEdit } = props;
  const [hover, setHover] = useState(false);
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
            flexDirection: 'column',
            position: 'relative'
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              border: '2px solid #000',
              opacity: edit && hover ? 0.5 : 1,
              backgroundColor: '#000'
            }}
            src={user ? user.photoURL : userImg}
            alt={user.name}
          />
          {edit && hover && (
            <IconButton
              sx={{
                position: 'absolute',
                margin: '0 auto',
                padding: '40%'
              }}
              component="label"
            >
              <Edit color="#f4a" titleAccess="Click to edit" />
              <input type="file" id="upload-img" hidden />
            </IconButton>
          )}
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
            variant="contained"
            color="success"
            onClick={() => setEdit(!edit)}
            startIcon={!edit ? <Edit /> : <ArrowBack />}
            sx={{ marginTop: '20px' }}
          >
            {edit ? 'Back to Account' : 'Edit Account'}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AcctHeader;
