import React, {useState, useEffect} from 'react';
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
import * as ROUTES from '../Constants/Routes';

const DetailView = props => {
  const [show, setShow] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [message, setMessage] = useState('')
  const [alert, setAlert] = useState(false)

  useEffect(() => {
    // let _isMounted = true;
    console.log(loadingState, props.loading)
    if(props.countryDetail && (props.countryDetail.length !== 0 || props.countryDetail === undefined)){
      setLoadingState(false)
    }
    !props.loading && props.getCountryInfo(props.match.params.country) 
    })

  useEffect(() => {
    props.user && props.countryDetail && !favorite && checkFavorite(props.countryDetail.name)
    console.log(props.match.params.country)
    props.getCountryInfo(props.match.params.country)
    setLoadingState(false)
  }, [props.data])

  useEffect(() => {
    return () => {
        this._isMounted = false
    }
  }, [])
  const checkFavorite = (country) => {
    const docRef = db.collection(`users/${props.user.uid}/favorites`).doc(`${country}`);
    docRef.get()
    .then(doc => {
      if(doc){
        if(doc.exists){
          const data = doc.data()
          setFavorite(true)
          console.log(data)
        } else {
          setFavorite(false)
        }
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
  const makeFavorite = (e, country) => {
    e.persist();
    setShow(true)
    if(!props.user){
      setMessage({style: "warning", content: `You need to sign in to favorite countries. Login `, link: ROUTES.SIGN_IN, linkContent: 'here'})
    } else {
      if(!favorite){
        db.collection(`users/${props.user.uid}/favorites`).doc(`${country.name}`).set({
              country
        }).then(() => {
          console.log(`Added ${country.name} to favorites`)
          setAlert(true)
          setMessage({style: "success", content: `Added ${country.name} to favorites`})
          setFavorite(true)
        }).catch((err) => {
          console.error(err)
          setAlert(true)
          setMessage({style: "danger", content: `Error adding ${country.name} to favorites, ${err}`})
        })
      } else {
        db.collection(`users/${props.user.uid}/favorites`).doc(`${country.name}`).delete()
        .then(() => {
          console.log(`Removed ${country.name} from favorites`)
          setAlert(true)
          setMessage({style: "warning", content: `Removed ${country.name} from favorites`})
          setFavorite(false)
          setShow(true)
        }).catch((err) => {
          console.error(err)
          setAlert(true)
          setMessage({style: "danger", content: `Error adding ${country.name} to favorites, ${err}`})
        })
      }
    }
}
  const {countryDetail } = this.props
  const totalRegions = props.data.map(a => a.geography.map_references)
  function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
  }
  let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
  uniqueRegions = uniqueRegions.filter(Boolean)
      return(
        loadingState ? <div className="my-5 text-center mx-auto" ><FontAwesomeIcon icon={faSpinner} spin size="3x"/></div> :
        (
        <BreakpointProvider>
        {countryDetail === "error" || countryDetail === undefined ? (
          <div className="h3">There has been an error. We cannot find the country in our database. Please go back and choose another country</div>
        ) : (
        <div className="row">
            <div className="col-md-12 col-md-9">
                <div className="card my-3">
                {<Alert show={show} variant={message.style}>{message.content}
                  {message && message.length>0 && message.link && 
                  <Alert.Link href={message.link && message.link}>
                    {message.linkContent}
                  </Alert.Link>
                  }
                </Alert>}
                <div className="row justify-content-between">
                  <div className="col-md-12 col-lg-12 flex-md-nowrap d-flex justify-content-between align-items-center">
                    <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-primary" onClick={() => props.history.goBack()}><FontAwesomeIcon icon={faArrowLeft}/> Back</Link>
                    <Breakpoint medium up>
                      <div className="col-lg-12">
                        <h3>{countryDetail.name} - <small>{countryDetail.government.capital.name.split(';')[0]}</small></h3>
                        <h5>Pop: {countryDetail.people.population.total} - Ranked ({countryDetail.people.population.global_rank})</h5>
                      </div>
                    </Breakpoint>
                    <FontAwesomeIcon onClick={(e) => makeFavorite(e, countryDetail)} size="2x" color={favorite ? "gold" : "gray"} icon={faStar} />
                    <Flag
                      className="detailFlag order-lg-12 align-self-end text-right img-thumbnail"
                      name={(countryDetail.government.country_name.isoCode ? countryDetail.government.country_name.isoCode : "_unknown") ? countryDetail.government.country_name.isoCode : `_${countryDetail.name}`}
                      format="svg"
                      pngSize={64}
                      shiny={false}
                      alt={`${countryDetail.name}'s Flag`}
                      basePath="/img/flags"
                    />
                    <AudioPlayer nation={countryDetail} />
                  </div>
                  
                  
                </div>
                <RecursiveProperty
                  property={countryDetail} 
                  expanded={Boolean}
                  propertyName={countryDetail.name} 
                  excludeBottomBorder={false} 
                  rootProperty={true}
                />
                </div>
            </div>
            <Breakpoint medium down>
            <SidebarView 
                data={props.data}
                changeView = {props.changeView}
                viewSidebar={props.viewSidebar}
                totalRegions = {totalRegions}
                uniqueRegions = {uniqueRegions}
                getOccurrence = {getOccurrence}
                sidebar={props.sidebar}
                getCountryInfo = {props.getCountryInfo}
                handleSideBar = {props.handleSideBar}
                hoverOffRegion = {props.hoverOffRegion}
                hoverOnRegion = {props.hoverOnRegion}
                filterCountryByName = {props.filterCountryByName}
                hoverOnCountry = {props.hoverOnCountry}
                hoverOffCountry = {props.hoverOffCountry}
            />
            </Breakpoint>
        </div>
        )}
        </BreakpointProvider>
        )
      )
    }
  
  export default DetailView;