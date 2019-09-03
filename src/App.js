/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import ResultView from './Components/ResultView';
import DetailView from './Components/DetailView';
import NaviBar from './Components/NaviBar';
import { BreakpointProvider } from 'react-socks';
import {Modal, Button} from 'react-bootstrap'
import './App.css';
import axios from 'axios';
import { auth, provider } from './Components/Firebase/firebase'
import i18n from 'i18n-iso-countries';
import Game from './Components/Game';
import Account from './Components/Account';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import PrivateRoute from './Components/PrivateRoutes';
import PasswordReset from './Components/PasswordReset';
import AccountEdit from './Components/AccountEdit'

class App extends Component {

  state = {
    loading: true,
    highlighted: "",
    hovered: false, 
    nations: [],
    mapView: "Show",
    sidebar: "Show",
    view: "default",
    filteredData: [],
    filterNations: [],
    searchText: '',
    worldData: [],
    countryDetail: [],
    countries: [],
    mode: "",
    user: null,
    showModal: false,
    modal: {}

  }

  componentDidMount() {
    this.loadWorldData();
    this.loadCodes();
    this.authListener();
  }
  removeNull(array){
    if(array !==undefined)
    return array
      .filter(item => item.government.capital !== undefined && item.government.country_name !==undefined && item.name)
      .map(item => Array.isArray(item) ? this.removeNull(item) : item);
  }
  authListener = () => {
    auth.onAuthStateChanged((user) => {
      user ?  this.setState({user: user, authenticated: true},console.log(user) ) : this.setState({user: null, authenticated: false})
    })
  }
  loadCodes = () => {
    axios.get("../iso.json")
     .then(res => {
       let codes = res.data
       const isoCodes = codes.map(code => {
         const container = {};
         container.name = code["CLDR display name"];
         container.shortName = code["UNTERM English Short"]
         container.isoCode = code["ISO3166-1-Alpha-3"];
         container.capital = code["Capital"]

         return container;
       })
      this.setState({isoCodes: isoCodes}, console.log(this.state.isoCodes))
     });
  }
  loadWorldData = () => {
    axios.get("../factbook.json")
    .then(res => {
      let Data = res && res.data.countries;
      Data = Object.values(Data).map(country => country.data) || [];
      let newData = this.removeNull(Object.values(Data));
      newData.forEach(function(element, index, newData) {
        newData[index].geography.map_references = newData[index].geography.map_references.replace(/;/g, "")
        if(newData[index].geography.map_references === "AsiaEurope")
        newData[index].geography.map_references = "Europe"
        if(newData[index].geography.map_references === "Middle East")
        newData[index].geography.map_references = "Southwest Asia"
      });
      i18n.registerLocale(require("i18n-iso-countries/langs/en.json"));
      let codes = i18n.getNames('en');
      let newCodes = {};
      const keys = Object.keys(codes);
      keys.forEach(key => {
        let val = codes[key];
        newCodes[val]=key;
      })
      const iso = this.state.isoCodes;

      let lookup = {};
      lookup.list = newData;
      for (let i = 0, len = lookup.list.length; i < len; i++){
        lookup[lookup.list[i].name] = lookup.list[i]
      }
      let otherLookup = {};
      otherLookup.list = iso;
      for (let i = 0, len = otherLookup.list.length; i < len; i++){
        // console.log(otherLookup.list[i])
        otherLookup[otherLookup.list[i].name] = otherLookup.list[i]
      }


      let i = 0;
      let len = otherLookup.list.length
      for (i; i < len; i++){
        // console.log(otherLookup.list[i]);
        if(lookup[otherLookup.list[i].name]){
          // console.log(lookup[otherLookup.list[i].name])
          lookup[otherLookup.list[i].name].government.country_name.isoCode = otherLookup.list[i].isoCode
        } else if (lookup[otherLookup.list[i].shortName]){
          lookup[otherLookup.list[i].shortName].government.country_name.isoCode = otherLookup.list[i].isoCode
        }
      }
      this.setState({ worldData: lookup.list || [], loading: false})
    });
  }
  simplifyString(string){
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '').toLowerCase()
  }

  handleClose = () => {
    this.setState({showModal: false})
    }
  handleOpen = () => {
    this.setState({showModal: true})
  }
  setModal = (modal) => {
    console.log('setting modal');
    this.setState({modal});
  }
  login = () => {
    auth.signInWithPopup(provider)
    .then((result) => {
        const user = result.user;
        console.log(user)
    }).catch((error) => {
        console.log(error)
        console.log(error.message)
    })
  }
  
  hoverOnCountry = (e, region, country) => {
    e.stopPropagation();
    if(this.state.view === "detail"){
      this.setState({view: 'default'})
    };
    let nodes = (document.getElementsByClassName("country"));
    nodes = [...nodes]
    nodes = nodes.filter(e => this.simplifyString(country) === this.simplifyString(e.dataset.longname) || this.simplifyString(country) === this.simplifyString(e.dataset.shortname))
    console.log(nodes);
    nodes.forEach( node => {
      node.style.fill =  "#ee0a43";
      node.style.stroke =  "#111";
      node.style.strokeWidth =  1;
      node.style.outline =  "none"
    })

  }
  hoverOffCountry = (e, region, country) => {
    e.stopPropagation();
    let nodes = (document.getElementsByClassName("country"));
    nodes = [...nodes]
    nodes = nodes.filter(e => this.simplifyString(country) === this.simplifyString(e.dataset.longname) || this.simplifyString(country) === this.simplifyString(e.dataset.shortname))
    console.log(nodes);
    nodes.forEach( node => {
      node.removeAttribute('style');
    })

  }
  hoverOnRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = Object.values(region)[2];
    if(typeof countries === "object"){
      svgs = countries.map((country, i) => this.simplifyString(country.name))
    }
    let nodes = (document.getElementsByClassName("country"));
    nodes = [...nodes]
    nodes = nodes.filter(e => svgs.includes(this.simplifyString(e.dataset.longname)) || svgs.includes(this.simplifyString(e.dataset.shortname)));
    nodes.forEach( node => {
      node.style.fill =  "#024e1b";
      node.style.stroke =  "#111";
      node.style.strokeWidth =  1;
      node.style.outline =  "none"
    })
    // console.log(this.state[regionName])
    // console.log(this.state[regionName].open)
  }
  hoverOffRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = Object.values(region)[2];
    if(typeof countries === "object"){
      svgs = countries.map((country, i) => this.simplifyString(country.name))
    }
    let nodes = (document.getElementsByClassName("country"));
    nodes = [...nodes]
    nodes = nodes.filter(e => svgs.includes(this.simplifyString(e.dataset.longname)) || svgs.includes(this.simplifyString(e.dataset.shortname)));
    nodes.forEach( node => {
      node.removeAttribute("style")
    })
    this.setState({SVG: []})
  }
  getCountryInfo = (name, capital) =>{
    let searchDB = Object.values(this.state.worldData);
    console.log(searchDB);
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '')
    console.log(name);
    let match = searchDB.filter(country => 
      this.simplifyString(country.name) === this.simplifyString(name)
      || country.government.country_name.conventional_long_form.toLowerCase() === name.toLowerCase())
      console.log(match);
      this.setState(({countryDetail: match[0]}))
      this.handleViews('detail');
  }
    
  filterCountryByName = (string) =>{
    let searchDB = Object.values(this.state.worldData);
    let match = searchDB.filter(country => country.name.toLowerCase() === string.toLowerCase()
      || country.name.toLowerCase().includes(string.toLowerCase())
      || country.government.country_name.conventional_long_form.toLowerCase() === string.toLowerCase()
      || country.government.country_name.conventional_long_form.toLowerCase().includes(string.toLowerCase())
    );
    // console.log(match)
    this.setState({filterNations: match})
    if(string.length === 0 || string === " ")
      { console.log(string);
        return match = []
      }
      console.log(match)
    return match;
  }

  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(value => o[value].toString().toLowerCase().includes(string.toLowerCase())));
  };
  handleViews = (view) => {
    // console.log(view);
      this.setState(({view}))
  };
  viewSidebar = () => {
    if(this.state.sidebar === "Show"){
      this.setState(({sidebar: "Hide"}))
    } else {
      this.setState(({sidebar: "Show"}))
    }
  }
  mapView = () => {
    if(this.state.mapView === "Show"){
      this.setState(({mapView: "Hide"}))
    } else {
      this.setState(({mapView: "Show"}))
    }
  }
  changeMode = (event) => {
    event.persist();
    console.log(event)
    console.log(event.target.textContent)
    this.setState(({mode: event.target.textContent}));
  }
  addNewCountry = (name, location, type, excerpt, imgurl) => {
    this.setState(prevState =>({
      countries: [
        ...this.state.countries, 
        {
          name,
          location,
          type,
          excerpt,
          imgurl,
          id: prevState.countries.length += 1
        }
      ],
      view: "default"
    }))
  };
  handleSideBar = (string) => {
    alert('handling sidebar');
    this.setState({filterNations: this.filterCountryByName(string)})
  };
  handleInput = (e) => {
    e.persist();
    // console.log('changing')
    let value = e.target.value
    if(value != null && value.trim() !== ''){
      this.setState({searchText: value}, () => this.filterCountryByName(value));
      let nodes = [...(document.getElementsByClassName("country"))];  
      nodes.forEach( node => {
        node.style.fill =  "#ECEFF1";
        node.style.stroke =  "#111";
        node.style.strokeWidth =  .75;
        node.style.outline =  "none";
        node.style.transition = "all 250ms"
      })
      console.log(e);
      console.log(e.target)
      console.log(value)
      nodes = nodes.filter(e => this.filterCountryByName(value).map((country, i) => country.name).includes(e.dataset.tip));
      // console.log(nodes);
      nodes.forEach( node => {
        node.style.fill =  "#024e1b";
        node.style.stroke =  "#111";
        node.style.strokeWidth =  1;
        node.style.outline =  "none";
        node.style.transition = "all 250ms"
      })

    } else {
      this.setState(({ 
        searchText: value, 
        filterNations: []
      }));
      let nodes = [...(document.getElementsByClassName("country"))];
      // console.log(this.state.filterNations)
      nodes.forEach( node => {
        node.removeAttribute("style")
      })
    }
  };
  render(){
    return (
      <BreakpointProvider>
      <div>
        <NaviBar 
          view={this.state.view}
          searchText = {this.state.searchText}
          handleInput = {this.handleInput}
          changeView = {this.handleViews}
          filterNations = {this.state.filterNations}
          changeMode = {this.changeMode}
          user= {this.state.user}
          handleOpen = {this.handleOpen}
          handleClose = {this.handleClose}
          setModal = {this.setModal}
          login = {this.login}
        />
        <div className="main container-fluid">
          <Switch>
          <Route exact path={`${process.env.PUBLIC_URL}/play`} 
                render={props => 
                <Game 
                      simplifyString = {this.simplifyString}
                      mapView = {this.mapView}
                      mapVisible={this.state.mapView}
                      flagCodes = {this.state.flagCodes}
                      data = {this.state.worldData}
                      getCountryInfo = {this.getCountryInfo}
                      user = {this.state.user}
                      handleOpen = {this.handleOpen}
                      handleClose = {this.handleClose}
                      setModal = {this.setModal}
                      login = {this.login}
                /> 
                } 
          />
          <PrivateRoute exact path={`${process.env.PUBLIC_URL}/account`} 
            user={this.state.user} 
            component={Account} 
            authenticated={this.state.authenticated} />
          <PrivateRoute exact path={`${process.env.PUBLIC_URL}/account/edit`} 
            user={this.state.user} 
            component={AccountEdit} 
            authenticated={this.state.authenticated} />
          <Route exact path={`${process.env.PUBLIC_URL}/login`} render={props => <SignIn 
            user={this.state.user}
            handleOpen = {this.handleOpen}
            handleClose = {this.handleClose}
            setModal = {this.setModal}
            login = {this.login} />}/>
          <Route exact path={`${process.env.PUBLIC_URL}/passwordreset`} render={props => <PasswordReset 
            user={this.state.user}
            handleOpen = {this.handleOpen}
            handleClose = {this.handleClose}
            setModal = {this.setModal}
            login = {this.login} />}/>
          <Route exact path={`${process.env.PUBLIC_URL}/signup`} render={props => <SignUp
            user={this.state.user}
            handleOpen = {this.handleOpen}
            handleClose = {this.handleClose}
            setModal = {this.setModal}
            login = {this.login} />}/>
          <Route exact path={`${process.env.PUBLIC_URL}/`} render={props => <ResultView
            mapView = {this.mapView}
            flagCodes = {this.state.flagCodes}
            countries = {this.state.filterNations}
            filterRegion = {this.filterRegion}
            handleSideBar = {this.handleSideBar}
            data = {this.state.worldData}
            getCountryInfo = {this.getCountryInfo}
            changeView = {this.handleViews}
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
            mapVisible={this.state.mapView}
            hoverOnRegion = {this.hoverOnRegion}
            hoverOffRegion = {this.hoverOffRegion}
            filterCountryByName = {this.filterCountryByName}
            hoverOnCountry = {this.hoverOnCountry}
            hoverOffCountry = {this.hoverOffCountry}
            handleMove = {this.handleMove}
            handleLeave = {this.handleLeave}
            hovered = {this.state.hovered}
            highlighted = {this.state.highlighted}
            handleOpen = {this.handleOpen}
            handleClose = {this.handleClose}
            user = {this.state.user}
            setModal = {this.setModal}
            login = {this.login}
          /> }/>
          <Route path={`${process.env.PUBLIC_URL}/:country`} render={props => <DetailView 
            flagCodes = {this.state.flagCodes}
            countries = {this.state.filterNations}
            filterRegion = {this.filterRegion}
            handleSideBar = {this.handleSideBar}
            data = {this.state.worldData}
            changeView = {this.handleViews}
            countryDetail = {this.state.countryDetail}
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
            getCountryInfo = {this.getCountryInfo}
            hoverOnRegion = {this.hoverOnRegion}
            hoverOffRegion = {this.hoverOffRegion}
            filterCountryByName = {this.filterCountryByName}
            hoverOnCountry = {this.hoverOnCountry}
            hoverOffCountry = {this.hoverOffCountry}
            handleMove = {this.handleMove}
            handleLeave = {this.handleLeave}
            hovered = {this.state.hovered}
            highlighted = {this.state.highlighted}
            user = {this.state.user}
            handleOpen = {this.handleOpen}
            handleClose = {this.handleClose}
            setModal = {this.setModal}
            login = {this.login}
            loadWorldData = {this.loadWorldData}
            loadCodes = {this.loadCodes}
            loading = {this.state.loading}
          />}/>
          </Switch>
          <Modal show={this.state.showModal} onHide={() => this.handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>{this.state.modal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.modal.body}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
                Close
            </Button>
            {this.state.modal.primaryButton}
            </Modal.Footer>
        </Modal>
        </div>
      </div>
      </BreakpointProvider>
    )
  }
};

export default App;
