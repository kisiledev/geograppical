import React, {Component} from 'react';
import RecursiveProperty from './DataList';
import AudioPlayer from './AudioPlayer';
import Flag from 'react-flags';
import { withRouter, Link } from 'react-router-dom';
import '../App.css';
import { Alert } from 'react-bootstrap'
import Sidebar from './Sidebar';
import { db } from './Firebase/firebase'
import { faArrowLeft, faSpinner, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DetailView extends Component {
  state = {
    loggedIn: true,
    favorite: false,
    show: false,
    loading: true,
    message: '',
}
componentDidMount = () => {
  console.log(this.state.loading, this.props.loading)
  if(this.props.countryDetail.length !== 0){
    this.setState({loading: false})
  }
  if(!this.props.loading){
    this.props.getCountryInfo(this.props.match.params.country)
    
  }
}
componentDidUpdate = (prevProps, prevState) => {
  console.log(this.props.loading)
  console.log(this.state.loading)
  console.log(prevProps.loading)
  console.log(prevState.loading)
  this.props.user && this.props.countryDetail && this.checkFavorite(this.props.countryDetail.name)
  if(this.props.loading !== prevProps.loading || this.props.loading !==prevState.loading){
    this.props.getCountryInfo(this.props.match.params.country)
    this.setState({loading: false})
  }
  if(this.state.favorite !== prevState.favorite){
    this.checkFavorite(this.props.countryDetail.name)
  }
}
  checkFavorite = (country) => {
    console.log(country)
    const docRef = db.collection(`users/${this.props.user.uid}/favorites`).doc(`${country}`);
    docRef.get()
    .then(doc => {
      if(doc.exists){
        const data = doc.data()
        this.setState({favorite: true})
        console.log(data)
      } else {
        this.setState({favorite: false})
        console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
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
    const totalRegions = this.props.data.map(a => a.geography.map_references)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean)
      return(
        this.state.loading ? <FontAwesomeIcon icon={faSpinner} spin size="3x"/> :
        (
        <div className="row">
            <div className="col-md-12 col-md-9">
                <div className="card mb-3">
                {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}</Alert>}
                <div className="row justify-content-between">
                  <div className="col-12 flex-nowrap d-flex justify-content-between align-items-center">
                    <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-primary" onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faArrowLeft}/> Back</Link>
                    <FontAwesomeIcon onClick={(e) => this.makeFavorite(e, this.props.countryDetail)} size="2x" color={this.state.favorite ? "gold" : "gray"} icon={faStar} />
                    <Flag
                      className="detailFlag col-3 align-self-end text-right img-thumbnail"
                      name={(this.props.countryDetail.government.country_name.isoCode ? this.props.countryDetail.government.country_name.isoCode : "_unknown") ? this.props.countryDetail.government.country_name.isoCode : `_${this.props.countryDetail.name}`}
                      format="svg"
                      pngSize={64}
                      shiny={false}
                      alt={`${this.props.countryDetail.name}'s Flag`}
                      basePath="/img/flags"
                    />
                  </div>
                  
                  
                </div>
                  <div className="col-12">
                    <AudioPlayer nation={this.props.countryDetail} />
                  </div>
                <RecursiveProperty
                  property={this.props.countryDetail} 
                  expanded={Boolean}
                  propertyName={this.props.countryDetail.name} 
                  excludeBottomBorder={false} 
                  rootProperty={true}
                />
                </div>
            </div>
            {this.props.sidebar === "Show" ?
            <Sidebar 
                data={this.props.data}
                changeView = {this.props.changeView}
                viewSidebar={this.props.viewSidebar}
                totalRegions = {totalRegions}
                uniqueRegions = {uniqueRegions}
                getOccurrence = {getOccurrence}
                sidebar={this.props.sidebar}
                getCountryInfo = {this.props.getCountryInfo}
                handleSideBar = {this.props.handleSideBar}
                hoverOffRegion = {this.props.hoverOffRegion}
                hoverOnRegion = {this.props.hoverOnRegion}
                filterCountryByName = {this.props.filterCountryByName}
                hoverOnCountry = {this.props.hoverOnCountry}
                hoverOffCountry = {this.props.hoverOffCountry}
            /> : null }
        </div>
        )
      )
    }
  }
  
  export default withRouter(DetailView);