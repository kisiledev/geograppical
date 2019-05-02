/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import Search from './Components/Search';
import ResultView from './Components/ResultView';
import AddView from './Components/AddView';
import globe from './img/logo.png';
import './App.css';
import Axios from 'axios';
 
class App extends Component {

  state = {
    nations: [],
    view: "default",
    filteredData: [],
    filterNations: [],
    searchText: '',
    regionData: [],
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
  }
  // componentWillUpdate(){
  //   this.sideBarData();
  // }
  getCountries = () => {
    Axios.get('https://restcountries.eu/rest/v2/all')
      .then(res => {
        this.setState({
          nations: res && res.data || []
        })
      });

  }
  filterByName = (string) =>{
  if(string !==undefined)
   return Axios
    .get('https://restcountries.eu/rest/v2/name/' + string)
    .then(res => {
      if(res.status === 200 && res !== null){
        console.log(res.data)
        this.setState(prevState =>({
          filterNations: res && res.data || []
        }))
      } else {
        throw new Error('No country found');
      }
      })
      .catch(error => {
        console.log(error)
        return []
      });
  };

  sideBarData = () => {
    let totalRegions = this.state.nations.map(a => a.region);
    console.log('triggered');
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    for (let i = 0; i < uniqueRegions.length -1; i++) {
      this.setState({
        regionData: this.findAllByRegion(uniqueRegions[i])
      })
    }
  }
  
  


  findAllByRegion = (region) =>{
  if(region !==undefined)
    return Axios
     .get('https://restcountries.eu/rest/v2/region/' + region)
     .then(res => {
       if(res.status === 200 && res !== null){
        this.setState(prevState =>({
          regionData: res && res.data || [] 
        }))
         console.log(res.data);
       } else {
         throw new Error('No country found');
       }
       })
       .catch(error => {
         console.log(error)
         return []
       });
   };

   filterRegion = (region) =>{
    if(region !==undefined)
      return Axios
       .get('https://restcountries.eu/rest/v2/region/' + region)
       .then(res => {
         if(res.status === 200 && res !== null){
          this.setState(prevState =>({
            [region]: res && res.data || [] 
          }))
          } else {
           throw new Error('No country found');
         }
         })
         .catch(error => {
           console.log(error)
           return []
         });
     };

  

  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(value => o[value].toString().toLowerCase().includes(string.toLowerCase())));
}

  handleViews = (e) => {
    e.persist();
    if(e.target.value === "add"){
      this.setState(prevState => ({
        view: e.target.value}))
    } else {
      this.setState(prevState => ({
        view: "default"}))
    }
  };

  prevCountryCount = this.state.countries.length;
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
          id: this.prevCountryCount += 1
        }
      ],
      view: "default"
    }))
  }

  handleInput = (e) => {
    e.persist();
    console.log(e.target.value);
    if(e.target.value !== ""){
      this.setState(prevState => ({ 
        searchText: e.target.value, 
        filterNations: this.filterByName(e.target.value)
      }));
    } else {
      this.setState(prevState => ({ 
        searchText: e.target.value, 
        filterNations: []
      }));
    }
  };
  render(){
    return (
      <div className="main container mt-5">
        <h2 className="text-center">
          <img 
            className="logo" 
            src={globe} 
            alt="logo" 
          />  Geography Search App</h2>
        <Search
          view={this.state.view}
          searchText = {this.state.searchText}
          passInput = {this.handleInput}
          changeView = {this.handleViews}
          
        />
        { (this.state.view === "default") ?   
          (<ResultView
            regionData = {this.state.regionData}
            countries = {this.state.filterNations}
            geodata = {this.state.nations}
            sideBarData = {this.sideBarData}
            totalRegions = {this.totalRegions}
            uniqueRegions = {this.uniqueRegions}
            getOccurrence = {this.getOccurrence}
            filterRegion = {this.filterRegion}
          />) :
          <AddView 
            changeView = {this.handleViews}
            addNew= {this.addNewCountry}
            addCountry={this.addNewCountry}/>
        }
      </div>
    )
  }
};

export default App;
