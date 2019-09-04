import React, {Component} from 'react';
import Result from './Result';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import { Alert, Button} from 'react-bootstrap'
import { db, firestore } from './Firebase/firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import Sidebar from './Sidebar';
import Maps from './Maps';


class ResultView extends Component {
  state = {
    loading: false,
    message: '',
  }

  makeFavorite = (e, country) => {
    e.persist();
    this.setState({show: true})
    if(!this.props.user){
      this.setState({message: {style: "warning", content: `You need to sign in to favorite countries. Login`}})
    } else {
      if(!this.state.favorite){
        db.collection(`users/${this.props.user.uid}/favorites`).doc(`${country.name}`).set({
              country
        }).then(() => {
          console.log(`Added ${country.name} to favorites`)
          this.setState({message: {style: "success", content: `Added ${country.name} to favorites`}, show: true, favorite: true})
        }).catch((err) => {
          console.error(err)
          this.setState({message: {style: "danger", content: `Error adding ${country.name} to favorites, ${err}`}})
        })
      } else {
        db.collection(`users/${this.props.user.uid}/favorites`).doc(`${country.name}`).delete()
        .then(() => {
          console.log(`Removed ${country.name} from favorites`)
          this.setState({message: {style: "warning", content: `Removed ${country.name} from favorites`}, favorite: false, show: true})
        }).catch((err) => {
          console.error(err)
          this.setState({message: {style: "danger", content: `Error adding ${country.name} to favorites, ${err}`}})
        })
      }
    }
}
  render() {
    // (regionCountries[0].name !== undefined) ? console.log(regionCountries): console.log('nothing');
    const totalRegions = this.props.data.map(a => a.geography.map_references.replace(/;/g, ""))
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean);

    return(
      <BreakpointProvider>
      <div className="row">
        <main className="col-md-9 px-0">
          {this.props.countries[0] === undefined ? 
              null
           : null }
          {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}</Alert>}
          {this.props.countries[0] && this.props.countries.map( (country, index) => 
            <Result
            worldData = {this.props.data}
            changeView = {this.props.changeView}
            getCountryInfo = {this.props.getCountryInfo}
            name={country.name}
            region = {country.geography.map_references}
            subregion = {country.geography.location}
            capital = {country.government.capital.name}
            excerpt = {country.excerpt}
            population = {country.people.population.total}
            flag = {country.flag}
            flagCode = {country.government.country_name.isoCode}
            imgalt = {country.name + "'s flag"}        
            key={index}
            country={country}
            code={country.alpha3Code}
            handleOpen = {this.props.handleOpen}
            handleClose = {this.props.handleClose}
            user = {this.props.user}
            setModal = {this.props.setModal}
            login = {this.props.login}
            />
          )}
        </main>
        {this.props.sidebar === "Show" ?
        <Sidebar
            hoverOnRegion = {this.props.hoverOnRegion}
            hoverOffRegion = {this.props.hoverOffRegion}
            changeView = {this.props.changeView}
            handleSideBar = {this.props.handleSideBar}
            viewSidebar={this.props.viewSidebar}
            data={this.props.data}
            totalRegions = {totalRegions}
            uniqueRegions = {uniqueRegions}
            getOccurrence = {getOccurrence}
            sidebar={this.props.sidebar}
            getCountryInfo = {this.props.getCountryInfo}
            filterCountryByName = {this.props.filterCountryByName}
            hoverOnCountry = {this.props.hoverOnCountry}
            hoverOffCountry = {this.props.hoverOffCountry}
            handleMove = {this.props.handleMove}
            handleLeave = {this.props.handleLeave}
            hovered = {this.props.hovered}
            highlighted = {this.props.highlighted}
        /> :     
        <Breakpoint small down>
            <div className="col-12 text-center px-0">
            <button 
            className="btn btn-sm btn-block btn-outline-secondary" 
            onClick={()=> this.props.viewSidebar()}
            >
            { (this.props.sidebar === "Hide") ? "Show" : "Hide"} Countries List
            </button>
            </div>
        </Breakpoint> 
      }
      </div>
      </BreakpointProvider>
    )
  }
}
export default ResultView;