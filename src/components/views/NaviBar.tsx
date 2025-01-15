import React, { useState } from 'react';
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
import { signInWithPopup, User } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase';
// import * as ROUTES from '../../Constants/Routes';
import userImg from '../../img/user.png';
import { useNavigate } from 'react-router';

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

interface NaviBarProps {
  searchText: string;
  handleInput: Function;
  user: User | null;
}
function NaviBar(props: NaviBarProps) {
  const { searchText, handleInput, user = null } = props;

  const settings = [
    { name: 'Profile', link: '/account', loggedIn: true },
    { name: 'Favorites', link: '/favorites', loggedIn: true },
    { name: 'Dashboard', link: '/account', loggedIn: true },
    { name: 'Logout', link: '/logout', loggedIn: true },
    { name: 'Sign In', link: '/login', loggedIn: false },
    { name: 'Sign Up', link: '/signup', loggedIn: false }
  ];
  const classes = useStyles();

  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<Element | null>(null);

  const handleOpenUserMenu = (event: React.MouseEvent) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    auth.signOut();
    navigate('/');
    console.log('pushing to root');
  };

  const handleMenuClick = (name: string) => {
    const selected = settings.filter((s) => s.name === name)[0];
    if (name === 'Logout') {
      logout();
    }
    if (name === 'Sign In') {
      navigate('/login');
    }
    if (name === 'Sign Up') {
      navigate('/signup');
    } else {
      navigate(selected.link);
    }
  };

  const searchMarkup = (
    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
      <Box className={classes.search}>
        <Box>
          <Search />
        </Box>
        <InputBase
          value={searchText}
          onChange={(e) => handleInput(e)}
          className={classes.searchField}
        />
      </Box>
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
export default NaviBar;
