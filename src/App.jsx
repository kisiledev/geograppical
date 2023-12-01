/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { BreakpointProvider, Breakpoint } from 'react-socks';
import {
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import PropTypes, { shape } from 'prop-types';
import ResultView from './Components/views/ResultView';
import DetailView from './Components/views/DetailView';
import NaviBar from './Components/views/NaviBar';
import { auth, firebaseApp, googleProvider } from './Firebase/firebase';
import Game from './Components/games/Game';
import Account from './Components/account/Account';
import SignIn from './Components/account/SignIn';
import SignUp from './Components/account/SignUp';
import PrivateRoute from './Components/account/PrivateRoutes';
import PasswordReset from './Components/account/PasswordReset';
import AccountEdit from './Components/account/AccountEdit';
import SearchResults from './Components/views/SearchResults';
import SideNaviBar from './Components/views/SideNaviBar';
import { loginUser, changeView, changeMap } from './redux-toolkit';
import { loadData } from './redux/data/dataSlice';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const App = (props) => {
  const dispatch = useDispatch();
  const mapView = useSelector((state) => state.mapView.value);
  const view = useSelector((state) => state.view.value);
  const toggleSidebar = useSelector((state) => state.toggleSidebar);
  const mode = useSelector((state) => state.mode.value);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState(false);
  const [scores, setScores] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [filterNations, setFilterNations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [worldData, setWorldData] = useState([]);
  const [countryDetail, setCountryDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({});
  const [search, setSearch] = useState('');

  const { history, location } = props;

  const db = getFirestore(firebaseApp);
  const handleViews = (selectedView) => {
    dispatch(changeView(selectedView));
  };

  const loadWorldData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, ...`countries`.split('/'))
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setWorldData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const simplifyString = (string) =>
    string
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/gi, '')
      .toUpperCase();

  const handleClose = () => {
    setShowModal(false);
  };
  const handleOpen = () => {
    setShowModal(true);
  };
  const setStateModal = (modalsetting) => {
    setModal(modalsetting);
  };
  const login = async () => {
    try {
      const loggedInUser = await auth.signInWithPopup(googleProvider);
      setUser(loggedInUser);
    } catch (err) {
      console.log(err);
    }
  };

  const hoverOnCountry = (e, region, country) => {
    e.stopPropagation();
    if (view === 'detail') {
      dispatch(changeView('default'));
    }
    let nodes = document.getElementsByClassName('country');
    nodes = [...nodes];
    nodes = nodes.filter(
      (y) =>
        simplifyString(country) === simplifyString(y.dataset.longname) ||
        simplifyString(country) === simplifyString(y.dataset.shortname)
    );
    nodes.forEach((node) => {
      node.style.fill = '#ee0a43';
      node.style.stroke = '#111';
      node.style.strokeWidth = 0.1;
      node.style.outline = 'none';
      node.style.willChange = 'all';
    });
  };
  const hoverOffCountry = (e, region, country) => {
    e.stopPropagation();
    let nodes = document.getElementsByClassName('country');
    nodes = [...nodes];
    nodes = nodes.filter(
      (y) =>
        simplifyString(country) === simplifyString(y.dataset.longname) ||
        simplifyString(country) === simplifyString(y.dataset.shortname)
    );
    nodes.forEach((node) => {
      node.removeAttribute('style');
      node.style.fill = '#024e1b';
      node.style.stroke = '#111';
      node.style.strokeWidth = 0.1;
      node.style.outline = 'none';
      node.style.willChange = 'all';
    });
  };
  const hoverOnRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = region && Object.values(region)[2];
    if (typeof countries === 'object') {
      svgs = countries.map((country) => simplifyString(country.name));
    }
    let nodes = document.getElementsByClassName('country');
    nodes = [...nodes];
    nodes = nodes.filter(
      (y) =>
        svgs.includes(simplifyString(y.dataset.longname)) ||
        svgs.includes(simplifyString(y.dataset.shortname))
    );
    nodes.forEach((node) => {
      node.style.fill = '#024e1b';
      node.style.stroke = '#111';
      node.style.strokeWidth = 0.1;
      node.style.outline = 'none';
      node.style.willChange = 'all';
    });
  };
  const hoverOffRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = Object.values(region)[2];
    if (typeof countries === 'object') {
      svgs = countries.map((country) => simplifyString(country.name));
    }
    let nodes = document.getElementsByClassName('country');
    nodes = [...nodes];
    nodes = nodes.filter(
      (y) =>
        svgs.includes(simplifyString(y.dataset.longname)) ||
        svgs.includes(simplifyString(y.dataset.shortname))
    );
    nodes.forEach((node) => {
      node.removeAttribute('style');
    });
  };
  const getCountryInfo = (name) => {
    const searchDB = Object.values(worldData);
    name = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/gi, '');
    const match = searchDB.filter(
      (country) =>
        simplifyString(country.name) === simplifyString(name) ||
        country.government.country_name.conventional_long_form.toUpperCase() ===
          name.toUpperCase()
    );
    if (!match || match.length === 0) {
      setCountryDetail('error');
    }
    setCountryDetail(match[0]);
    handleViews('detail');
  };
  const getResults = (results, e) => {
    if (!searchText) {
      setSearchText(results);
      history.goBack();
    } else {
      e.preventDefault();
      setSearch(searchText);
      handleViews('default');
      history.push(`/search/${searchText}`);
    }
  };
  const filterCountryByName = (string) => {
    const searchDB = Object.values(worldData);
    const match = searchDB.filter(
      (country) =>
        country.name.toUpperCase() === string.toUpperCase() ||
        country.name.toUpperCase().includes(string.toUpperCase()) ||
        country.government.country_name.conventional_long_form.toUpperCase() ===
          string.toUpperCase() ||
        country.government.country_name.conventional_long_form
          .toUpperCase()
          .includes(string.toUpperCase())
    );
    setFilterNations(match);
    if (string.length > 0) {
      setFilterNations(match);
      return match;
    }
    return null;
  };

  useEffect(() => {
    loadWorldData();
  }, []);
  const changeMapView = () => {
    if (mapView === 'Show') {
      dispatch(changeMap('Hide'));
    } else {
      dispatch(changeMap('Show'));
    }
  };
  const handleSideBar = (string) => {
    alert('handling sidebar');
    setFilterNations(filterCountryByName(string));
  };
  const handleSubmit = (e) => {
    alert('clicked');
    e.preventDefault();
    console.log('handling submit');
    history.push(e.target.value);
  };
  const handleData = (type) => {
    if (location.pathname !== '/account') {
      console.log('not on account page');
      history.push('/account');
    }
    if (type === 'favorites') {
      setFavorites(!favorites);
    } else {
      setScores(!scores);
    }
  };
  const handleInput = (e) => {
    e.persist();
    // console.log('changing')
    const { value } = e.target;
    if (value != null && value.trim() !== '') {
      setSearchText(value);
      filterCountryByName(value);
      let nodes = [...document.getElementsByClassName('country')];
      nodes.forEach((node) => {
        node.style.fill = '#60c080 ';
        node.style.stroke = '#111';
        node.style.strokeWidth = 0.1;
        node.style.outline = 'none';
        node.style.willChange = 'all';
      });
      const filtered = filterCountryByName(value).map(
        (country) => country.name
      );
      nodes = nodes.filter((y) => filtered.includes(y.dataset.shortname));
      nodes.forEach((node) => {
        node.style.fill = '#024e1b';
        node.style.stroke = '#111';
        node.style.strokeWidth = 0.1;
        node.style.outline = 'none';
        node.style.willChange = 'all';
      });
    } else {
      setSearchText(value);
      setFilterNations([]);
      const nodes = [...document.getElementsByClassName('country')];
      // console.log(filterNations)
      nodes.forEach((node) => {
        node.removeAttribute('style');
      });
    }
  };
  const handleRefresh = (value) => {
    if (worldData) {
      if (value != null && value.trim() !== '') {
        setSearchText(value);
        filterCountryByName(value);
        // let nodes = [...(document.getElementsByClassName("country"))];
        // nodes.forEach( node => {
        //   node.style.fill =  "#ECEFF1";
        //   node.style.stroke =  "#111";
        //   node.style.strokeWidth =  .75;
        //   node.style.outline =  "none";
        //   node.style.transition = "all 250ms"
        // })
        // nodes = nodes.filter(e => filterCountryByName(value).map((country, i) => country.name).includes(e.dataset.tip));
        // // console.log(nodes);
        // nodes.forEach( node => {
        //   node.style.fill =  "#024e1b";
        //   node.style.stroke =  "#111";
        //   node.style.strokeWidth =  1;
        //   node.style.outline =  "none";
        //   node.style.transition = "all 250ms"
        // })
      } else {
        setSearchText(value);
        setFilterNations([]);
        // let nodes = [...(document.getElementsByClassName("country"))];
        // // console.log(filterNations)
        // nodes.forEach( node => {
        //   node.removeAttribute("style")
        // })
      }
    }
  };
  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        setAuthenticated(true);
        setLoadingState(false);
      } else {
        setUser(null);
        setAuthenticated(false);
        setLoadingState(false);
      }
    });
    if (user && !authenticated) {
      setAuthenticated(true);
    }
  }, [user]);

  if (error) {
    return <h1>{error}</h1>;
  }
  return (
    <BreakpointProvider>
      <Breakpoint large up>
        <SideNaviBar
          view={view}
          loadingState={loadingState}
          searchText={searchText}
          handleInput={handleInput}
          changeView={handleViews}
          getCountryInfo={getCountryInfo}
          getResults={getResults}
          filterNations={filterNations}
          user={user}
          handleOpen={handleOpen}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          setStateModal={setStateModal}
          login={login}
          changeMapView={changeMapView}
          countries={filterNations}
          handleSideBar={handleSideBar}
          data={worldData}
          mapVisible={mapView}
          hoverOnRegion={hoverOnRegion}
          hoverOffRegion={hoverOffRegion}
          filterCountryByName={filterCountryByName}
          hoverOnCountry={hoverOnCountry}
          hoverOffCountry={hoverOffCountry}
          favorites={favorites}
          scores={scores}
          handleData={handleData}
        />
      </Breakpoint>
      <div className="main container-fluid">
        <NaviBar
          view={view}
          searchText={searchText}
          handleInput={handleInput}
          changeView={handleViews}
          getCountryInfo={getCountryInfo}
          getResults={getResults}
          filterNations={filterNations}
          user={user}
          handleOpen={handleOpen}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          setStateModal={setStateModal}
          login={login}
        />
        <Switch>
          <Route
            exact
            path="/search/:input"
            render={() => (
              <SearchResults
                changeMapView={changeMapView}
                searchText={searchText}
                countries={filterNations}
                handleSideBar={handleSideBar}
                data={worldData}
                getCountryInfo={getCountryInfo}
                changeView={handleViews}
                mapVisible={mapView}
                hoverOnRegion={hoverOnRegion}
                hoverOffRegion={hoverOffRegion}
                filterCountryByName={filterCountryByName}
                hoverOnCountry={hoverOnCountry}
                hoverOffCountry={hoverOffCountry}
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                user={user}
                setStateModal={setStateModal}
                login={login}
                results={search}
                getResults={getResults}
                handleRefresh={handleRefresh}
              />
            )}
          />
          <Route
            exact
            path="/play"
            render={() => (
              <Game
                simplifyString={simplifyString}
                changeMapView={changeMapView}
                mapVisible={mapView}
                data={worldData}
                getCountryInfo={getCountryInfo}
                user={user}
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                setStateModal={setStateModal}
                login={login}
              />
            )}
          />
          <PrivateRoute
            exact
            path="/account"
            user={user}
            simplifyString={simplifyString}
            component={Account}
            loadingState={loadingState}
            favorites={favorites}
            scores={scores}
            handleData={handleData}
            authenticated={authenticated}
          />
          <PrivateRoute
            exact
            path="/account/edit"
            user={user}
            component={AccountEdit}
            loadingState={loadingState}
            authenticated={authenticated}
          />
          <Route
            exact
            path="/login"
            render={() => (
              <SignIn
                loadingState={loadingState}
                user={user}
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                setStateModal={setStateModal}
                login={login}
              />
            )}
          />
          <Route
            exact
            path="/passwordreset"
            render={() => (
              <PasswordReset
                user={user}
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                setStateModal={setStateModal}
                login={login}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            render={() => (
              <SignUp
                user={user}
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                setStateModal={setStateModal}
                login={login}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={() => (
              <ResultView
                changeMapView={changeMapView}
                countries={filterNations}
                handleSideBar={handleSideBar}
                data={worldData}
                getCountryInfo={getCountryInfo}
                changeView={handleViews}
                mapVisible={mapView}
                hoverOnRegion={hoverOnRegion}
                hoverOffRegion={hoverOffRegion}
                filterCountryByName={filterCountryByName}
                hoverOnCountry={hoverOnCountry}
                hoverOffCountry={hoverOffCountry}
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                user={user}
                setStateModal={setStateModal}
                login={login}
              />
            )}
          />
          <Route
            path="/:country"
            render={() => (
              <DetailView
                countries={filterNations}
                handleSideBar={handleSideBar}
                data={worldData}
                changeView={handleViews}
                countryDetail={countryDetail}
                getCountryInfo={getCountryInfo}
                hoverOnRegion={hoverOnRegion}
                hoverOffRegion={hoverOffRegion}
                filterCountryByName={filterCountryByName}
                hoverOnCountry={hoverOnCountry}
                hoverOffCountry={hoverOffCountry}
                user={user}
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                setStateModal={setStateModal}
                login={login}
                loadCodes={loadCodes}
                loadingState={loadingState}
              />
            )}
          />
        </Switch>
        <Dialog open={showModal} onClose={() => handleClose()}>
          <DialogTitle>{modal.title}</DialogTitle>
          <DialogContent>{modal.body}</DialogContent>
          <DialogActions>
            <Button variant="secondary" onClick={() => handleClose()}>
              Close
            </Button>
            {modal.primaryButton}
          </DialogActions>
        </Dialog>
      </div>
    </BreakpointProvider>
  );
};

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    hash: PropTypes.string,
    key: PropTypes.string
  }).isRequired,
  history: shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
};
export default withRouter(App);
