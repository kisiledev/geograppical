import React, { Component } from 'react';
import Search from './Components/Search';
import ResultView from './Components/ResultView';
import AddView from './Components/AddView';
import './App.css';
import Axios from 'axios';



 
class App extends Component {

  state = {
    nations: [],
    view: "default",
    filteredData: [],
    filterNations: [],
    searchText: '',
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

  getCountries() {
    Axios.get('https://restcountries.eu/rest/v2/all')
      .then(res => {
        this.setState({
          nations: res.data
        })
      });

  }
  
  filterByName(string){
   return Axios
    .get('https://restcountries.eu/rest/v2/name/' + string)
    .then(res => {
      if(res.status === 200 && res !== null){
        this.setState(prevState =>({
          filterNations: res.data
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

  componentDidMount() {
    this.getCountries();  
    this.filterByName();  
  }

  

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
        <h2 className="text-center">Geography Search App</h2>
        <Search
          view={this.state.view}
          searchText = {this.state.searchText}
          passInput = {this.handleInput}
          changeView = {this.handleViews}
          
        />
        { (this.state.view === "default") ?   
          (<ResultView 
            countries = {this.state.filterNations}
            geodata = {this.state.nations} 
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
