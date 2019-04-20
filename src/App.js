import React, { Component } from 'react';
import Search from './Components/Search';
import ResultList from './Components/ResultList';
import AddView from './Components/AddView';
import Sidebar from './Components/Sidebar';
import './App.css';



 
class App extends Component {

  state = {
    view: "default",
    filteredData: [],
    searchText: '',
    countries: [
        {
          name: "Ghana", 
          location: "Afrika",
          type: "country",
          excerpt: "Ghana is a country in West Afrika, with a population of ... ",
          imgurl: "img/ghana.JPG",
          imgalt: "A view of Lake Volta",
          id: "1"
      },
      {
          name: "Burkina Faso", 
          location: "Afrika",
          type: "country",
          excerpt: "Burkino Faso is a country in West Afrika, with a population of ... ",
          imgurl: "img/bkfaso.jpg",
          imgalt: "Burkinabe children",
          id: "2"
      },
      {
          name: "Haiti (Ayiti)", 
          location: "Caribbean Sea",
          type: "country",
          excerpt: "Haiti is an island country in the Caribbean Sea, with a population of ... ",
          imgurl: "img/haiti.jpg",
          imgalt: "Haitian beach",
          id: "3"
      }
    ]
  }

  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(value => o[value].toLowerCase().includes(string.toLowerCase())));
}

  handleViews = (e) => {
    e.persist();
    if(e.target.value === "add"){
      this.setState(prevState => ({
        view: e.target.value}))
      console.log(this.state.view)
    } else {
      this.setState(prevState => ({
        view: "default"}))
      console.log(this.state.view);
    }
  };

  prevCountryCount = 3;
  addNewCountry = (name, location, type, excerpt) => {
    this.setState(prevState =>({
      countries: [
        ...this.state.countries, 
        {
          name,
          location,
          type,
          excerpt,
          id: this.prevCountryCount += 1
        }
      ],
      view: "default"
    }))
  }

  handleInput = (e) => {
    e.persist();
    if(e.target.value !== ""){
      this.setState(prevState => ({ 
        searchText: e.target.value, 
        filteredData: this.filterByValue(this.state.countries, e.target.value)
      }));
    } else {
      this.setState(prevState => ({ 
        searchText: e.target.value, 
        filteredData: []
      }));
    }
  };
  render(){
    return (
      <div className="main container card mt-5">
        <h1 className="text-center">Geography Search App</h1>
        <Search
          searchText = {this.state.searchText}
          passInput = {this.handleInput}
          searchData = {this.filterData}
          changeView = {this.handleViews}
          
        />
        <div className="row">
        { this.state.view === "default" ? 
          <ResultList 
            countries = {this.state.filteredData}
          /> :
          <AddView 
            changeView = {this.handleViews}
            addNew= {this.addNewCountry}
            addCountry={this.addNewCountry}/>
        }
        <Sidebar 
          countries = {this.state.countries}
        />
        </div>
      </div>
    )
  }
};

export default App;
