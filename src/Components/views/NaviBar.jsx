import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Search } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { auth, googleProvider } from '../../Firebase/firebase';
import { userType } from '../../Helpers/Types/index';
// import * as ROUTES from '../../Constants/Routes';
import userImg from '../../img/user.png';
import { signInWithPopup } from 'firebase/auth';

const useStyles = makeStyles({
  appbar: {
    marginBottom: '50px',
    paddingLeft: '275px'
  },
  search: {
    position: 'relative',
    borderRadius: '3px',
    border: '1px solid white',
    width: '20vw',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
    padding: '5px'
  },
  searchField: {
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: '1px 1px 1px 0',
      textAlign: 'initial',
      marginLeft: '5px'
    }
  }
});

function NaviBar(props) {
  const { history, searchText, handleInput, user } = props;

  const settings = [
    { name: 'Profile', link: '/profile', loggedIn: true },
    { name: 'Favorites', link: '/favorites', loggedIn: true },
    { name: 'Dashboard', link: '/dashboard', loggedIn: true },
    { name: 'Logout', link: '/logout', loggedIn: true },
    { name: 'Sign In', link: '/login', loggedIn: false },
    { name: 'Sign Up', link: '/signup', loggedIn: false }
  ];
  const classes = useStyles();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw new Error(error);
    }
  };
  const logout = () => {
    auth.signOut();
    history.push('/');
  };

  const handleMenuClick = (name) => {
    if (name === 'Logout') {
      logout();
    }
    if (name === 'Sign In') {
      login();
    }
    if (name === 'Sign Up') {
      history.push('/signup');
    }
  };

  const searchMarkup = (
    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
      <Typography>Geograppical</Typography>
      <div className={classes.search}>
        <div className={classes.searchIconWrapper}>
          <Search />
        </div>
        <InputBase
          value={searchText}
          onChange={(e) => handleInput(e)}
          className={classes.searchField}
        />
      </div>
    </Box>
  );

  const accountMarkup = (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar src={user ? user.photoURL : userImg} alt="avatar" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings
          .filter((s) => (user ? s.loggedIn : !s.loggedIn))
          .map((setting) => (
            <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
              <Button onClick={() => handleMenuClick(setting.name)}>
                <Typography textAlign="center">{setting.name}</Typography>
              </Button>
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
  return (
    <AppBar className={classes.appbar}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {searchMarkup}
        {accountMarkup}
      </Toolbar>
    </AppBar>
  );
}
NaviBar.defaultProps = {
  user: null
};
NaviBar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  getResults: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  handleInput: PropTypes.func.isRequired,
  user: userType
};
export default withRouter(NaviBar);
