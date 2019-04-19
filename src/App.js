import React, { Component } from 'react';
import Search from './Components/Search';
import ResultList from './Components/ResultList';
import Sidebar from './Components/Sidebar';
import './App.css';



 
class App extends Component {

  state = {
    filteredData: [],
    searchText: '',
    countries: [
        {
          name: "Ghana", 
          location: "Afrika",
          type: "country",
          excerpt: "Ghana is a country in West Afrika, with a population of ... ",
          img: {
              url: "img/ghana.JPG",
              alt: "A view of Lake Volta"
          },
          id: 1
      },
      {
          name: "Burkina Faso", 
          location: "Afrika",
          type: "country",
          excerpt: "Burkino Faso is a country in West Afrika, with a population of ... ",
          img: {
              url: "img/bkfaso.jpg",
              alt: "Burkinabe children"
          },
          id: 2
      },
      {
          name: "Haiti", 
          location: "Caribbean Sea",
          type: "country",
          excerpt: "Haiti is an island country in the Caribbean Sea, with a population of ... ",
          img: {
              url: "img/haiti.jpg",
              alt: "Haitian beach"
          },
          id: 3
      }
    ]
  }

  handleInput = (e) => {
    this.setState({ 
      searchText: e.target.value, 
      filteredData: this.state.countries.filter(country => country.name.includes(this.state.searchText))
    })
  };
  render(){
    console.log(this.state.searchText);
    console.log(this.state.filteredData);
    return (
      <div className="main container card mt-5">
        <h1 className="text-center">Geography Search App</h1>
        <Search
          searchText = {this.state.searchText}
          passInput = {this.handleInput}
          searchData = {this.filterData}
        />
        <div className="row">
        <ResultList 
          countries = {this.state.filteredData}
        />
        <Sidebar 
          countries = {this.state.countries}
        />
        </div>
      </div>
    )
  }
};

export default App;
