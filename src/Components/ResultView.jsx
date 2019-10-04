import React, {useState} from 'react';
import Result from './Result.jsx';
import { Breakpoint, BreakpointProvider } from 'react-socks';
import { Alert} from 'react-bootstrap'
import { db } from './Firebase/firebase'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import SidebarView from './SidebarView.jsx';
import Maps from './Maps.jsx';
import * as ROUTES from '../Constants/Routes'


const ResultView = props => {
  const [show, setShow] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [message, setMessage] = useState('')
  const [alert, setAlert] = useState(false)

  const makeFavorite = (e, country) => {
    e.persist();
    setShow(true)
    if(!props.user){
      setAlert(true);
      setMessage({style: "warning", content: `You need to sign in to favorite countries. Login`, link: ROUTES.SIGN_IN, linkContent: ' here'})
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
    // (regionCountries[0].name !== undefined) ? console.log(regionCountries): console.log('nothing');
  const totalRegions = props.data.map(a => a.geography.map_references.replace(/;/g, ""))
  function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
  }
  let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
  uniqueRegions = uniqueRegions.filter(Boolean);

    return(
      <BreakpointProvider>
      <div className="row">
        <main className="col-md-9 col-lg-12 px-0">
          {props.countries[0] === undefined ? 
              null
           : null }
          {alert && 
          <Alert show={show} variant={message.style}>{message.content}
            <Alert.Link href={message.link}>
              {message.linkContent}
            </Alert.Link>
          </Alert>}
          <Breakpoint medium up>
          <Maps
            mapVisible = {props.mapVisible}
            mapView={props.mapView} 
            worldData = {props.data}
            countries = {props.countries}
            changeView = {props.changeView}
            getCountryInfo = {props.getCountryInfo}
            hoverOnRegion = {props.hoverOnRegion}
            hoverOffRegion = {props.hoverOffRegion}
            handleMove = {props.handleMove}
            handleLeave = {props.handleLeave}
            hovered = {props.hovered}
            highlighted = {props.highlighted}
            totalRegions = {totalRegions}
            uniqueRegions = {uniqueRegions}
            getOccurrence = {getOccurrence}
          />
          </Breakpoint>
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
            setModal = {props.setModal}
            login = {props.login}
            />
          )}
        </main>
        <Breakpoint medium down>
          <SidebarView
              hoverOnRegion = {props.hoverOnRegion}
              hoverOffRegion = {props.hoverOffRegion}
              changeView = {props.changeView}
              handleSideBar = {props.handleSideBar}
              viewSidebar={props.viewSidebar}
              data={props.data}
              totalRegions = {totalRegions}
              uniqueRegions = {uniqueRegions}
              getOccurrence = {getOccurrence}
              sidebar={props.sidebar}
              getCountryInfo = {props.getCountryInfo}
              filterCountryByName = {props.filterCountryByName}
              hoverOnCountry = {props.hoverOnCountry}
              hoverOffCountry = {props.hoverOffCountry}
              handleMove = {props.handleMove}
              handleLeave = {props.handleLeave}
              hovered = {props.hovered}
              highlighted = {props.highlighted}
          />
        </Breakpoint>
      </div>
      </BreakpointProvider>
    )
  }
export default ResultView;