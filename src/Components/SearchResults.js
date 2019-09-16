import React, {Component} from 'react';
import Result from './Result';
import { Breakpoint, BreakpointProvider } from 'react-socks';
import { Alert} from 'react-bootstrap'
import { db } from './Firebase/firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import SidebarView from './SidebarView';
import Maps from './Maps';
import {withRouter} from 'react-router-dom'
import * as ROUTES from '../Constants/Routes'


class SearchResults extends Component {
  state = {
    loading: false,
    message: '',
    alert: false
  }
  componentDidMount = () => {
  }
  componentDidUpdate = (prevProps, prevState) => {
    console.log('loading view')
    if(this.props.countries){
        console.log(this.props.countries, prevProps.countries)
    }
    if(this.props.countries.length !==prevProps.countries.length){
        this.setState({loading: false})
    }
    if(this.props.data !== prevProps.data){
        this.props.handleRefresh(this.props.match.params.input)
        this.setState({loading: false}, console.log('false'))
    }
  }
  makeFavorite = (e, country) => {
    e.persist();
    this.setState({show: true})
    if(!this.props.user){
      this.setState({alert: true, message: {style: "warning", content: `You need to sign in to favorite countries. Login`, link: ROUTES.SIGN_IN, linkContent: ' here'}})
    } else {
      if(!this.state.favorite){
        db.collection(`users/${this.props.user.uid}/favorites`).doc(`${country.name}`).set({
              country
        }).then(() => {
          console.log(`Added ${country.name} to favorites`)
          this.setState({alert: true, message: {style: "success", content: `Added ${country.name} to favorites`}, show: true, favorite: true})
        }).catch((err) => {
          console.error(err)
          this.setState({alert: true, message: {style: "danger", content: `Error adding ${country.name} to favorites, ${err}`}})
        })
      } else {
        db.collection(`users/${this.props.user.uid}/favorites`).doc(`${country.name}`).delete()
        .then(() => {
          console.log(`Removed ${country.name} from favorites`)
          this.setState({alert: true, message: {style: "warning", content: `Removed ${country.name} from favorites`}, favorite: false, show: true})
        }).catch((err) => {
          console.error(err)
          this.setState({alert: true, message: {style: "danger", content: `Error adding ${country.name} to favorites, ${err}`}})
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
          {this.state.alert && 
          <Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}
            <Alert.Link href={this.state.message.link}>
              {this.state.message.linkContent}
            </Alert.Link>
          </Alert>}
          <div className="col-12 text-center">
              { this.state.loading ? <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="3x" /> :
                (this.props.searchText === "" ? <h4 className="my-3">No search terms are entered</h4> : <h4 className="my-3">Search Results for {this.props.data ? this.props.searchText : this.props.match.params.input}</h4>)
              }
              
          </div>
          <Breakpoint medium up>
          <Maps
            mapVisible = {this.props.mapVisible}
            mapView={this.props.mapView} 
            worldData = {this.props.data}
            countries = {this.props.countries}
            changeView = {this.props.changeView}
            getCountryInfo = {this.props.getCountryInfo}
            hoverOnRegion = {this.props.hoverOnRegion}
            hoverOffRegion = {this.props.hoverOffRegion}
            handleMove = {this.props.handleMove}
            handleLeave = {this.props.handleLeave}
            hovered = {this.props.hovered}
            highlighted = {this.props.highlighted}
            totalRegions = {totalRegions}
            uniqueRegions = {uniqueRegions}
            getOccurrence = {getOccurrence}
          />
          </Breakpoint>
          {this.props.countries[0] && this.props.countries.map( (country, index) => 
            <Result
            filtered = {this.props.countries[0]}
            worldData = {this.props.data}
            makeFavorite = {this.makeFavorite}
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
        {/* <SidebarView
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
        /> */}
      </div>
      </BreakpointProvider>
    )
  }
}
export default withRouter(SearchResults);