import React, {useState, useEffect} from 'react';
import Result from './Result';
import { BreakpointProvider } from 'react-socks';
import { Alert} from 'react-bootstrap'
import { db } from './Firebase/firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import {withRouter} from 'react-router-dom'
import * as ROUTES from '../Constants/Routes'


const SearchResults = props => {
  const [loadingState, setLoadingState] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [message, setMessage] = useState('')
  const [alert, setAlert] = useState(false)
  const [show, setShow] = useState(false)
  
  useEffect(()=> {
    props.handleRefresh(props.match.params.input)
    setLoadingState(false)
  }, [props.data]);

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
    return(
      <BreakpointProvider>
      <div className="row">
        <main className="col-md-9 px-5">
          {props.countries[0] === undefined ? 
              null
           : null }
          {alert && 
          <Alert show={show} variant={message.style}>{message.content}
            <Alert.Link href={message.link}>
              {message.linkContent}
            </Alert.Link>
          </Alert>}
          <div className="col-12 text-center">
              { loadingState ? <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="3x" /> :
                (props.searchText === "" ? <h4 className="my-3">No search terms are entered</h4> : <h4 className="my-3">Search Results for {props.data ? props.searchText : props.match.params.input}</h4>)
              }
              
          </div>
          {props.countries[0] && props.countries.map( (country, index) => 
            <Result
            filtered = {props.countries[0]}
            worldData = {props.data}
            makeFavorite = {makeFavorite}
            changeView = {props.changeView}
            getCountryInfo = {props.getCountryInfo}
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
            handleOpen = {props.handleOpen}
            handleClose = {props.handleClose}
            user = {props.user}
            setStateModal = {props.setStateModal}
            login = {props.login}
            />
          )}
        </main>
      </div>
      </BreakpointProvider>
    )
}
export default withRouter(SearchResults);