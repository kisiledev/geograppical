import React, {Component} from 'react';
import RecursiveProperty from './DataList';
import AudioPlayer from './AudioPlayer';
import Flag from 'react-flags';
import { withRouter, Link } from 'react-router-dom';
import '../App.css';
import { BreakpointProvider, Breakpoint } from 'react-socks';
import { Alert } from 'react-bootstrap'
import SidebarView from './SidebarView';
import { db } from './Firebase/firebase'
import { faArrowLeft, faSpinner, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ROUTES from '../Constants/Routes'

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
  this.props.user && this.props.countryDetail && !this.state.favorite && this.checkFavorite(this.props.countryDetail.name)
  if(this.props.data !==prevProps.data){
    console.log('reloading')
    console.log(this.props.match.params.country)
    this.props.getCountryInfo(this.props.match.params.country)
    this.setState({loading: false})
  }
}
  checkFavorite = (country) => {
    const docRef = db.collection(`users/${this.props.user.uid}/favorites`).doc(`${country}`);
    docRef.get()
    .then(doc => {
      if(doc.exists){
        const data = doc.data()
        this.setState({favorite: true})
        console.log(data)
      } else {
        this.setState({favorite: false})
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
  makeFavorite = (e, country) => {
    e.persist();
    this.setState({show: true})
    if(!this.props.user){
      this.setState({message: {style: "warning", content: `You need to sign in to favorite countries. Login `, link: ROUTES.SIGN_IN, linkContent: 'here'}})
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
        this.state.loading ? <div className="my-5 text-center mx-auto" ><FontAwesomeIcon icon={faSpinner} spin size="3x"/></div> :
        (
        <BreakpointProvider>
        <div className="row">
            <div className="col-md-12 col-md-9">
                <div className="card my-3">
                {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}
                  {this.state.message && this.state.message.length>0 && this.state.message.link && <Alert.Link href={this.state.message.link && this.state.message.link}>
                    {this.state.message.linkContent}
                  </Alert.Link>
                  }
                </Alert>}
                <div className="row justify-content-between">
                  <div className="col-md-12 col-lg-6 flex-md-nowrap d-flex justify-content-between align-items-center">
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
                  
                  <div className="col-md-12 col-lg-6">
                    <AudioPlayer nation={this.props.countryDetail} />
                  </div>
                  
                  
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
            <Breakpoint medium down>
            <SidebarView 
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
            />
            </Breakpoint>
        </div>
        </BreakpointProvider>
        )
      )
    }
  }
  
  export default withRouter(DetailView);