/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import ResultView from './Components/ResultView';
import DetailView from './Components/DetailView';
import NavBar from './Components/NavBar';
import { BreakpointProvider } from 'react-socks';
import './App.css';
import axios from 'axios';
import i18n from 'i18n-iso-countries';

 
class App extends Component {

  state = {
    nations: [],
    sidebar: "Show",
    view: "default",
    filteredData: [],
    filterNations: [],
    searchText: '',
    worldData: [],
    countryDetail: [],
    countries: []
  }

  componentDidMount() {
    this.loadWorldData();
  }
  removeNull(array){
    if(array !==undefined)
    return array
      .filter(item => item.government.capital !== undefined && item.government.country_name !==undefined && item.name)
      .map(item => Array.isArray(item) ? this.removeNull(item) : item);
  }
 async loadWorldData() {
   await axios.get("../factbook.json")
    .then(res => {
      let Data = res && res.data.countries;
      Data = Object.values(Data).map(country => country.data) || [];
      let newData = this.removeNull(Object.values(Data));
      newData.forEach(function(element, index, newData) {
        newData[index].geography.map_references = newData[index].geography.map_references.replace(/;/g, "")
        if(newData[index].geography.map_references === "AsiaEurope")
        newData[index].geography.map_references = "Europe"
      });
      i18n.registerLocale(require("i18n-iso-countries/langs/en.json"));
      let codes = i18n.getNames('en');
      let newCodes = {};
      const keys = Object.keys(codes);
      keys.forEach(key => {
        let val = codes[key];
        newCodes[val]=key;
      })
      this.setState({flagCodes: newCodes})
      this.setState({ worldData: newData || []})
    });
  }
  
  


  getCountryInfo = (name) =>{
    let searchDB = Object.values(this.state.worldData);
    console.log(searchDB);
    console.log(name )
    let match = searchDB.filter(country => country.name === name || country.government.country_name.conventional_long_form === name)
    console.log(match);
    this.setState(({countryDetail: match[0]}))
    this.handleViews('detail');
  }
filterCountryByName = (string) =>{
    let searchDB = Object.values(this.state.worldData);
    console.log(searchDB)
    let match = searchDB.filter(place => place.name.toLowerCase().includes(string.toLowerCase()));
    console.log(match)
    return match
  }

  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(value => o[value].toString().toLowerCase().includes(string.toLowerCase())));
  };
  handleViews = (view) => {
    console.log(view);
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
    this.setState({filterNations: this.filterCountryByName(string)})
  };
  handleInput = (e) => {
    e.persist();
    if(e.target.value !== ""){
      this.setState(({ 
        searchText: e.target.value, 
        filterNations: this.filterCountryByName(e.target.value)
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
        { (this.state.view === "default") ?   
          (<ResultView
            flagCodes = {this.state.flagCodes}
            countries = {this.state.filterNations}
            filterRegion = {this.filterRegion}
            handleSideBar = {this.handleSideBar}
            data = {this.state.worldData}
            getCountryInfo = {this.getCountryInfo}
            changeView = {this.handleViews}
            viewSidebar={this.viewSidebar}
            sidebar={this.state.sidebar}
          />) :
          <DetailView 
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
          />
        }
        </div>
      </div>
      </BreakpointProvider>
    )
  }
};

export default App;
