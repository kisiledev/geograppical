/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import {Route, Switch, withRouter } from 'react-router-dom';
import ResultView from './Components/ResultView.jsx';
import DetailView from './Components/DetailView.jsx';
import NaviBar from './Components/NaviBar.jsx';
import { BreakpointProvider, Breakpoint } from 'react-socks';
import {Modal, Button} from 'react-bootstrap'
import './App.css';
import axios from 'axios';
import { auth, googleProvider } from './Components/Firebase/firebase'
import Game from './Components/Game.jsx';
import Account from './Components/Account.jsx';
import SignIn from './Components/SignIn.jsx';
import SignUp from './Components/SignUp.jsx';
import PrivateRoute from './Components/PrivateRoutes.jsx';
import PasswordReset from './Components/PasswordReset.jsx';
import AccountEdit from './Components/AccountEdit.jsx'
import SearchResults from './Components/SearchResults.jsx';
import SideNaviBar from './Components/SideNaviBar.jsx'

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}
// import LogRocket from 'logrocket';
// LogRocket.init('w5ty2q/geograppical');

class App extends Component {

  state = {
    favorites: false,
    scores: false,
    error: null,
    authenticated: false,
    loading: true,
    highlighted: "",
    hovered: false, 
    nations: [],
    mapView: "Show",
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
    this.loadCodes();
    this.loadWorldData();
    auth.onAuthStateChanged(user => {
      console.log(user)
      if(user){
        this.setState({
          user: user, 
          authenticated: true,
          loading: false
        })
      } else {
        this.setState({
          user: null, 
          authenticated: false, 
          loading: false
        })
      }
    })
  }
  // componentDidUpdate(prevState) {
  //   if(this.state.user !==prevState.user){
  //     auth.onAuthStateChanged(user => {
  //       if(user){
  //         this.setState({
  //           user: user, 
  //           authenticated: true,
  //           loading: false
  //         })
  //       } else {
  //         this.setState({
  //           user: null, 
  //           authenticated: false, 
  //           loading: false
  //         })
  //       }
  //     })
  //   }
  // }
  removeIsoNull(array){
    return array
      .filter(item => 
        item.government.capital !== undefined && 
        item.government.country_name !==undefined && 
        item.government.country_name.isoCode !==undefined &&
        item.name)
      // .map(item => console.log(item) && item.government.country_name.isoCode && Array.isArray(item) ? this.removeIsoNull(item) : item);
  }
  removeNull(array){
    if(array !==undefined)
    return array
      .filter(item => item.government.capital !== undefined && 
        item.government.country_name !== undefined && 
        item.name)
      .map(item => Array.isArray(item) ? this.removeNull(item) : item);
  }
  authListener = () => {
    
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
      this.setState({isoCodes: isoCodes})
     });
  }
  loadWorldData = () => {
    try {
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
        let iso; 
        if(this.state.isoCodes) {
          iso = this.state.isoCodes;
        }

    

        let countries = {};
        countries.list = newData;
        for (let i = 0, len = countries.list.length; i < len; i++){
          countries[countries.list[i].name] = countries.list[i]
        }
        let codes = {};
        if(codes === undefined){
          return console.log('unable to load')
        }
        codes.list = iso;
        if(codes.list && codes.list.length>0){
          for (let i = 0, len = codes.list.length; i < len; i++){
            if([codes.list[i]]){
              codes[codes.list[i].name] = codes.list[i]
            }
          }
          let i = 0;
          let len = codes.list.length
          for (i; i < len; i++){
            if(countries[codes.list[i].name]){
              countries[codes.list[i].name].government.country_name.isoCode = codes.list[i].isoCode
            } else if (countries[codes.list[i].shortName]){
              countries[codes.list[i].shortName].government.country_name.isoCode = codes.list[i].isoCode
            }
          }
        }
        let x = this.removeIsoNull(countries.list);
        this.setState({ worldData: x || [], loading: false})
      });
    } catch (error){
      this.setState({error})
    };
  }
  simplifyString(string){
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '').toUpperCase()
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
    auth.signInWithPopup(googleProvider)
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
    console.log(country)
    nodes.forEach( node => {
      node.style.fill =  "#ee0a43";
      node.style.stroke =  "#111";
      node.style.strokeWidth =  .1;
      node.style.outline =  "none"
      node.style.willChange = "all"
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
      node.style.fill =  "#024e1b";
      node.style.stroke =  "#111";
      node.style.strokeWidth =  .1;
      node.style.outline =  "none"
      node.style.willChange = "all"
    })

  }
  hoverOnRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = Object.values(region)[2];
    console.log(countries)
    if(typeof countries === "object"){
      svgs = countries.map((country, i) => this.simplifyString(country.name))
    }
    let nodes = (document.getElementsByClassName("country"));
    nodes = [...nodes]
    console.log(nodes)
    console.log(svgs)
    nodes = nodes.filter(e => svgs.includes(this.simplifyString(e.dataset.longname)) || svgs.includes(this.simplifyString(e.dataset.shortname)));
    console.log(nodes)
    nodes.forEach( node => {
      node.style.fill =  "#024e1b";
      node.style.stroke =  "#111";
      node.style.strokeWidth =  .1;
      node.style.outline =  "none"
      node.style.willChange = "all"
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
  getCountryInfo = (name, code) =>{
    let searchDB = Object.values(this.state.worldData);
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/ig, '')
    let match = searchDB.filter(country => 
      (this.simplifyString(country.name) === this.simplifyString(name)
      || country.government.country_name.conventional_long_form.toUpperCase() === name.toUpperCase())) 
      if(match === [] || !match || match.length === 0){
        this.setState({countryDetail: "error"})
      }
      this.setState(({countryDetail: match[0]}))
      this.handleViews('detail');
  }
  getResults = (results, e) => {
    if(!this.state.searchText){
      this.setState({search: results})
      this.props.history.goBack();
    } else {
      e.preventDefault();
      this.setState({search: this.state.searchText}, this.handleViews('default'))
      this.props.history.push('/search/' + this.state.searchText)
    }
  }
    
  filterCountryByName = (string) =>{
    let searchDB = Object.values(this.state.worldData);
    let match = searchDB.filter(country => country.name.toUpperCase() === string.toUpperCase()
      || country.name.toUpperCase().includes(string.toUpperCase())
      || country.government.country_name.conventional_long_form.toUpperCase() === string.toUpperCase()
      || country.government.country_name.conventional_long_form.toUpperCase().includes(string.toUpperCase())
    );
    // console.log(match)
    this.setState({filterNations: match})
    if(string.length === 0 || string === " "){
        return match = []
      } else{
        return match;
      }
  }

  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(value => o[value].toString().toUpperCase().includes(string.toUpperCase())));
  };
  handleViews = (view) => {
      this.setState(({view}))
  };
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
  handleSubmit = (e) => {
    alert('clicked')
    e.preventDefault();
    console.log('handling submit')
    this.props.history.push(e.target.value)
  };
  handleData = (type) => {
    if(this.props.location.pathname !== "/account"){
      console.log('not on account page')
      this.props.history.push('/account')
    }
    this.setState({[type]: !this.state[type]})
  }
  handleInput = (e) => {
    e.persist();
    // console.log('changing')
    let value = e.target.value
    if(value != null && value.trim() !== ''){
      this.setState({searchText: value}, () => this.filterCountryByName(value));
      let nodes = [...(document.getElementsByClassName("country"))];  
      nodes.forEach( node => {
        node.style.fill =  "#60c080 ";
        node.style.stroke =  "#111";
        node.style.strokeWidth =  .1;
        node.style.outline =  "none";
        node.style.willChange = "all"
      })
      console.log(this.filterCountryByName(value))
      let filtered = this.filterCountryByName(value).map((country, i) => country.name)
      console.log(nodes.map(e => e.dataset.shortname))
      nodes = nodes.filter(e => filtered.includes(e.dataset.shortname));
      console.log(nodes);
      nodes.forEach( node => {
        node.style.fill =  "#024e1b";
        node.style.stroke =  "#111";
        node.style.strokeWidth =  .1;
        node.style.outline =  "none";
        node.style.willChange = "all"
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
  handleRefresh = (value) => {
    if(this.state.worldData){
      if(value != null && value.trim() !== ''){
        this.setState({searchText: value}, () => this.filterCountryByName(value));
        // let nodes = [...(document.getElementsByClassName("country"))];  
        // nodes.forEach( node => {
        //   node.style.fill =  "#ECEFF1";
        //   node.style.stroke =  "#111";
        //   node.style.strokeWidth =  .75;
        //   node.style.outline =  "none";
        //   node.style.transition = "all 250ms"
        // })
        // nodes = nodes.filter(e => this.filterCountryByName(value).map((country, i) => country.name).includes(e.dataset.tip));
        // // console.log(nodes);
        // nodes.forEach( node => {
        //   node.style.fill =  "#024e1b";
        //   node.style.stroke =  "#111";
        //   node.style.strokeWidth =  1;
        //   node.style.outline =  "none";
        //   node.style.transition = "all 250ms"
        // })
  
      } else {
        this.setState(({ 
          searchText: value, 
          filterNations: []
        }));
        // let nodes = [...(document.getElementsByClassName("country"))];
        // // console.log(this.state.filterNations)
        // nodes.forEach( node => {
        //   node.removeAttribute("style")
        // })
      }
    }
  };
  render(){
    if(this.state.error){
      return <h1>{this.state.error}</h1>
    }
    return (
      <BreakpointProvider>
        <Breakpoint large up>
          <SideNaviBar 
            view={this.state.view}
            searchText={this.state.searchText}
            handleInput={this.handleInput}
            changeView={this.handleViews}
            getCountryInfo={this.getCountryInfo}
            getResults={this.getResults}
            filterNations={this.state.filterNations}
            changeMode={this.changeMode}
            user={this.state.user}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleSubmit={this.handleSubmit}
            setModal={this.setModal}
            login={this.login}
            mapView={this.mapView}
            flagCodes={this.state.flagCodes}
            countries={this.state.filterNations}
            filterRegion={this.filterRegion}
            handleSideBar={this.handleSideBar}
            data={this.state.worldData}
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
            mapVisible={this.state.mapView}
            hoverOnRegion={this.hoverOnRegion}
            hoverOffRegion={this.hoverOffRegion}
            filterCountryByName={this.filterCountryByName}
            hoverOnCountry={this.hoverOnCountry}
            hoverOffCountry={this.hoverOffCountry}
            handleMove={this.handleMove}
            handleLeave={this.handleLeave}
            hovered={this.state.hovered}
            highlighted={this.state.highlighted}
            favorites={this.state.favorites}
            scores={this.state.scores}
            handleData={this.handleData}
          />
        </Breakpoint>
        <div className="main container-fluid">
        <NaviBar 
          view={this.state.view}
          searchText={this.state.searchText}
          handleInput={this.handleInput}
          changeView={this.handleViews}
          getCountryInfo={this.getCountryInfo}
          getResults={this.getResults}
          filterNations={this.state.filterNations}
          changeMode={this.changeMode}
          user={this.state.user}
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
          handleSubmit={this.handleSubmit}
          setModal={this.setModal}
          login={this.login}
        />
          <Switch>
          <Route exact path={`${process.env.PUBLIC_URL}/search/:input`} render={props => <SearchResults
            mapView={this.mapView}
            searchText={this.state.searchText}
            flagCodes={this.state.flagCodes}
            countries={this.state.filterNations}
            filterRegion={this.filterRegion}
            handleSideBar={this.handleSideBar}
            data={this.state.worldData}
            getCountryInfo={this.getCountryInfo}
            changeView={this.handleViews}
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
            mapVisible={this.state.mapView}
            hoverOnRegion={this.hoverOnRegion}
            hoverOffRegion={this.hoverOffRegion}
            filterCountryByName={this.filterCountryByName}
            hoverOnCountry={this.hoverOnCountry}
            hoverOffCountry={this.hoverOffCountry}
            handleMove={this.handleMove}
            handleLeave={this.handleLeave}
            hovered={this.state.hovered}
            highlighted={this.state.highlighted}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleSubmit={this.handleSubmit}
            user={this.state.user}
            setModal={this.setModal}
            login={this.login}
            results={this.state.search}
            getResults={this.getResults}
            handleRefresh={this.handleRefresh}
          /> } />
          <Route exact path={`${process.env.PUBLIC_URL}/play`} 
                render={props => 
                <Game 
                      simplifyString={this.simplifyString}
                      mapView={this.mapView}
                      mapVisible={this.state.mapView}
                      flagCodes={this.state.flagCodes}
                      data={this.state.worldData}
                      getCountryInfo={this.getCountryInfo}
                      user={this.state.user}
                      handleOpen={this.handleOpen}
                      handleClose={this.handleClose}
                      handleSubmit={this.handleSubmit}
                      setModal={this.setModal}
                      login={this.login}
                /> 
                } 
          />
          <PrivateRoute exact path={`${process.env.PUBLIC_URL}/account`} 
            user={this.state.user}
            simplifyString={this.simplifyString}
            component={Account}
            loading={this.state.loading} 
            favorites={this.state.favorites}
            scores={this.state.scores}
            handleData={this.handleData}

            authenticated={this.state.authenticated} />
          <PrivateRoute exact path={`${process.env.PUBLIC_URL}/account/edit`} 
            user={this.state.user} 
            component={AccountEdit}
            loading={this.state.loading} 
            authenticated={this.state.authenticated} />
          <Route exact path={`${process.env.PUBLIC_URL}/login`} render={props => <SignIn 
            user={this.state.user}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleSubmit={this.handleSubmit}
            setModal={this.setModal}
            login={this.login} />}/>
          <Route exact path={`${process.env.PUBLIC_URL}/passwordreset`} render={props => <PasswordReset 
            user={this.state.user}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleSubmit={this.handleSubmit}
            setModal={this.setModal}
            login={this.login} />}/>
          <Route exact path={`${process.env.PUBLIC_URL}/signup`} render={props => <SignUp
            user={this.state.user}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleSubmit={this.handleSubmit}
            setModal={this.setModal}
            login={this.login} />}/>
          <Route exact path={`${process.env.PUBLIC_URL}/`} render={props => <ResultView
            mapView={this.mapView}
            flagCodes={this.state.flagCodes}
            countries={this.state.filterNations}
            filterRegion={this.filterRegion}
            handleSideBar={this.handleSideBar}
            data={this.state.worldData}
            getCountryInfo={this.getCountryInfo}
            changeView={this.handleViews}
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
            mapVisible={this.state.mapView}
            hoverOnRegion={this.hoverOnRegion}
            hoverOffRegion={this.hoverOffRegion}
            filterCountryByName={this.filterCountryByName}
            hoverOnCountry={this.hoverOnCountry}
            hoverOffCountry={this.hoverOffCountry}
            handleMove={this.handleMove}
            handleLeave={this.handleLeave}
            hovered={this.state.hovered}
            highlighted={this.state.highlighted}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleSubmit={this.handleSubmit}
            user={this.state.user}
            setModal={this.setModal}
            login={this.login}
          /> }/>
          <Route path={`${process.env.PUBLIC_URL}/:country`} render={ (props) => <DetailView 
            flagCodes={this.state.flagCodes}
            countries={this.state.filterNations}
            filterRegion={this.filterRegion}
            handleSideBar={this.handleSideBar}
            data={this.state.worldData}
            changeView={this.handleViews}
            countryDetail={this.state.countryDetail}
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
            getCountryInfo={this.getCountryInfo}
            hoverOnRegion={this.hoverOnRegion}
            hoverOffRegion={this.hoverOffRegion}
            filterCountryByName={this.filterCountryByName}
            hoverOnCountry={this.hoverOnCountry}
            hoverOffCountry={this.hoverOffCountry}
            handleMove={this.handleMove}
            handleLeave={this.handleLeave}
            hovered={this.state.hovered}
            highlighted={this.state.highlighted}
            user={this.state.user}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleSubmit={this.handleSubmit}
            setModal={this.setModal}
            login={this.login}
            loadWorldData={this.loadWorldData}
            loadCodes={this.loadCodes}
            loading={this.state.loading}
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
      </BreakpointProvider>
    )
  }
};

export default withRouter(App);
