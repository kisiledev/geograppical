/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
// import Search from './Components/Search';
import ResultView from './Components/ResultView';
import DetailView from './Components/DetailView';
import NavBar from './Components/NavBar';
import { BreakpointProvider } from 'react-socks';
import './App.css';
import axios from 'axios';
 
class App extends Component {

  state = {
    nations: [],
    sidebar: "Show",
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
    this.loadWorldData();
  }
  // componentWillUpdate(){
  //   this.sideBarData();
  // }
  removeNull(array){
    return array
      .filter(item => item.data.government.capital !== undefined && item.data.government.country_name !==undefined && item.data.name)
      .map(item => Array.isArray(item) ? this.removeNull(item) : item);
  }
 async loadWorldData() {
   await axios.get("../factbook.json")
    .then(res => {
      let Data = res && Object.values(res.data)[0] || [];
      let exposedData = Object.values(Data);
      let newData = this.removeNull(exposedData);
      this.setState({ worldData: newData || []})
    });
  }
  
  




  getCountryInfo = (name, capital) => {
    let searchDB = Object.values(this.state.worldData);
    this.removeNull(searchDB);
    let match = searchDB.filter(country => 
    country.data.name === name || 
    country.data.government.country_name.conventional_long_form === name || 
    country.data.government.country_name.conventional_short_form === name || 
    country.data.government.capital.name === capital
    )[0].data;
    this.setState({countryDetail: match});
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
  getCountry = (string) => {
    console.log(string)
    let searchDB = Object.values(this.state.worldData);
    let match = searchDB.filter(place => place.data.name === string)[0].data;
    console.log(match);
    return match;
}
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
  handleViews = (view) => {
      this.setState(({view}))
  };
  viewSidebar = () => {
    if(this.state.sidebar === "Show"){
      this.setState(({sidebar: "Hide"}))
    } else {
      this.setState(({sidebar: "Show"}))
    }
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
    console.log(string);
    console.log(this.getCountry(string));
    this.setState(({filterNations: this.getCountry(string)}))
    console.log(this.state.filterNations);
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
        <div className="main container-fluid">
        {/* <Breakpoint small down>
          <Search
            view={this.state.view}
            countries={this.state.filterNations}
            searchText = {this.state.searchText}
            passInput = {this.handleInput}
            changeView = {this.handleViews}
          />
        </Breakpoint> */}
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
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
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
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
            getCountryInfo = {this.getCountryInfo}
          />
        }
        </div>
      </div>
      </BreakpointProvider>
    )
  }
};

export default App;
