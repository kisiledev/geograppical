import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useLocation, useNavigate } from 'react-router-dom';
import { Routes } from 'react-router';
import { BreakpointProvider, Breakpoint } from 'react-socks';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PropTypes, { shape } from 'prop-types';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import ResultView from './components/views/ResultView';
import DetailView from './components/views/DetailView';
import NaviBar from './components/views/NaviBar';
import { auth, firebaseApp, googleProvider } from './firebase/firebase';
import Game from './components/games/Game';
import Account from './components/account/Account';
import SignIn from './components/account/SignIn';
import SignUp from './components/account/SignUp';
import PrivateRoute from './components/account/PrivateRoutes';
import PasswordReset from './components/account/PasswordReset';
import SearchResults from './components/views/SearchResults';
import SideNaviBar from './components/views/SideNaviBar';
import { changeView, changeMap } from './redux-toolkit';
import { Country, DataType, SliceStates } from './helpers/types';
import { CountryType } from './helpers/types/CountryType';
import { User } from 'firebase/auth';

interface AppProps {
  location: {
    pathname: string;
    search: string;
    hash: string;
    key: string;
  };
  history: {
    goBack: () => void;
  };
}

const App = (props: AppProps) => {
  const dispatch = useDispatch();
  const mapView = useSelector((state) => state.mapView.value);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState(false);
  const [scores, setScores] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [filterNations, setFilterNations] = useState<CountryType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [worldData, setWorldData] = useState<DataType>([]);
  const [countryDetail, setCountryDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({
    title: '',
    body: '',
    primaryButton: ''
  });

  const location = useLocation();
  const navigate = useNavigate();

  const db = getFirestore(firebaseApp);
  const handleViews = (selectedView: SliceStates) => {
    console.log(selectedView);
    dispatch(changeView(selectedView));
  };

  const loadWorldData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'countries'));
      const data: DataType = [];
      querySnapshot.forEach((doc) => {
        const country = doc.data() as CountryType;
        data.push(country);
      });
      console.log(data);
      setWorldData(data);
    } catch (err) {
      setError(err as Error);
      console.log(err);
    }
  };
  const simplifyString = (string: string) =>
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
  const setStateModal = (modalsetting: SliceStates) => {
    setModal(modalsetting);
  };
  const freezeLoad = (loadState: boolean) => {
    console.log('running freezeLoad');
    setLoadingState(loadState);
  };
  const login = async () => {
    try {
      const loggedInUser = await auth.signInWithPopup(googleProvider);
      setUser(loggedInUser);
    } catch (err) {
      console.log(err);
    }
  };
  const getCountryInfo = (name: string) => {
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
    console.log(match[0]);
    setCountryDetail(match[0]);
    handleViews('detail');
  };

  const filterCountryByName = (string: string) => {
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
    console.log('loading world dta');
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
    navigate(e.target.value);
  };
  const handleData = (type) => {
    if (location.pathname !== '/account') {
      console.log('not on account page');
      navigate('/account');
    }
    if (type === 'favorites') {
      setFavorites(!favorites);
    } else {
      setScores(!scores);
    }
  };
  const handleInput = (e) => {
    console.log(e, typeof e);
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
    auth.onAuthStateChanged((u: User | null) => {
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
          loadingState={loadingState}
          changeView={handleViews}
          getCountryInfo={getCountryInfo}
          handleSideBar={handleSideBar}
          data={worldData}
          filterCountryByName={filterCountryByName}
        />
      </Breakpoint>
      <div className="main container-fluid">
        <NaviBar
          searchText={searchText}
          handleInput={handleInput}
          user={user}
        />
        <Routes>
          <Route
            path="/search/:input"
            children={() => (
              <SearchResults
                searchText={searchText}
                countries={filterNations}
                data={worldData}
                getCountryInfo={getCountryInfo}
                user={user}
                login={login}
                handleRefresh={handleRefresh}
              />
            )}
          />
          <Route
            path="/play"
            children={() => (
              <Game
                changeMapView={changeMapView}
                mapVisible={mapView}
                data={worldData}
                getCountryInfo={getCountryInfo}
                user={user}
                handleOpen={handleOpen}
                handleSubmit={handleSubmit}
                setStateModal={setStateModal}
                login={login}
              />
            )}
          />
          <Route
            path="/account"
            children={() => (
              <PrivateRoute
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
            )}
          />

          <Route
            path="/login"
            children={() => (
              <SignIn
                loadingState={loadingState}
                user={user}
                handleSubmit={handleSubmit}
                login={login}
              />
            )}
          />
          <Route
            path="/passwordreset"
            children={() => (
              <PasswordReset
                user={user}
                handleSubmit={handleSubmit}
                login={login}
              />
            )}
          />
          <Route
            path="/signup"
            children={() => (
              <SignUp user={user} handleSubmit={handleSubmit} login={login} />
            )}
          />
          <Route
            path="/"
            children={() => (
              <ResultView
                changeMapView={changeMapView}
                countries={filterNations}
                handleSideBar={handleSideBar}
                data={worldData}
                getCountryInfo={getCountryInfo}
                changeView={handleViews}
                mapVisible={mapView}
                filterCountryByName={filterCountryByName}
                user={user}
                login={login}
              />
            )}
          />
          <Route
            path="/:country"
            children={() => (
              <DetailView
                handleSideBar={handleSideBar}
                data={worldData}
                changeView={handleViews}
                freezeLoad={freezeLoad}
                countryDetail={countryDetail}
                getCountryInfo={getCountryInfo}
                filterCountryByName={filterCountryByName}
                user={user}
                loadingState={loadingState}
              />
            )}
          />
        </Routes>
        <Dialog open={showModal} onClose={() => handleClose()}>
          <DialogTitle>{modal.title}</DialogTitle>
          <DialogContent>{modal.body}</DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => handleClose()}>
              Close
            </Button>
            {modal.primaryButton}
          </DialogActions>
        </Dialog>
      </div>
    </BreakpointProvider>
  );
};

export default App;
