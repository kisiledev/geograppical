import React, {Component} from 'react';
import RecursiveProperty from './DataList';
import AudioPlayer from './AudioPlayer';
import Flag from 'react-flags';
import { Link } from 'react-router-dom';
import '../App.css';
import Alert from 'react-bootstrap/Alert'
import Sidebar from './Sidebar';
import { db, auth } from './Firebase/firebase'
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DetailView extends Component {
  state = {
    loggedIn: true,
    favorite: false
}

// users/${currentUser}/favorites
  makeFavorite = (e, country) => {
    e.persist();
    if(!this.state.favorite){
        db.collection(`users/${this.props.user.uid}/favorites`).doc(`${country.name}`).set({
              country
        }).then(() => {
          console.log(`Added ${country.name} to favorites`)
          this.setState({message: {style: "success", content: `Added ${country.name} to favorites`}, favorite: true})
        }).catch((err) => {
          console.error(err)
          this.setState({message: {style: "danger", content: `Error adding ${country.name} to favorites, ${err}`}})
        })
    } else {
        this.setState({favorite: false})
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
          {this.state.messasge && <Alert variant={this.state.message.style}>{this.state.message}</Alert>}
            <div className="col-sm-12 col-md-9">
                <div className="card mb-3">
                <div className="row justify-content-between">
                <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-primary align-self-start" onClick={() => this.props.changeView('default')}><FontAwesomeIcon icon={faArrowLeft}/> Back to Results</Link>
                <AudioPlayer nation={this.props.countryDetail} />
                {auth.currentUser && <div className="stars"><FontAwesomeIcon onClick={(e) => this.makeFavorite(e, this.props.countryDetail)} size="2x" color={this.state.favorite ? "gold" : "gray"} icon={faStar} /></div>}
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
  
  export default DetailView;