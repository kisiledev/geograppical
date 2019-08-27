import React, {Component} from 'react';
import RecursiveProperty from './DataList';
import AudioPlayer from './AudioPlayer';
import Flag from 'react-flags';
import { withRouter, Link } from 'react-router-dom';
import '../App.css';
import { Alert, Button} from 'react-bootstrap'
import Sidebar from './Sidebar';
import { db } from './Firebase/firebase'
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DetailView extends Component {
  state = {
    loggedIn: true,
    favorite: false,
    show: false,
    loading: false,
    message: '',
}
componentWillMount = () => {
  console.log(this.props)
}

  mapStateToProps = (state, props) => {
    console.log(props.match.params)
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
        <div className="row">
            <div className="col-sm-12 col-md-9">
                <div className="card mb-3">
                {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content} <Alert.Link href={`${process.env.PUBLIC_URL}/login`}>here</Alert.Link></Alert>}
                <div className="row justify-content-between">
                <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-primary align-self-start" onClick={() => this.props.changeView('default')}><FontAwesomeIcon icon={faArrowLeft}/> Back to Results</Link>
                <AudioPlayer nation={this.props.countryDetail} />
                {<div className="stars"><FontAwesomeIcon onClick={(e) => this.makeFavorite(e, this.props.countryDetail)} size="2x" color={this.state.favorite ? "gold" : "gray"} icon={faStar} /></div>}
                <Flag
                  className="detailFlag align-self-end text-right img-thumbnail"
                  name={(this.props.countryDetail.government.country_name.isoCode ? this.props.countryDetail.government.country_name.isoCode : "_unknown") ? this.props.countryDetail.government.country_name.isoCode : `_${this.props.countryDetail.name}`}
                  format="svg"
                  pngSize={64}
                  shiny={false}
                  alt={`${this.props.countryDetail.name}'s Flag`}
                  basePath="/img/flags"
                />
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
    }
  }
  
  export default withRouter(DetailView);