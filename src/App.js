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
    this.filterByCode();
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
  filterByCode = (string) =>{
    if(string !==undefined)
     return Axios
      .get('https://restcountries.eu/rest/v2/alpha/' + string)
      .then(res => {
        if(res.status === 200 && res !== null){
          console.log(res.data)
          let nation = []
          nation.push(res && res.data || []);
          this.setState(prevState =>({
            filterNations: nation
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
  handleSideBar = (string) => {
    this.setState(prevState => ({
      filterNations: this.filterByCode(string)
    }))
  };
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
        <img 
            className="logo" 
            src={globe} 
            alt="logo" 
          />  
        <h2 className="text-center">Geography Search App</h2>
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
            filterRegion = {this.filterRegion}
            handleSideBar = {this.handleSideBar}
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
