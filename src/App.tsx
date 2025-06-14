import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
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
import { changeView, changeMap } from './helpers/toolkitSlices';
import { DataType } from './helpers/types';
import { CountryType } from './helpers/types/CountryType';
import { signInWithPopup, User } from 'firebase/auth';
import MediaQuery from 'react-responsive';
// import { useDispatch, useSelector } from 'react-redux';
import { useDispatch, useSelector } from './redux-hooks';

type Modal = {
  title: string;
  body: string;
  primaryButton: string;
};
const App = () => {
  const dispatch = useDispatch();
  const mapView = useSelector((state) => {
    return state.mapView.value;
  });
  const [user, setUser] = useState<User | null>(null);
  const favorites = false;
  const scores = false;
  const [error, setError] = useState<Error | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [filterNations, setFilterNations] = useState<CountryType[] | null>([]);
  const [searchText, setSearchText] = useState('');
  const [worldData, setWorldData] = useState<DataType>([]);
  const [countryDetail, setCountryDetail] = useState<CountryType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<Modal>({
    title: '',
    body: '',
    primaryButton: ''
  });

  const db = getFirestore(firebaseApp);
  const handleViews = (selectedView: string) => {
    dispatch(changeView({ value: selectedView }));
  };

  const loadWorldData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'countries'));
      const data: DataType = [];
      querySnapshot.forEach((doc) => {
        const country = doc.data() as CountryType;
        data.push(country);
      });
      setWorldData(data);
    } catch (err) {
      setError(err as Error);
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
  const setStateModal = (modalsetting: Modal) => {
    setModal(modalsetting);
  };
  const freezeLoad = (loadState: boolean) => {
    setLoadingState(loadState);
  };
  const login = async () => {
    try {
      const loggedInUser = await signInWithPopup(auth, googleProvider);
      setUser(loggedInUser.user);
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
      setCountryDetail(null);
    }
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
    loadWorldData();
  }, []);
  const changeMapView = () => {
    if (mapView === 'Show') {
      dispatch(changeMap({ value: 'Hide' }));
    } else {
      dispatch(changeMap({ value: 'Show' }));
    }
  };
  const handleSideBar = (string: string) => {
    alert('handling sidebar');
    setFilterNations(filterCountryByName(string));
  };
  const handleInput = (e: React.KeyboardEvent) => {
    e.persist();
    const { value } = e.target as HTMLInputElement;
    if (value != null && value.trim() !== '') {
      setSearchText(value);
      filterCountryByName(value);
      let nodes = [
        ...(document.getElementsByClassName(
          'country'
        ) as HTMLCollectionOf<HTMLElement>)
      ];
      nodes.forEach((node) => {
        node.style.fill = '#60c080 ';
        node.style.stroke = '#111';
        node.style.strokeWidth = '0.1';
        node.style.outline = 'none';
        node.style.willChange = 'all';
      });
      let filtered = null;
      const filteredCountry = filterCountryByName(value);
      if (filteredCountry) {
        filtered = filteredCountry.map((country) => country.name);
      }
      nodes = nodes.filter((y) => {
        if (filtered && y.dataset.shortname) {
          filtered.includes(y.dataset.shortname);
        }
      });
      nodes.forEach((node) => {
        node.style.fill = '#024e1b';
        node.style.stroke = '#111';
        node.style.strokeWidth = '0.1';
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
  const handleRefresh = (value: string) => {
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
    <>
      <MediaQuery minWidth={992}>
        <SideNaviBar
          loadingState={loadingState}
          changeView={handleViews}
          getCountryInfo={getCountryInfo}
          handleSideBar={handleSideBar}
          data={worldData}
          filterCountryByName={filterCountryByName}
        />
      </MediaQuery>
      <div className="main container-fluid">
        <NaviBar
          searchText={searchText}
          handleInput={handleInput}
          user={user}
        />
        <Routes>
          <Route
            path="/search/:input"
            element={
              <SearchResults
                searchText={searchText}
                countries={filterNations}
                data={worldData}
                getCountryInfo={getCountryInfo}
                user={user}
                login={login}
                handleRefresh={handleRefresh}
                handleOpen={handleOpen}
                changeView={handleViews}
              />
            }
          />
          <Route
            path="/play"
            element={
              <Game
                changeMapView={changeMapView}
                mapVisible={mapView}
                data={worldData}
                getCountryInfo={getCountryInfo}
                user={user}
                handleOpen={handleOpen}
                setStateModal={setStateModal}
                login={login}
              />
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute
                loadingState={loadingState}
                authenticated={authenticated}
              >
                <Account
                  user={user}
                  simplifyString={simplifyString}
                  favorites={favorites}
                  scores={scores}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/login"
            element={<SignIn loadingState={loadingState} user={user} />}
          />
          <Route
            path="/passwordreset"
            element={<PasswordReset user={user} />}
          />
          <Route path="/signup" element={<SignUp user={user} />} />
          <Route
            path="/"
            element={
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
            }
          />
          <Route
            path="/:country"
            element={
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
            }
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
    </>
  );
};

export default App;
