/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import Search from './Components/Search';
import ResultView from './Components/ResultView';
import DetailView from './Components/DetailView';
import NavBar from './Components/NavBar';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import './App.css';
import axios from 'axios';
 
class App extends Component {

  state = {
    nations: [],
    view: "default",
    filteredData: [],
    filterNations: [],
    searchText: '',
    regionData: [],
    worldData: [],
    countryDetail: [],
    countries: [
        {
          name: "Ghana", 
          location: "Afrika",
          type: "country",
          excerpt: "Ghana is a country in West Afrika, with a population of ... ",
          imgurl: "img/ghana.JPG",
          imgalt: "A view of Lake Volta",
          id: 1
      },
      {
          name: "Burkina Faso", 
          location: "Afrika",
          type: "country",
          excerpt: "Burkino Faso is a country in West Afrika, with a population of ... ",
          imgurl: "img/bkfaso.jpg",
          imgalt: "Burkinabe children",
          id: 2
      },
      {
          name: "Haiti (Ayiti)", 
          location: "Caribbean Sea",
          type: "country",
          excerpt: "Haiti is an island country in the Caribbean Sea, with a population of ... ",
          imgurl: "img/haiti.jpg",
          imgalt: "Haitian beach",
          id: 3
      }
    ]
  }

  componentDidMount() {
    
    this.getCountries();  
    this.filterByName();
    this.findAllByRegion();  
    this.filterRegion();
    this.filterByCode();
    this.loadWorldData();
  }
  // componentWillUpdate(){
  //   this.sideBarData();
  // }
 async loadWorldData() {
   await axios.get("../factbook.json")
    .then(res => {
      this.setState({ worldData: res && Object.values(res.data)[0] || []})
    })
  }

  getCountryInfo = (string) => {
    let searchDB = Object.values(this.state.worldData);
    let match = searchDB.filter(countries => countries.data.name.toLowerCase() === string.toLowerCase())[0].data;
    const data = (string && match) || match;
    this.setState({countryDetail: data});
    this.handleViews('detail');
  }
  getCountries = () => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(res => {
        this.setState({nations: res && res.data || []})
      });

  }
  filterByName = (string) =>{
  if(string !==undefined)
   return axios
    .get('https://restcountries.eu/rest/v2/name/' + string)
    .then(res => {
      if(res.status === 200 && res !== null){
        this.setState(({filterNations: res && res.data || []}))
      } else {
        throw new Error('No country found');
      }})
      .catch(error => {
        console.log(error)
        return []
      });
  };
  filterByCode = (string) =>{
    if(string !==undefined)
     return axios
      .get('https://restcountries.eu/rest/v2/alpha/' + string)
      .then(res => {
        if(res.status === 200 && res !== null){
          let nation = []
          nation.push(res && res.data || []);
          this.setState(({filterNations: nation}))
        } else {
          throw new Error('No country found');
        }})
        .catch(error => {
          console.log(error)
          return []
        });
  };
  findAllByRegion = (region) =>{
  if(region !==undefined)
    return axios
     .get('https://restcountries.eu/rest/v2/region/' + region)
     .then(res => {
       if(res.status === 200 && res !== null){
        this.setState(({regionData: res && res.data || [] }))
         console.log(res.data);
       } else {
         throw new Error('No country found');
       }})
       .catch(error => {
         console.log(error)
         return []
       });
  };
  filterRegion = (region) =>{
    if(region !==undefined)
      return axios
       .get('https://restcountries.eu/rest/v2/region/' + region)
       .then(res => {
         if(res.status === 200 && res !== null){
          this.setState(({[region]: res && res.data || [] }))
          } else {
           throw new Error('No country found');
         }})
         .catch(error => {
           console.log(error)
           return []
         });
  };
  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(value => o[value].toString().toLowerCase().includes(string.toLowerCase())));
  };
  handleViews = () => {
    if(this.state.view === "detail"){
      console.log('changing view')
      this.setState(({view: "default"}))
    } else {
      this.setState(({view: "detail"}))
    }
  };
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
    this.setState(({filterNations: this.filterByCode(string)}))
  };
  handleInput = (e) => {
    e.persist();
    if(e.target.value !== ""){
      this.setState(({ 
        searchText: e.target.value, 
        filterNations: this.filterByName(e.target.value)
      }));
    } else {
      this.setState(({ 
        searchText: e.target.value, 
        filterNations: []
      }));
    }
  };
  render(){
    return (
      <BreakpointProvider>
      <div>
        <NavBar 
          view={this.state.view}
          searchText = {this.state.searchText}
          passInput = {this.handleInput}
          changeView = {this.handleViews}
        />
        <div className="main container">
        <Breakpoint small down>
          <Search
            view={this.state.view}
            searchText = {this.state.searchText}
            passInput = {this.handleInput}
            changeView = {this.handleViews}
          />
        </Breakpoint>
        { (this.state.view === "default") ?   
          (<ResultView
            regionData = {this.state.regionData}
            countries = {this.state.filterNations}
            geodata = {this.state.nations}
            filterRegion = {this.filterRegion}
            handleSideBar = {this.handleSideBar}
            data = {this.state.worldData}
            getCountryInfo = {this.getCountryInfo}
            changeView = {this.handleViews}
          />) :
          <DetailView 
            regionData = {this.state.regionData}
            countries = {this.state.filterNations}
            geodata = {this.state.nations}
            filterRegion = {this.filterRegion}
            handleSideBar = {this.handleSideBar}
            data = {this.state.worldData}
            changeView = {this.handleViews}
            countryDetail = {this.state.countryDetail}
          />
        }
        </div>
      </div>
      </BreakpointProvider>
    )
  }
};

export default App;
