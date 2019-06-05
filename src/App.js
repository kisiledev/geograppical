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
    this.loadCodes();
  }
  removeNull(array){
    if(array !==undefined)
    return array
      .filter(item => item.government.capital !== undefined && item.government.country_name !==undefined && item.name)
      .map(item => Array.isArray(item) ? this.removeNull(item) : item);
  }

  async loadCodes() {
    await axios.get("../iso.json")
     .then(res => {
       let codes = res.data
       const isoCodes = codes.map(code => {
         const container = {};
         container.name = code["CLDR display name"];
         container.isoCode = code["ISO3166-1-Alpha-3"];
         container.capital = code["Capital"]

         return container;
       })
       console.log(codes);
       console.log(isoCodes);
       this.setState({isoCodes: isoCodes})
     });
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
      const iso = this.state.isoCodes;
      console.log(newData)
      console.log(newCodes);
      console.log(newData);
      console.log(iso); 
      this.setState({flagCodes: newCodes})
      this.setState({ worldData: newData || []})
    });
  }
  
  hoverOnRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = Object.values(region)[2];
    if(typeof countries === "object"){
    this.svgs = countries.map((country, i) => country.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase())
    this.setState({SVG: this.svgs})
    }
    svgs = this.svgs
    let nodes = (document.getElementsByClassName("country"));
    nodes = [...nodes]
    console.log(svgs);
    console.log(nodes);
    nodes = nodes.filter(e => this.svgs.includes(e.dataset.longname.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()) || this.svgs.includes(e.dataset.shortname.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()));
    nodes.forEach( node => {
      console.log('changing style');
      node.style.fill =  "#60c080";
      node.style.stroke =  "#607D8B";
      node.style.strokeWidth =  1;
      node.style.outline =  "none"
    })
  }

  hoverOffRegion = (e, region) => {
    let svgs = [];
    e.stopPropagation();
    const countries = Object.values(region)[2];
    if(typeof countries === "object"){
    this.svgs = countries.map((country, i) => country.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase())
    this.setState({SVG: this.svgs})
    }
    svgs = this.svgs
    let nodes = (document.getElementsByClassName("country"));
    nodes = [...nodes]
    console.log(svgs);
    console.log(nodes.map(e => e.dataset.longname))
    console.log(nodes.map(e => e.dataset.shortname))
    nodes = nodes.filter(e => this.svgs.includes(e.dataset.longname.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()) || this.svgs.includes(e.dataset.shortname.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()));
    console.log(nodes);
    nodes.forEach( node => {
      console.log('changing style');
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
      country.name.toLowerCase() === name.toLowerCase()
      || country.government.country_name.conventional_long_form.toLowerCase() === name.toLowerCase())
      console.log(match);
      this.setState(({countryDetail: match[0]}))
      this.handleViews('detail');
    }
    
filterCountryByName = (string) =>{
    let searchDB = Object.values(this.state.worldData);
    console.log(string)
    console.log(this.state.filterNations)
    console.log(searchDB)
    let match = searchDB.filter(country => country.name.toLowerCase() === string.toLowerCase()
      || country.name.toLowerCase().includes(string.toLowerCase())
      || country.government.country_name.conventional_long_form.toLowerCase() === string.toLowerCase()
      || country.government.country_name.conventional_long_form.toLowerCase().includes(string.toLowerCase())
    );
    console.log(match)
    this.setState({filterNations: match})
    if(string.length === 0 || string === " ")
      { console.log(string);
        return match = []
      }
    return match;
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
    console.log('changing')
    if(e.target.value != null && e.target.value.trim() !== ''){
      this.setState({searchText: e.target.value}, () => this.filterCountryByName(e.target.value));
      let nodes = [...(document.getElementsByClassName("country"))];
      console.log(this.state.filterNations)
      let searchNations = this.filterCountryByName(e.target.value).map((country, i) => country.name)
      console.log(searchNations)
      nodes.forEach( node => {
        node.style.fill =  "#ECEFF1";
        node.style.stroke =  "#607D8B";
        node.style.strokeWidth =  .75;
        node.style.outline =  "none"
      })
      nodes = nodes.filter(e => searchNations.includes(e.dataset.tip));
      console.log(nodes);
      nodes.forEach( node => {
        node.style.fill =  "#60c080";
        node.style.stroke =  "#607D8B";
        node.style.strokeWidth =  1;
        node.style.outline =  "none"
      })

    } else {
      this.setState(({ 
        searchText: e.target.value, 
        filterNations: []
      }));
      let nodes = [...(document.getElementsByClassName("country"))];
      console.log(this.state.filterNations)
      let searchNations = this.filterCountryByName(e.target.value).map((country, i) => country.name)
      console.log(searchNations)
      nodes.forEach( node => {
        node.removeAttribute("style")
      })
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
            hoverOnRegion = {this.hoverOnRegion}
            hoverOffRegion = {this.hoverOffRegion}
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
            hoverOnRegion = {this.hoverOnRegion}
            hoverOffRegion = {this.hoverOffRegion}
          />
        }
        </div>
      </div>
      </BreakpointProvider>
    )
  }
};

export default App;
